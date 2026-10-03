# Signalingo Security Architecture & Threat Model

**Academic Domain Focus:** Security in Computing  
**Platform:** Signalingo — Secure Sign Language Learning and Recognition Platform  
**Authors:** B.E. Computer Science & Engineering Team (5th Semester)

---

## 1. Security Architecture Overview

Security is a foundational architectural pillar of Signalingo. The backend API (FastAPI) enforces strict security boundaries to protect user credentials, prevent unauthorized access, and ensure data integrity.

```
                      +-----------------------------+
                      |   Next.js Frontend Client   |
                      +--------------+--------------+
                                     |
                          HTTPS / REST API (JWT)
                                     v
                      +-----------------------------+
                      |   FastAPI Backend Server    |
                      |  - JWT Authentication       |
                      |  - RBAC Permission Check    |
                      |  - Pydantic Input Validation|
                      |  - Security Event Logger    |
                      +--------------+--------------+
                                     |
                            SQLAlchemy ORM
                                     v
                      +-----------------------------+
                      |   SQLite Database File      |
                      |   (data/signalingo.db)      |
                      +-----------------------------+
```

---

## 2. Core Security Controls

### 2.1 Authentication & Password Hashing
- **Algorithm:** Passwords are hashed using **bcrypt** (`bcrypt.gensalt(rounds=12)`).
- **Zero Plaintext Storage:** Plaintext passwords are never stored in the database, logged in files, or transmitted in API responses.
- **JWT Tokens:** Authenticated sessions emit JSON Web Tokens signed with `HS256` and an environment-driven `SECRET_KEY`. Tokens carry expiration claims (`exp`) and role claims (`role`).

### 2.2 Role-Based Access Control (RBAC)
FastAPI backend dependencies enforce explicit role checks on protected endpoints:
- **Learner:** Access to personal learning modules, practice quizzes, and personal streak history.
- **Family Member:** Access to personal profile and **explicitly authorized** family learners. Blocked from viewing unauthorized learner progress.
- **Admin:** Administrative control over platform users, sign content creation, and system logs.

### 2.3 IDOR & Broken Access Control Prevention
- URLs such as `/api/v1/progress/user/{target_user_id}` perform server-side checks (`verify_user_or_authorized_family`).
- Requesting another user's progress returns `403 Forbidden` unless the requester is the user themselves, an authorized family member, or an admin.

### 2.4 SQL Injection Prevention
- All database queries strictly utilize **SQLAlchemy ORM** parameterized queries.
- Direct raw string concatenation (e.g., `f"SELECT * FROM users WHERE email='{email}'"`) is strictly forbidden across the codebase.

### 2.5 Input Validation
- API request payloads are parsed and validated by **Pydantic v2** schemas.
- Field constraints enforce strong password length (minimum 8 characters), valid email RFC syntax via `email-validator`, and sanitized enum labels.

### 2.6 Secure File Upload Handling
- Uploaded user avatars are processed by `app.core.file_storage`.
- **Validation:** Enforces file extension checks (`.png`, `.jpeg`, `.jpg`, `.webp`), MIME type verification, and a 5MB size limit.
- **Path Traversal Protection:** User-supplied filenames are ignored; files are assigned server-generated UUID v4 filenames stored inside `backend/uploads/`.

### 2.7 CORS & Secret Management
- CORS is restricted in production to `FRONTEND_URL` (`http://localhost:3000`). `allow_origins=["*"]` is disabled.
- Sensitive values (`SECRET_KEY`, `DATABASE_URL`) are configured via `.env` environment variables and omitted from version control.

### 2.8 Security Event Logging
Security events are recorded in `backend/logs/security.log` without recording sensitive credentials:
- Successful logins and failed login attempts.
- Password change events.
- Administrative user deletions and content creation.
- Unauthorized access attempts (`403 Forbidden`).

---

## 3. Threat Model & Risk Mitigation Matrix

| Threat Category | Potential Attack Vector | Signalingo Mitigation Strategy |
| :--- | :--- | :--- |
| **Credential Theft / Brute Force** | Dictionary attack or database breach exposing passwords | Passwords salted and hashed with **bcrypt (work factor 12)**. |
| **SQL Injection (SQLi)** | Malicious SQL syntax inside login or sign query fields | 100% ORM parameterized queries via **SQLAlchemy**. |
| **Broken Access Control (IDOR)** | User altering URL ID to inspect another learner's progress | Backend `verify_user_or_authorized_family` verification on every user endpoint. |
| **Privilege Escalation** | Learner sending admin commands to add or delete users | FastAPI `require_roles(["admin"])` dependency checks user role claim. |
| **Unrestricted File Upload** | Attacker uploading executable scripts or path traversal payload | Extension + MIME validation, 5MB cap, and UUID filename generation. |
| **Data Leakage in API** | Password hashes or stack traces exposed in error responses | Sanitized safe API error details returned via FastAPI HTTPExceptions. |
| **CORS Hijacking** | Unauthorized origin making cross-site requests | Explicit CORS origin whitelist configured in FastAPI middleware. |

---

## 4. SQLite Data Boundary Note

SQLite is intentionally selected for this mini project to maintain lightweight, serverless local execution (`backend/data/signalingo.db`). The database is encapsulated entirely behind FastAPI service abstractions. Migration to PostgreSQL/MySQL via SQLAlchemy requires only changing `DATABASE_URL` in `.env`.
