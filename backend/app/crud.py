from sqlmodel import Session, select
from .models import Vaga
from .schemas import CreateVaga, UpdateVaga
import uuid

def create_vaga(session: Session, vaga: CreateVaga) -> Vaga:
    nova_vaga = Vaga(
        id=vaga.id,
        empresa=vaga.empresa,
        cargo=vaga.cargo,
        plataforma=vaga.plataforma,
        link=vaga.link,
        data_limite=vaga.data_limite,
        status=vaga.status,
        ultima_atualizacao=vaga.ultima_atualizacao
    )
    session.add(nova_vaga)
    session.commit()
    session.refresh(nova_vaga)
    return nova_vaga

def get_vagas(session: Session, skip: int = 0, limit: int = 100) -> list[Vaga]:
    return session.exec(select(Vaga).offset(skip).limit(limit)).all()

def get_vaga_by_id(session: Session, vaga_id: uuid.UUID) -> Vaga:
    return session.exec(select(Vaga).where(Vaga.id == vaga_id)).first()

def update_vaga(session: Session, vaga_id: uuid.UUID, vaga_update: UpdateVaga) -> Vaga:
    vaga = session.exec(select(Vaga).where(Vaga.id == vaga_id)).first()
    if not vaga:
        return None
    
    for key, value in vaga_update.model_dump(exclude_unset=True).items():
        setattr(vaga, key, value)
    
    session.add(vaga)
    session.commit()
    session.refresh(vaga)
    return vaga

def delete_vaga(session: Session, vaga_id: uuid.UUID) -> bool:
    vaga = session.exec(select(Vaga).where(Vaga.id == vaga_id)).first()
    if not vaga:
        return False
    
    session.delete(vaga)
    session.commit()
    return True

def get_unique_companies(session: Session) -> list[str]:
    statement = select(Vaga.empresa).distinct()
    results = session.exec(statement).all()
    return results


def search_vagas_by_empresa(session: Session, empresa: str) -> list[Vaga]:
    """Busca vagas cujo nome da empresa contenha o termo (case-insensitive)."""
    all_vagas = session.exec(select(Vaga)).all()
    termo = empresa.lower()
    return [v for v in all_vagas if termo in v.empresa.lower() or v.empresa.lower() in termo]


def search_vagas_by_plataforma(session: Session, plataforma: str) -> list[Vaga]:
    """Busca vagas pela plataforma."""
    return session.exec(
        select(Vaga).where(Vaga.plataforma == plataforma)
    ).all()
