from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from datetime import datetime
from typing import List

from ..database import get_session
from .. import crud, schemas

router = APIRouter(
    prefix="/alertas", tags=["alertas"]
)


@router.post("/webhook")
def receive_webhook(
    payload: schemas.WebhookPayload,
    session: Session = Depends(get_session),
):
    """
    Recebe dados do n8n AI Agent após análise de um e-mail.

    Fluxo:
    1. Busca vagas que correspondam à empresa informada.
    2. Atualiza o status (e outros campos) da(s) vaga(s) encontrada(s).
    3. Retorna o resultado da operação.
    """
    print(f"[Webhook] Payload recebido: {payload.model_dump()}")

    # Busca vagas que batem com a empresa
    vagas_encontradas = crud.search_vagas_by_empresa(session, payload.empresa)

    if not vagas_encontradas:
        return {
            "status": "ignorado",
            "motivo": f"Nenhuma vaga encontrada para a empresa '{payload.empresa}'",
            "payload": payload.model_dump(),
        }

    atualizadas = []
    now = datetime.now().isoformat()

    for vaga in vagas_encontradas:
        campos_update = {}

        if payload.novo_status:
            campos_update["status"] = payload.novo_status

        if payload.cargo and not vaga.cargo:
            campos_update["cargo"] = payload.cargo

        # Sempre atualiza o timestamp
        campos_update["ultima_atualizacao"] = now  # type: ignore

        if campos_update:
            update_schema = schemas.UpdateVaga(**campos_update)
            vaga_atualizada = crud.update_vaga(
                session=session,
                vaga_id=vaga.id,
                vaga_update=update_schema,
            )
            atualizadas.append({
                "id": str(vaga_atualizada.id),
                "empresa": vaga_atualizada.empresa,
                "status_anterior": vaga.status,
                "status_novo": vaga_atualizada.status,
            })

    return {
        "status": "processado",
        "vagas_atualizadas": len(atualizadas),
        "detalhes": atualizadas,
        "email": {
            "remetente": payload.remetente,
            "assunto": payload.assunto,
            "resumo": payload.resumo,
        },
    }


@router.get("/empresas-monitoradas", response_model=List[str])
def get_empresas_monitoradas(session: Session = Depends(get_session)):
    """
    Retorna lista de empresas cadastradas.
    Usado pelo AI Agent do n8n para verificar se o e-mail
    é de uma empresa/plataforma que estamos monitorando.
    """
    return crud.get_unique_companies(session)
