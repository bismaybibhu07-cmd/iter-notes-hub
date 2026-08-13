print("🔥 THIS MAIN.PY IS RUNNING ON RENDER")
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import shutil
import os

from database import SessionLocal, engine
import models
import schemas
from auth import (
    SECRET_KEY,
    ALGORITHM,
    hash_password,
    verify_password,
    create_access_token
)

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
@app.get("/api/health") 
def health(): 
    return {"status": "success"}

# Security
security = HTTPBearer()

# Uploads folder
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Current user
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        user = db.query(models.User).filter(
            models.User.email == email
        ).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return user

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

# Home
@app.get("/")
def home():
    return {"message": "ITER Notes Hub Backend Running"}

# ================= AUTH =================

@app.post("/signup", response_model=schemas.UserResponse)
def signup(
    user: schemas.SignupRequest,
    db: Session = Depends(get_db)
):
    existing = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role="student",
        credits=5
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.post("/login", response_model=schemas.TokenResponse)
def login(
    user: schemas.LoginRequest,
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token({
        "sub": db_user.email,
        "role": db_user.role
    })

    return {"access_token": token}

@app.get("/me", response_model=schemas.UserResponse)
def get_me(
    current_user: models.User = Depends(get_current_user)
):
    return current_user

# ================= SUBJECTS =================

@app.post("/subjects", response_model=schemas.SubjectResponse)
def create_subject(
    subject: schemas.SubjectCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(models.Subject).filter(
        models.Subject.name == subject.name,
        models.Subject.branch == subject.branch,
        models.Subject.semester == subject.semester
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Subject already exists for this branch and semester"
        )

    new_subject = models.Subject(
        name=subject.name,
        branch=subject.branch,
        semester=subject.semester
    )

    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)

    return new_subject

@app.get("/subjects", response_model=list[schemas.SubjectResponse])
def get_subjects(
    branch: str | None = None,
    semester: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Subject)

    if branch:
        query = query.filter(models.Subject.branch == branch)

    if semester is not None:
        query = query.filter(models.Subject.semester == semester)

    return query.all()

@app.get("/subjects/find", response_model=schemas.SubjectResponse)
def find_subject(
    name: str,
    branch: str,
    semester: int,
    db: Session = Depends(get_db)
):
    subject = db.query(models.Subject).filter(
        models.Subject.name == name,
        models.Subject.branch == branch,
        models.Subject.semester == semester
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    return subject

# ================= NOTES =================

@app.post("/notes", response_model=schemas.NoteResponse)
def create_note(
    title: str = Form(...),
    content: str = Form(...),
    subject_id: int = Form(...),
    pdf: UploadFile | None = File(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pdf_path = None

    # Save PDF
    if pdf:
        file_location = f"uploads/{pdf.filename}"

        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(pdf.file, buffer)

        pdf_path = f"/uploads/{pdf.filename}"

    # Create note
    new_note = models.Note(
        title=title,
        content=content,
        subject_id=subject_id,
        user_id=current_user.id,
        pdf_file=pdf_path
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    # Increase credits
    user_in_db = db.query(models.User).filter(
        models.User.id == current_user.id
    ).first()

    user_in_db.credits += 5

    db.commit()
    db.refresh(user_in_db)

    return new_note

@app.get("/notes", response_model=list[schemas.NoteResponse])
def get_notes(
    subject_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Note)

    if subject_id is not None:
        query = query.filter(models.Note.subject_id == subject_id)

    return query.all()

# ================= DELETE SUBJECT =================

@app.delete("/subjects/{subject_id}")
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db)
):
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id
    ).first()

    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    db.delete(subject)
    db.commit()

    return {"message": "Subject deleted successfully"}

# ================= DELETE NOTE =================

@app.delete("/notes/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db)
):
    note = db.query(models.Note).filter(
        models.Note.id == note_id
    ).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    # Delete PDF file
    if note.pdf_file:
        file_path = note.pdf_file.lstrip("/")

        if os.path.exists(file_path):
            os.remove(file_path)

    db.delete(note)
    db.commit()

    return {"message": "Note deleted successfully"}