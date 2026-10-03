from typing import List, Callable
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import oauth2_scheme, decode_access_token
from app.models.models import User, FamilyRelationship
from app.core.logging_config import log_security_event

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """
    Decodes JWT token and retrieves the current authenticated user.
    Raises 401 Unauthorized if invalid or inactive.
    """
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
    return user

def require_roles(allowed_roles: List[str]) -> Callable:
    """
    Role-Based Access Control (RBAC) dependency factory.
    Enforces role restrictions at the FastAPI backend level.
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role = current_user.role.name.lower()
        if user_role not in [r.lower() for r in allowed_roles]:
            log_security_event(
                event_type="UNAUTHORIZED_ROLE_ACCESS",
                user_email=current_user.email,
                details=f"Required roles: {allowed_roles}, User role: {user_role}",
                status="FAILED"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied. Required role: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker

def verify_user_or_authorized_family(target_user_id: int, current_user: User, db: Session) -> bool:
    """
    Prevents IDOR (Insecure Direct Object Reference) and broken access control.
    Returns True if target_user_id is the current user, or if current user is an authorized family member, or if admin.
    """
    # 1. Self access
    if current_user.id == target_user_id:
        return True
    
    # 2. Admin access
    if current_user.role.name == "admin":
        return True
        
    # 3. Family member access check
    if current_user.role.name == "family":
        relationship = db.query(FamilyRelationship).filter(
            FamilyRelationship.family_member_user_id == current_user.id,
            FamilyRelationship.learner_user_id == target_user_id,
            FamilyRelationship.status == "approved"
        ).first()
        if relationship:
            return True
            
    return False
