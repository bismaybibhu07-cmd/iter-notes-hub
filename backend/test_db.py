from database import engine
from sqlalchemy import text

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("DATABASE CONNECTED SUCCESSFULLY!")
except Exception as e:
    print("DATABASE CONNECTION FAILED!")
    print(e)