from pydantic import BaseModel
from typing import Optional
import uuid as uuid_pkg

class CreateVaga(BaseModel):
    id: uuid_pkg.UUID
    empresa: str
    cargo: Optional[str] = None
    plataforma: str
    link: Optional[str] = None
    data_limite: Optional[str] = None
    status: str
    ultima_atualizacao: str

class UpdateVaga(BaseModel):
    empresa: Optional[str] = None
    cargo: Optional[str] = None
    plataforma: Optional[str] = None
    link: Optional[str] = None
    data_limite: Optional[str] = None
    status: Optional[str] = None
    ultima_atualizacao: Optional[str] = None


class WebhookPayload(BaseModel):
    """Payload enviado pelo n8n AI Agent após analisar um e-mail."""
    empresa: str
    novo_status: Optional[str] = None
    cargo: Optional[str] = None
    remetente: Optional[str] = None
    assunto: Optional[str] = None
    resumo: Optional[str] = None
    data_evento: Optional[str] = None