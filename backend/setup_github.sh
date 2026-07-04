#!/bin/bash

# Configurações - Altere com os seus dados do GitHub
GIT_NAME="DanielAlbuquerq"
GIT_EMAIL="daniel_developer@hotmail.com"

echo "========================================="
echo " Iniciando automação do Git e SSH (Fedora)"
echo "========================================="

# 1. Atualizar pacotes e instalar Git
echo "--> Atualizando sistema e instalando Git..."
sudo dnf update -y
sudo dnf install git -y

# 2. Configurar perfil global do Git
echo "--> Configurando identidade global do Git..."
git config --global user.name "$GIT_NAME"
git config --global user.email "$GIT_EMAIL"

# 3. Gerar chave SSH (sem senha/passphrase para automação)
echo "--> Gerando chave SSH (Ed25519)..."
mkdir -p ~/.ssh
ssh-keygen -t ed25519 -C "$GIT_EMAIL" -f ~/.ssh/id_ed25519 -N ""

# 4. Iniciar agente SSH e adicionar a chave
echo "--> Ativando SSH Agent..."
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

echo "========================================="
echo " Configuração concluída com sucesso!     "
echo "========================================="
echo ""
echo "Copie a chave pública abaixo e adicione ao seu GitHub:"
echo "------------------------------------------------------"
cat ~/.ssh/id_ed25519.pub
echo "------------------------------------------------------"
echo ""
echo "Após adicionar a chave no site do GitHub, teste com:"
echo "ssh -T git@github.com"
