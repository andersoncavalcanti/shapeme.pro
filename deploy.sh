#!/bin/bash

echo "🚀 Iniciando deploy do ShapeMe..."

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "Crie um arquivo .env com as seguintes variáveis:"
    echo "DATABASE_URL=postgresql://user:password@your-rds-endpoint:5432/shapeme"
    echo "SECRET_KEY=your-super-secret-key"
    echo "HOTMART_WEBHOOK_SECRET=your-hotmart-secret"
    exit 1
fi

# Verificar qual comando docker compose usar
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose não encontrado!"
    exit 1
fi

echo "📦 Usando: $DOCKER_COMPOSE"

# Parar containers existentes
echo "🛑 Parando containers existentes..."
$DOCKER_COMPOSE down

# Rebuild e start
echo "🔨 Construindo e iniciando containers..."
$DOCKER_COMPOSE up --build -d

# Verificar status
echo "✅ Verificando status dos containers..."
$DOCKER_COMPOSE ps

echo "🎉 Deploy concluído!"
echo "📱 Aplicação disponível em: http://shapeme.pro"
echo "�� API Health Check: http://shapeme.pro/health"