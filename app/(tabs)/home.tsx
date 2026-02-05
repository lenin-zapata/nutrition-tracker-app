import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { useMealsStore } from '@/store/mealsStore';
import CircularProgress from '@/components/CircularProgress';
import MacroProgressBar from '@/components/MacroProgressBar';

// ✅ Importar i18n
import { useTranslation } from 'react-i18next';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// ✅ Solo guardamos el icono aquí, la etiqueta (label) la traduciremos al vuelo
const MEAL_ICONS: Record<MealType, keyof typeof Ionicons.glyphMap> = {
  breakfast: 'sunny',
  lunch: 'restaurant',
  dinner: 'moon',
  snack: 'cafe',
};

export default function HomeScreen() {
  const { t, i18n } = useTranslation(); // ✅ Hook t y objeto i18n (para el idioma actual)
  
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useUserProfileStore();
  const { meals, dailyTotals, fetchMeals } = useMealsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const initData = async () => {
      if (!user) return;

      await fetchProfile(user.id);
      const currentProfile = useUserProfileStore.getState().profile;

      if (!currentProfile) {
        router.replace('/onboarding');
        return;
      }

      fetchMeals(user.id, today);
    };

    initData();
  }, [user, today]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await fetchProfile(user.id);
      const current = useUserProfileStore.getState().profile;
      if (current) {
        await fetchMeals(user.id, today);
      }
    }
    setRefreshing(false);
  };

  const calorieGoal = profile?.daily_calorie_goal || 2000;
  const calorieProgress = calorieGoal > 0 ? (dailyTotals.calories / calorieGoal) * 100 : 0;

  const getMealsByType = (type: MealType) => {
    return meals.filter((meal) => meal.meal_type === type);
  };

  const getTotalCaloriesByType = (type: MealType) => {
    return getMealsByType(type).reduce((sum, meal) => sum + meal.calories, 0);
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>{t('home.verifying')}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('home.title')}</Text>
          <Text style={styles.headerDate}>
            {/* ✅ Fecha formateada según el idioma actual */}
            {new Date().toLocaleDateString(i18n.language, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.caloriesCard}>
          <Text style={styles.cardLabel}>{t('home.calories')}</Text>
          <CircularProgress
            size={150}
            strokeWidth={12}
            progress={calorieProgress}
            color="#4F46E5"
          />
          <View style={styles.caloriesInfo}>
            <Text style={styles.caloriesValue}>
              {Math.round(dailyTotals.calories)}
            </Text>
            <Text style={styles.caloriesGoal}>
              {/* ✅ Traducción con interpolación de variable */}
              {t('home.ofTarget', { target: Math.round(calorieGoal) })}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.macros')}</Text>
          <MacroProgressBar
            label={t('home.proteins')}
            current={dailyTotals.protein}
            goal={profile.daily_protein_goal || 150}
            color="#10B981"
          />
          <MacroProgressBar
            label={t('home.carbs')}
            current={dailyTotals.carbs}
            goal={profile.daily_carbs_goal || 200}
            color="#3B82F6"
          />
          <MacroProgressBar
            label={t('home.fats')}
            current={dailyTotals.fats}
            goal={profile.daily_fats_goal || 65}
            color="#F59E0B"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.mealsTitle')}</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/add-food')}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>{t('home.add')}</Text>
            </TouchableOpacity>
          </View>

          {/* Iteramos sobre las claves de los iconos */}
          {(Object.keys(MEAL_ICONS) as MealType[]).map((type) => {
            const icon = MEAL_ICONS[type];
            const typeMeals = getMealsByType(type);
            const totalCalories = getTotalCaloriesByType(type);

            return (
              <TouchableOpacity
                key={type}
                style={styles.mealCard}
                onPress={() => router.push(`/meal-detail?mealType=${type}`)}
              >
                <View style={styles.mealCardContent}>
                  <View style={styles.mealCardLeft}>
                    <Ionicons name={icon} size={24} color="#4F46E5" />
                    <View style={styles.mealCardTextContainer}>
                      <Text style={styles.mealCardTitle}>
                         {/* ✅ Traducción dinámica del tipo de comida */}
                         {t(`home.mealTypes.${type}`)}
                      </Text>
                      <Text style={styles.mealCardSubtitle}>
                        {/* ✅ Pluralización automática: "1 comida" o "2 comidas" */}
                        {t('home.mealItems', { count: typeMeals.length })} •{' '}
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#4B5563',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 16,
    color: '#4B5563',
    textTransform: 'capitalize',
  },
  caloriesCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4338CA',
    marginBottom: 8,
  },
  caloriesInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  caloriesValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
  },
  caloriesGoal: {
    fontSize: 16,
    color: '#4B5563',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  mealCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  mealCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealCardTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  mealCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  mealCardSubtitle: {
    fontSize: 14,
    color: '#4B5563',
  },
});