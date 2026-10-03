from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Sign
from app.schemas.schemas import SignOut

router = APIRouter(prefix="/signs", tags=["Signs Content"])

@router.get("", response_model=List[SignOut])
def get_signs(
    content_type: Optional[str] = Query(None, description="Filter by 'alphabet' or 'word'"),
    db: Session = Depends(get_db)
):
    query = db.query(Sign).filter(Sign.is_active == True)
    if content_type:
        query = query.filter(Sign.content_type == content_type.lower())
    return query.order_by(Sign.label.asc()).all()

@router.get("/{sign_id}", response_model=SignOut)
def get_sign_by_id(sign_id: int, db: Session = Depends(get_db)):
    sign = db.query(Sign).filter(Sign.id == sign_id, Sign.is_active == True).first()
    if not sign:
        raise HTTPException(status_code=404, detail="Sign content not found")
    return sign
