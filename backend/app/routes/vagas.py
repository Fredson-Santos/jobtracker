from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from pydantic import BaseModel, HttpUrl
import uuid
import os
import httpx

from ..database import get_session
from .. import crud, schemas

SCRAPER_URL = os.getenv("SCRAPER_URL", "http://localhost:8001")

router = APIRouter(
    prefix="/vagas", tags=["vagas"]
)


class ExtractRequest(BaseModel):
    url: HttpUrl


@router.post("/extract")
async def extract_vaga_from_link(payload: ExtractRequest):
    """Proxy para a API de scraping externa."""
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                f"{SCRAPER_URL}/extract",
                json={"url": str(payload.url)},
            )
            resp.raise_for_status()
            return resp.json()
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail="Erro na API de extração",
        )
    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="API de extração indisponível",
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
