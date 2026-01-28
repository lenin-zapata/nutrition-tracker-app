import { useEffect } from 'react';
import { View } from 'react-native'; // <--- Importante
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';
import { AdBanner } from '@/components/AdBanner'; // <--- Importamos el banner

export default function RootLayout() {
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    // Usamos un contenedor principal con flex: 1
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style="auto" />
      
      {/* El Stack toma todo el espacio disponible (flex: 1) */}
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
        </Stack>
      </View>

      {/* El anuncio queda fuera del Stack, pegado al fondo */}
      <AdBanner />
    </View>
  );
}