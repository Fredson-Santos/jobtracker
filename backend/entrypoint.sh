#!/bin/sh

# Sai imediatamente se um comando falhar
set -e

echo "🚀 Iniciando migrações do banco de dados..."
alembic upgrade head

echo "✅ Migrações concluídas!"

# Executa o comando passado para o container (CMD)
exec "$@"
