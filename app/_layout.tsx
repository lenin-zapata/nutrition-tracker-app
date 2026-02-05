import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';

import { useAuthStore } from '@/store/authStore';
import { AdBanner } from '@/components/AdBanner';
import { supabase } from '@/services/supabase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stackContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

// Función auxiliar para leer parámetros de la URL
function getParamsFromUrl(url: string) {
  const params: { [key: string]: string } = {};
  const parts = url.split('#');
  const hash = parts.length > 1 ? parts[1] : url.split('?')[1];
  
  if (!hash) return params;
  
  hash.split('&').forEach((param) => {
    const [key, value] = param.split('=');
    if (key && value) params[key] = decodeURIComponent(value);
  });
  
  return params;
}

export default function RootLayout() {
  const { session, initialize } = useAuthStore();
  
  // "Engañamos" a TS para que trate segments como array de strings simple
  const segments = useSegments() as string[];
  
  const router = useRouter();
  
  // SEMÁFORO: Si esto es true, nadie te mueve de la pantalla de cambio de contraseña
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 1. Inicialización con Timeout (SEGURO DE VIDA)
  // Esto evita que te quedes en el spinner infinito
  useEffect(() => {
    let mounted = true;

    const startApp = async () => {
      try {
        await initialize();
      } catch (e) {
        console.error("Error inicializando:", e);
      }
      if (mounted) setIsReady(true);
    };

    startApp();

    // Si en 3 segundos la app no ha reaccionado, forzamos la carga
    const timer = setTimeout(() => {
      if (mounted && !isReady) {
        console.log("⏱️ Tiempo de espera agotado, forzando arranque...");
        setIsReady(true);
      }
    }, 3000);

    return () => { 
      mounted = false; 
      clearTimeout(timer);
    };
  }, []); 

  // 2. Lógica de Deep Links (Detectar si vienes del correo)
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      const params = getParamsFromUrl(url);
      
      // Si detectamos "type=recovery" o tokens en la URL
      if (params.type === 'recovery' || (params.access_token && params.refresh_token)) {
        console.log("🔗 Link de recuperación detectado");
        setIsRecoveryFlow(true); // Bloqueamos al "portero"
        
        // Forzamos la sesión manualmente
        if (params.access_token && params.refresh_token) {
          await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
        }
        // Redirigimos INMEDIATAMENTE
        router.replace('/(auth)/reset-password-change');
      }
    };

    // Chequear URL al abrir la app en frío
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Chequear URL si la app ya estaba abierta
    const sub = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    
    return () => sub.remove();
  }, []);

  // 3. Detectar Evento Interno de Supabase (Red de seguridad)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        console.log("🔑 Evento PASSWORD_RECOVERY interno detectado");
        setIsRecoveryFlow(true);
        router.replace('/(auth)/reset-password-change');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // 4. Protección de Rutas (El Portero)
  useEffect(() => {
    if (!isReady) return; 
    if (isRecoveryFlow) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inRoot = segments.length === 0; // <--- NUEVO: Detectar si estamos en la raíz (/)
    const isResetPage = segments.length > 1 && segments[1] === 'reset-password-change';

    // Si hay sesión y estamos en Login, Onboarding O EN LA RAÍZ -> Al Home
    if (session && !isResetPage && (inAuthGroup || inOnboarding || inRoot)) {
      router.replace('/(tabs)/home');
    } 
    // Si no hay sesión y NO estamos en Login/Onboarding -> Al Login
    else if (!session && !inAuthGroup && !inOnboarding) {
      router.replace('/(auth)/login');
    }
  }, [session, isReady, segments, isRecoveryFlow]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.stackContainer}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="index" />
          <Stack.Screen name="meal-detail" />
        </Stack>
      </View>
      <AdBanner />
    </View>
  );
}