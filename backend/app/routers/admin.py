import os
import re
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.models import User, Sign, Word, Lesson, Role, PracticeAttempt, FamilyRelationship
from app.schemas.schemas import UserOut, SignOut, SignCreate, WordOut, LessonOut, PlatformStats, SecurityLogEntry
from app.routers.auth import build_user_out
from app.dependencies.auth import require_roles
from app.core.logging_config import log_security_event

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

@router.get("/stats", response_model=PlatformStats)
def get_platform_stats(
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    total_users = db.query(func.count(User.id)).scalar() or 0
    learner_role = db.query(Role).filter(Role.name == "learner").first()
    family_role = db.query(Role).filter(Role.name == "family").first()
    admin_role = db.query(Role).filter(Role.name == "admin").first()

    total_learners = db.query(func.count(User.id)).filter(User.role_id == learner_role.id).scalar() or 0 if learner_role else 0
    total_family = db.query(func.count(User.id)).filter(User.role_id == family_role.id).scalar() or 0 if family_role else 0
    total_admins = db.query(func.count(User.id)).filter(User.role_id == admin_role.id).scalar() or 0 if admin_role else 0

    total_signs = db.query(func.count(Sign.id)).scalar() or 0
    total_lessons = db.query(func.count(Lesson.id)).scalar() or 0
    total_attempts = db.query(func.count(PracticeAttempt.id)).scalar() or 0
    total_links = db.query(func.count(FamilyRelationship.id)).scalar() or 0

    return PlatformStats(
        total_users=total_users,
        total_learners=total_learners,
        total_family_members=total_family,
        total_admins=total_admins,
        total_signs=total_signs,
        total_lessons=total_lessons,
        total_practice_attempts=total_attempts,
        total_family_links=total_links
    )

@router.get("/logs", response_model=List[SecurityLogEntry])
def get_security_logs(
    limit: int = 50,
    current_user: User = Depends(require_roles(["admin"]))
):
    """
    Returns sanitized recent security events from logs/security.log.
    Strictly admin-only protected. Passwords and hashes are never stored or logged.
    """
    logs_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "logs")
    log_file = os.path.join(logs_dir, "security.log")
    
    if not os.path.exists(log_file):
        return []

    entries: List[SecurityLogEntry] = []
    log_regex = re.compile(
        r"^\[(?P<timestamp>[^\]]+)\]\s+\[(?P<level>[^\]]+)\]\s+\[SECURITY\]:\s+Event=(?P<event>[^|]+)\|\s+User=(?P<user>[^|]+)\|\s+Status=(?P<status>[^|]+)\|\s+Details=(?P<details>.*)$"
    )

    try:
        with open(log_file, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
        
        for line in reversed(lines[-limit:]):
            line = line.strip()
            if not line:
                continue
            match = log_regex.match(line)
            if match:
                entries.append(SecurityLogEntry(
                    timestamp=match.group("timestamp").strip(),
                    level=match.group("level").strip(),
                    event=match.group("event").strip(),
                    user=match.group("user").strip(),
                    status=match.group("status").strip(),
                    details=match.group("details").strip(),
                ))
            else:
                entries.append(SecurityLogEntry(
                    timestamp="Recent",
                    level="INFO",
                    event="SYSTEM_EVENT",
                    user="system",
                    status="SUCCESS",
                    details=line[:120],
                ))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read security logs: {str(e)}")

    return entries


@router.get("/users", response_model=List[UserOut])
def list_all_users(
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    results = [build_user_out(u) for u in users]
    return results

@router.post("/signs", response_model=SignOut, status_code=status.HTTP_201_CREATED)
def create_sign(
    sign_in: SignCreate,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    existing = db.query(Sign).filter(Sign.label == sign_in.label.upper()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Sign label '{sign_in.label}' already exists."
        )

    sign = Sign(
        label=sign_in.label.upper(),
        content_type=sign_in.content_type.lower(),
        description=sign_in.description,
        image_url=sign_in.image_url or f"/assets/signs/{sign_in.label.lower()}.svg",
        difficulty=sign_in.difficulty.lower(),
        is_active=True
    )
    db.add(sign)
    db.commit()
    db.refresh(sign)

    log_security_event("ADMIN_CREATE_SIGN", current_user.email, f"Created sign '{sign.label}'", "SUCCESS")
    return sign

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account.")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
        
    db.delete(user)
    db.commit()

    log_security_event("ADMIN_DELETE_USER", current_user.email, f"Deleted user ID {user_id}", "SUCCESS")
    return {"message": f"User ID {user_id} deleted successfully."}
