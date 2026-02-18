import uuid as uuid_pkg
from sqlmodel import SQLModel, Field
from typing import Optional

class Vaga(SQLModel, table=True):
    __tablename__ = "vagas"
    
    id: uuid_pkg.UUID = Field(default_factory=uuid_pkg.uuid4, primary_key=True)
    empresa: str
    plataforma: str
    data_limite: Optional[str] = None
    status: str
    ultima_atualizacao: str
