// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { api } from '../services/api';

// interface Restaurant {
//   id: string;
//   name: string;
//   whatsapp: string;
// }

// export default function HomeScreen({ navigation }: any) {
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get('/restaurants')
//       .then(response => {
//         setRestaurants(response.data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error("Erro ao buscar restaurantes:", error);
//         setLoading(false);
//         //Precisamos direcionar o user caso entre nesse erro!
//       });
//   }, []);

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#2563eb" />
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 p-5 bg-gray-50">
//       <Text className="text-2xl font-bold text-gray-900 mb-6">
//         Escolha um Restaurante
//       </Text>
      
//       <FlatList
//         data={restaurants}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity 
//             className="bg-white p-5 rounded-xl mb-4 shadow-sm border border-gray-100"
//             // A navegação para o menu será implementada na próxima etapa
//             onPress={() => console.log("Navegar para o restaurante", item.name)}
//           >
//             <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
//             <Text className="text-sm text-gray-500 mt-1">Ver cardápio completo</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }