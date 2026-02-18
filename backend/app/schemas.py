from pydantic import BaseModel
from typing import Optional
import uuid as uuid_pkg

class CreateVaga(BaseModel):
    id: uuid_pkg.UUID
    empresa: str
    plataforma: str
    data_limite: Optional[str] = None
    status: str
    ultima_atualizacao: str

class UpdateVaga(BaseModel):
    empresa: Optional[str] = None
    plataforma: Optional[str] = None
    data_limite: Optional[str] = None
    status: Optional[str] = None