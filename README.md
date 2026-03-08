# JobTracker

O **JobTracker** é um sistema completo para organização e acompanhamento de processos seletivos. Ele centraliza suas candidaturas e, através de uma automação inteligente com n8n e IA, monitora sua caixa de entrada do Gmail para atualizar automaticamente o status das vagas e enviar notificações via Telegram.

## 🚀 Funcionalidades

- **Dashboard**: Painel com cards de estatísticas (Total, Inscritos, Teste Pendente, Entrevistas) e prazos próximos (7 dias).
- **Gestão de Vagas**: CRUD completo de candidaturas com filtros por status, ordenação e paginação.
- **Extração de Vagas**: Preenchimento automático de dados a partir da URL da vaga (integração com scraper externo).
- **Monitoramento Automático**: Integração com Gmail via n8n — polling a cada minuto por novos e-mails.
- **IA (Google Gemini)**: Agente de IA via LangChain que analisa e-mails, identifica se são sobre uma vaga monitorada e extrai dados (empresa, status, cargo, resumo).
- **Atualização em Tempo Real**: Status da candidatura atualizado automaticamente via webhook do n8n.
- **Notificações Telegram**: Alertas imediatos no Telegram sobre mudanças de status.
- **Tema Escuro/Claro**: Interface com toggle de tema, persistido no `localStorage`.
- **Timestamps automáticos**: Cada vaga registra `created_at` e `updated_at` automaticamente.

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Banco de Dados**: PostgreSQL
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Migrações**: Alembic
- **HTTP Client**: HTTPX (async)
- **Servidor**: Uvicorn

### Frontend
- **Framework**: React 19 (Vite 6)
- **Estilização**: TailwindCSS
- **Roteamento**: React Router Dom v7
- **HTTP/API**: Axios
- **Notificações**: React Hot Toast

### Automação (n8n)
- **Trigger**: Gmail Polling (a cada minuto)
- **IA**: Google Gemini via LangChain
- **Lógica**: Agente de IA que consulta as empresas monitoradas, analisa o e-mail e envia o resultado via webhook
- **Notificação**: Bot Telegram integrado ao workflow

## 📂 Estrutura do Projeto

```
jobtracker/
├── backend/
│   ├── app/
│   │   ├── main.py            # Ponto de entrada da API FastAPI
│   │   ├── models.py          # Modelo Vaga (SQLModel)
│   │   ├── schemas.py         # Schemas Pydantic (CreateVaga, UpdateVaga, WebhookPayload)
│   │   ├── crud.py            # Lógica de acesso ao banco (CRUD)
│   │   ├── database.py        # Configuração PostgreSQL + sessão
│   │   └── routes/
│   │       ├── vagas.py       # CRUD de vagas + extração via URL
│   │       └── alertas.py     # Webhook do n8n + empresas monitoradas
│   ├── alembic/               # Migrações do banco de dados
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Rotas: / (Dashboard) e /vagas (Listagem)
│   │   ├── api/vagasApi.js    # Cliente Axios centralizado
│   │   ├── components/        # Layout, VagaCard, VagaModal, StatusBadge, TruncatedText
│   │   ├── context/           # ThemeContext (escuro/claro)
│   │   └── pages/             # Dashboard.jsx, Vagas.jsx
│   ├── package.json
│   ├── Dockerfile
│   └── vite.config.js
├── n8n/                        # Workflow exportado do n8n (Gmail Monitor)
├── docs/                       # Documentação do projeto
├── docker-compose.yml
└── README.md
```

