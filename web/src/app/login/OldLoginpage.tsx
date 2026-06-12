"use client";

import { useState, ChangeEvent, SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';

export default function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('customer'); // Padrão para "owner", pode ser "customer" se quiser testar o fluxo de cliente
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    // Evita o comportamento padrão de recarregar a página quando o formulário é enviado
    e.preventDefault();

    try {
      // Define a rota e os dados dependendo se é cadastro ou login,
      // Se verdadeiro é '/auth/register', Se falso é '/auth/login', e os dados enviados também mudam
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const payload = isRegistering ? { name, email, password } : { email, password };
      
      const response = await api.post(endpoint, payload);
      
      // O backend retorna o access_token e o userId
      const { access_token, userId, userRole } = response.data;

      // Salva o role do usuário para usar no frontend 
      // (ex: para mostrar opções de menu diferentes para clientes e donos de restaurante)
      setRole(userRole);
       
      // Salva os dados de forma segura no navegador
      try {
      localStorage.setItem('@MVPDelivery:token', access_token);
      localStorage.setItem('@MVPDelivery:userId', userId);
      } catch (storageError) {
        console.error("Erro ao salvar dados no localStorage", storageError);
        alert('Erro no LocalStorage. tente limpar os dados do navegador e tente novamente ou ligue para o suporte.');
        return;
      }
      // Redireciona para o painel principal
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Erro na autenticação. Verifique seus dados e tente novamente.');
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isRegistering ? 'Criar Nova Conta' : 'Acessar o Painel'}
        </h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                required={isRegistering}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors mt-2"
          >
            {isRegistering ? 'Cadastrar e Entrar' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {isRegistering 
              ? 'Já tem uma conta? Faça Login' 
              : 'Não tem conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </main>
  );
}