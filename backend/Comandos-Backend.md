The Everyday Workflow:

- Para testar se tudo deu certo até aqui, basta rodar "npm run start:dev" na pasta backend

- Sempre que você alterar o arquivo schema.prisma (adicionar/remover tabelas ou campos), rode: "npx prisma migrate dev" para atualizar seu banco de dados e gerar a tipagem.

- Para atualizar apenas a tipagem do seu código (sem alterar o banco de dados), use: "npx prisma generate"

- Se você estiver em um ambiente de desenvolvimento local e quiser apenas testar mudanças rapidamente sem criar arquivos de migração históricos, você pode usar o "npx prisma db push"

- Para abrir o Prisma Studio: 'npx prisma studio'


____________

PRODUÇÃO:

Commandos pm2:::

- pm2 status > Mostra a lista de processos 
- pm2 monit > Abre um painel interativo no terminal em tempo real 
- pm2 logs > Mostra em tempo real tudo o que está sendo processado
- pm2 start dist/main.js --name "backend-api" > This boots up your compiled Node.js application (usually found in your dist/ folder) and assigns it the recognizable name backend-api in your PM2 process list.
- pm2 save > This takes a snapshot of all currently running PM2 processes and saves them to a configuration file on your server.
- pm2 startup > This detects your server's operating system (e.g., Ubuntu, CentOS) and generates a specific command to register PM2 as a system service.
- pm2 restart backend-api > avisa que o código foi atualizado e que ele precisa de reiniciar a API (confirme o nome do seu serviço, aqui nomeamos como 'backend-api' no inicio da configuração)
- pm2 flush > Limpar Logs

Gerenciamento automático de logs (Evitar que o disco fique cheio)Em ambientes de produção, os logs crescem rapidamente.
Para evitar problemas, instale e configure o módulo pm2-logrotate, que rotaciona e deleta logs antigos automaticamente.

- Instale o módulo rodando:'pm2 install pm2-logrotate' 
- Configure o tamanho máximo do arquivo (ex: 10MB) executando: 'pm2 set pm2-logrotate:max_size 10M' 
- Defina a quantidade de arquivos de log retidos:pm2 set pm2-logrotate:retain 30

ALTERAR ARQUIVOS DENTRO DO 'AWS EC2':

- nano src/main.ts > Abre o ficheiro com o editor de texto do terminal
----
CERTBOT 

- Instalar o Certbot (Let's Encrypt) - Comandos Abaixo    
Instalar este certificado para conexão https: como o Amazon Linux (Fedora) gere os pacotes de forma restrita, a forma oficial e mais segura de instalar o gerador de certificados SSL (Certbot) é através do ambiente virtual do Python. Execute estes comandos um a um:

- sudo dnf install python3 augeas-libs -y   
Instala o Python 3 e a biblioteca augeas-libs (necessária para o Certbot entender e editar os arquivos de configuração do Nginx automaticamente).

- sudo python3 -m venv /opt/certbot/   
Cria um Ambiente Virtual (venv) do Python na pasta /opt/certbot/. Isso garante que as dependências do Certbot não entrem em conflito com outros programas do seu servidor.

- sudo /opt/certbot/bin/pip install --upgrade pip   
Atualiza o gerenciador de pacotes do Python (pip) dentro desse ambiente virtual para a versão mais recente.

- sudo /opt/certbot/bin/pip install certbot certbot-nginx   
Baixa e instala o programa do Certbot e o plug-in do Nginx dentro do ambiente virtual isolado.

- sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot   
Cria um atalho (link simbólico). Isso permite que você digite apenas certbot em qualquer lugar do terminal, em vez de ter que digitar o caminho inteiro /opt/certbot/bin/certbot.
-----

- sudo certbot --nginx -d api.dpede.com.br   
Pedir ao Let's Encrypt  para gerar um certificado SSL oficial, para o domínio real