import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { api } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import "../../global.css";

interface Restaurant {
  id: string;
  name: string;
  whatsapp: string;
  logoUrl?: string; // Adicionei para suportar a imagem se existir
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // DADOS FALSOS PARA TESTAR O VISUAL (Pode integrar com a API depois)
  const categorias = [
    { id: '1', nome: 'Lanches', img: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
    { id: '2', nome: 'Pizza', img: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png' },
    { id: '3', nome: 'Doces', img: 'https://cdn-icons-png.flaticon.com/512/3081/3081949.png' },
    { id: '4', nome: 'Açaí', img: 'https://cdn-icons-png.flaticon.com/512/6554/6554162.png' },
  ];

  const ofertas = [
    { id: '1', titulo: 'Hambúrguer Duplo', preco: 20.00, precoAntigo: 45.00, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
    { id: '2', titulo: 'Pizza Calabresa', preco: 35.90, precoAntigo: 50.00, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
  ];

  useEffect(() => {
    // Chamada real para a API na AWS
    api.get('/restaurants', { timeout: 10000 })
      .then(response => {
        // Filtra para manter apenas os restaurantes abertos
        const openRestaurants = response.data.filter((restaurant: any) => restaurant.isOpen === true);
        setRestaurants(openRestaurants);
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <ActivityIndicator size="large" color="#00E096" />
        <Text style={{ marginTop: 10, color: '#666' }}>A carregar restaurantes...</Text>
      </View>
    );
  }

  return (
    <>
    {/* ESTA LINHA DESLIGA O CABEÇALHO PADRÃO DO EXPO ROUTER */}
    <Stack.Screen options={{ headerShown: false }} />
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* CABEÇALHO ESTILO KEETA */}
      <View style={styles.headerBackground}>
        <View style={styles.headerTop}>
          <Text style={styles.logo}>DPede</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={16} color="#000" />
            <Text style={styles.locationText}>Localização atual</Text>
            <Ionicons name="chevron-down" size={16} color="#000" />
          </View>
        </View>

        {/* BARRA DE PESQUISA */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput 
            style={styles.searchInput}
            placeholder="O que gostaria de pedir hoje?"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* SESSÃO 1: CATEGORIAS */}
      <View style={styles.sectionContainer}>
        <FlatList
          data={categorias}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIconContainer}>
                <Image source={{ uri: item.img }} style={styles.categoryImg} />
              </View>
              <Text style={styles.categoryText}>{item.nome}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* SESSÃO 2: PRODUTOS COM DESCONTO (OFERTAS) */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Top Ofertas para você!</Text>
        <FlatList
          data={ofertas}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.offerCard}>
              <Image source={{ uri: item.img }} style={styles.offerImg} />
              <View style={styles.offerInfo}>
                <Text style={styles.offerTitle} numberOfLines={1}>{item.titulo}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.currentPrice}>R$ {item.preco.toFixed(2)}</Text>
                  <Text style={styles.oldPrice}>R$ {item.precoAntigo.toFixed(2)}</Text>
                </View>
                <View style={styles.deliveryInfo}>
                  <Ionicons name="bicycle" size={14} color="#00E096" />
                  <Text style={styles.deliveryText}>Grátis</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* SESSÃO 3: RESTAURANTES REAIS DA API */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Restaurantes disponíveis</Text>
        
        {restaurants.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>
            Nenhum restaurante aberto no momento.
          </Text>
        ) : (
          restaurants.map((rest) => (
            <TouchableOpacity 
              key={rest.id} 
              style={styles.restaurantCard}
              onPress={() => router.push({
                pathname: "/restaurant/[id]",
                params: { 
                  id: rest.id, 
                  restaurantName: rest.name, 
                  whatsapp: rest.whatsapp 
                }
              })}
            >
              {rest.logoUrl ? (
                <Image source={{ uri: rest.logoUrl }} style={styles.restaurantImg} />
              ) : (
                <View style={styles.restaurantImgPlaceholder}>
                  <Ionicons name="restaurant" size={30} color="#CCC" />
                </View>
              )}
              
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{rest.name}</Text>
                <View style={styles.restaurantMeta}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.metaText}>Novo • 30-45 min</Text>
                </View>
                <Text style={styles.metaText}>Taxa: Grátis</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
      
      <View style={{ height: 40 }} /> 
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerBackground: { backgroundColor: '#00E096', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  logo: { fontSize: 26, fontWeight: 'bold', color: '#000' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  locationText: { fontWeight: '600', marginHorizontal: 5 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10, marginTop: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  
  sectionContainer: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  
  categoryItem: { alignItems: 'center', marginRight: 20 },
  categoryIconContainer: { width: 70, height: 70, backgroundColor: '#FFF', borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginBottom: 8 },
  categoryImg: { width: 40, height: 40 },
  categoryText: { fontSize: 13, fontWeight: '500', color: '#555' },

  offerCard: { width: 160, backgroundColor: '#FFF', borderRadius: 15, marginRight: 15, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  offerImg: { width: '100%', height: 120 },
  offerInfo: { padding: 12 },
  offerTitle: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  currentPrice: { fontSize: 16, fontWeight: 'bold', color: '#00E096', marginRight: 8 },
  oldPrice: { fontSize: 12, color: '#999', textDecorationLine: 'line-through' },
  deliveryInfo: { flexDirection: 'row', alignItems: 'center' },
  deliveryText: { fontSize: 12, color: '#666', marginLeft: 4, fontWeight: '600' },

  restaurantCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  restaurantImgPlaceholder: { width: 80, height: 80, backgroundColor: '#EEE', borderRadius: 10, marginRight: 15, justifyContent: 'center', alignItems: 'center' },
  restaurantImg: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  restaurantInfo: { flex: 1, justifyContent: 'center' },
  restaurantName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  restaurantMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  metaText: { fontSize: 13, color: '#666', marginLeft: 5 },
});