# JobTracker 🚀

O **JobTracker** é um ecossistema de gerenciamento e automação de processos seletivos. O objetivo é centralizar candidaturas de diferentes plataformas (Gupy, Eureca, Universia) e monitorar convites para testes e entrevistas via Gmail, enviando alertas em tempo real pelo Telegram para garantir que nenhum prazo seja perdido.

## 🏗️ Arquitetura do Sistema

A solução é composta por quatro camadas integradas, rodando em ambiente Docker no seu homelab:

- **Front-End (Painel Web):** Interface em React para cadastro de vagas e visualização de status.
- **Back-End (API):** Desenvolvido em FastAPI (Python) para gerenciar o banco de dados e disparar Webhooks.
- **Automação (Cérebro):** Workflows no n8n integrados à API do Gmail para escanear convites de empresas específicas.
- **Notificação:** Bot no Telegram para alertas críticos de prazos e novas etapas.

## 📋 Escopo das Funcionalidades

### 1. Gestão de Vagas
- **Cadastro Manual:** Registro da empresa, cargo, link da candidatura e data limite.
- **Controle de Status:** Acompanhamento da evolução (Inscrito, Teste Pendente, Entrevista, Feedback).
- **Centralização de Plataformas:** Monitoramento unificado para Gupy, Eureca e Universia.

### 2. Automação e Monitoramento
- **Gmail Scanner:** Busca automatizada por e-mails de remetentes específicos (ex: `@gupy.pub`, `@eureca.me`) contendo palavras-chave como "convite", "teste" ou "entrevista".
- **Webhooks de Sincronização:** Comunicação entre a API FastAPI e o n8n para atualizar o status da vaga no banco de dados assim que um e-mail é detectado.

### 3. Sistema de Alertas (Telegram)
- **Aviso de Prazo:** Alerta enviado 24h antes do vencimento de trilhas online ou inscrições.
- **Notificação de Nova Etapa:** Mensagem imediata no Telegram ao receber um convite para entrevista técnica ou comportamental.

## 🗄️ Modelo de Dados (MVP)

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único da candidatura. |
| `empresa` | String | Nome da empresa (ex: Record, Omie, B3). |
| `plataforma` | String | Gupy, Eureca ou Universia. |
| `data_limite` | Date | Prazo final (ex: 19/02/2026 para Casas Bahia). |
| `status` | String | Status atual no funil de seleção. |
| `ultima_att` | Timestamp | Data e hora da última verificação no Gmail. |

## 🚨 Vagas em Monitoramento Inicial

As seguintes vagas e prazos devem ser priorizados no setup inicial do sistema:

- **Casas Bahia:** Trilha Online e Inscrições até **19/02/2026**.
- **Gertec:** Inscrições abertas até **27/02/2026**.
- **Honda:** Inscrições abertas até **06/03/2026**.
- **B3:** Inscrições abertas até **30/03/2026**.
- **Omie:** Inscrições abertas até **31/03/2026**.
- **PagBank:** Inscrições abertas até **07/04/2026**.
- **Record:** Inscrições abertas até **31/12/2026**.

## � Stack Backend Simples

Para manter o desenvolvimento ágil e eficiente, utilizaremos uma stack moderna e leve:

- **Linguagem:** Python 3.12+
- **Framework:** FastAPI (Assíncrono, validação automática com Pydantic)
- **Banco de Dados:** SQLite (para dev/MVP) -> PostgreSQL (produção)
- **ORM:** SQLModel (Combinação de SQLAlchemy + Pydantic)
- **Gerenciamento de Dependências:** Pip (com `requirements.txt`)
- **Containerização:** Docker

## 📂 Estrutura de Pastas Simples

A organização do projeto seguirá um padrão modular para facilitar a manutenção:

```
jobtracker/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # Ponto de entrada da API
│   │   ├── models.py        # Modelos do Banco de Dados (SQLModel)
│   │   ├── schemas.py       # Schemas Pydantic (Request/Response)
│   │   ├── crud.py          # Lógica de acesso ao banco (CRUD)
│   │   ├── database.py      # Configuração do banco de dados
│   │   └── routers/         # Rotas da API divididas por contexto
│   │       ├── __init__.py
│   │       ├── vagas.py
│   │       └── alertas.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env                 # Variáveis de ambiente
├── frontend/                # Aplicação React
├── n8n/                     # Workflows exportados do n8n
├── docker-compose.yml       # Orquestração dos serviços
└── README.md
```

## �🛠️ Tecnologias Utilizadas

- Python (FastAPI)
- SQL (PostgreSQL/SQLite)
- Docker & Docker Compose
- n8n
- Gmail API
- Telegram Bot API
- React