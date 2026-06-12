"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';
import { Store, UtensilsCrossed, Power, LogOut, Tag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

export default function PartnerPortal() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('@MVPDelivery:role');
    const userId = localStorage.getItem('@MVPDelivery:userId');
    
    if (role !== 'RESTAURANT' || !userId) {
      router.push('/login/restaurante');
    } else {
      loadMyRestaurant(userId);
    }
  }, []);

  async function loadMyRestaurant(userId: string) {
    try {
      // Busca todos os restaurantes e filtra pelo ID do dono atual
      const response = await api.get('/restaurants');
      const myRest = response.data.find((r: any) => r.ownerId === userId);
      
      if (myRest) {
        setRestaurant(myRest);
        loadCategories(myRest.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function loadCategories(restaurantId: string) {
    try {
      const response = await api.get(`/categories/restaurant/${restaurantId}`);
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar cardápio", error);
    }
  }

  async function toggleRestaurantStatus() {
    if (!restaurant) return;
    try {
      await api.patch(`/restaurants/${restaurant.id}/status`, { isOpen: !restaurant.isOpen });
      setRestaurant({ ...restaurant, isOpen: !restaurant.isOpen });
    } catch (error) {
      console.error("Erro", error);
    }
  }

  async function toggleProductStatus(productId: string, currentStatus: boolean) {
    try {
      await api.patch(`/products/${productId}/status`, { isActive: !currentStatus });
      loadCategories(restaurant.id); // Recarrega a lista para atualizar a interface visual
    } catch (error) {
      console.error("Erro ao atualizar produto", error);
    }
  }

  function handleLogout() {
    localStorage.clear();
    router.push('/login/restaurant');
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">A carregar o seu portal...</div>;

  if (!restaurant && !loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold text-gray-800">Nenhum restaurante encontrado.</h2>
      <p className="text-gray-500 mt-2 mb-4">Peça ao Administrador do sistema para vincular uma loja à sua conta.</p>
      <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-2 rounded-lg">Voltar ao Login</button>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* SIDEBAR PARCEIRO */}
      <aside className="w-64 bg-red-600 text-white flex flex-col shadow-xl hidden md:flex">
        <div className="p-6 border-b border-red-500 flex items-center gap-3">
          <Store className="w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight">Portal Parceiro</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 bg-red-700 px-4 py-3 rounded-lg font-medium transition-colors">
            <UtensilsCrossed className="w-5 h-5" /> Meu Cardápio
          </button>
        </nav>
        <div className="p-4 border-t border-red-500">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 hover:bg-red-700 px-4 py-3 rounded-lg font-medium transition-colors">
            <LogOut className="w-5 h-5" /> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-3 h-3 rounded-full ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <p className="text-sm text-gray-500 font-medium">
                {restaurant.isOpen ? 'Restaurante Aberto (A receber pedidos)' : 'Restaurante Fechado'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={toggleRestaurantStatus}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-colors ${restaurant.isOpen ? 'bg-red-100 hover:bg-red-200 text-red-700' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}
          >
            <Power className="w-5 h-5" />
            {restaurant.isOpen ? 'Pausar Loja' : 'Abrir Loja'}
          </button>
        </header>

        <div className="p-8 max-w-6xl w-full mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestão Rápida de Produtos</h2>
          <p className="text-gray-500 mb-8">Ligue ou desligue a disponibilidade de um item do cardápio em tempo real.</p>
          
          {categories.map((category) => (
            <div key={category.id} className="mb-10">
              <h3 className="text-xl font-bold text-gray-800 border-b-2 border-red-100 pb-2 mb-5 flex items-center gap-2">
                <Tag className="w-5 h-5 text-red-500" /> {category.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.products.map(product => (
                  <div key={product.id} className={`bg-white p-4 rounded-xl shadow-sm border transition-colors flex justify-between items-center ${product.isActive ? 'border-gray-200' : 'border-red-200 bg-red-50/30 opacity-75'}`}>
                    <div>
                      <h4 className={`font-bold text-lg ${product.isActive ? 'text-gray-900' : 'text-gray-500 line-through'}`}>{product.name}</h4>
                      <p className="text-green-600 font-bold mt-1">R$ {product.price.toFixed(2)}</p>
                    </div>
                    
                    <button 
                      onClick={() => toggleProductStatus(product.id, product.isActive)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${product.isActive ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    >
                      {product.isActive ? 'Desativar (Esgotado)' : 'Reativar Item'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}