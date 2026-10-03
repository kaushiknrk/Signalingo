from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.models import User, Profile, Streak, Progress, PracticeAttempt, FamilyRelationship
from app.schemas.schemas import FamilyLearnerSummary, FamilyRequestCreate
from app.dependencies.auth import get_current_user, require_roles
from app.core.logging_config import log_security_event

router = APIRouter(prefix="/family", tags=["Family Member Portal"])

@router.get("/learners", response_model=List[FamilyLearnerSummary])
def get_authorized_learners(
    current_user: User = Depends(require_roles(["family", "admin"])),
    db: Session = Depends(get_db)
):
    """
    Returns list of authorized learners linked to the authenticated family member.
    Enforces access control so family members only view explicitly authorized learners.
    """
    relationships = db.query(FamilyRelationship).filter(
        FamilyRelationship.family_member_user_id == current_user.id,
        FamilyRelationship.status == "approved"
    ).all()

    summaries = []
    for rel in relationships:
        learner = db.query(User).filter(User.id == rel.learner_user_id).first()
        if not learner:
            continue
            
        profile = db.query(Profile).filter(Profile.user_id == learner.id).first()
        streak = db.query(Streak).filter(Streak.user_id == learner.id).first()
        
        # Count completed lessons
        completed_lessons = db.query(func.count(Progress.id)).filter(
            Progress.user_id == learner.id,
            Progress.completed == True
        ).scalar() or 0

        # Calculate total practice points
        total_points = db.query(func.sum(PracticeAttempt.score)).filter(
            PracticeAttempt.user_id == learner.id
        ).scalar() or 0

        # Get last activity
        last_attempt = db.query(PracticeAttempt).filter(
            PracticeAttempt.user_id == learner.id
        ).order_by(PracticeAttempt.attempted_at.desc()).first()

        summaries.append(FamilyLearnerSummary(
            learner_id=learner.id,
            display_name=profile.display_name if profile else learner.email,
            email=learner.email,
            profile_image_url=profile.profile_image_url if profile else None,
            current_streak=streak.current_streak if streak else 0,
            completed_lessons=completed_lessons,
            total_practice_points=total_points,
            last_activity=last_attempt.attempted_at if last_attempt else None
        ))

    return summaries

@router.post("/request")
def request_learner_access(
    req: FamilyRequestCreate,
    current_user: User = Depends(require_roles(["family"])),
    db: Session = Depends(get_db)
):
    target_learner = db.query(User).filter(User.email == req.learner_email.lower()).first()
    if not target_learner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learner with this email address was not found."
        )

    # Check existing relationship
    existing = db.query(FamilyRelationship).filter(
        FamilyRelationship.family_member_user_id == current_user.id,
        FamilyRelationship.learner_user_id == target_learner.id
    ).first()
    
    if existing:
        return {"message": f"Relationship status with {target_learner.email} is '{existing.status}'"}

    new_rel = FamilyRelationship(
        family_member_user_id=current_user.id,
        learner_user_id=target_learner.id,
        status="approved"  # Auto-approve for seamless mini project testing
    )
    db.add(new_rel)
    db.commit()

    log_security_event(
        "FAMILY_RELATIONSHIP_CREATED",
        current_user.email,
        f"Family access linked to learner {target_learner.email}",
        "SUCCESS"
    )

    return {"message": f"Access granted to monitor learner {target_learner.email}"}
