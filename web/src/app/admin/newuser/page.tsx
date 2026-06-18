"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../services/api';
import { Store, LogOut, Plus, UserCircle, MapPin } from 'lucide-react';

export default function AdminNewPartner() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados - Responsável Legal
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerPasswordConfirm, setOwnerPasswordConfirm] = useState('');
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

  async function handleCreateFullRegistration(e: FormEvent) {
    e.preventDefault();
    
    //Confirmação que as senhas do form são iguais.
    if (ownerPassword !== ownerPasswordConfirm) {
      alert("As senhas não coincidem. Por favor, verifique.");
      return;
    }
    setLoading(true);

    try {
      await api.post('/restaurants/register-full', {
        ownerName, ownerEmail, ownerPassword, ownerPhone, ownerCpf,
        restaurantName, cnpj, whatsapp, restaurantPhone, address, logoUrl, coverImage
      });
      
      alert("Cadastro completo realizado com sucesso!");

      // Limpa formulário
      setOwnerName(''); setOwnerEmail(''); setOwnerPassword(''); setOwnerPasswordConfirm(''); setOwnerPhone(''); setOwnerCpf('');
      setRestaurantName(''); setCnpj(''); setWhatsapp(''); setRestaurantPhone(''); setAddress(''); setLogoUrl(''); setCoverImage('');
      
      router.push('/admin');
    } catch (error) {
      alert("Erro ao criar cadastro. O e-mail já em uso.");
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold text-slate-800">Novo Parceiro</h2>
          <p className="text-sm text-slate-500 mt-1">Crie a conta do responsável e a loja simultaneamente.</p>
        </div>
        <button onClick={handleLogout} className="md:hidden cursor-pointer p-2 text-slate-500 hover:text-red-600">
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
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Confirmar Senha *</label>
                  <input type="password" value={ownerPasswordConfirm} onChange={e => setOwnerPasswordConfirm(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" required />
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

          <button disabled={loading} type="submit" className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-4 rounded-xl w-full transition-colors flex justify-center items-center gap-2 text-lg">
            <Plus className="w-6 h-6" /> {loading ? 'A processar e a encriptar...' : 'Criar Conta e Restaurante Simultaneamente'}
          </button>
        </form>
      </div>
    </>
  );
}