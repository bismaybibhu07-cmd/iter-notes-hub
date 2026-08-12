from sqlalchemy import Column, Integer, String, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(150), unique=True, nullable=False)

    password = Column(String(255), nullable=False)

    role = Column(String(20), default="student")

    credits = Column(Integer, default=0)

    notes = relationship("Note", back_populates="user")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    branch = Column(String(50), nullable=False)
    semester = Column(Integer, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "name",
            "branch",
            "semester",
            name="unique_subject_branch_semester"
        ),
    )

    notes = relationship("Note", back_populates="subject")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text)
    pdf_file = Column(String(255))

    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))

    user = relationship("User", back_populates="notes")
    subject = relationship("Subject", back_populates="notes")