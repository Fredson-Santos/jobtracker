from fastapi import FastAPI

from .routes.vagas import router as vagas_router
from .routes.alertas import router as alertas_router
from .database import create_db_and_table

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_table()

app.include_router(vagas_router)
app.include_router(alertas_router)

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API de Vagas e Alertas!"}