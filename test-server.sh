#!/bin/bash

# Script para testar o servidor localmente

echo "🧪 Testando Health Check..."
curl -s http://localhost:3000/health | jq . || echo "Servidor não está respondendo"

echo ""
echo "🧪 Testando página inicial..."
curl -s http://localhost:3000/ -L | head -20

echo ""
echo "✅ Testes concluídos"
