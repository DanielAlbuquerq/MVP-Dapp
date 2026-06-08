import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { api } from '../services/api';
import "../../global.css"
import {arrayRestaurants} from '../../../backend/arrayRestaurants.js';


interface Restaurant {
  id: string;
  name: string;
  whatsapp: string;
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    api.get('/restaurants', { timeout: 10000000 })
      .then(response => {
        setRestaurants(response.data);
        setLoading(false);
      })
       .catch(error => {
        console.error("Erro ao buscar restaurantes:", error);
        setLoading(false);
        if (error.code === 'ECONNABORTED') {
          alert("A conexão demorou muito. Por favor, tente novamente.");
        } else {
          alert("Ocorreu um erro ao carregar os restaurantes. Por favor contate o suporte.");
        }
      });
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }


  return (
    <View className="flex-1 p-5 bg-gray-50">
      <Text className="text-2xl font-bold text-gray-900 mb-6">
        Escolha um Restaurante
      </Text>
      
      <FlatList
        data={restaurants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-white p-5 rounded-xl mb-4 shadow-sm border border-gray-100"
            onPress={() => router.push({
              pathname: "/restaurant/[id]",
              params: { 
                id: item.id, 
                restaurantName: item.name, 
                whatsapp: item.whatsapp 
              }
            })}
          >
            <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
            <Text className="text-sm text-gray-500 mt-1">Ver cardápio completo</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}