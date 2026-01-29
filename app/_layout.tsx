import { useEffect } from 'react';
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

interface UrlParams {
  [key: string]: string;
}

function getParamsFromUrl(url: string): UrlParams {
  const params: UrlParams = {};
  const queryString = url.split('#')[1] || url.split('?')[1];
  
  if (!queryString) return params;
  
  queryString.split('&').forEach((param) => {
    const [key, value] = param.split('=');
    params[key] = decodeURIComponent(value);
  });
  
  return params;
}

export default function RootLayout() {
  const { session, initialize, initialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (!url || !url.includes('access_token') || !url.includes('refresh_token')) {
        return;
      }

      try {
        const params = getParamsFromUrl(url);
        if (params.access_token && params.refresh_token) {
          await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });
        }
      } catch (error) {
        console.error('Error processing deep link:', error);
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) =>
      handleDeepLink(url)
    );
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inRoot = segments.length === 0;

    if (session && (inAuthGroup || inRoot)) {
      router.replace('/(tabs)/home');
    } else if (!session && !inAuthGroup && segments[0] !== 'onboarding') {
      router.replace('/(auth)/login');
    }
  }, [session, initialized, segments, router]);

  if (!initialized) {
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
        </Stack>
      </View>
      <AdBanner />
    </View>
  );
}