import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { AdBanner } from '@/components/AdBanner';
import { supabase } from '@/services/supabase';
import '@/lang/i18n';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});

export default function RootLayout() {
  const { session, initialize: initializeAuth } = useAuthStore();
  const { fetchProfile, profile } = useUserProfileStore();
  
  const segments = useSegments() as string[];
  const router = useRouter();
  
  // Usamos tus variables de estado
  const [isReady, setIsReady] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  // 1. INICIALIZACIÓN DE LA APP (Tu código original, está perfecto)
  useEffect(() => {
    let mounted = true;

    const startApp = async () => {
      try {
        await initializeAuth();
        
        const currentSession = useAuthStore.getState().session;
        if (currentSession?.user) {
          setIsCheckingProfile(true);
          await fetchProfile(currentSession.user.id);
          setIsCheckingProfile(false);
        }
      } catch (e) {
        console.error("Error inicializando:", e);
      } finally {
        if (mounted) setIsReady(true);
      }
    };

    startApp();
    return () => { mounted = false; };
  }, []);

  // 2. EL PORTERO (Lógica de Navegación) - ESTO ES LO QUE FALTABA
  useEffect(() => {
    // Si no estamos listos o estamos cargando perfil, no hacemos nada aún
    if (!isReady || isCheckingProfile) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    // CASO A: NO LOGUEADO
    if (!session) {
      // Si no tiene sesión y no está en login, mandar a Login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
      return;
    }

    // CASO B: LOGUEADO
    if (session) {
      if (profile) {
        // ✅ TIENE PERFIL (Usuario registrado)
        
        // ⚠️ LA CORRECCIÓN CLAVE:
        // Solo lo mandamos al Home si está en Login o en la pantalla de carga (root).
        // Si está en 'onboarding' (editando perfil), NO hacemos nada (lo dejamos ahí).
        if (inAuthGroup || segments.length === 0) {
          router.replace('/(tabs)/home');
        }
      } else {
        // ❌ NO TIENE PERFIL (Usuario nuevo)
        // Debe ir obligatoriamente a Onboarding
        if (!inOnboarding) {
          router.replace('/onboarding');
        }
      }
    }
  }, [isReady, isCheckingProfile, session, profile, segments]);

  
  // Pantalla de Carga (Splash)
  if (!isReady || isCheckingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="index" />
        <Stack.Screen name="meal-detail" />
      </Stack>
      <AdBanner /> 
    </View>
  );
}