import axios from 'axios';

// DICA ESTRATÉGICA: Se for testar no seu celular físico pelo Expo Go, 
// o "localhost" não vai funcionar. Troque "SEU_IP_LOCAL" pelo IP real 
// da sua máquina na rede Wi-Fi (Ex: http://192.168.1.15:3000).
//IPs podem mudar dependendo da rede, então certifique-se de usar o IP correto para o dispositivo que está testando.

export const api = axios.create({
//baseURL: 'http://localhost:3000', 
baseURL: 'http://192.168.1.249:3000' //Doceria,
//baseURL: 'http://192.168.0.66:3000' //Camara,
//baseURL: 'http://192.168.0.9:3000' //Claudio
});