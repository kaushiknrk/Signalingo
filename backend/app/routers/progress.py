from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import User, Progress, Lesson
from app.schemas.schemas import ProgressOut, ProgressUpdate
from app.dependencies.auth import get_current_user, verify_user_or_authorized_family

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.get("/me", response_model=List[ProgressOut])
def get_my_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    records = db.query(Progress).filter(Progress.user_id == current_user.id).all()
    results = []
    for r in records:
        lesson = db.query(Lesson).filter(Lesson.id == r.lesson_id).first()
        results.append(ProgressOut(
            id=r.id,
            user_id=r.user_id,
            lesson_id=r.lesson_id,
            completed=r.completed,
            score=r.score,
            attempts=r.attempts,
            completed_at=r.completed_at,
            lesson_title=lesson.title if lesson else None
        ))
    return results

@router.get("/user/{target_user_id}", response_model=List[ProgressOut])
def get_user_progress(
    target_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # IDOR / Broken Access Control Security Check
    if not verify_user_or_authorized_family(target_user_id, current_user, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You are not authorized to access progress records for this user."
        )
        
    records = db.query(Progress).filter(Progress.user_id == target_user_id).all()
    results = []
    for r in records:
        lesson = db.query(Lesson).filter(Lesson.id == r.lesson_id).first()
        results.append(ProgressOut(
            id=r.id,
            user_id=r.user_id,
            lesson_id=r.lesson_id,
            completed=r.completed,
            score=r.score,
            attempts=r.attempts,
            completed_at=r.completed_at,
            lesson_title=lesson.title if lesson else None
        ))
    return results

@router.post("/update", response_model=ProgressOut)
def update_lesson_progress(
    p_in: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.lesson_id == p_in.lesson_id
    ).first()
    
    lesson = db.query(Lesson).filter(Lesson.id == p_in.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
        
    if not record:
        record = Progress(
            user_id=current_user.id,
            lesson_id=p_in.lesson_id,
            completed=p_in.completed,
            score=p_in.score,
            attempts=1,
            completed_at=datetime.utcnow() if p_in.completed else None
        )
        db.add(record)
    else:
        record.attempts += 1
        if p_in.score > record.score:
            record.score = p_in.score
        if p_in.completed:
            record.completed = True
            record.completed_at = datetime.utcnow()
            
    db.commit()
    db.refresh(record)
    
    return ProgressOut(
        id=record.id,
        user_id=record.user_id,
        lesson_id=record.lesson_id,
        completed=record.completed,
        score=record.score,
        attempts=record.attempts,
        completed_at=record.completed_at,
        lesson_title=lesson.title
    )
