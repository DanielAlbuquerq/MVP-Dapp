"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, UtensilsCrossed, LogOut, List } from 'lucide-react';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  function handleLogout() {
    localStorage.clear();
    router.push('/login/restaurante');
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      
      {/* SIDEBAR PARCEIRO FIXA */}
      <aside className="w-64 bg-yellow-600 text-white flex flex-col shadow-xl hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-yellow-500 flex items-center gap-3">
          <Store className="w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight">Portal Parceiro</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {/* Nova rota: Meus Restaurantes */}
          <Link 
            href="/portalparceiro/meus-restaurantes" 
            className="w-full flex items-center gap-3 hover:bg-yellow-700 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            <List className="w-5 h-5" /> Meus Restaurantes
          </Link>

          {/* Rota Original: Cardápio do Restaurante Selecionado */}
          <Link 
            href="#minhasvendas" 
            className="w-full flex items-center gap-3 hover:bg-yellow-700 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            <UtensilsCrossed className="w-5 h-5" /> FIXINGMinhas Vendas
          </Link>
        </nav>

        <div className="p-4 border-t border-yellow-500">
          <button 
            onClick={handleLogout} 
            className="w-full cursor-pointer flex items-center gap-3 hover:bg-yellow-700 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" /> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL (As páginas vão aparecer aqui dentro) */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}