import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';

export default function Index() {
  const { user, initialized } = useAuthStore();
  const { profile, fetchProfile, loading: profileLoading } = useUserProfileStore();
  const [profileFetched, setProfileFetched] = useState(false);

  useEffect(() => {
    if (user && initialized && !profileFetched) {
      setProfileFetched(true);
      fetchProfile(user.id);
    }
  }, [user, initialized]);

  if (!initialized) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-4 text-gray-600">Cargando...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Si estamos cargando el perfil, mostrar loading
  if (profileLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-4 text-gray-600">Cargando perfil...</Text>
      </View>
    );
  }

  if (!profile || !profile.daily_calorie_goal) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)/home" />;
}

