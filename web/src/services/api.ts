import axios from 'axios';

export const api = axios.create({
  //baseURL: 'http://192.168.0.9:3000', // Porta onde o Nest.js está rodando
  //baseURL: 'http://192.168.1.35:3000',
    baseURL: 'http://localhost:3000',
});

// Interceptador: antes de qualquer requisição sair do front, ele executa isso:
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('@MVPDelivery:token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});