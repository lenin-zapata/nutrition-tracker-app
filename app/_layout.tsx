import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native'; // ✅ Agregado Platform
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { AdBanner } from '@/components/AdBanner';
import { supabase } from '@/services/supabase';
import '@/lang/i18n';

// ✅ 1. Importar la librería de actualizaciones
import SpInAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});

export default function RootLayout() {
  const { session, initialize: initializeAuth } = useAuthStore();
  const { fetchProfile, profile } = useUserProfileStore();
  
  const segments = useSegments() as string[];
  const router = useRouter();
  
  const [isReady, setIsReady] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  // 1. INICIALIZACIÓN DE LA APP (Auth + Perfil)
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

  // ✅ 2. VERIFICACIÓN DE ACTUALIZACIONES (NUEVO)
  useEffect(() => {
    // Solo ejecutamos esto en Android real
    if (Platform.OS !== 'android') return;

    const checkForUpdates = async () => {
      const inAppUpdates = new SpInAppUpdates(
        false // debug: false para producción
      );

      try {
        // Verifica con la Play Store
        const result = await inAppUpdates.checkNeedsUpdate();
        
        if (result.shouldUpdate) {
          console.log("🚀 Actualización encontrada, forzando pantalla...");
          // Lanza la pantalla de actualización OBLIGATORIA (IMMEDIATE)
          await inAppUpdates.startUpdate({
            updateType: IAUUpdateKind.FLEXIBLE, 
          });
        }
      } catch (error) {
        // Es normal que falle en desarrollo si la versión no coincide con la tienda
        console.log("⚠️ Error verificando updates (ignorar en dev):", error);
      }
    };

    checkForUpdates();
  }, []);

  // 3. EL PORTERO (Lógica de Navegación)
  useEffect(() => {
    if (!isReady || isCheckingProfile) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    // CASO A: NO LOGUEADO
    if (!session) {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
      return;
    }

    // CASO B: LOGUEADO
    if (session) {
      if (profile) {
        // ✅ TIENE PERFIL
        // Solo redirigir a Home si está en Login o Splash, permitir Onboarding para editar
        if (inAuthGroup || segments.length === 0) {
          router.replace('/(tabs)/home');
        }
      } else {
        // ❌ NO TIENE PERFIL -> Obligatorio Onboarding
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