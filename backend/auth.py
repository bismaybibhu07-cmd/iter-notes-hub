from datetime import datetime, timedelta
from jose import jwt
import bcrypt

SECRET_KEY = "iter_notes_super_secret_key_2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


def hash_password(password: str):
    password_bytes = password.encode("utf-8")

    salt = bcrypt.gensalt()

    hashed = bcrypt.hashpw(
        password_bytes,
        salt
    )

    return hashed.decode("utf-8")


def verify_password(
    plain_password: str,
    hashed_password: str
):
    plain_password_bytes = plain_password.encode("utf-8")
    hashed_password_bytes = hashed_password.encode("utf-8")

    return bcrypt.checkpw(
        plain_password_bytes,
        hashed_password_bytes
    )


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )