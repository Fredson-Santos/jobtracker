import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://jobtracker:jobtracker@localhost:5432/jobtracker")

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_table():
    SQLModel.metadata.create_all(engine)
    print("Banco de dados criado com sucesso!")

def get_session():
    with Session(engine) as session:
        yield session