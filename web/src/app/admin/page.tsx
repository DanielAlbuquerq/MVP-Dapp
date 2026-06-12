"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';
import { ShieldCheck, Store, Power, LogOut, Plus } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  whatsapp: string;
  isOpen: boolean;
  ownerId: string;
  email: string;
  password: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  // Para simplificar, o Admin precisa de atribuir um ownerId ao criar a loja.
  // Num cenário real, existiria um campo de pesquisa de utilizadores.
  const [ownerId, setOwnerId] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('@MVPDelivery:role');
    if (role !== 'ADMIN') {
      router.push('/login/admin');
    } else {
      loadRestaurants();
    }
  }, []);

  async function loadRestaurants() {
    try {
      const response = await api.get('/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error("Erro ao procurar restaurantes", error);
    }
  }

  async function handleCreateRestaurant(e: FormEvent) {
    e.preventDefault();
    try {
      await api.post('/restaurants', { name, whatsapp, ownerId });
      setName('');
      setWhatsapp('');
      setOwnerId('');
      loadRestaurants();
    } catch (error) {
      alert("Erro ao criar restaurante. Verifique o ID do Dono.");
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
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* SIDEBAR ADMIN */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold tracking-tight">Admin System</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-lg font-medium transition-colors">
            <Store className="w-5 h-5" /> Gestão de Lojas
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg font-medium transition-colors text-red-400">
            <LogOut className="w-5 h-5" /> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral da Plataforma</h2>
          <button onClick={handleLogout} className="md:hidden p-2 text-slate-500 hover:text-red-600">
            <LogOut className="w-6 h-6" />
          </button>
        </header>

        <div className="p-8 max-w-6xl w-full mx-auto space-y-8">
          {/* Formulário de Criação */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Adicionar Novo Restaurante
            </h3>
            <form onSubmit={handleCreateRestaurant} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Nome do Restaurante" value={name} onChange={e => setName(e.target.value)} className="border border-slate-300 rounded-lg p-3 bg-slate-50" required />
              <input type="text" placeholder="WhatsApp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="border border-slate-300 rounded-lg p-3 bg-slate-50" required />
              <input type="text" placeholder="ID do Utilizador (Dono)" value={ownerId} onChange={e => setOwnerId(e.target.value)} className="border border-slate-300 rounded-lg p-3 bg-slate-50" required />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg md:col-span-3 transition-colors">Criar Registo</button>
            </form>
          </div>

          {/* Listagem Global de Restaurantes */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Lojas Registadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurants.map(rest => (
                <div key={rest.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{rest.name}</h3>
                    <p className="text-sm text-slate-500">ID: {rest.id}</p>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded-full ${rest.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {rest.isOpen ? 'LOJA ABERTA' : 'LOJA FECHADA'}
                    </span>
                  </div>
                  <button 
                    onClick={() => toggleRestaurantStatus(rest.id, rest.isOpen)}
                    className={`p-3 rounded-full transition-colors ${rest.isOpen ? 'bg-red-100 hover:bg-red-200 text-red-600' : 'bg-green-100 hover:bg-green-200 text-green-600'}`}
                    title={rest.isOpen ? "Forçar Fecho" : "Forçar Abertura"}
                  >
                    <Power className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}