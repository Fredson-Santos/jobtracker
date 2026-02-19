import httpx
import uuid
from datetime import datetime

# Configuração
BASE_URL = "http://localhost:8000"

def seed_vaga():
    vaga_data = {
        "id": str(uuid.uuid4()),
        "empresa": "Empresa Teste N8N",
        "cargo": "Desenvolvedor Backend",
        "plataforma": "LinkedIn",
        "link": "https://www.linkedin.com/jobs/view/123456789",
        "data_limite": "2024-12-31",
        "status": "Candidatado",
        "ultima_atualizacao": datetime.now().isoformat()
    }

    try:
        response = httpx.post(f"{BASE_URL}/vagas/", json=vaga_data)
        response.raise_for_status()
        print(f"✅ Vaga criada com sucesso! ID: {response.json()['id']}")
        print(f"   Empresa: {response.json()['empresa']}")
    except httpx.HTTPError as e:
        print(f"❌ Erro ao criar vaga: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"   Detalhes: {e.response.text}")

def check_empresas_monitoradas():
    try:
        response = httpx.get(f"{BASE_URL}/alertas/empresas-monitoradas")
        response.raise_for_status()
        empresas = response.json()
        print(f"\n✅ Empresas monitoradas: {empresas}")
        if "Empresa Teste N8N" in empresas:
            print("   -> Sucesso! A empresa foi encontrada no endpoint.")
        else:
            print("   -> Aviso: A empresa criada não apareceu na lista.")
    except httpx.HTTPError as e:
        print(f"❌ Erro ao buscar empresas: {e}")

if __name__ == "__main__":
    print("🚀 Iniciando seed de dados...")
    seed_vaga()
    check_empresas_monitoradas()
