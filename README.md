# JobTracker

O **JobTracker** é um sistema completo para organização e acompanhamento de processos seletivos. Ele centraliza suas candidaturas e, através de uma automação inteligente com n8n e IA, monitora sua caixa de entrada para atualizar automaticamente o status das vagas.

## 🚀 Funcionalidades

- **Dashboard de Vagas**: Visualize todas as suas candidaturas em um só lugar.
- **Monitoramento Automático**: Integração com Gmail via n8n para ler respostas de empresas.
- **Inteligência Artificial**: Analisa o conteúdo dos e-mails (convites para entrevista, testes, feedbacks, reprovações) e classifica a relevância.
- **Atualização em Tempo Real**: O status da candidatura é atualizado automaticamente no sistema baseada na análise da IA.
- **Alertas**: Receba notificações sobre movimentações importantes nos seus processos (Em breve).

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Banco de Dados**: SQLModel (SQLite por padrão, fácil migração para PostgreSQL)
- **Validação**: Pydantic
- **Cliente HTTP**: HTTPX

### Frontend
- **Framework**: React (Vite)
- **Estilização**: TailwindCSS
- **Roteamento**: React Router Dom
- **HTTP/API**: Axios

### Automação (n8n)
- **Workflow**: Monitoramento de Gmail trigger via Polling.
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
   - **Backend (API Docs)**: [http://localhost:8015/docs](http://localhost:8015/docs) (Internamente o container roda na porta 8015, mas no modo manual roda na 8000)
   - **Frontend**: [http://localhost:8016](http://localhost:8016)

> **Nota:** As rotas da API agora ficam sob o prefixo `/api` (ex: `/api/vagas`).

> **Nota:** O frontend no Docker roda via `vite preview`. Para desenvolvimento com hot-reload, use a opção manual abaixo para o frontend.

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
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Acesse: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Frontend

Certifique-se de ter o Node.js instalado.

```bash
cd frontend
npm install

# Configure as variáveis de ambiente (Opcional)
# Crie um arquivo .env na pasta frontend com o seguinte conteúdo padrão:
# VITE_PORT=8016
# VITE_HOST=true
# VITE_API_URL=http://127.0.0.1:8000
# VITE_ALLOWED_HOSTS=jobtracker.conekta.tech

# Rodar modo de desenvolvimento
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173) (ou a porta indicada no terminal)

> **Troubleshooting (Erro ECONNREFUSED 127.0.0.1:8015):**
> Se você ver um erro de conexão recusada na porta 8015 ao rodar manualmente, é provável que a variável de ambiente `VITE_API_URL` esteja definida (talvez pelo Docker) apontando para a porta 8015.
> Para corrigir em modo manual (backend na 8000), certifique-se de que `VITE_API_URL` não está definida ou aponte explicitamente para `http://127.0.0.1:8000`.
> No PowerShell: `Remove-Item Env:\VITE_API_URL`
> No Bash: `unset VITE_API_URL`

---

## 🤖 Configurando a Automação (n8n)

Para que o monitoramento de e-mails funcione, você precisa importar o workflow no n8n.

1. **Instale o n8n**: Você pode rodar via Docker (`docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n`).
2. **Importar Workflow**:
   - No n8n, vá em "Workflows" -> "Import from File".
   - Selecione o arquivo `n8n/JobTracker - Gmail Monitor.json`.
3. **Configurar Credenciais**:
   - **Gmail OAuth2**: Configure suas credenciais do Google Cloud para permitir leitura de e-mails.
   - **Google Gemini / Groq API**: Adicione sua chave de API para o modelo de IA escolhido.
4. **Ajustar IPs**:
   - O workflow faz chamadas para o backend (`http://YOUR_SERVER_IP:8000/api/...`).
   - Se estiver rodando o n8n em Docker e o backend no host, use `host.docker.internal` ou o IP da sua máquina local (ex: `192.168.1.X`).
   - Atualize a porta se necessário (padrão manual é `8000`).

## 📁 Estrutura do Projeto

```
jobtracker/
├── backend/            # API FastAPI
├── frontend/           # Aplicação React
├── n8n/                # Workflows de automação
├── docs/               # Documentação adicional
└── docker-compose.yml  # Orquestração de containers
```

## 📝 Licença

Este projeto está sob a licença MIT.
