from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

# Authentication & User Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    first_name: str
    last_name: str
    role_name: str = "learner"  # learner or family

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserChangePassword(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8)

class ProfileOut(BaseModel):
    id: int
    user_id: int
    first_name: str
    last_name: str
    display_name: str
    profile_image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role_name: str = "learner"
    is_active: bool
    profile: Optional[ProfileOut] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None

# Sign & Word Schemas
class SignOut(BaseModel):
    id: int
    label: str
    content_type: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    difficulty: str
    is_active: bool

    class Config:
        from_attributes = True

class SignCreate(BaseModel):
    label: str
    content_type: str = "alphabet"
    description: Optional[str] = None
    image_url: Optional[str] = None
    difficulty: str = "easy"

class WordOut(BaseModel):
    id: int
    word: str
    category: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    sign_id: Optional[int] = None

    class Config:
        from_attributes = True

# Lesson Schemas
class LessonItemOut(BaseModel):
    id: int
    sign_id: int
    order_index: int
    sign: Optional[SignOut] = None

    class Config:
        from_attributes = True

class LessonOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    difficulty: str
    content_type: str
    order_index: int
    items_count: int = 0

    class Config:
        from_attributes = True

class LessonDetailOut(LessonOut):
    items: List[LessonItemOut] = []

    class Config:
        from_attributes = True

# Progress & Streak Schemas
class ProgressOut(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    completed: bool
    score: int
    attempts: int
    completed_at: Optional[datetime] = None
    lesson_title: Optional[str] = None

    class Config:
        from_attributes = True

class ProgressUpdate(BaseModel):
    lesson_id: int
    score: int
    completed: bool = True

class PracticeAttemptCreate(BaseModel):
    content_id: Optional[int] = None
    result: str  # correct or incorrect
    score: int

class PracticeAttemptOut(BaseModel):
    id: int
    user_id: int
    content_id: Optional[int] = None
    result: str
    score: int
    attempted_at: datetime
    recognized_label: Optional[str] = None
    confidence: Optional[float] = None

    class Config:
        from_attributes = True

class StreakOut(BaseModel):
    user_id: int
    current_streak: int
    longest_streak: int
    last_activity_date: Optional[date] = None

    class Config:
        from_attributes = True

# Family Member Monitoring Schemas
class FamilyLearnerSummary(BaseModel):
    learner_id: int
    display_name: str
    email: str
    profile_image_url: Optional[str] = None
    current_streak: int
    completed_lessons: int
    total_practice_points: int
    last_activity: Optional[datetime] = None

class FamilyRequestCreate(BaseModel):
    learner_email: EmailStr

# Admin Dashboard Schemas
class PlatformStats(BaseModel):
    total_users: int
    total_learners: int
    total_family_members: int
    total_admins: int
    total_signs: int
    total_lessons: int
    total_practice_attempts: int
    total_family_links: int

class SecurityLogEntry(BaseModel):
    timestamp: str
    level: str
    event: str
    user: str
    status: str
    details: str

