import sqlite3
import os
import json

db_path = os.path.join(os.path.dirname(__file__), "data", "signalingo.db")
print(f"Auditing DB at: {db_path}")
print(f"File exists: {os.path.exists(db_path)}")
print(f"File size: {os.path.getsize(db_path)} bytes")

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# 1. Tables
cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
tables = [r[0] for r in cur.fetchall()]
print("\nACTUAL TABLES IN SQLITE:")
print(json.dumps(tables, indent=2))

# 2. Table details
print("\nTABLE SCHEMAS & COUNTS:")
for t in tables:
    cur.execute(f"PRAGMA table_info({t});")
    cols = cur.fetchall()
    cur.execute(f"PRAGMA foreign_key_list({t});")
    fks = cur.fetchall()
    cur.execute(f"SELECT COUNT(*) FROM {t};")
    count = cur.fetchone()[0]
    
    col_names = [f"{c[1]} ({c[2]}){' [PK]' if c[5] else ''}" for c in cols]
    fk_details = [f"{fk[3]} -> {fk[2]}.{fk[4]}" for fk in fks]
    print(f"\nTable: {t} (Rows: {count})")
    print(f"  Columns: {', '.join(col_names)}")
    if fk_details:
        print(f"  Foreign Keys: {', '.join(fk_details)}")

# 3. Roles
print("\nROLES IN DATABASE:")
cur.execute("SELECT id, name, description FROM roles;")
for r in cur.fetchall():
    print(f"  ID={r[0]}, Name={r[1]}, Desc={r[2]}")

# 4. Users (Safe - No passwords)
print("\nUSERS IN DATABASE (SAFE INFO ONLY):")
cur.execute("SELECT u.id, u.email, r.name, u.is_active, u.created_at FROM users u JOIN roles r ON u.role_id = r.id;")
for u in cur.fetchall():
    print(f"  User ID={u[0]}, Email={u[1]}, Role={u[2]}, Active={bool(u[3])}, Created={u[4]}")

# 5. Signs & Alphabet A-Z
cur.execute("SELECT label FROM signs WHERE content_type='alphabet' ORDER BY label;")
alphabet_labels = [r[0] for r in cur.fetchall()]
print(f"\nALPHABET SIGNS COUNT: {len(alphabet_labels)}")
print(f"  Labels: {', '.join(alphabet_labels)}")
expected_az = [chr(i) for i in range(ord('A'), ord('Z')+1)]
missing = set(expected_az) - set(alphabet_labels)
print(f"  All 26 A-Z present: {len(missing) == 0} (Missing: {missing})")

# 6. Words
cur.execute("SELECT word, category FROM words ORDER BY word;")
words_list = cur.fetchall()
print(f"\nWORDS COUNT: {len(words_list)}")
print(f"  Words: {', '.join([f'{w[0]} ({w[1]})' for w in words_list])}")

# 7. Lessons
cur.execute("SELECT id, title, order_index, difficulty, content_type FROM lessons ORDER BY order_index;")
lessons = cur.fetchall()
print(f"\nLESSONS COUNT: {len(lessons)}")
for l in lessons:
    cur.execute("SELECT COUNT(*) FROM lesson_items WHERE lesson_id=?;", (l[0],))
    item_cnt = cur.fetchone()[0]
    print(f"  Lesson {l[2]}: '{l[1]}' (Diff: {l[3]}, Items: {item_cnt})")

# 8. Family relationships
cur.execute("SELECT id, family_member_user_id, learner_user_id, status FROM family_relationships;")
fams = cur.fetchall()
print(f"\nFAMILY RELATIONSHIPS COUNT: {len(fams)}")
for f in fams:
    print(f"  ID={f[0]}, FamilyMemberID={f[1]}, LearnerID={f[2]}, Status={f[3]}")

# 9. Streaks
cur.execute("SELECT user_id, current_streak, longest_streak, last_activity_date FROM streaks;")
streaks = cur.fetchall()
print(f"\nSTREAKS COUNT: {len(streaks)}")
for s in streaks:
    print(f"  UserID={s[0]}, Current={s[1]}, Longest={s[2]}, LastDate={s[3]}")

# 10. Progress
cur.execute("SELECT id, user_id, lesson_id, completed, score, attempts FROM progress;")
progs = cur.fetchall()
print(f"\nPROGRESS RECORDS COUNT: {len(progs)}")
for p in progs:
    print(f"  ProgID={p[0]}, UserID={p[1]}, LessonID={p[2]}, Completed={bool(p[3])}, Score={p[4]}, Attempts={p[5]}")

# 11. Practice Attempts
cur.execute("SELECT COUNT(*), AVG(score) FROM practice_attempts;")
pa = cur.fetchone()
print(f"\nPRACTICE ATTEMPTS COUNT: {pa[0]} (Avg Score: {pa[1]})")

# 12. Alembic
try:
    cur.execute("SELECT version_num FROM alembic_version;")
    av = cur.fetchall()
    print(f"\nALEMBIC REVISION IN DB: {av}")
except Exception as e:
    print(f"\nALEMBIC TABLE IN DB: Not created yet ({e})")

conn.close()
