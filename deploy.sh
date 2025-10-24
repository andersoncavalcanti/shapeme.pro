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

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Rebuild e start
echo "🔨 Construindo e iniciando containers..."
docker-compose up --build -d

# Verificar status
echo "✅ Verificando status dos containers..."
docker-compose ps

echo "🎉 Deploy concluído!"
echo "📱 Aplicação disponível em: http://shapeme.pro"
echo "🔍 API Health Check: http://shapeme.pro/health"