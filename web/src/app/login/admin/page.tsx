"use client";

import { useState, SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../services/api';
import { ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      console.log('try')
      const response = await api.post('/auth/login', { email, password });
      console.log('try2')

      // Verificação extra para garantir que o utilizador é realmente um ADMIN
      if(response.data.role !== 'ADMIN') {
        alert('Acesso negado. Este e-mail não pertence a um administrador.');
        return;
      }
      console.log('Resposta do login:', response.data); // Log para depuração

      localStorage.setItem('@MVPDelivery:token', response.data.access_token);
      localStorage.setItem('@MVPDelivery:userId', response.data.userId);
      localStorage.setItem('@MVPDelivery:role', response.data.role); // Guardamos o papel para segurança extra

      // Redireciona para o painel de controlo geral do sistema
      router.push('/admin'); 
    } catch (error) {
      
      console.error(error);
      alert('Acesso negado. Verifique o seu e-mail e palavra-passe de administrador.');
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-slate-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-slate-100 p-3 rounded-full mb-3">
            <ShieldCheck className="w-10 h-10 text-slate-800" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Acesso Administrador</h1>
          <p className="text-slate-500 text-sm mt-1">Gestão global da plataforma</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-700">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1 text-slate-700">Palavra-passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-800"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg transition-colors mt-4 w-full"
          >
            Entrar no Painel Admin
          </button>
        </form>
      </div>
    </main>
  );
}