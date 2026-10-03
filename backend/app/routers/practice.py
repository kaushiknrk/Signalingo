from typing import List
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import User, PracticeAttempt, Streak
from app.schemas.schemas import PracticeAttemptCreate, PracticeAttemptOut, StreakOut
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/practice", tags=["Practice"])

@router.post("/attempt", response_model=PracticeAttemptOut)
def record_practice_attempt(
    attempt_in: PracticeAttemptCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Create PracticeAttempt record
    attempt = PracticeAttempt(
        user_id=current_user.id,
        content_id=attempt_in.content_id,
        result=attempt_in.result.lower(),
        score=attempt_in.score,
        attempted_at=datetime.utcnow()
    )
    db.add(attempt)
    
    # 2. Update Streak logic honestly
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    today = date.today()
    
    if not streak:
        streak = Streak(
            user_id=current_user.id,
            current_streak=1 if attempt_in.result.lower() == "correct" else 0,
            longest_streak=1 if attempt_in.result.lower() == "correct" else 0,
            last_activity_date=today
        )
        db.add(streak)
    else:
        if streak.last_activity_date != today:
            if streak.last_activity_date and (today - streak.last_activity_date).days == 1:
                streak.current_streak += 1
            else:
                streak.current_streak = 1
                
            streak.last_activity_date = today
            if streak.current_streak > streak.longest_streak:
                streak.longest_streak = streak.current_streak
                
    db.commit()
    db.refresh(attempt)
    return attempt

@router.get("/history", response_model=List[PracticeAttemptOut])
def get_practice_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    attempts = db.query(PracticeAttempt).filter(
        PracticeAttempt.user_id == current_user.id
    ).order_by(PracticeAttempt.attempted_at.desc()).limit(20).all()
    return attempts
