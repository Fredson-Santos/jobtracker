import uuid as uuid_pkg
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from sqlalchemy import Column, DateTime, func

class Vaga(SQLModel, table=True):
    __tablename__ = "vagas"
    
    id: uuid_pkg.UUID = Field(default_factory=uuid_pkg.uuid4, primary_key=True)
    empresa: str
    cargo: Optional[str] = None
    plataforma: str
    link: Optional[str] = None
    data_limite: Optional[str] = None
    status: str
    ultima_atualizacao: str
    
    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    updated_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    )
