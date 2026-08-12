from pydantic import BaseModel, ConfigDict


# ---------- SUBJECT ----------

class SubjectCreate(BaseModel):
    name: str
    branch: str
    semester: int


class SubjectResponse(BaseModel):
    id: int
    name: str
    branch: str
    semester: int

    model_config = ConfigDict(from_attributes=True)


# ---------- NOTE ----------

class NoteCreate(BaseModel):
    title: str
    content: str | None = None
    subject_id: int

class SubjectMini(BaseModel):
    id: int
    name: str
    branch: str
    semester: int

    model_config = ConfigDict(from_attributes=True)



class NoteResponse(BaseModel):
    id: int
    title: str
    content: str | None = None
    subject_id: int
    pdf_file: str | None = None
    user_id: int
    subject: SubjectMini


    model_config = ConfigDict(from_attributes=True)

    # ---------- AUTH ----------

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    credits: int

    model_config = ConfigDict(from_attributes=True)