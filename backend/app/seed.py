import os
from datetime import datetime, date, timedelta, timezone
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.models import (
    Role, User, Profile, Sign, Word, Lesson, LessonItem, Progress, PracticeAttempt, Streak, FamilyRelationship
)

def seed_db():
    print("Initializing Database tables...")
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Seed Roles
        print("Seeding Roles...")
        roles_data = [
            ("learner", "Standard Sign Language Learner"),
            ("family", "Family Member / Progress Observer"),
            ("admin", "System Administrator & Content Manager")
        ]
        roles_map = {}
        for r_name, r_desc in roles_data:
            role = db.query(Role).filter(Role.name == r_name).first()
            if not role:
                role = Role(name=r_name, description=r_desc)
                db.add(role)
                db.commit()
                db.refresh(role)
            roles_map[r_name] = role

        # 2. Seed Users & Profiles
        print("Seeding Initial Users...")
        # Admin User
        admin_email = "admin@signalingo.edu"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                email=admin_email,
                password_hash=get_password_hash("Admin@123456"),
                role_id=roles_map["admin"].id,
                is_active=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            db.add(Profile(
                user_id=admin.id,
                first_name="System",
                last_name="Admin",
                display_name="System Administrator",
                profile_image_url="/assets/avatars/admin.svg"
            ))
            db.add(Streak(user_id=admin.id, current_streak=0, longest_streak=0))

        # Learner User (Gowri)
        gowri_email = "gowri@signalingo.edu"
        gowri = db.query(User).filter(User.email == gowri_email).first()
        if not gowri:
            gowri = User(
                email=gowri_email,
                password_hash=get_password_hash("Learner@123456"),
                role_id=roles_map["learner"].id,
                is_active=True
            )
            db.add(gowri)
            db.commit()
            db.refresh(gowri)
            db.add(Profile(
                user_id=gowri.id,
                first_name="Gowri",
                last_name="CS",
                display_name="Gowri",
                profile_image_url="/assets/avatars/gowri.svg"
            ))
            db.add(Streak(
                user_id=gowri.id,
                current_streak=4,
                longest_streak=7,
                last_activity_date=date.today()
            ))

        # Family User (Priya)
        priya_email = "family@signalingo.edu"
        priya = db.query(User).filter(User.email == priya_email).first()
        if not priya:
            priya = User(
                email=priya_email,
                password_hash=get_password_hash("Family@123456"),
                role_id=roles_map["family"].id,
                is_active=True
            )
            db.add(priya)
            db.commit()
            db.refresh(priya)
            db.add(Profile(
                user_id=priya.id,
                first_name="Priya",
                last_name="Parent",
                display_name="Priya",
                profile_image_url="/assets/avatars/priya.svg"
            ))
            db.add(Streak(user_id=priya.id, current_streak=0, longest_streak=0))

        db.commit()

        # 3. Seed Authorized Family Relationship between Priya and Gowri
        rel = db.query(FamilyRelationship).filter(
            FamilyRelationship.family_member_user_id == priya.id,
            FamilyRelationship.learner_user_id == gowri.id
        ).first()
        if not rel:
            rel = FamilyRelationship(
                family_member_user_id=priya.id,
                learner_user_id=gowri.id,
                status="approved"
            )
            db.add(rel)
            db.commit()

        # 4. Seed ASL Alphabet Signs A-Z
        print("Seeding ASL Alphabet A-Z...")
        alphabet_descriptions = {
            'A': "Fist formed with thumb resting vertically against the side of the index finger.",
            'B': "Open palm with four fingers straight up together, thumb folded inward across the palm.",
            'C': "Curved hand forming a 'C' shape with thumb and fingers separated.",
            'D': "Index finger pointing upward while middle, ring, little finger touching thumb tip.",
            'E': "Fingers curled inward with finger tips resting on top of folded thumb.",
            'F': "Index finger and thumb touching tips forming a circle, other three fingers extended straight.",
            'G': "Index finger and thumb parallel pointing horizontally to the side.",
            'H': "Index and middle finger extended straight together horizontally.",
            'I': "Pinky finger extended straight up while all other fingers and thumb are closed.",
            'J': "Pinky extended drawing a curving 'J' stroke in the air.",
            'K': "Index finger pointing up, middle finger angled forward, thumb resting on middle knuckle.",
            'L': "Index finger up and thumb extended perpendicular forming an 'L' shape.",
            'M': "Thumb tucked underneath first three fingers (index, middle, ring).",
            'N': "Thumb tucked underneath first two fingers (index and middle).",
            'O': "All fingertips touching thumb tip forming a circular 'O' shape.",
            'P': "Index finger pointing down, middle finger pointing forward, thumb on middle knuckle.",
            'Q': "Index finger and thumb pointing downward in a hooking posture.",
            'R': "Index finger and middle finger crossed over each other.",
            'S': "Fist with thumb wrapped across the front of the fingers.",
            'T': "Thumb tucked underneath index finger only.",
            'U': "Index and middle finger extended straight up together.",
            'V': "Index and middle finger extended up forming a 'V' peace sign.",
            'W': "Index, middle, and ring finger extended up forming a 'W' shape.",
            'X': "Index finger hooked into a claw curve, other fingers folded.",
            'Y': "Thumb and pinky extended out, middle three fingers folded into palm.",
            'Z': "Index finger drawing a 'Z' shape in the air."
        }

        sign_objects = {}
        for char, desc in alphabet_descriptions.items():
            sign = db.query(Sign).filter(Sign.label == char).first()
            if not sign:
                sign = Sign(
                    label=char,
                    content_type="alphabet",
                    description=desc,
                    image_url=f"/assets/signs/{char.lower()}.svg",
                    difficulty="easy" if char in ['A', 'B', 'C', 'L', 'O', 'V', 'Y'] else "medium",
                    is_active=True
                )
                db.add(sign)
                db.commit()
                db.refresh(sign)
            sign_objects[char] = sign

        # 5. Seed Word Signs
        print("Seeding Word Signs...")
        words_data = [
            ("HELLO", "greetings", "Flat hand touch temple then move outward in a salute motion.", "easy"),
            ("YES", "greetings", "Fist nodding up and down like a head nod.", "easy"),
            ("NO", "greetings", "Index and middle finger snapping shut against thumb.", "easy"),
            ("THANK YOU", "greetings", "Fingertips touch chin then extend forward politely.", "easy"),
            ("PLEASE", "essential", "Open palm circling clockwise flat against chest.", "easy"),
            ("GOODBYE", "greetings", "Open palm waving fingers downward.", "easy"),
            ("LOVE", "feelings", "Both hands crossed over chest in an embrace.", "medium"),
            ("HELP", "essential", "Closed fist with thumb up resting on flat opposite palm, lifted together.", "medium")
        ]

        for w_label, w_cat, w_desc, w_diff in words_data:
            sign = db.query(Sign).filter(Sign.label == w_label).first()
            if not sign:
                sign = Sign(
                    label=w_label,
                    content_type="word",
                    description=w_desc,
                    image_url=f"/assets/signs/{w_label.lower().replace(' ', '_')}.svg",
                    difficulty=w_diff,
                    is_active=True
                )
                db.add(sign)
                db.commit()
                db.refresh(sign)

            word = db.query(Word).filter(Word.word == w_label).first()
            if not word:
                word = Word(
                    word=w_label,
                    category=w_cat,
                    description=w_desc,
                    image_url=f"/assets/signs/{w_label.lower().replace(' ', '_')}.svg",
                    sign_id=sign.id
                )
                db.add(word)
                db.commit()

        # 6. Seed Lessons & Lesson Items
        print("Seeding Lessons...")
        lessons_data = [
            ("Alphabet Foundations: A - G", "Master the first 7 ASL alphabet handshapes (A to G).", "easy", "alphabet", 1, ['A', 'B', 'C', 'D', 'E', 'F', 'G']),
            ("Alphabet Expansion: H - N", "Learn letters H through N with clear positional guidance.", "easy", "alphabet", 2, ['H', 'I', 'J', 'K', 'L', 'M', 'N']),
            ("Alphabet Practice: O - U", "Master letters O through U and practice transition speed.", "medium", "alphabet", 3, ['O', 'P', 'Q', 'R', 'S', 'T', 'U']),
            ("Final Letters & Common Words", "Complete V to Z and learn essential daily conversation signs.", "medium", "word", 4, ['V', 'W', 'X', 'Y', 'Z', 'HELLO', 'YES', 'NO', 'THANK YOU'])
        ]

        for title, desc, diff, ctype, order_idx, sign_labels in lessons_data:
            lesson = db.query(Lesson).filter(Lesson.title == title).first()
            if not lesson:
                lesson = Lesson(
                    title=title,
                    description=desc,
                    difficulty=diff,
                    content_type=ctype,
                    order_index=order_idx,
                    is_active=True
                )
                db.add(lesson)
                db.commit()
                db.refresh(lesson)

                # Add Lesson Items
                for idx, lbl in enumerate(sign_labels, 1):
                    s_obj = db.query(Sign).filter(Sign.label == lbl).first()
                    if s_obj:
                        li = LessonItem(lesson_id=lesson.id, sign_id=s_obj.id, order_index=idx)
                        db.add(li)
                db.commit()

        # 7. Seed Real Progress & Practice Attempts for Gowri
        print("Seeding Progress & Practice History for Gowri...")
        now = datetime.now(timezone.utc)
        lesson_1 = db.query(Lesson).filter(Lesson.order_index == 1).first()
        if lesson_1 and gowri:
            prog = db.query(Progress).filter(Progress.user_id == gowri.id, Progress.lesson_id == lesson_1.id).first()
            if not prog:
                prog = Progress(
                    user_id=gowri.id,
                    lesson_id=lesson_1.id,
                    completed=True,
                    score=100,
                    attempts=2,
                    completed_at=now - timedelta(days=1)
                )
                db.add(prog)

            # Add practice attempts
            sign_a = sign_objects.get('A')
            sign_b = sign_objects.get('B')
            if sign_a and sign_b:
                attempts_data = [
                    (sign_a.id, "correct", 20, now - timedelta(hours=5)),
                    (sign_b.id, "correct", 20, now - timedelta(hours=4)),
                    (sign_a.id, "correct", 20, now - timedelta(hours=2)),
                    (sign_b.id, "incorrect", 0, now - timedelta(minutes=30))
                ]
                for s_id, res, sc, dt in attempts_data:
                    pa = PracticeAttempt(user_id=gowri.id, content_id=s_id, result=res, score=sc, attempted_at=dt)
                    db.add(pa)
                db.commit()

        print("Database Seeding Completed Successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_db()
