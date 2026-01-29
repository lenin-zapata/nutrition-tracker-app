import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router'; // <--- OJO: Agregamos useRouter y useSegments
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { useAuthStore } from '@/store/authStore';
import { AdBanner } from '@/components/AdBanner';
import { supabase } from '@/services/supabase'; 

export default function RootLayout() {
  // 1. Hooks de navegación y estado
  const { session, initialize, initialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // 2. Función auxiliar para leer el token oculto en la URL del correo
  const getParamsFromUrl = (url: string) => {
    const params: { [key: string]: string } = {};
    const queryString = url.split('#')[1] || url.split('?')[1]; 
    if (!queryString) return params;
    
    queryString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      params[key] = decodeURIComponent(value);
    });
    return params;
  };

  // 3. Inicializar la app
  useEffect(() => {
    initialize();
  }, []);

  // 4. Lógica de Deep Linking (Capturar clic del correo)
  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;

      // Si la URL trae tokens (access_token y refresh_token)
      if (url.includes('access_token') && url.includes('refresh_token')) {
        try {
          const params = getParamsFromUrl(url);
          if (params.access_token && params.refresh_token) {
            console.log("Detectado link de correo. Forzando sesión...");
            // Inyectamos la sesión manualmente en Supabase
            await supabase.auth.setSession({
              access_token: params.access_token,
              refresh_token: params.refresh_token,
            });
            // Al hacer esto, Supabase avisa a 'useAuthStore' y 'session' se actualiza solo
          }
        } catch (error) {
          console.error("Error procesando el link:", error);
        }
      }
    };

    // Escuchar si la app se abre desde cero o segundo plano
    const subscription = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    Linking.getInitialURL().then((url) => { if (url) handleDeepLink(url); });

    return () => {
      subscription.remove();
    };
  }, []);

  // 5. EL SEMÁFORO (Traffic Guard) - VERSIÓN CORREGIDA
  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)'; 
    const inRoot = (segments as string[]).length === 0;
    
    if (session && (inAuthGroup || inRoot)) {
      // Si tiene sesión Y (está en login O está en el lobby) -> Mandar al Home
      router.replace('/(tabs)/home');
    } else if (!session && !inAuthGroup && segments[0] !== 'onboarding') {
      // Si NO tiene sesión -> Mandar al Login
      router.replace('/(auth)/login');
    }
  }, [session, initialized, segments]);

  // 6. Pantalla de carga mientras verificamos sesión
  // 6. Pantalla de carga (Reemplaza el return null)
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  // 7. Renderizado Principal
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style="auto" />
      
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="index" /> */}
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
        </Stack>
      </View>

      <AdBanner />
    </View>
  );
}