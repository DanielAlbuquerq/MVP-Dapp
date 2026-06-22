"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../services/api'; // Ajuste o caminho se necessário
import { Store, LogOut, Plus, UserCircle, MapPin, UploadCloud, ImageIcon } from 'lucide-react';

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

  // Estados - Restaurante (Dados em Texto)
  const [restaurantName, setRestaurantName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [restaurantPhone, setRestaurantPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Estados - Arquivos de Imagem (File)
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  //Função Criar Restaurante 
  async function handleCreateFullRegistration(e: FormEvent) {
    e.preventDefault();
    
    if (ownerPassword !== ownerPasswordConfirm) {
      alert("As senhas não coincidem. Por favor, verifique.");
      return;
    }
    setLoading(true);

    // Utilizamos o FormData porque estamos enviando arquivos físicos
    const formData = new FormData();
    formData.append('ownerName', ownerName);
    formData.append('ownerEmail', ownerEmail);
    formData.append('ownerPassword', ownerPassword);
    formData.append('ownerPhone', ownerPhone);
    formData.append('ownerCpf', ownerCpf);

    formData.append('restaurantName', restaurantName);
    formData.append('cnpj', cnpj);
    formData.append('whatsapp', whatsapp);
    formData.append('restaurantPhone', restaurantPhone);
    formData.append('address', address);

    // Anexamos as imagens se elas tiverem sido selecionadas
    if (logoFile) formData.append('logo', logoFile);
    if (coverImageFile) formData.append('coverImage', coverImageFile);

    try {
      await api.post('/restaurants/register-full', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      

      //Criar um pop up ou modal que some em segundos 
      //quando cadastro completo. 
      alert("Cadastro completo realizado com sucesso!");
      router.push('/admin');

    } catch (error) {
      alert("Erro ao criar cadastro. O e-mail pode já estar em uso.");
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
            
            {/* CARD 1: RESPONSÁVEL LEGAL (Mantido igual) */}
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

            {/* CARD 2: RESTAURANTE (Com Upload de Arquivos) */}
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
                  <label className="block text-xs font-semibold text-slate-500 mb-1">CNPJ *</label>
                  <input type="text" value={cnpj} onChange={e => setCnpj(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">WhatsApp para Pedidos *</label>
                  <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Endereço Completo *</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 bg-slate-50" required />
                </div>
                
                {/* CAMPO: UPLOAD DE LOGO */}
                <div className="col-span-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 flex flex-col items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
                  <label className="cursor-pointer text-blue-600 font-semibold text-sm hover:underline">
                    Upload da Logo (Circular)
                    <input 
                      type="file" accept="image/png, image/jpeg, image/webp" className="hidden" 
                      onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)}
                    />
                  </label>
                  {logoFile && <span className="text-[10px] text-green-600 font-bold mt-2 truncate w-full px-2">{logoFile.name}</span>}
                </div>

                {/* CAMPO: UPLOAD DE CAPA */}
                <div className="col-span-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 flex flex-col items-center justify-center">
                  <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                  <label className="cursor-pointer text-blue-600 font-semibold text-sm hover:underline">
                    Upload da Capa (Fundo)
                    <input 
                      type="file" accept="image/png, image/jpeg, image/webp" className="hidden" 
                      onChange={(e) => setCoverImageFile(e.target.files ? e.target.files[0] : null)}
                    />
                  </label>
                  {coverImageFile && <span className="text-[10px] text-green-600 font-bold mt-2 truncate w-full px-2">{coverImageFile.name}</span>}
                </div>

              </div>
            </div>
          </div>

          <button disabled={loading} type="submit" className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-4 rounded-xl w-full transition-colors flex justify-center items-center gap-2 text-lg">
            <Plus className="w-6 h-6" /> {loading ? 'A processar imagens e a encriptar...' : 'Criar Conta e Restaurante'}
          </button>
        </form>
      </div>
    </>
  );
}