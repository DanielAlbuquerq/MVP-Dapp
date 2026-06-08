import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useLocalSearchParams, router } from 'expo-router';

export default function CartScreen() {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart();
  // Recebemos o WhatsApp do restaurante pela navegação
  const { whatsapp } = useLocalSearchParams<{ whatsapp: string }>();

  const handleCheckout = () => {
    if (cart.length === 0) return Alert.alert("Ops", "Seu carrinho está vazio!");

    // Formata a mensagem com todos os itens
    let message = `Olá! Gostaria de fazer o seguinte pedido:\n\n`;
    cart.forEach((item) => {
      message += `- ${item.quantity}x *${item.product.name}* (R$ ${(item.product.price * item.quantity).toFixed(2)})\n`;
    });
    message += `\n*Total a pagar: R$ ${cartTotal.toFixed(2)}*`;

    const encodedMessage = encodeURIComponent(message);
    const cleanNumber = whatsapp.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${cleanNumber}?text=${encodedMessage}`;

    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          clearCart(); // Limpa o carrinho após o pedido
          router.back(); // Volta para a tela anterior
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert("Erro", "WhatsApp não está instalado ou o link é inválido.");
        }
      })
      .catch((err) => console.error("Erro ao abrir WhatsApp", err));
  };

  return (
    <View className="flex-1 bg-gray-50 p-5">
      {cart.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">Seu carrinho está vazio.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.product.id}
            renderItem={({ item }) => (
              <View className="flex-row justify-between items-center bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100">
                <View>
                  <Text className="font-bold text-gray-900">{item.quantity}x {item.product.name}</Text>
                  <Text className="text-gray-500">R$ {(item.product.price * item.quantity).toFixed(2)}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
                  <Text className="text-red-500 font-bold">Remover</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View className="mt-4 border-t border-gray-200 pt-4">
            <Text className="text-xl font-bold text-gray-900 mb-4">Total: R$ {cartTotal.toFixed(2)}</Text>
            <TouchableOpacity 
              className="bg-green-600 p-4 rounded-xl items-center"
              onPress={handleCheckout}
            >
              <Text className="text-white font-bold text-lg">Enviar Pedido (WhatsApp)</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}