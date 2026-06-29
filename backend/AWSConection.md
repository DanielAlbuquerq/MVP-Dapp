powershell -Command "New-Item -Path . -Name 'AWS_CONEXAO_GUIDE.md' -ItemType 'File' -Value (@'
# 📝 Documentação de Conectividade: AWS RDS & AWS EC2 no Windows

Este documento consolida as soluções para problemas comuns de conexão com o **Prisma ORM (PostgreSQL no AWS RDS)** e problemas de permissão de chave privada (\`.pem\`) ao acessar instâncias **AWS EC2 (Linux)** através de uma máquina host Windows.

---

## 1. Conexão Prisma ORM com AWS RDS PostgreSQL
Ao utilizar caracteres especiais em senhas dentro de strings de conexão (URLs), o interpretador do Prisma pode falhar na leitura da porta (\`P1013\`) ou falhar em alcançar o servidor (\`P1001\`).

### Correção de Sintaxe (Erro P1013)
O caractere \`#\` é reservado em URLs para indicar âncoras. Ele deve ser obrigatoriamente codificado em formato hexadecimal (**URL Encode**).

* **Incorreto:** \`postgresql://user:Senha#123@host:5432/db\`
* **Correto (Substituir por \`%23\`):** \`postgresql://user:Senha%23123@host:5432/db\`

**Tabela de Conversão Rápida para Outros Caracteres:**
* \`@\` -> \`%40\`
* \`:\` -> \`%3A\`
* \`$\` -> \`%24\`

### Liberação de Rede (Erro P1001)
Se a URL estiver correta mas o servidor continuar inacessível, o tráfego está sendo bloqueado pelo *Firewall* da AWS.
1. Acesse o **AWS RDS Console** -> **Databases** -> Selecione seu banco.
2. Na aba **Connectivity & security**, clique no link em **VPC security groups**.
3. Vá em **Inbound Rules** (Regras de Entrada) -> **Edit inbound rules**.
4. Adicione uma regra: 
   * **Type:** \`PostgreSQL\` (Porta \`5432\`).
   * **Source:** \`My IP\` (Apenas sua máquina) ou \`Anywhere-IPv4\` (\`0.0.0.0/0\` - *Apenas para testes temporários*).

---

## 2. Acesso SSH à AWS EC2 Linux via Windows
O protocolo SSH exige que o arquivo de chave privada (\`.pem\`) tenha permissões estritas de leitura, limitadas **apenas ao usuário proprietário**. O comando Unix \`chmod 400\` não funciona nativamente no PowerShell do Windows.

### Configuração de Permissões Equivalentes ao \`chmod 400\` via PowerShell
Para remover os privilégios herdados e garantir acesso exclusivo ao seu usuário atual do Windows, abra o **PowerShell** na pasta onde o arquivo \`.pem\` está localizado e execute os seguintes comandos:

\`\`\`powershell
# 1. Desabilita a herança de permissões no arquivo de chave
icacls.exe .\\mvp-key.pem /inheritance:r

# 2. Concede permissão de leitura exclusivamente para o usuário logado
icacls.exe .\\mvp-key.pem /grant:r '\$($env:USERNAME):(R)'

# 3. Garante a remoção de acessos amplos de grupos do sistema (Administradores/SYSTEM)
icacls.exe .\\mvp-key.pem /remove \"Administrators\"
icacls.exe .\\mvp-key.pem /remove \"SYSTEM\"
\`\`\`

### Validação das Permissões
Para confirmar se a alteração foi aplicada com sucesso, execute:
\`\`\`powershell
icacls.exe .\\mvp-key.pem
\`\`\`
*O retorno deve listar estritamente o seu usuário seguido do sufixo \`(R)\` (Read/Leitura).*

### Comando de Conexão SSH
Com a chave protegida, realize o acesso remoto utilizando o terminal do Windows (PowerShell ou CMD):

\`\`\`bash
ssh -i .\\mvp-key.pem usuario_padrao@ip_publico_ec2
\`\`\`

**Principais usuários padrão por distribuição Linux na AWS:**
* **Ubuntu:** \`ubuntu\`
* **Amazon Linux 2 / 2023:** \`ec2-user\`
* **Debian:** \`admin\`
'@)" -Force`
