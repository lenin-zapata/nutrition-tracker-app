import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  // Este archivo es la "Sala de Espera".
  // Se muestra solo por milésimas de segundo mientras 
  // el _layout.tsx redirige al usuario a donde corresponda.
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );
}