# 🚀 O Coração do JobTracker

### `main.py`
É o ponto de entrada da API. Ele inicializa o **FastAPI**, configura os middlewares e inclui os roteadores das vagas e alertas. É aqui que o evento `startup` dispara o `init_db()` para preparar o banco SQLite.

---

## ⚙️ Core & Database
Esta camada gerencia as configurações e a persistência dos dados das suas candidaturas.

| Arquivo | Descrição |
| :--- | :--- |
| `database.py` | Configura a conexão assíncrona com o SQLite (**via aiosqlite**). Define a função `get_session`, que provê a conexão para as rotas interagirem com os dados das empresas como **B3** e **PagBank**. |
| `models.py` | Define a estrutura das tabelas usando **SQLModel**. Aqui mapeamos campos críticos como `data_limite` (para não perder o prazo da **Gertec** em **27/02**) e o status da vaga. |

---

## 🏗️ Dados e Validação — Models vs. Schemas

- **`models/`**: Representam as tabelas do banco de dados. Definem como os dados são salvos (ex: UUID para o ID, String para o nome da empresa).
- **`schemas/`**: São os **Pydantic Models**. Eles filtram o que a API recebe e envia.
    - *Exemplo:* O schema de entrada valida se o link da vaga enviado é uma URL válida da **Gupy** ou **Eureca**.

---

## 🛣️ Rotas e Lógica de Negócio

- **`routes/vagas.py`**: Gerencia o CRUD das candidaturas. É por aqui que você cadastrará as vagas da **Honda** ou da **Omie**.
- **`routes/alertas.py`**: Recebe os webhooks vindos do n8n. Quando o n8n encontra um e-mail com o termo "Entrevista" no Gmail, ele avisa esta rota para atualizar o banco e disparar o bot do Telegram.

---

## 🤖 Automação (n8n & Bots)

- **`n8n/workflow_gmail.json`**: Contém a lógica de busca. Ele acessa o Gmail em intervalos regulares procurando por remetentes como `@gupy.pub` ou `@eureca.me`.
- **`telegram_bot`**: Integrado ao backend para enviar mensagens diretas: *"Fredson, você tem um novo teste para a vaga da Record!"*.

---

## 📦 Containerização

- **`Dockerfile`**: Define a imagem **Python 3.12**, instala as dependências do `requirements.txt` e prepara o ambiente para rodar o **Uvicorn**.
- **`docker-compose.yml`**: Orquestra tudo: sobe o banco de dados, a API FastAPI e o container do n8n, garantindo que todo o sistema de monitoramento rode de forma isolada no seu servidor.