## 🔌 Endpoints da API

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/vagas/` | Listar vagas (paginado: `skip`, `limit`) |
| `POST` | `/api/vagas/` | Criar nova vaga |
| `GET` | `/api/vagas/{id}` | Buscar vaga por ID |
| `PATCH` | `/api/vagas/{id}` | Atualizar campos da vaga |
| `DELETE` | `/api/vagas/{id}` | Excluir vaga |
| `GET` | `/api/vagas/empresas` | Listar empresas únicas |
| `POST` | `/api/vagas/extract` | Extrair dados de uma URL de vaga |
| `POST` | `/api/alertas/webhook` | Receber webhook do n8n (análise de e-mail) |
| `GET` | `/api/alertas/empresas-monitoradas` | Listar empresas monitoradas |

---

## 📦 Como Rodar

### Pré-requisitos

- Docker e Docker Compose **ou**
- Python 3.12+ e Node.js 20+
- PostgreSQL acessível

### Opção 1: Docker Compose (Recomendado)

1. **Configurar variáveis de ambiente**:
   Crie o arquivo `backend/.env`:
   ```env
   DATABASE_URL=postgresql://usuario:senha@host:5432/jobtracker
   SCRAPER_URL=http://seu-scraper:8001
   ```

2. **Executar**:
   ```bash
   docker compose up --build
   ```

3. **Acessar**:
   - **Backend (API Docs)**: [http://localhost:8015/docs](http://localhost:8015/docs)
   - **Frontend**: [http://localhost:8016](http://localhost:8016)

> **Nota:** O frontend no Docker roda via `vite preview`. Para desenvolvimento com hot-reload, use a opção manual abaixo.

---

### Opção 2: Execução Manual

#### 1. Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

pip install -r requirements.txt

# Crie o arquivo .env com DATABASE_URL e SCRAPER_URL

uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Acesse: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Frontend

```bash
cd frontend
npm install

# Configure o .env na pasta frontend:
# VITE_PORT=8016
# VITE_HOST=true
# VITE_API_URL=http://127.0.0.1:8000

npm run dev
```

Acesse: [http://localhost:8016](http://localhost:8016) (ou a porta indicada no terminal)

> **Troubleshooting (Erro ECONNREFUSED):**
> Se você ver um erro de conexão recusada, verifique se a variável `VITE_API_URL` no `frontend/.env` aponta para a porta correta onde o backend está rodando.
> - Modo manual: `VITE_API_URL=http://127.0.0.1:8000`
> - Docker: `VITE_API_URL=http://192.168.X.X:8015` (IP local da máquina)

---

## 🗄️ Migrações de Banco de Dados (Alembic)

As migrações do banco de dados são gerenciadas pelo **Alembic**. Para aplicar migrações pendentes:

```bash
cd backend
# Ativar o ambiente virtual primeiro
alembic upgrade head
```

Para criar uma nova migração após alterar `models.py`:

```bash
alembic revision --autogenerate -m "descricao da mudanca"
alembic upgrade head
```

---

## 🤖 Configurando a Automação (n8n)

Para que o monitoramento de e-mails funcione, você precisa importar o workflow no n8n.

1. **Instale o n8n**: Você pode rodar via Docker:
   ```bash
   docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
   ```
2. **Importar Workflow**:
   - No n8n, vá em "Workflows" -> "Import from File".
   - Selecione o arquivo `n8n/JobTracker - Gmail Monitor.json`.
3. **Configurar Credenciais**:
   - **Gmail OAuth2**: Configure suas credenciais do Google Cloud para permitir leitura de e-mails.
   - **Google Gemini / Groq API**: Adicione sua chave de API para o modelo de IA escolhido.
4. **Ajustar IPs**:
   - O workflow faz chamadas para o backend (`http://YOUR_SERVER_IP:8000/api/...`).
   - Se o n8n rodar em Docker e o backend no host, use `host.docker.internal` ou o IP local da máquina.

---

## 📁 Estrutura do Projeto

```
jobtracker/
├── backend/                # API FastAPI
│   ├── alembic/            # Migrações de banco de dados
│   ├── app/
│   │   ├── routes/         # Rotas da API (vagas, alertas)
│   │   ├── models.py       # Modelos do banco de dados (SQLModel)
│   │   ├── schemas.py      # Schemas Pydantic (request/response)
│   │   ├── crud.py         # Operações de banco de dados
│   │   └── main.py         # Entrypoint da aplicação
│   ├── requirements.txt
│   └── .env                # Variáveis de ambiente do backend
├── frontend/               # Aplicação React (Vite)
│   ├── src/
│   │   ├── api/            # Funções de chamada à API
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   └── main.jsx        # Entrypoint do frontend
│   ├── package.json
│   └── .env                # Variáveis de ambiente do frontend
├── n8n/                    # Workflows de automação
├── docs/                   # Documentação adicional
└── docker-compose.yml      # Orquestração de containers
```

## 📝 Licença

Este projeto está sob a licença MIT.
