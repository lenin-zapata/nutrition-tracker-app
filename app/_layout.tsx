import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore'; // ✅ IMPORTANTE
import { AdBanner } from '@/components/AdBanner';
import { supabase } from '@/services/supabase';
import '@/lang/i18n'; 

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  stackContainer: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});

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
  const { fetchProfile, profile } = useUserProfileStore(); // ✅ Traemos el store del perfil
  const segments = useSegments() as string[];
  const router = useRouter();
  
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 1. Inicialización Robusta
  useEffect(() => {
    let mounted = true;

    const startApp = async () => {
      try {
        // A. Inicializar Auth
        await initialize();
        
        // B. Si hay sesión, intentamos cargar el perfil INMEDIATAMENTE
        // Esto evita que la app se quede "pensando" en el limbo
        const currentSession = useAuthStore.getState().session;
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (e) {
        console.error("Error inicializando:", e);
      }
      
      if (mounted) setIsReady(true);
    };

    startApp();

    // Seguro de vida: forzar carga en 3 segundos si algo falla
    const timer = setTimeout(() => {
      if (mounted && !isReady) setIsReady(true);
    }, 3000);

    return () => { mounted = false; clearTimeout(timer); };
  }, []); 

  // 2. Deep Links (Recuperación contraseña)
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      const params = getParamsFromUrl(url);
      if (params.type === 'recovery' || (params.access_token && params.refresh_token)) {
        setIsRecoveryFlow(true);
        if (params.access_token && params.refresh_token) {
          await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
        }
        router.replace('/(auth)/reset-password-change');
      }
    };

    Linking.getInitialURL().then((url) => { if (url) handleDeepLink(url); });
    const sub = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    return () => sub.remove();
  }, []);

  // 3. Listener Supabase
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryFlow(true);
        router.replace('/(auth)/reset-password-change');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // 4. EL PORTERO (Lógica de Protección Actualizada)
  useEffect(() => {
    if (!isReady) return; 
    if (isRecoveryFlow) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inRoot = segments.length === 0; // Estamos en la raíz '/'
    const isResetPage = segments.length > 1 && segments[1] === 'reset-password-change';

    // CASO 1: Usuario Logueado
    if (session && !isResetPage) {
      
      // A. Si no tiene perfil -> MANDAR A ONBOARDING
      // (Excepto si ya está ahí)
      if (!profile && !inOnboarding) {
        router.replace('/onboarding');
        return;
      }

      // B. Si tiene perfil Y está intentando entrar a Login o Raíz -> MANDAR A HOME
      if (profile && (inAuthGroup || inRoot)) {
        router.replace('/(tabs)/home');
        return;
      }
      
      // Nota: Si tiene perfil y está en onboarding (editando), lo dejamos estar ahí.
    } 
    
    // CASO 2: Usuario NO Logueado
    else if (!session && !inAuthGroup && !inOnboarding) {
      router.replace('/(auth)/login');
    }

  }, [session, profile, isReady, segments, isRecoveryFlow]);

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