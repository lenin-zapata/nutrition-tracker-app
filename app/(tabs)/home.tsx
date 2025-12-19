import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { useMealsStore } from '@/store/mealsStore';
import CircularProgress from '@/components/CircularProgress';
import MacroProgressBar from '@/components/MacroProgressBar';
import { Ionicons } from '@expo/vector-icons';

const MEAL_TYPES = {
  breakfast: { label: 'Desayuno', icon: 'sunny' },
  lunch: { label: 'Almuerzo', icon: 'restaurant' },
  dinner: { label: 'Cena', icon: 'moon' },
  snack: { label: 'Snack', icon: 'cafe' },
};

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { profile } = useUserProfileStore();
  const { meals, dailyTotals, fetchMeals, loading } = useMealsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user) {
      fetchMeals(user.id, today);
    }
  }, [user, today]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await fetchMeals(user.id, today);
    }
    setRefreshing(false);
  };

  const calorieGoal = profile?.daily_calorie_goal || 2000;
  const calorieProgress = calorieGoal > 0 ? (dailyTotals.calories / calorieGoal) * 100 : 0;

  const getMealsByType = (type: string) => {
    return meals.filter((meal) => meal.meal_type === type);
  };

  const getTotalCaloriesByType = (type: string) => {
    return getMealsByType(type).reduce((sum, meal) => sum + meal.calories, 0);
  };

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600">Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="px-6 pt-12 pb-8">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-1">Hoy</Text>
          <Text className="text-base text-gray-600">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Calorías principales */}
        <View className="bg-indigo-50 rounded-2xl p-6 mb-6 items-center">
          <Text className="text-sm font-medium text-indigo-700 mb-2">Calorías</Text>
          <CircularProgress
            size={150}
            strokeWidth={12}
            progress={calorieProgress}
            color="#4F46E5"
          />
          <View className="mt-4 items-center">
            <Text className="text-3xl font-bold text-gray-900">
              {Math.round(dailyTotals.calories)}
            </Text>
            <Text className="text-base text-gray-600">
              de {Math.round(calorieGoal)} kcal
            </Text>
          </View>
        </View>

        {/* Macronutrientes */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Macronutrientes</Text>
          <MacroProgressBar
            label="Proteínas"
            current={dailyTotals.protein}
            goal={profile.daily_protein_goal || 150}
            color="#10B981"
          />
          <MacroProgressBar
            label="Carbohidratos"
            current={dailyTotals.carbs}
            goal={profile.daily_carbs_goal || 200}
            color="#3B82F6"
          />
          <MacroProgressBar
            label="Grasas"
            current={dailyTotals.fats}
            goal={profile.daily_fats_goal || 65}
            color="#F59E0B"
          />
        </View>

        {/* Comidas del día */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">Comidas</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/add-food')}
              className="bg-indigo-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Agregar</Text>
            </TouchableOpacity>
          </View>

          {Object.entries(MEAL_TYPES).map(([type, { label, icon }]) => {
            const typeMeals = getMealsByType(type);
            const totalCalories = getTotalCaloriesByType(type);

            return (
              <TouchableOpacity
                key={type}
                className="bg-gray-50 rounded-xl p-4 mb-3"
                onPress={() => router.push(`/(tabs)/add-food?mealType=${type}`)}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <Ionicons name={icon as any} size={24} color="#4F46E5" />
                    <View className="ml-3 flex-1">
                      <Text className="text-base font-semibold text-gray-900">{label}</Text>
                      <Text className="text-sm text-gray-600">
                        {typeMeals.length} {typeMeals.length === 1 ? 'comida' : 'comidas'} •{' '}
                        {Math.round(totalCalories)} kcal
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>


      </View>
    </ScrollView>
  );
}

