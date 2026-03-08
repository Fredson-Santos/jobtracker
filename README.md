# JobTracker

O **JobTracker** é um sistema completo para organização e acompanhamento de processos seletivos. Ele centraliza suas candidaturas e, através de uma automação inteligente com n8n e IA, monitora sua caixa de entrada para atualizar automaticamente o status das vagas.

## 🚀 Funcionalidades

- **Dashboard de Vagas**: Visualize todas as suas candidaturas em um só lugar, com resumo de status e prazos.
- **Gerenciamento de Candidaturas**: Cadastre, edite e exclua vagas manualmente.
- **Monitoramento Automático**: Integração com Gmail via n8n para ler respostas de empresas.
- **Inteligência Artificial**: Analisa e-mails (convites, testes, feedbacks, reprovações) e classifica a relevância.
- **Atualização em Tempo Real**: Status da candidatura atualizado automaticamente com base na análise da IA.
- **Timestamps automáticos**: Cada vaga registra `created_at` e `updated_at` automaticamente.
- **Alertas**: Notificações sobre movimentações importantes (Em breve).

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Banco de Dados**: SQLModel + SQLite (fácil migração para PostgreSQL)
- **Migrações**: Alembic
- **Validação**: Pydantic

### Frontend
- **Framework**: React (Vite)
- **Estilização**: TailwindCSS
- **Roteamento**: React Router Dom
- **HTTP/API**: Axios

### Automação (n8n)
- **Workflow**: Monitoramento de Gmail via Polling.
- **IA**: Integração com LLMs (Google Gemini, Groq ou OpenAI) via LangChain no n8n.
- **Lógica**: Agente de IA que decide se o e-mail é sobre uma vaga e extrai dados (Empresa, Status, Resumo).

---

## 📦 Como Rodar

### Opção 1: Docker Compose (Recomendado)

A maneira mais fácil de rodar todo o ambiente (Backend + Frontend).

1. **Configuração do Ambiente**:
   - Vá para a pasta `backend/` e renomeie `.env.example` para `.env`. Configure as variáveis se necessário.

2. **Executar**:
   Na raiz do projeto, rode:
   ```bash
   docker compose up --build
   ```

3. **Acessar**:
   - **Backend (API Docs)**: [http://localhost:8015/docs](http://localhost:8015/docs)
   - **Frontend**: [http://localhost:8016](http://localhost:8016)

> **Nota:** As rotas da API ficam sob o prefixo `/api` (ex: `/api/vagas`).

> **Nota:** O frontend no Docker roda via `vite preview`. Para desenvolvimento com hot-reload, use a opção manual abaixo.

---

### Opção 2: Execução Manual

Caso queira rodar os serviços individualmente para desenvolvimento.

#### 1. Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

pip install -r requirements.txt

# Renomeie o .env.example para .env e ajuste as configurações se necessário

# Rodar o servidor
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Acesse: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Frontend

Certifique-se de ter o Node.js instalado.

```bash
cd frontend
npm install

# Configure as variáveis de ambiente no arquivo .env (já existente na pasta frontend):
# VITE_PORT=8016
# VITE_HOST=true
# VITE_API_URL=http://127.0.0.1:8000

# Rodar modo de desenvolvimento
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
