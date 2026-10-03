from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)  # learner, family, admin
    description = Column(String(255), nullable=True)
    
    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    role = relationship("Role", back_populates="users")
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    progress = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    practice_attempts = relationship("PracticeAttempt", back_populates="user", cascade="all, delete-orphan")
    streak = relationship("Streak", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    display_name = Column(String(100), nullable=False)
    profile_image_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    user = relationship("User", back_populates="profile")

class Sign(Base):
    __tablename__ = "signs"
    
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(50), unique=True, nullable=False, index=True)  # e.g., 'A', 'B', 'HELLO'
    content_type = Column(String(50), nullable=False, default="alphabet")  # alphabet, word, phrase, sentence
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    difficulty = Column(String(20), default="easy")  # easy, medium, hard
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lesson_items = relationship("LessonItem", back_populates="sign")

class Word(Base):
    __tablename__ = "words"
    
    id = Column(Integer, primary_key=True, index=True)
    word = Column(String(100), unique=True, nullable=False, index=True)
    category = Column(String(50), default="greetings")  # greetings, essential, actions
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    sign_id = Column(Integer, ForeignKey("signs.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(String(20), default="easy")
    content_type = Column(String(50), default="alphabet")
    order_index = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    items = relationship("LessonItem", back_populates="lesson", cascade="all, delete-orphan")
    progress_records = relationship("Progress", back_populates="lesson", cascade="all, delete-orphan")

class LessonItem(Base):
    __tablename__ = "lesson_items"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    sign_id = Column(Integer, ForeignKey("signs.id"), nullable=False)
    order_index = Column(Integer, default=1)
    
    lesson = relationship("Lesson", back_populates="items")
    sign = relationship("Sign", back_populates="lesson_items")

class Progress(Base):
    __tablename__ = "progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    completed = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    attempts = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress_records")

class PracticeAttempt(Base):
    __tablename__ = "practice_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content_id = Column(Integer, ForeignKey("signs.id"), nullable=True)
    result = Column(String(20), nullable=False)  # correct, incorrect
    score = Column(Integer, default=0)
    attempted_at = Column(DateTime, default=datetime.utcnow)
    
    # Placeholder fields for Future ML pipeline integration
    recognized_label = Column(String(50), nullable=True)
    confidence = Column(Float, nullable=True)
    model_version = Column(String(50), nullable=True)

    user = relationship("User", back_populates="practice_attempts")

class Streak(Base):
    __tablename__ = "streaks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity_date = Column(Date, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="streak")

class FamilyRelationship(Base):
    __tablename__ = "family_relationships"
    
    id = Column(Integer, primary_key=True, index=True)
    family_member_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    learner_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default="approved")  # pending, approved, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, default=datetime.utcnow)
