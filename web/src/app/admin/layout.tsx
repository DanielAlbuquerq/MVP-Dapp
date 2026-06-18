"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, LogOut, Plus, List } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const role = localStorage.getItem('@MVPDelivery:role');
    console.log("useEffectrun")
    if (role !== 'ADMIN') {
      router.push('/login/admin');
    }
  }, [router]);

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
          <Link 
            href="/admin/newuser"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${pathname === '/admin/new' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Plus className="w-5 h-5" /> Novo Parceiro
          </Link>
          <Link 
            href="/admin"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${pathname === '/admin' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <List className="w-5 h-5" /> Lojas Cadastradas
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 hover:bg-slate-800 px-4 py-3 rounded-lg font-medium transition-colors text-red-400">
            <LogOut className="w-5 h-5" /> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}