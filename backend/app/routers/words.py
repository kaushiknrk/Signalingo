from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Word
from app.schemas.schemas import WordOut

router = APIRouter(prefix="/words", tags=["Words Content"])

@router.get("", response_model=List[WordOut])
def get_words(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Word)
    if category:
        query = query.filter(Word.category == category.lower())
    return query.order_by(Word.word.asc()).all()
