"use client";

import { useState, useEffect, SubmitEvent } from 'react';
import { api } from '../services/api';
import Link from 'next/link';
import SkeletonLoader from '../components/SkeletonLoader';
import { useRouter } from 'next/navigation';

// Tipagem básica para o TypeScript
interface Restaurant {
  id: string;
  name: string;
  whatsapp: string;
  imageUrl?: string;
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [ownerId, setOwnerId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');

  const router = useRouter();

  // COLE AQUI O ID DO USUÁRIO QUE VOCÊ CRIOU NO PRISMA STUDIO
  //const MOCK_OWNER_ID = "123"; 

  // Busca os restaurantes ao carregar a página
  useEffect(() => {
    // Verifica se o usuário está logado
    const token = localStorage.getItem('@MVPDelivery:token');
    const storedUserId = localStorage.getItem('@MVPDelivery:userId');
    
    // Se não tiver token, expulsa para a tela de login
    if (!token || !storedUserId) {
      router.push('/login');
    } else {
      setOwnerId(storedUserId); // Salva o userId para usar no cadastro de restaurantes
      loadRestaurants();   
    }
  }, []);

  async function loadRestaurants() {
    try {
      const response = await api.get('/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error("Erro ao buscar restaurantes", error);
    }
  }

  async function handleCreateRestaurant(e: SubmitEvent) {
    e.preventDefault();
    try {
      await api.post('/restaurants', {
        name,
        whatsapp,
        ownerId: MOCK_OWNER_ID, 
      });
      
      setName('');
      setWhatsapp('');
      loadRestaurants(); // Recarrega a lista após salvar
    } catch (error) {
      console.error("Erro ao criar restaurante", error);
      alert("Erro ao salvar. Verifique se colou o Owner ID corretamente.");
    }
  }

  function handleLogout() {
    localStorage.removeItem('@MVPDelivery:token');
    localStorage.removeItem('@MVPDelivery:userId');
    router.push('/login');
  }

  // Evita renderizar a página antes de confirmar o login
  if (!ownerId) return <SkeletonLoader />;

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Painel Admin - MVP Delivery</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">Cadastrar Novo Restaurante</h2>
          <form onSubmit={handleCreateRestaurant} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Nome do Restaurante</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">WhatsApp (Ex: 11999999999)</label>
              <input 
                type="text" 
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
            >
              Salvar
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Restaurantes Cadastrados</h2>
          {restaurants.length === 0 ? (
            <p className="text-gray-500">Nenhum restaurante cadastrado ainda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {restaurants.map((restaurant) => (
  <div key={restaurant.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
    <div>
      <h3 className="font-bold text-lg">{restaurant.name}</h3>
      <p className="text-gray-600 text-sm mt-1">WhatsApp: {restaurant.whatsapp}</p>
    </div>
    <Link 
      href={`/restaurant/${restaurant.id}`}
      className="mt-4 bg-gray-100 hover:bg-gray-200 text-center text-gray-800 font-semibold py-2 rounded-md transition-colors"
    >
      Gerenciar Cardápio
    </Link>
  </div>
))}
            </div>
          )}
        </div>
  <button 
    onClick={handleLogout}
    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold py-2 px-4 rounded-md transition-colors"
  >
    Sair (Logout)
  </button>
      </div>
    </main>
  );
}