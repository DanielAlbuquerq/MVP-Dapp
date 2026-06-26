#### Documento consolidado com todas as estratégias, arquitetura e configurações técnicas discutidas para o deploy do seu aplicativo de delivery no nível gratuito da AWS.

------------------------------
## 📋 Guia de Arquitetura e Deploy: App de Delivery (Nível Gratuito AWS)
Este documento estabelece as diretrizes de configuração para o deploy de um aplicativo de delivery composto por NestJS (Backend), Prisma (ORM) e NextJS (Frontend), utilizando a infraestrutura gratuita da AWS para suportar uma operação inicial de 15 restaurantes e 1.000 usuários cadastrados.
------------------------------
## 1. Dimensionamento da Infraestrutura (AWS Free Tier)
Para garantir custo zero (ou mínimo) durante os primeiros 12 meses de validação do negócio, a infraestrutura deve seguir estritamente o modelo abaixo:

| Componente | Serviço AWS | Tipo de Instância | Recursos Incluídos | Função |
|---|---|---|---|---|
| Banco de Dados | Amazon RDS | db.t4g.micro | 2 vCPUs, 1 GiB RAM, 20 GiB SSD | PostgreSQL Gerenciado |
| Servidor Web | Amazon EC2 | t3.micro ou t2.micro | 2 vCPUs, 1 GiB RAM, 30 GiB SSD | Hospedagem da API e do Frontend |

------------------------------
## 2. Estratégia de Proteção do Banco de Dados (PostgreSQL)
O banco de dados de 1 GiB de RAM (db.t4g.micro) possui um limite físico rigoroso de aproximadamente 80 a 85 conexões simultâneas. Como o PostgreSQL aloca memória para cada conexão aberta, estourar esse limite causará a queda do servidor (Out of Memory).
## O Mecanismo de Conexões Fixas (Connection Pool)
Para blindar o banco de dados, configuramos o Prisma ORM para trabalhar com um Pool Fixo de 5 conexões. A API manterá apenas 5 canais abertos que serão revezados em milissegundos entre os usuários, garantindo estabilidade absoluta.
## Configuração no Arquivo .env:
Adicione explicitamente o parâmetro connection_limit=5 ao final da string de conexão com o banco:

# URL de conexão do Prisma com limite de conexões ativado
DATABASE_URL="postgresql://usuario:senha@://amazonaws.com"

## Otimizações Obrigatórias no Banco

   1. Indexação Crítica: Crie índices (@@index ou @unique no schema.prisma) para colunas usadas frequentemente em buscas (where), como restaurante_id, status_pedido e categoria. Isso impede a leitura total do disco e poupa CPU.
   2. Cache na API (NestJS): Implemente cache em memória no NestJS para dados estáticos (ex: lista de categorias de comida ou cardápios que mudam pouco), evitando consultas desnecessárias ao banco de dados a cada clique do usuário.

------------------------------
## 3. Arquitetura de Deploy no Servidor (Amazon EC2)
Como a instância EC2 do nível gratuito possui apenas 1 GiB de RAM, rodar o processo de compilação (build) do NextJS e do NestJS diretamente no servidor pode travar a máquina.
## Fluxo de Trabalho Recomendado:

   1. Build Local/CI: Execute npm run build na sua máquina local ou via GitHub Actions.
   2. Transferência: Envie apenas as pastas de produção geradas (/dist do NestJS e /.next do NextJS) para o servidor EC2.

## Gerenciamento de Processos com PM2
O Node.js encerra o processo se encontrar um erro não tratado. Para manter o aplicativo online 24h por dia, o PM2 deve gerenciar a execução em segundo plano.
## Inicialização dos Serviços no Servidor:

# Iniciar a API NestJS (Porta padrão 3000)
pm2 start dist/main.js --name "delivery-api"
# Iniciar o Frontend NextJS (Porta padrão 3001 ou customizada)
pm2 start npm --name "delivery-front" -- run start

------------------------------
## 4. Configuração de Rede e Segurança (Nginx + SSL)
Para que os clientes acessem o app de forma segura via HTTPS, o servidor EC2 utilizará o Nginx como Proxy Reverso e o Certbot para emissão de certificados SSL gratuitos.
## Fluxo do Tráfego de Rede:

* O usuário acessa a internet pelas portas padrão 80 (HTTP) ou 443 (HTTPS).
* O Nginx intercepta a requisição e a direciona internamente para a porta correta do Node.js.

## Exemplo de Configuração do Nginx (/etc/nginx/sites-available/default):

# Configuração para o Frontend (Next.js)
server {
    server_name seuapp.com ://seuapp.com;

    location / {
        proxy_pass http://localhost:3001; # Porta do Next.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Configuração para a API (NestJS)
server {
    server_name ://seuapp.com;

    location / {
        proxy_pass http://localhost:3000; # Porta do NestJS
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

## Ativação do SSL (HTTPS Gratuito):
Execute o Certbot no terminal do seu EC2 para automatizar a segurança:

sudo certbot --nginx -d seuapp.com -d ://seuapp.com -d ://seuapp.com

------------------------------
## 5. Resumo Operacional
Seguindo este modelo de arquitetura, o seu sistema estará blindado contra picos de acesso comuns em apps de delivery, operando de forma enxuta. A infraestrutura suportará a meta de 15 restaurantes e 1.000 usuários com excelente performance, mantendo você dentro da previsibilidade financeira do nível gratuito da AWS.
------------------------------
Deseja que eu elabore um script automatizado de deploy para facilitar o envio do seu código local direto para o EC2, ou prefere focar em como configurar as variáveis de ambiente de forma segura no servidor?

