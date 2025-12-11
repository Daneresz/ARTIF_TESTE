#!/bin/bash

# Script para testar upload de imagem para comunidade
# Uso: ./test-upload.sh <comunidade-id>

COMUNIDADE_ID="$1"

if [ -z "$COMUNIDADE_ID" ]; then
    echo "Erro: Forneça o ID da comunidade"
    echo "Uso: ./test-upload.sh <comunidade-id>"
    exit 1
fi

# Criar arquivo de teste
echo "Criando arquivo de teste..."
echo "Este é um arquivo de teste para upload" > /tmp/test-image.txt

# Fazer o POST com curl
echo "Enviando POST para localhost:1111/cliente/comunidades/ver/$COMUNIDADE_ID/post"
curl -v -X POST \
    -F "artista=Test Artista" \
    -F "descricao=Teste de upload de imagem" \
    -F "imagem=@/tmp/test-image.txt" \
    "http://localhost:1111/cliente/comunidades/ver/$COMUNIDADE_ID/post"

echo ""
echo "Teste concluído!"
