import { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { profile, fetchProfile } = useUserProfileStore();

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user]);

  const handleSignOut = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600">Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-6">Perfil</Text>

        {/* Información del usuario */}
        <View className="bg-gray-50 rounded-xl p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Información Personal</Text>
          <View className="mb-3">
            <Text className="text-sm text-gray-600">Email</Text>
            <Text className="text-base font-medium text-gray-900">{user?.email}</Text>
          </View>
          {profile.age && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Edad</Text>
              <Text className="text-base font-medium text-gray-900">{profile.age} años</Text>
            </View>
          )}
          {profile.weight_kg && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Peso</Text>
              <Text className="text-base font-medium text-gray-900">{profile.weight_kg} kg</Text>
            </View>
          )}
          {profile.height_cm && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Altura</Text>
              <Text className="text-base font-medium text-gray-900">{profile.height_cm} cm</Text>
            </View>
          )}
        </View>

        {/* Metas */}
        <View className="bg-indigo-50 rounded-xl p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Metas Diarias</Text>
          {profile.daily_calorie_goal && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Calorías</Text>
              <Text className="text-base font-medium text-gray-900">
                {Math.round(profile.daily_calorie_goal)} kcal
              </Text>
            </View>
          )}
          {profile.daily_protein_goal && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Proteínas</Text>
              <Text className="text-base font-medium text-gray-900">
                {Math.round(profile.daily_protein_goal)}g
              </Text>
            </View>
          )}
          {profile.daily_carbs_goal && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Carbohidratos</Text>
              <Text className="text-base font-medium text-gray-900">
                {Math.round(profile.daily_carbs_goal)}g
              </Text>
            </View>
          )}
          {profile.daily_fats_goal && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Grasas</Text>
              <Text className="text-base font-medium text-gray-900">
                {Math.round(profile.daily_fats_goal)}g
              </Text>
            </View>
          )}
        </View>

        {/* Métricas calculadas */}
        {(profile.bmr || profile.tdee) && (
          <View className="bg-green-50 rounded-xl p-6 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Métricas</Text>
            {profile.bmr && (
              <View className="mb-3">
                <Text className="text-sm text-gray-600">BMR (Metabolismo Basal)</Text>
                <Text className="text-base font-medium text-gray-900">
                  {Math.round(profile.bmr)} kcal
                </Text>
              </View>
            )}
            {profile.tdee && (
              <View className="mb-3">
                <Text className="text-sm text-gray-600">TDEE (Gasto Calórico Total)</Text>
                <Text className="text-base font-medium text-gray-900">
                  {Math.round(profile.tdee)} kcal
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Opciones */}
        <TouchableOpacity
          className="bg-gray-50 rounded-xl p-4 mb-3 flex-row items-center"
          onPress={() => router.push('/onboarding')}
        >
          <Ionicons name="settings-outline" size={24} color="#4F46E5" />
          <Text className="ml-3 text-base font-medium text-gray-900">Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-auto" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-50 rounded-xl p-4 flex-row items-center"
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text className="ml-3 text-base font-medium text-red-600">Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

