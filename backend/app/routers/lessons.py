from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Lesson
from app.schemas.schemas import LessonOut, LessonDetailOut

router = APIRouter(prefix="/lessons", tags=["Lessons"])

@router.get("", response_model=List[LessonOut])
def get_lessons(db: Session = Depends(get_db)):
    lessons = db.query(Lesson).filter(Lesson.is_active == True).order_by(Lesson.order_index.asc()).all()
    out = []
    for l in lessons:
        out.append(LessonOut(
            id=l.id,
            title=l.title,
            description=l.description,
            difficulty=l.difficulty,
            content_type=l.content_type,
            order_index=l.order_index,
            items_count=len(l.items)
        ))
    return out

@router.get("/{lesson_id}", response_model=LessonDetailOut)
def get_lesson_detail(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.is_active == True).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson
