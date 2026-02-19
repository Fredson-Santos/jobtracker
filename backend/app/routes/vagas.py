from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
import uuid

from ..database import get_session
from .. import crud, schemas

router = APIRouter(
    prefix="/vagas", tags=["vagas"]
)

@router.get("/empresas", response_model=List[str])
def read_empresas(session: Session = Depends(get_session)):
    return crud.get_unique_companies(session)


@router.post("/", response_model=schemas.CreateVaga)
def create_vaga(vaga: schemas.CreateVaga, session: Session = Depends(get_session)):
    return crud.create_vaga(session=session, vaga=vaga)

@router.get("/", response_model=List[schemas.CreateVaga])
def read_vagas(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    vagas = crud.get_vagas(session, skip=skip, limit=limit)
    return vagas

@router.get("/{vaga_id}", response_model=schemas.CreateVaga)
def read_vaga(vaga_id: uuid.UUID, session: Session = Depends(get_session)):
    db_vaga = crud.get_vaga_by_id(session, vaga_id)
    if not db_vaga:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return db_vaga

@router.patch("/{vaga_id}", response_model=schemas.CreateVaga)
def update_vaga(vaga_id: uuid.UUID, vaga: schemas.UpdateVaga, session: Session = Depends(get_session)):
    db_vaga = crud.get_vaga_by_id(session, vaga_id)
    if not db_vaga:
        raise HTTPException(status_code=404, detail="Vaga not found")
    return crud.update_vaga(session=session, vaga_id=vaga_id, vaga_update=vaga)

@router.delete("/{vaga_id}")
def delete_vaga(vaga_id: uuid.UUID, session: Session = Depends(get_session)):
    db_vaga = crud.get_vaga_by_id(session, vaga_id)
    if not db_vaga:
        raise HTTPException(status_code=404, detail="Vaga not found")
    crud.delete_vaga(session=session, vaga_id=vaga_id)
    return {"ok": True}
