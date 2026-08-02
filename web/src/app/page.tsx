import React from 'react';
import Link from 'next/link';
import { Smartphone, ChefHat, ArrowRight, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function LandingPage() {
  // 🚨 SUBSTITUA PELO SEU NÚMERO DE WHATSAPP REAL AQUI (Com código do país e DDD, sem espaços)
  const whatsappNumber = "5511964548597"; 
  const whatsappMessage = encodeURIComponent("Olá! Tenho um restaurante e gostaria de me cadastrar na DPede.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* NAVEGAÇÃO */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 p-2 rounded-xl">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">DPede</span>
          </div>
          
          <nav className="hidden md:flex gap-8 font-medium text-gray-600">
            <a href="#sobre" className="hover:text-yellow-600 transition-colors">Sobre nós</a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600 transition-colors">Cadastrar Restaurante</a>
            <a href="#baixar" className="hover:text-yellow-600 transition-colors">Baixar o App</a>
          </nav>

          <div className="flex gap-4">
            <Link href="/login/restaurante" className="hidden md:flex items-center font-bold text-gray-700 hover:text-yellow-600">
              Entrar
            </Link>
            <a 
              href="#baixar"
              className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl"
            >
              Baixar App
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION (Seção Principal) */}
      <section className="bg-yellow-400 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 z-10">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              A comida que você ama,<br/>na velocidade que você precisa.
            </h1>
            <p className="text-xl text-gray-800 mb-10 max-w-lg">
              Apoie os restaurantes da sua região pagando menos taxas. Baixe o DPede e descubra um novo mundo de sabores perto de si.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#baixar" className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-xl hover:scale-105">
                <Smartphone className="w-6 h-6" />
                Baixar para Cliente
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:scale-105">
                <MessageCircle className="w-6 h-6 text-green-500" />
                Sou Restaurante
              </a>
            </div>
          </div>
          
          <div className="lg:w-1/2 mt-16 lg:mt-0 relative flex justify-center">
            {/* Espaço para colocar a imagem de um telemóvel depois. Por agora usamos um placeholder elegante */}
            <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] border-[14px] border-white shadow-2xl overflow-hidden relative flex flex-col">
               <div className="bg-yellow-400 p-6 flex-1">
                  <div className="w-20 h-20 bg-white rounded-2xl mb-4 shadow-sm flex items-center justify-center">
                    <ChefHat className="w-10 h-10 text-yellow-500"/>
                  </div>
                  <div className="h-4 bg-white/50 rounded-full w-3/4 mb-4"></div>
                  <div className="h-4 bg-white/50 rounded-full w-1/2 mb-8"></div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center">
                         <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                         <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE NÓS */}
      <section id="sobre" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Por que escolher o DPede?</h2>
          <p className="text-xl text-gray-500 mb-16 max-w-2xl mx-auto">Nós viemos para revolucionar o delivery na sua cidade, conectando você diretamente aos melhores preparos locais.</p>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Comércio Local</h3>
              <p className="text-gray-600">Valorizamos os restaurantes do seu bairro. Quando pede por aqui, ajuda a economia local a girar.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Contato Direto</h3>
              <p className="text-gray-600">Sem robôs e sem burocracia. O seu pedido vai direto para o WhatsApp do restaurante.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Agilidade Total</h3>
              <p className="text-gray-600">Cardápio otimizado para não perder tempo. Escolheu, clicou, pediu. É vapt-vupt!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION - BAIXAR O APP */}
      <section id="baixar" className="py-24 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <ChefHat className="w-16 h-16 text-yellow-400 mb-8" />
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Com fome? O DPede resolve.</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl">
            Descarregue a nossa versão inicial do aplicativo e faça o seu primeiro pedido hoje mesmo.
          </p>
          
          {/* BOTÃO PARA BAIXAR O APK (Você pode colocar o link direto do Google Drive ou do EAS Build aqui depois) */}
          <a 
            href="#" 
            className="flex items-center gap-3 bg-yellow-400 text-gray-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-yellow-500 transition-all hover:scale-105 shadow-[0_0_40px_rgba(250,204,21,0.3)]"
          >
            <Smartphone className="w-8 h-8" />
            <div className="text-left">
              <span className="block text-sm font-bold opacity-80 uppercase tracking-wider">Baixar para</span>
              <span className="block text-2xl">Android (APK)</span>
            </div>
          </a>
          <p className="mt-6 text-gray-500 text-sm">* A versão para iOS será disponibilizada em breve na App Store.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-yellow-500" />
            <span className="text-xl font-bold text-gray-900">DPede</span>
          </div>
          <p className="text-gray-500 font-medium">© {new Date().getFullYear()} DPede. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/login/admin" className="text-sm text-gray-400 hover:text-gray-900">Acesso Restrito</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}