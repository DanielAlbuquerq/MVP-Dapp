"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../services/api';
import { Power, Tag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  imageUrl: string; 
}

interface Category {
  id: string;
  name: string;
  categoryType: string;
  products: Product[];
}

export default function PartnerMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const role = localStorage.getItem('@MVPDelivery:role');
    const userId = localStorage.getItem('@MVPDelivery:userId');
    
    // Lógica Antiga: if (role !== 'RESTAURANT' || !userId) {
    if ((role !== 'RESTAURANT' && role !== 'ADMIN') || !userId) {
      router.push('/login/restaurante');
    } else {
      
      loadMyRestaurant(userId);
    }
  }, [searchParams]); // Re-executa se a URL mudar

  async function loadMyRestaurant(userId: string) {
    try {
      const response = await api.get('/restaurants');
      const myRests = response.data.filter((r: any) => r.ownerId === userId);
      
      // Lê o ID selecionado na URL. Se não tiver nenhum, pega o primeiro da lista.
      const selectedId = searchParams.get('restaurantId');
      const myRest = selectedId 
        ? myRests.find((r: any) => r.id === selectedId) 
        : myRests[0];

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
      loadCategories(restaurant.id);
    } catch (error) {
      console.error("Erro ao atualizar produto", error);
    }
  }

  if (loading){
    return ( 
      <div className='self-center pt-20'>
      <h1 className='p-3'>A carregar os Restaurantes e Cardápio...</h1>
      <div className="flex items-center self-center justify-center">
      <div className="w-15 h-15 border-8 border-yellow-600 border-t-yellow-200 rounded-full animate-spin"></div>
      </div>
      </div>
    )
  }  

  if (!restaurant && !loading) return (
    <div className="flex flex-col items-center justify-center p-8 mt-20">
      <h2 className="text-2xl font-bold text-gray-800">Nenhum restaurante encontrado.</h2>
    </div>
  );

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
        <div>
            {restaurant.logoUrl && (
                      <img src={restaurant.logoUrl} alt={restaurant.name} className="w-50 h-30 object-cover rounded-md" />
            )}
          <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-4 h-4 rounded-full ${restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <p className="text-sm text-gray-500 font-medium">
              {restaurant.isOpen ? 'Restaurante Aberto (A receber pedidos)' : 'Restaurante Fechado'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={toggleRestaurantStatus}
          className={`flex items-center cursor-pointer gap-2 px-5 py-2.5 rounded-lg font-bold transition-colors ${restaurant.isOpen ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}
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
            {/* <h3 className="text-xl font-bold text-gray-800 border-b-2 border-yellow-100 pb-2 mb-5 flex items-center gap-2">
              <Tag className="w-5 h-5 text-yellow-500" /> {category.name} 
            </h3> */}
              <h3 className="font-bold text-lg border-b border-gray-300 pb-2 mb-4">
                {category.name} <span className="text-sm font-normal text-gray-400">[{category.categoryType}]</span>
              </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 sm-grind-cols-1 gap-4">
              {category.products.map(product => (
                <div key={product.id} className={`p-4 rounded-xl shadow-sm border transition-colors flex justify-around items-center ${product.isActive ? 'bg-green-300/10 border-green-300' : 'border-red-500 bg-red-400/10'}`}>
                   {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} className="w-20 pr-1 h-20 object-cover rounded-md"/>
                    )}
                  <div>
                    <h4 className={`font-bold ${product.isActive ? 'text-gray-900' : 'text-gray-500 line-through'}`}>                      
                        {product.name}</h4>
                    {/* Ajudar tipagem de preço depois para não aceitar valores alto */}
                    <p className="text-green-600 font-bold mt-1">R$ {product.price.toFixed(2)}</p>
                    <h6 className="text-gray-400">id: ({product.id.slice(0, 3)})</h6> 

                  </div>
                  
                  <button 
                    onClick={() => toggleProductStatus(product.id, product.isActive)}
                    className={`px-4  self-end cursor-pointer py-2 rounded-lg font-semibold text-sm transition-colors ${product.isActive ? 'bg-gray-100 hover:bg-red-200 text-gray-700' : 'bg-yellow-400/40 hover:bg-green-500/70 hover:opacity-90 text-black-700'}`}
                  >
                    {product.isActive ? 'Desativar' : 'Reativar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}