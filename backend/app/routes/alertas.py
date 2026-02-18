from fastapi import APIRouter, Body

router = APIRouter(
    prefix="/alertas", tags=["alertas"]
)

@router.post("/webhook")
async def receive_webhook(payload: dict = Body(...)):
    """
    Recebe notificação do n8n (ex: email encontrado).
    Por enquanto, apenas loga o payload.
    """
    print(f"Webhook recebido: {payload}")
    return {"status": "recebido", "payload": payload}
