"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../../services/api';
import { ChefHat, CheckCircle, Clock, Motorbike } from 'lucide-react';

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customer: { user: { name: string }, phone: string };
  items: { quantity: number, product: { name: string } }[];
}

export default function OrderManager() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Adicionei o user Id mas não tinha antes,
    // Podemos tirar se necessário
    const userId = localStorage.getItem('@MVPDelivery:userId');
    if (restaurantId && userId) {
      loadOrders();
      // Dica para o futuro: Aqui você poderá colocar um setInterval ou WebSocket 
      // para recarregar os pedidos automaticamente a cada 10 segundos!
    } else {
        router.push('/login/restaurante');
      return;
    }
  }, [restaurantId]);

  async function loadOrders() {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Erro ao carregar pedidos", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8 font-bold text-gray-600">A carregar Gestor de Pedidos...</div>;
  if (!restaurantId) return <div className="p-8 text-red-500">Erro: Restaurante não identificado.</div>;

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ChefHat className="text-yellow-600 w-8 h-8" /> Gestor de Pedidos
          </h1>
          <p className="text-gray-500 mt-1">Acompanhe os pedidos da sua loja.</p>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-200 text-gray-500">
          Ainda não há pedidos para esta loja hoje.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-yellow-500">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {order.status}
                </span>
                <span className="text-gray-400 text-sm font-semibold">
                  {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-1">{order.customer?.user?.name || 'Cliente'}</h3>
              <p className="text-sm text-gray-500 mb-4">{order.customer?.phone}</p>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-4 space-y-2">
                {order.items.map((item, idx) => (
                  <p key={idx} className="text-sm text-gray-700 font-medium">
                    <span className="text-gray-400">{item.quantity}x</span> {item.product.name}
                  </p>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-gray-500 text-sm">Total:</span>
                <span className="font-bold text-green-600 text-lg">R$ {order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}