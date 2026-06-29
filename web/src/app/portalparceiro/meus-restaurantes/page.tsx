"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../services/api';
import { Store } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  isOpen: boolean;
  address: string;
}

export default function MeusRestaurantes() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('@MVPDelivery:userId');
    if (!userId) {
      router.push('/login/restaurante');
      return;
    }
    loadMyRestaurants(userId);
  }, []);

  async function loadMyRestaurants(userId: string) {
    try {
      const response = await api.get('/restaurants');
      // Filtra trazendo TODOS os restaurantes deste usuário
      const myRests = response.data.filter((r: any) => r.ownerId === userId);
      setRestaurants(myRests);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

// Ao clicar num restaurante, abre o Gestor de Pedidos numa nova guia
  function handleSelectRestaurant(id: string) {
    // URL APONTANDO PARA O GESTOR DE PEDIDOS
    const url = `/portalparceiro/ordermanager?restaurantId=${id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  if (loading) return <div className="p-8">A carregar os seus restaurantes...</div>;

  return (
    <main className="p-8 max-w-6xl w-full mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Meus Restaurantes</h2>
        <p className="text-gray-500 mt-2">Selecione uma loja para gerenciar o cardápio e os status.</p>
      </header>

      {restaurants.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">Nenhum restaurante vinculado à sua conta.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(rest => (
            <div 
              key={rest.id} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
              onClick={() => handleSelectRestaurant(rest.id)}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Store className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-800">{rest.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">{rest.address || 'Endereço não cadastrado'}</p>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className={`flex items-center gap-2 text-sm font-semibold ${rest.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${rest.isOpen ? 'bg-green-600' : 'bg-red-600'}`}></span>
                  {rest.isOpen ? 'Aberto' : 'Fechado'}
                </span>
                <span className="bg-yellow-200 p-1 border-2 rounded-md hover:bg-yellow-100   text-yellow-600 font-bold text-sm">Gerenciar &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}