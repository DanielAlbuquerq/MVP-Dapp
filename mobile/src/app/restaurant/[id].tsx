import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { api } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
// import "../../../global.css"

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
  products: Product[];
}

export default function RestaurantMenuScreen() {
  // O hook useLocalSearchParams extrai os parâmetros enviados pela tela index
  const { id, restaurantName, whatsapp } = useLocalSearchParams<{ id: string, restaurantName: string, whatsapp: string }>();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();
  
  useEffect(() => {
    api.get(`/categories/restaurant/${id}`)
      .then(response => {

        //Filtra os produtos ativos e remove as categorias que ficarem vazias
        const activeCategories = response.data
          .map((category: Category) => ({
            ...category,
            products: category.products.filter(product => product.isActive === true)
          }))
          .filter((category: Category) => category.products.length > 0);

        //Renderiza no React (na tela)
        setCategories(activeCategories);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar cardápio:", error);
        setLoading(false);
      });
  }, [id]);

  // const handleOrder = (product: Product) => {
  //   const message = `Olá! Gostaria de pedir um *${product.name}* (R$ ${product.price.toFixed(2)}).`;
  //   const encodedMessage = encodeURIComponent(message);
    
  //   const cleanNumber = whatsapp.replace(/\D/g, '');
  //   const whatsappUrl = `https://wa.me/55${cleanNumber}?text=${encodedMessage}`;

  //   Linking.canOpenURL(whatsappUrl)
  //     .then((supported) => {
  //       if (supported) {
  //         return Linking.openURL(whatsappUrl);
  //       } else {
  //         Alert.alert("Erro", "WhatsApp não está instalado ou o link é inválido.");
  //       }
  //     })
  //     .catch((err) => console.error("Erro ao abrir WhatsApp", err));
  // };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-5">
      <Text className="text-2xl font-bold text-gray-900 mb-6">{restaurantName}</Text>
      
      {categories.length === 0 ? (
        <Text className="text-gray-500">Este restaurante ainda não possui produtos.</Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={cat => cat.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: category }) => (
            <View className="mb-6">
              <Text className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                {category.name}
              </Text>
              
              {category.products.map(product => (
                <View key={product.id} className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100 flex-row">
                  {product.imageUrl ? (
                    <Image 
                      source={{ uri: product.imageUrl }} 
                      className="w-20 h-20 rounded-lg mr-3 bg-gray-200"
                    />
                  ) : (
                    <View className="w-20 h-20 rounded-lg mr-3 bg-gray-200 justify-center items-center">
                      <Text className="text-gray-400 text-xs">Sem foto</Text>
                    </View>
                  )}
                  
                  <View className="flex-1 justify-between">
                    <View>
                      <Text className="font-bold text-gray-900 text-base">{product.name}</Text>
                      <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
                        {product.description}
                      </Text>
                    </View>
                    
                    {/* <View className="flex-row justify-between items-center mt-2">
                      <Text className="text-green-600 font-bold">R$ {product.price.toFixed(2)}</Text>
                      <TouchableOpacity 
                        className="bg-blue-600 px-3 py-1.5 rounded-lg"
                        onPress={() => handleOrder(product)}
                      >
                        <Text className="text-white font-semibold text-xs">Pedir</Text>
                      </TouchableOpacity>
                    </View> */}

                    <View className="flex-row justify-between items-center mt-2">
                      <Text className="text-green-600 font-bold">R$ {product.price.toFixed(2)}</Text>
                      <TouchableOpacity 
                        className="bg-blue-600 px-3 py-1.5 rounded-lg"
                        onPress={() => addToCart(product)} // NOVO: Adiciona ao carrinho em vez de abrir o zap
                      >
                        <Text className="text-white font-semibold text-xs">+ Adicionar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        />
      )}
      
      {/* Botão Flutuante do Carrinho */}
      {cart.length > 0 && (
        <TouchableOpacity 
          className="absolute bottom-6 flex-row justify-between items-center bg-green-600 p-4 rounded-full shadow-lg left-5 right-5"
          onPress={() => router.push({ pathname: '/cart', params: { whatsapp } })}
        >
          <View className="bg-white rounded-full w-8 h-8 justify-center items-center">
            <Text className="text-green-600 font-bold">{cart.reduce((acc, item) => acc + item.quantity, 0)}</Text>
          </View>
          <Text className="text-white font-bold text-lg">Ver Carrinho</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}