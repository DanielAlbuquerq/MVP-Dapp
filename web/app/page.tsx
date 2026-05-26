"use client";

import { useState, useEffect, FormEvent } from 'react';
import { api } from '../services/api';

// Tipagem básica para o TypeScript
interface Restaurant {
  id: string;
  name: string;
  whatsapp: string;
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [name, setName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');

  //ID DO USUÁRIO NO PRISMA 
  const MOCK_OWNER_ID = "123"; 

  // Busca os restaurantes ao carregar a página
  useEffect(() => {
    loadRestaurants();
  }, []);

  // Função para buscar os restaurantes no backend
  async function loadRestaurants() {
    try {
      const response = await api.get('/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error("Erro ao buscar restaurantes", error);
    }
  }

  async function handleCreateRestaurant(e: FormEvent) {
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
                <div key={restaurant.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">WhatsApp: {restaurant.whatsapp}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}