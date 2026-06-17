"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';
import { ShieldCheck, Store, Power, LogOut, Plus, UserCircle, MapPin } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  isOpen: boolean;
  owner: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados - Responsável Legal
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerCpf, setOwnerCpf] = useState('');

  // Estados - Restaurante
  const [restaurantName, setRestaurantName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [restaurantPhone, setRestaurantPhone] = useState('');
  const [address, setAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('@MVPDelivery:role');
    if (role !== 'ADMIN') router.push('/login/admin');
    else loadRestaurants();
  }, []);

  async function loadRestaurants() {
    try {
      const response = await api.get('/restaurants');
      setRestaurants(response.data);
    } catch (error) {
      console.error("Erro ao procurar restaurantes", error);
    }
  }

  async function handleCreateFullRegistration(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/restaurants/register-full', {
        ownerName, ownerEmail, ownerPassword, ownerPhone, ownerCpf,
        restaurantName, cnpj, whatsapp, restaurantPhone, address, logoUrl, coverImage
      });
      
      alert("Cadastro completo realizado com sucesso!");
      // Limpa formulário
      setOwnerName(''); setOwnerEmail(''); setOwnerPassword(''); setOwnerPhone(''); setOwnerCpf('');
      setRestaurantName(''); setCnpj(''); setWhatsapp(''); setRestaurantPhone(''); setAddress(''); setLogoUrl(''); setCoverImage('');
      loadRestaurants();
    } catch (error) {
      alert("Erro ao criar cadastro. O e-mail pode já estar em uso.");
    } finally {
      setLoading(false);
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
            <Store className="w-5 h-5" /> Gestão Global
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
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Novo Parceiro</h2>
            <p className="text-sm text-slate-500 mt-1">Crie a conta do responsável e a loja simultaneamente.</p>
          </div>
          <button onClick={handleLogout} className="md:hidden p-2 text-slate-500 hover:text-red-600">
            <LogOut className="w-6 h-6" />
          </button>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          
          <form onSubmit={handleCreateFullRegistration} className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* CARD 1: RESPONSÁVEL LEGAL */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <UserCircle className="w-5 h-5 text-blue-600" /> 1. Dados do Responsável Legal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Nome Completo *</label>
                    <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">E-mail de Acesso *</label>
                    <input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Senha de Acesso *</label>
                    <input type="password" value={ownerPassword} onChange={e => setOwnerPassword(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Celular Pessoal *</label>
                    <input type="text" value={ownerPhone} onChange={e => setOwnerPhone(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">CPF (Opcional)</label>
                    <input type="text" value={ownerCpf} onChange={e => setOwnerCpf(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" />
                  </div>
                </div>
              </div>

              {/* CARD 2: RESTAURANTE */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Store className="w-5 h-5 text-blue-600" /> 2. Dados do Restaurante
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Nome do Restaurante *</label>
                    <input type="text" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">CNPJ * (Sendo Encriptado)</label>
                    <input type="text" value={cnpj} onChange={e => setCnpj(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">WhatsApp para Pedidos *</label>
                    <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Telefone Fixo (Opcional)</label>
                    <input type="text" value={restaurantPhone} onChange={e => setRestaurantPhone(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Endereço Completo *</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">URL da Logo (Opcional)</label>
                    <input type="url" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">URL da Capa (Opcional)</label>
                    <input type="url" value={coverImage} onChange={e => setCoverImage(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" />
                  </div>
                </div>
              </div>
            </div>

            <button disabled={loading} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl w-full transition-colors flex justify-center items-center gap-2 text-lg">
              <Plus className="w-6 h-6" /> {loading ? 'A processar e a encriptar...' : 'Criar Conta e Restaurante Simultaneamente'}
            </button>
          </form>

          {/* Listagem Simplificada */}
          <div className="pt-8 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Lojas Registadas Recentes</h2>
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
                    <button onClick={() => toggleRestaurantStatus(rest.id, rest.isOpen)} className={`p-2 rounded-full transition-colors ${rest.isOpen ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      <Power className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}