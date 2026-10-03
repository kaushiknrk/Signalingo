from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import User, Profile
from app.schemas.schemas import ProfileOut
from app.dependencies.auth import get_current_user
from app.core.file_storage import save_uploaded_file

router = APIRouter(prefix="/profiles", tags=["Profiles"])

@router.get("/me", response_model=ProfileOut)
def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/me", response_model=ProfileOut)
def update_profile(
    first_name: str,
    last_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id, first_name=first_name, last_name=last_name, display_name=f"{first_name} {last_name}")
        db.add(profile)
    else:
        profile.first_name = first_name
        profile.last_name = last_name
        profile.display_name = f"{first_name} {last_name}"
    
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/avatar-upload", response_model=ProfileOut)
def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_url = save_uploaded_file(file, subfolder="profiles")
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if profile:
        profile.profile_image_url = file_url
        db.commit()
        db.refresh(profile)
    return profile
