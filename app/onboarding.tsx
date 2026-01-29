import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { calculateBMR, calculateTDEE, calculateDailyCalorieGoal, calculateMacroGoals, ActivityLevel, Goal } from '@/utils/calculations';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerSection: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#4B5563',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionLabelLarge: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonBase: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  buttonActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  buttonInactive: {
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },
  buttonTextActive: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#4F46E5',
  },
  buttonTextInactive: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#4B5563',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  optionButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
});

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentario' },
  { value: 'light', label: 'Ligero' },
  { value: 'moderate', label: 'Moderado' },
  { value: 'active', label: 'Activo' },
  { value: 'very_active', label: 'Muy Activo' },
];

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: 'lose_weight', label: 'Perder Peso' },
  { value: 'maintain', label: 'Mantener' },
  { value: 'gain_muscle', label: 'Ganar Músculo' },
];

export default function OnboardingScreen() {
  const { user } = useAuthStore();
  const { createOrUpdateProfile } = useUserProfileStore();

  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [isMale, setIsMale] = useState(true);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    const ageNum = parseInt(age, 10);
    const weightNum = parseFloat(weight);
    const heightNum = parseInt(height, 10);

    if (!age || !weight || !height || ageNum <= 0 || weightNum <= 0 || heightNum <= 0) {
      Alert.alert('Error', 'Por favor completa todos los campos correctamente');
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

      Alert.alert('Éxito', 'Perfil configurado correctamente', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
      ]);
    } catch {
      Alert.alert('Error', 'Error al guardar el perfil');
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
          <Text style={styles.headerTitle}>Configura tu Perfil</Text>
          <Text style={styles.headerSubtitle}>Necesitamos algunos datos para calcular tus metas</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Género</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.buttonBase, isMale ? styles.buttonActive : styles.buttonInactive]}
              onPress={() => setIsMale(true)}
            >
              <Text style={isMale ? styles.buttonTextActive : styles.buttonTextInactive}>Hombre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonBase, !isMale ? styles.buttonActive : styles.buttonInactive]}
              onPress={() => setIsMale(false)}
            >
              <Text style={!isMale ? styles.buttonTextActive : styles.buttonTextInactive}>Mujer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Edad</Text>
          <TextInput
            style={styles.input}
            placeholder="25"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="70"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="175"
            value={height}
            onChangeText={setHeight}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Nivel de Actividad</Text>
          <View style={styles.optionButtonRow}>
            {ACTIVITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  activityLevel === option.value ? styles.buttonActive : styles.buttonInactive,
                ]}
                onPress={() => setActivityLevel(option.value)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    activityLevel === option.value ? styles.buttonTextActive : styles.buttonTextInactive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionLabelLarge}>
          <Text style={styles.sectionLabel}>Objetivo</Text>
          <View style={styles.optionButtonRow}>
            {GOAL_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  goal === option.value ? styles.buttonActive : styles.buttonInactive,
                ]}
                onPress={() => setGoal(option.value)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    goal === option.value ? styles.buttonTextActive : styles.buttonTextInactive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitButtonText}>{loading ? 'Guardando...' : 'Continuar'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
