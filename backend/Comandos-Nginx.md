- Iniciar o servidor web Nginx:   
sudo dnf install nginx -y

- Mostra se ele está ativo e rodando sem erros:   
sudo systemctl status nginx

- Parar o servidor:    
sudo systemctl stop nginx

- Garante que o Nginx ligue sozinho sempre que você reiniciar o servidor:   
sudo systemctl enable nginx

- Teste se a configuração está correta:   
sudo nginx -t

- Reinicie o Nginx:
sudo systemctl restart nginx

- Meu ficheiro na instância: 
sudo nano /etc/nginx/conf.d/mvp.conf
