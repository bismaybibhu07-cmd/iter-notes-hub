from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import URL

DATABASE_URL = URL.create(
    drivername="postgresql+psycopg2",
    username="postgres",
    password="Bibhu@63718",
    host="localhost",
    port=5432,
    database="iter_notes_hub"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()