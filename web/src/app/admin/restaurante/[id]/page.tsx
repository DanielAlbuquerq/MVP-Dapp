"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { api } from '../../../../services/api';
import { Edit, Trash2, X, Image as ImageIcon, UploadCloud } from 'lucide-react';

// interface Restaurant {
//     name: string;
//     whatsapp?: string;
//     logoUrl?: string;
//     isOpen?: boolean;
//     address?: string;
// }

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  categoryType: string;
  products: Product[];
}

const CATEGORY_TYPES = [
  "LANCHES", "SAUDAVEL", "VITAMINAS", "ESPETINHO", "BEBIDAS",
  "CAFE", "CAFEDAMANHA", "DOCES", "SORVETE", "PIZZAS",  
  "HAMBURGUER", "DOMAR", "SALGADOS", "OUTROS", "MARMITA",
  "PADARIA", "PASTEL", "JAPONESA", "BRASILEIRA", "AÇAI", "RAPIDAO"
];

export default function RestaurantMenu({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('OUTROS');
  const [restaurantName, setRestaurantName] = useState('');

  // Estados do Produto (Criação)
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  // NOVO: Estado para guardar o Arquivo de imagem em vez do Texto
  const [prodImageFile, setProdImageFile] = useState<File | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // ESTADOS DO MODAL DE EDIÇÃO
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdIsActive, setEditProdIsActive] = useState(true);
  
  // NOVO: Estados de imagem no Modal
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // Guarda a URL atual (antiga)
  const [editProdImageFile, setEditProdImageFile] = useState<File | null>(null); // Guarda a nova foto se o usuário trocar

  const resolvedParams = React.use(params as Promise<{ id: string }>); 

  useEffect(() => {
    loadCategories();
  }, [resolvedParams?.id]);

  //função carrega categorias
  async function loadCategories() {
    try {
      const response = await api.get(`/categories/restaurant/${resolvedParams.id}`);
      setCategories(response.data);

      //Get na rota Restaurantes e pega todos Restaurantes
      //const currentRest filtra pelo ID da URL
      const responseRes = await api.get(`/restaurants`);
      const currentRest = responseRes.data.find((r: any) => r.id === resolvedParams.id);
      
      if(currentRest) setRestaurantName(currentRest.name);
    } catch (error) {
      console.error("Erro ao carregar categorias", error);
    }
  }

  // --- Função criar categoria ---
  async function handleCreateCategory(e: FormEvent) {
    e.preventDefault();
    try {
      await api.post('/categories', { name: newCategoryName, restaurantId: resolvedParams.id, categoryType: newCategoryType });
      setNewCategoryName('');
      setNewCategoryType('OUTROS');
      loadCategories();
    } catch (error) {
      alert("Erro ao criar a categoria.");
    }
  }

   // --- Função criar produto
  async function handleCreateProduct(e: FormEvent) {
    e.preventDefault();
    if (!selectedCategoryId) return alert("Selecione uma categoria primeiro!");
    
    // Criando o FormData (Necessário para envio de arquivos binários)
    const formData = new FormData();
    formData.append('name', prodName);
    formData.append('description', prodDesc);
    formData.append('price', prodPrice);
    formData.append('categoryId', selectedCategoryId);
    
    // Anexando o arquivo físico se ele existir
    if (prodImageFile) {
      formData.append('file', prodImageFile);
    }

    try {
      // Enviamos o formData e avisamos o Axios sobre o tipo multipart
      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setProdName(''); setProdDesc(''); setProdPrice(''); setProdImageFile(null);
      loadCategories();
    } catch (error) {
      console.error("Erro ao criar produto", error);
    }
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setEditProdName(product.name);
    setEditProdDesc(product.description);
    setEditProdPrice(product.price.toString());
    setEditProdIsActive(product.isActive !== false);
    setCurrentImageUrl(product.imageUrl || '');
    setEditProdImageFile(null); // Zera o arquivo novo
  }

  function closeEditModal() {
    setEditingProduct(null);
  }

  // NOVO: Submit com FormData para Edição
  async function handleUpdateProduct(e: FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData();
    formData.append('name', editProdName);
    formData.append('description', editProdDesc);
    formData.append('price', editProdPrice);
    formData.append('isActive', String(editProdIsActive));
    
    // Só envia o arquivo novo se o usuário selecionou uma imagem nova no Modal
    if (editProdImageFile) {
      formData.append('file', editProdImageFile);
    }

    try {
      await api.patch(`/products/${editingProduct.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      closeEditModal();
      loadCategories(); 
    } catch (error) {
      alert("Erro ao atualizar o produto.");
    }
  }

  async function handleDeleteProduct(id: string) {
    const confirm = window.confirm("Tem certeza que deseja apagar este produto definitivamente?");
    if (!confirm) return;
    try {
      await api.delete(`/products/${id}`);
      closeEditModal();
      loadCategories();
    } catch (error) {
      alert("Erro ao apagar o produto.");
    }
  }

  return (
    <main className="p-5 text-gray-900 relative">
    {/* Page Header  */}
      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">{restaurantName}</h1>
        <h2 className="text-xl font-bold mb-8 text-gray-500">Gestão do Cardápio (Modo Admin)</h2>

        {/* Editar layout Formulário, está muito largo */}
        {/* ... FORMULÁRIO DE CATEGORIA */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Nova Categoria</h2>
          <form onSubmit={handleCreateCategory} className="flex gap-4 items-end">
            <div className="flex-1">
              <input type="text" placeholder="Nome da Categoria" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
            </div>
            <div className="flex-1">
              <select value={newCategoryType} onChange={(e) => setNewCategoryType(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" required>
                {CATEGORY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md">Adicionar</button>
          </form>
        </div>

        {/* --- FORMULÁRIO DE PRODUTO ATUALIZADO --- */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Novo Produto</h2>
          <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
            <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="border border-gray-300 rounded-md p-2" required>
              <option value="">Selecione uma categoria...</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name} ({cat.categoryType})</option>)}
            </select>
            <input type="text" placeholder="Nome do Produto" value={prodName} onChange={(e) => setProdName(e.target.value)} className="border border-gray-300 rounded-md p-2" required />
            <input type="text" placeholder="Descrição" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} className="border border-gray-300 rounded-md p-2" required />
            <input type="number" step="0.01" placeholder="Preço (Ex: 25.50)" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} className="border border-gray-300 rounded-md p-2" required />
            
            {/* Input do tipo File */}
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 flex flex-col items-center justify-center">
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <label className="cursor-pointer text-blue-600 font-semibold hover:underline">
                Clique para selecionar a imagem do produto
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                  onChange={(e) => setProdImageFile(e.target.files ? e.target.files[0] : null)}
                />
              </label>
              {prodImageFile && <span className="text-sm text-green-600 font-bold mt-2">Arquivo selecionado: {prodImageFile.name}</span>}
            </div>
            
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md self-start">Salvar Produto</button>
          </form>
        </div>

        {/* --- "Cardápio" LISTAGEM DE CATEGORIAS E PRODUTOS --- */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Cardápio Atual</h2>
          {categories.length === 0 && <p className="text-gray-500">Nenhuma categoria cadastrada.</p>}
          
          {categories.map((category) => (
            <div key={category.id} className="mb-6">
              <h3 className="font-bold text-lg border-b border-gray-300 pb-2 mb-4">
                {category.name} <span className="text-sm font-normal text-gray-400">[{category.categoryType}]</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {category.products.map(product => (
                  <div 
                    key={product.id} 
                    onClick={() => openEditModal(product)}
                    className={`bg-white p-4 rounded-lg shadow-sm border flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow ${!product.isActive ? 'opacity-60 border-red-200 bg-red-50' : 'border-gray-200'}`}
                  >
                    <div className="flex gap-4">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <h4 className={`font-bold ${!product.isActive && 'line-through text-gray-500'}`}>{product.name}</h4>
                           <span className={`text-[10px] ${!product.isActive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} px-2 py-0.5 rounded-full font-bold`}> {!product.isActive ? 'Pausado' : 'Ativo' }</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        <p className="text-green-600 font-semibold mt-1">R$ {product.price.toFixed(2)}</p>
                        <p className="text-gray-400">id: ({product.id.slice(0, 3)})</p> 
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        openEditModal(product);
                      }}
                      className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit className="w-4 h-4" /> Alterar Produto
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL DE EDIÇÃO ATUALIZADO PARA ACEITAR FILE --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-screen overflow-y-auto">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" /> Editar Produto
              </h3>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleUpdateProduct} className="flex flex-col gap-4">
                {/* Componente Visual de Upload no Modal */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Imagem do Produto</label>
                  <div className="flex items-center gap-4">
                    {/* Mostra a imagem atual ou uma miniatura do arquivo novo */}
                    {editProdImageFile ? (
                       <img src={URL.createObjectURL(editProdImageFile)} alt="Preview" className="w-16 h-16 object-cover rounded-md border" />
                    ) : currentImageUrl ? (
                       <img src={currentImageUrl} alt="Atual" className="w-16 h-16 object-cover rounded-md border" />
                    ) : (
                       <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-400"/></div>
                    )}
                    
                    <div className="flex-1">
                      <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm py-2 px-4 rounded-md inline-block transition-colors">
                        Escolher Nova Foto
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, image/webp" 
                          className="hidden" 
                          onChange={(e) => setEditProdImageFile(e.target.files ? e.target.files[0] : null)}
                        />
                      </label>
                      <p className="text-xs text-gray-400 mt-1">Deixe em branco para manter a foto atual.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Nome do Produto</label>
                  <input type="text" value={editProdName} onChange={(e) => setEditProdName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Descrição</label>
                  <textarea value={editProdDesc} onChange={(e) => setEditProdDesc(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Preço (R$)</label>
                  <input type="number" step="0.01" value={editProdPrice} onChange={(e) => setEditProdPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
                  <div>
                    <p className="font-bold text-gray-800">Status no Cardápio</p>
                    <p className="text-xs text-gray-500">Produtos inativos não aparecem para o cliente.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setEditProdIsActive(!editProdIsActive)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${editProdIsActive ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${editProdIsActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => handleDeleteProduct(editingProduct.id)} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-bold transition-colors">
                    <Trash2 className="w-5 h-5" /> Apagar
                  </button>
                  <div className="flex gap-3">
                    <button type="button" onClick={closeEditModal} className="px-5 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-100">Cancelar</button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors">Salvar Alterações</button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}