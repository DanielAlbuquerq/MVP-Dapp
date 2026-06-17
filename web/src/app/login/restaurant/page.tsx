"use client";

import { useState, SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../services/api';
import { Store } from 'lucide-react';

export default function RestaurantLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('@MVPDelivery:token', response.data.access_token);
      localStorage.setItem('@MVPDelivery:userId', response.data.userId);
      localStorage.setItem('@MVPDelivery:role', 'RESTAURANT'); // Guardamos o papel para o portal

      // Redireciona para o portal exclusivo do restaurante
      router.push('/portal'); 
    } catch (error) {
      console.error(error);
      alert('Acesso negado. Verifique as credenciais do seu restaurante.');
    }
  }

  return (
    <main 
      className="min-h-screen absolute flex items-center pb-24 pr-24 justify-center md:justify-end p-4 text-gray-900 relative bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Dpede2.jpg')" }} // Change this to your image file name in the 'public' folder
    >
       {/* <img src="../../../public/Dpede2.jpg" alt="Fundo" className="absolute inset-0 w-[120%] h-full object-cover object-center max-w-none" /> */}
      {/* Overlay to ensure the card stands out from the background */}
      <div className="absolute inset-0 bg-yellow-500/40"></div>

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-yellow-100 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-yellow-100 p-3 rounded-full mb-3">
            <Store className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Portal Restaurante</h1>
          <p className="text-gray-500 text-sm mt-1">Faça login para gerir o seu restaurante</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Palavra-passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors mt-4 w-full"
          >
            Aceder ao Meu Restaurante
          </button>
        </form>
      </div>
    </main>
  );
}