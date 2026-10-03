from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import User, Streak
from app.schemas.schemas import StreakOut
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/streaks", tags=["Streaks"])

@router.get("/me", response_model=StreakOut)
def get_my_streak(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    if not streak:
        streak = Streak(user_id=current_user.id, current_streak=0, longest_streak=0)
        db.add(streak)
        db.commit()
        db.refresh(streak)
    return streak
