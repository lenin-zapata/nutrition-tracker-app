import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { calculateBMR, calculateTDEE, calculateDailyCalorieGoal, calculateMacroGoals, ActivityLevel, Goal } from '@/utils/calculations';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons'; // 1. Importar Iconos

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingHorizontal: 24, paddingVertical: 32 },
  headerSection: { marginBottom: 24 },
  
  // 2. Nuevo estilo para el botón de regresar
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16, // Separación con el título
  },

  headerTitle: { fontSize: 30, fontWeight: '700', color: '#111827', marginBottom: 8 },
  headerSubtitle: { fontSize: 16, color: '#4B5563' },
  sectionContainer: { marginBottom: 16 },
  sectionLabelLarge: { marginBottom: 24 },
  sectionLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  buttonBase: { paddingVertical: 12, borderRadius: 8, borderWidth: 2, flex: 1 },
  buttonActive: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  buttonInactive: { borderColor: '#D1D5DB', backgroundColor: 'transparent' },
  buttonTextActive: { textAlign: 'center', fontWeight: '500', color: '#4F46E5' },
  buttonTextInactive: { textAlign: 'center', fontWeight: '500', color: '#4B5563' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
  optionButtonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 2 },
  optionButtonText: { fontSize: 14, fontWeight: '500' },
  submitButton: { backgroundColor: '#4F46E5', borderRadius: 8, paddingVertical: 16 },
  submitButtonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600', fontSize: 18 },
});

const ACTIVITY_VALUES: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
const GOAL_VALUES: Goal[] = ['lose_weight', 'maintain', 'gain_muscle'];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { createOrUpdateProfile, profile } = useUserProfileStore();
  
  const params = useLocalSearchParams();
  const isEditing = params.editing === 'true';

  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [isMale, setIsMale] = useState(true);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && profile) {
      setAge(profile.age?.toString() || '');
      setWeight(profile.weight_kg?.toString() || '');
      setHeight(profile.height_cm?.toString() || '');
      setActivityLevel(profile.activity_level || 'moderate');
      setGoal(profile.goal || 'maintain');
      // Si tuvieras género en BD: setIsMale(profile.gender === 'male');
    }
  }, [isEditing, profile]);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert(t('common.error'), t('onboarding.errorAuth'));
      return;
    }

    const ageNum = parseInt(age, 10);
    const weightNum = parseFloat(weight);
    const heightNum = parseInt(height, 10);

    if (!age || !weight || !height || ageNum <= 0 || weightNum <= 0 || heightNum <= 0) {
      Alert.alert(t('common.error'), t('onboarding.errorValidation'));
      return;
    }

    setLoading(true);

    try {
      const bmr = calculateBMR(weightNum, heightNum, ageNum, isMale);
      const tdee = calculateTDEE(bmr, activityLevel);
      const dailyCalorieGoal = calculateDailyCalorieGoal(tdee, goal);
      const macroGoals = calculateMacroGoals(dailyCalorieGoal, goal);

      await createOrUpdateProfile({
        id: user.id,
        email: user.email || null,
        age: ageNum,
        weight_kg: weightNum,
        height_cm: heightNum,
        activity_level: activityLevel,
        goal,
        bmr,
        tdee,
        daily_calorie_goal: dailyCalorieGoal,
        daily_protein_goal: macroGoals.protein,
        daily_carbs_goal: macroGoals.carbs,
        daily_fats_goal: macroGoals.fats,
      });

      Alert.alert(t('onboarding.successTitle'), t('onboarding.successMessage'), [
        { 
          text: 'OK', 
          onPress: () => {
            if (isEditing) {
              router.back();
            } else {
              router.replace('/(tabs)/home');
            }
          } 
        },
      ]);
    } catch {
      Alert.alert(t('common.error'), t('onboarding.errorSave'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          
          {/* 3. Botón condicional: SOLO si estamos editando */}
          {isEditing && (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
          )}

          <Text style={styles.headerTitle}>
            {isEditing ? t('onboarding.editTitle') : t('onboarding.title')}
          </Text>
          <Text style={styles.headerSubtitle}>{t('onboarding.subtitle')}</Text>
        </View>

        {/* GÉNERO */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{t('onboarding.gender')}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.buttonBase, isMale ? styles.buttonActive : styles.buttonInactive]}
              onPress={() => setIsMale(true)}
            >
              <Text style={isMale ? styles.buttonTextActive : styles.buttonTextInactive}>
                {t('onboarding.male')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonBase, !isMale ? styles.buttonActive : styles.buttonInactive]}
              onPress={() => setIsMale(false)}
            >
              <Text style={!isMale ? styles.buttonTextActive : styles.buttonTextInactive}>
                {t('onboarding.female')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* EDAD */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{t('onboarding.age')}</Text>
          <TextInput
            style={styles.input}
            placeholder="25"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />
        </View>

        {/* PESO */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{t('onboarding.weight')}</Text>
          <TextInput
            style={styles.input}
            placeholder="70"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
          />
        </View>

        {/* ALTURA */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{t('onboarding.height')}</Text>
          <TextInput
            style={styles.input}
            placeholder="175"
            value={height}
            onChangeText={setHeight}
            keyboardType="number-pad"
          />
        </View>

        {/* NIVEL DE ACTIVIDAD */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{t('onboarding.activityLevel')}</Text>
          <View style={styles.optionButtonRow}>
            {ACTIVITY_VALUES.map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.optionButton,
                  activityLevel === val ? styles.buttonActive : styles.buttonInactive,
                ]}
                onPress={() => setActivityLevel(val)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    activityLevel === val ? styles.buttonTextActive : styles.buttonTextInactive,
                  ]}
                >
                  {t(`onboarding.activities.${val}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* OBJETIVO */}
        <View style={styles.sectionLabelLarge}>
          <Text style={styles.sectionLabel}>{t('onboarding.goal')}</Text>
          <View style={styles.optionButtonRow}>
            {GOAL_VALUES.map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.optionButton,
                  goal === val ? styles.buttonActive : styles.buttonInactive,
                ]}
                onPress={() => setGoal(val)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    goal === val ? styles.buttonTextActive : styles.buttonTextInactive,
                  ]}
                >
                  {t(`onboarding.goals.${val}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitButtonText}>
            {loading 
              ? t('onboarding.saving') 
              : (isEditing ? t('onboarding.update') : t('onboarding.submit'))
            }
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}