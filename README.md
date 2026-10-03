# Signalingo — Secure Sign Language Learning and Recognition Platform

**Academic Project:** 5th-Semester CS Engineering Mini Project  
**Domain Focus:** Security in Computing  
**Tech Stack:** Next.js (TypeScript + Tailwind CSS + Anime.js + Three.js), FastAPI (Python + SQLAlchemy + Alembic), SQLite Database

---

## 🌟 Project Identity & Overview

**Signalingo** is a secure, modern web platform for learning American Sign Language (ASL). It combines gamified 26-character alphabet learning, word practice, honest progress tracking, and access-controlled family member monitoring within a security-first architecture.

### Color Palette & Visual Identity
Inspired by the Deaf Culture Flag:
- **Turquoise Blue (`#00A896`):** Primary visual brand identity, sign cards, active navigation, interactive buttons.
- **Yellow (`#FFB703`):** Highlights, streak flames, achievement badges, energy accents.
- **Dark Blue (`#0F172A`):** High contrast headings, navigation bar, structural borders.
- **Warm Light Background (`#F8FAF9`):** Off-white clean layout.

---

## 🏗️ System Architecture

```
                                  SIGNALINGO
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                      FRONTEND                  BACKEND
                         │                         │
                 Next.js + TypeScript            FastAPI
                         │                         │
                 ┌───────┼────────┐                │
                 │       │        │             SQLAlchemy
             Tailwind  Anime.js  Three.js          │
                 │       │        │                ↓
                 └───────┴────────┘             SQLite
                                                   │
                                        ┌──────────┼──────────┐
                                        │          │          │
                                      Users     Learning    Progress
                                      Roles     Content     Practice
                                      Profiles  Lessons     Streaks
                                                Signs       Family


                                FUTURE ML SYSTEM
                                       │
                                    Camera
                                       ↓
                                   MediaPipe
                                       ↓
                                Hand Landmarks
                                       ↓
                                 Preprocessing
                                       ↓
                                  Scikit-learn
                                       ↓
                                Sign Recognition
                                       ↓
                                   Text Output
```

---

## 🔐 Core Security Features

Implemented as part of the **Security in Computing** academic domain:
1. **Password Hashing:** Passwords hashed with **bcrypt (work factor 12)**.
2. **Role-Based Access Control (RBAC):** Backend role verification for `Learner`, `Family Member`, and `Admin`.
3. **IDOR & Access Control Protection:** Verification checks prevent users from accessing unauthorized learner data.
4. **SQL Injection Prevention:** 100% ORM parameterized queries via SQLAlchemy.
5. **Input Validation:** Pydantic schemas enforce RFC email validation and strong passwords.
6. **Secure File Storage:** File uploads validated for extension (`.png`, `.jpg`), MIME type, size limit (5MB), and assigned UUID filenames.
7. **CORS Restrictions:** Configured to whitelist only the frontend origin.
8. **Security Logging:** Security event logging (`logs/security.log`) for logins, admin operations, and unauthorized access attempts.

---

## 🚀 Quick Setup Instructions

### Prerequisites
- **Node.js** (v18+ or v22+)
- **Python** (v3.10+ or v3.14+)

---

### Step 1: Clone & Setup Workspace
Navigate to the project root:
```bash
cd signalingo
```

---

### Step 2: Backend Setup (FastAPI & SQLite)

1. Change directory to `backend`:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Initialize Database & Seed Content:
   ```bash
   python -m app.seed
   ```
   *(This creates `data/signalingo.db` and populates 34 signs, 4 lessons, default roles, and pre-seeded demo accounts.)*

4. Start FastAPI Server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *FastAPI docs will be available at: `http://localhost:8000/docs`*

---

### Step 3: Frontend Setup (Next.js)

1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install Node dependencies (if needed):
   ```bash
   npm install
   ```

3. Start Next.js Development Server:
   ```bash
   npm run dev
   ```
   *Application will be available at: `http://localhost:3000`*

---

## 🔑 Demo Login Presets

The login page provides quick-fill buttons for evaluation:

| Account Role | Email Address | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Learner** | `gowri@signalingo.edu` | `Learner@123456` | Dashboard, Learn A-Z, Lessons, Quiz Practice, Honest Progress |
| **Family Member** | `family@signalingo.edu` | `Family@123456` | Learner Progress Monitoring Portal (Authorized for Gowri) |
| **Admin** | `admin@signalingo.edu` | `Admin@123456` | Platform User Management, Sign Content Creation, System Audit |

---

## 📊 Implemented vs Future Scope

### Implemented Now
- Full ASL Alphabet A-Z visual learning cards
- Simple word sign content
- Interactive quiz practice arena with points and streak calculation
- Honest database progress tracking
- Access-controlled Family Member monitoring
- RBAC Admin control panel
- Three.js 3D floating hero canvas & Anime.js micro-animations
- Real-Time Sign Translator camera shell & MediaPipe ML pipeline specifications

### Future Integration
- Camera video stream capture via MediaPipe
- 21 Hand Landmark extraction & normalization
- Scikit-learn sign inference model execution
- Real-time sign-to-text live translation
