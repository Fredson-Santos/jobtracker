from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.vagas import router as vagas_router
from .routes.alertas import router as alertas_router
from .database import create_db_and_table

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_table()

app.include_router(vagas_router, prefix="/api")
app.include_router(alertas_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API de Vagas e Alertas!"}