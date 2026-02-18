# JobTracker

O **JobTracker** é um sistema para centralizar candidaturas de emprego e monitorar respostas via Gmail.

## Como Rodar

### Backend

1.  Navegue até a pasta `backend`:
    ```bash
    cd backend
    ```
2.  Crie um ambiente virtual e instale as dependências:
    ```bash
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt
    ```
3.  Renomeie `.env.example` para `.env` (se necessário) e ajuste as variáveis.
4.  Execute o servidor:
    ```bash
    uvicorn app.main:app --reload
    ```
5.  Acesse a documentação da API em: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend (Em Breve)

### n8n (Em Breve)
