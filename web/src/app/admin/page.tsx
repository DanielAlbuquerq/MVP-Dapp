"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';
import { Power, LogOut } from 'lucide-react';
import Link from 'next/link';

interface Restaurant {
  id: string;
  name: string;
  isOpen: boolean;
  owner: {
    name: string;
    email: string;
  };
}

export default function AdminRestaurants() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  async function loadRestaurants() {
    try {
      const response = await api.get('/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error("Erro ao procurar restaurantes", error);
    }
  }

  async function toggleRestaurantStatus(id: string, currentStatus: boolean) {
    try {
      await api.patch(`/restaurants/${id}/status`, { isOpen: !currentStatus });
      loadRestaurants();
    } catch (error) {
      console.error("Erro ao alterar estado", error);
    }
  }

  function handleLogout() {
    localStorage.clear();
    router.push('/login/admin');
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Lojas Cadastradas</h2>
          <p className="text-sm text-slate-500 mt-1">Gerencie os parceiros e lojas registadas no sistema.</p>
        </div>
        <button onClick={handleLogout} className="md:hidden p-2 text-slate-500 hover:text-red-600">
          <LogOut className="w-6 h-6" />
        </button>
      </header>

      <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map(rest => (
            <div key={rest.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{rest.name}</h3>
                <p className="text-sm text-slate-500 mt-1">Dono: {rest.owner?.name}</p>
                <p className="text-xs text-slate-400">{rest.owner?.email}</p>
              </div>
              <div className="flex justify-between items-end mt-4">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${rest.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {rest.isOpen ? 'ONLINE' : 'OFFLINE'}
                </span>
                
                <div className="flex gap-2">
                  {/*Botão que leva para a página que você acabou de criar */}
                  <Link 
                    href={`/admin/restaurante/${rest.id}`}
                    className="p-2 text-sm font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    Cardápio
                  </Link>

                  <button onClick={() => toggleRestaurantStatus(rest.id, rest.isOpen)} className={`p-2 cursor-pointer rounded-lg transition-colors ${rest.isOpen ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                    <Power className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {restaurants.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              Nenhuma loja registada ainda.
            </div>
          )}
        </div>
      </div>
    </>
  );
}