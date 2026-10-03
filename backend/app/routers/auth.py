from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token
)
from app.core.logging_config import log_security_event
from app.models.models import User, Role, Profile, Streak
from app.schemas.schemas import (
    UserRegister,
    UserLogin,
    UserChangePassword,
    UserOut,
    ProfileOut,
    Token
)
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

def build_user_out(user: User) -> UserOut:
    role_name = user.role.name if user.role else "learner"
    profile_out = ProfileOut.model_validate(user.profile) if user.profile else None
    return UserOut(
        id=user.id,
        email=user.email,
        role_name=role_name,
        is_active=user.is_active,
        profile=profile_out,
        created_at=user.created_at
    )

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # 1. Check if user already exists
    existing_user = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing_user:
        log_security_event("REGISTER_ATTEMPT", user_in.email, "Email already registered", "FAILED")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # 2. Get role
    requested_role = user_in.role_name.lower()
    if requested_role not in ["learner", "family"]:
        requested_role = "learner"
        
    role = db.query(Role).filter(Role.name == requested_role).first()
    if not role:
        role = Role(name=requested_role, description=f"Registered as {requested_role}")
        db.add(role)
        db.commit()
        db.refresh(role)

    # 3. Hash password securely using bcrypt
    hashed_password = get_password_hash(user_in.password)

    # 4. Create User entity
    user = User(
        email=user_in.email.lower(),
        password_hash=hashed_password,
        role_id=role.id,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 5. Create Profile entity
    profile = Profile(
        user_id=user.id,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        display_name=f"{user_in.first_name} {user_in.last_name}"
    )
    db.add(profile)

    # 6. Initialize Streak record
    streak = Streak(user_id=user.id, current_streak=0, longest_streak=0)
    db.add(streak)

    db.commit()
    db.refresh(user)

    log_security_event("USER_REGISTRATION", user.email, f"User registered as {role.name}", "SUCCESS")

    # Generate Token
    access_token = create_access_token(subject=user.id, role=role.name)
    user_out = build_user_out(user)

    return Token(access_token=access_token, token_type="bearer", user=user_out)

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    email_clean = credentials.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()
    
    if not user:
        log_security_event("LOGIN_ATTEMPT", email_clean, "User not found", "FAILED")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password hash
    if not verify_password(credentials.password, user.password_hash):
        log_security_event("LOGIN_ATTEMPT", email_clean, "Incorrect password", "FAILED")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        log_security_event("LOGIN_ATTEMPT", email_clean, "Account inactive", "FAILED")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive."
        )

    role_name = user.role.name if user.role else "learner"
    access_token = create_access_token(subject=user.id, role=role_name)

    log_security_event("USER_LOGIN", email_clean, "Login successful", "SUCCESS")

    user_out = build_user_out(user)

    return Token(access_token=access_token, token_type="bearer", user=user_out)

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return build_user_out(current_user)

@router.post("/change-password")
def change_password(
    pwd_data: UserChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(pwd_data.old_password, current_user.password_hash):
        log_security_event("PASSWORD_CHANGE", current_user.email, "Old password mismatch", "FAILED")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password"
        )
        
    current_user.password_hash = get_password_hash(pwd_data.new_password)
    db.commit()

    log_security_event("PASSWORD_CHANGE", current_user.email, "Password changed successfully", "SUCCESS")
    return {"message": "Password changed successfully"}

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    log_security_event("USER_LOGOUT", current_user.email, "Logged out", "SUCCESS")
    return {"message": "Successfully logged out"}
