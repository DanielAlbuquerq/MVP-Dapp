"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { api } from '../../../../services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface Category {
  id: string;
  name: string;
  categoryType: string;
  products: Product[];
}

// Lista com os exatos mesmos nomes do Enum do seu Prisma
const CATEGORY_TYPES = [
  "LANCHES", "SAUDAVEL", "VITAMINAS", "ESPETINHO", "BEBIDAS",
  "CAFE", "CAFEDAMANHA", "DOCES", "SORVETE", "PIZZAS",  
  "HAMBURGUER", "DOMAR", "SALGADOS", "OUTROS", "MARMITA",
  "PADARIA", "PASTEL", "JAPONESA", "BRASILEIRA", "AÇAI", "RAPIDAO"
];

export default function RestaurantMenu({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Estados de Categoria
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('OUTROS'); // Valor padrão
  
  const [restaurantName, setRestaurantName] = useState('');

  // Estados de Produto
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const resolvedParams = React.use(params as Promise<{ id: string }>); 

  useEffect(() => {
    loadCategories();
  }, [resolvedParams?.id]);


  //função que carrega todas categorias e produtos junto
  //Assim que a tela é carregada
  async function loadCategories() {
    try {
      const response = await api.get(`/categories/restaurant/${resolvedParams.id}`);
      setCategories(response.data);

      const responseRes = await api.get(`/restaurants`);
      const currentRest = responseRes.data.find((r: any) => r.id === resolvedParams.id);
      if(currentRest) setRestaurantName(currentRest.name);

    } catch (error) {
      console.error("Erro ao carregar categorias", error);
    }
  }

  //Função para criar cadetegorias
  async function handleCreateCategory(e: FormEvent) {
    e.preventDefault();
    try {
      // Agora enviamos o nome amigável e o Tipo do Enum para o backend
      await api.post('/categories', { 
        name: newCategoryName, 
        restaurantId: resolvedParams.id,
        categoryType: newCategoryType 
      });
      
      setNewCategoryName('');
      setNewCategoryType('OUTROS'); // Reseta para o padrão
      loadCategories();
    } catch (error) {
      console.error("Erro ao criar categoria", error);
      alert("Erro ao criar a categoria. Certifique-se de que o backend atualizou o Prisma.");
    }
  }

  async function handleCreateProduct(e: FormEvent) {
    e.preventDefault();
    if (!selectedCategoryId) return alert("Selecione uma categoria primeiro!");

    try {
      await api.post('/products', {
        name: prodName,
        description: prodDesc,
        price: parseFloat(prodPrice),
        imageUrl: prodImage,
        categoryId: selectedCategoryId,
      });
      
      setProdName('');
      setProdDesc('');
      setProdPrice('');
      setProdImage('');
      loadCategories();
    } catch (error) {
      console.error("Erro ao criar produto", error);
    }
  }

  return (
    <main className="p-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">{restaurantName}</h1>
        <h2 className="text-xl font-bold mb-8 text-gray-500">Gestão do Cardápio (Modo Admin)</h2>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Nova Categoria</h2>
          <form onSubmit={handleCreateCategory} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-600">Nome da Categoria (Ex: Hambúrgueres da Casa)</label>
              <input 
                type="text" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-600">Tipo de Categoria (Ícone/Filtro)</label>
              <select 
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 bg-white"
                required
              >
                {CATEGORY_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md h-[42px]">
              Adicionar
            </button>
          </form>
        </div>

        {/* ... Restante do código (Formulário do Produto e Listagem) permanece igual ... */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Novo Produto</h2>
          <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
            <select 
              value={selectedCategoryId} 
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Selecione uma categoria...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name} ({cat.categoryType})</option>
              ))}
            </select>
            
            <input type="text" placeholder="Nome do Produto" value={prodName} onChange={(e) => setProdName(e.target.value)} className="border border-gray-300 rounded-md p-2" required />
            <input type="text" placeholder="Descrição" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} className="border border-gray-300 rounded-md p-2" required />
            <input type="number" step="0.01" placeholder="Preço (Ex: 25.50)" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} className="border border-gray-300 rounded-md p-2" required />
            <input type="text" placeholder="URL da Imagem (Opcional por enquanto)" value={prodImage} onChange={(e) => setProdImage(e.target.value)} className="border border-gray-300 rounded-md p-2" />
            
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md self-start">
              Salvar Produto
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Cardápio Atual</h2>
          {categories.length === 0 && <p className="text-gray-500">Nenhuma categoria cadastrada.</p>}
          
          {categories.map((category) => (
            <div key={category.id} className="mb-6">
              <h3 className="font-bold text-lg border-b border-gray-300 pb-2 mb-4">
                {category.name} <span className="text-sm font-normal text-gray-400">[{category.categoryType}]</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.products.map(product => (
                  <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex gap-4">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
                    )}
                    <div>
                      <h4 className="font-bold">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <p className="text-green-600 font-semibold mt-1">R$ {product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}