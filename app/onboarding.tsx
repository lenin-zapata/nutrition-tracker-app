import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { calculateBMR, calculateTDEE, calculateDailyCalorieGoal, calculateMacroGoals, ActivityLevel, Goal } from '@/utils/calculations';

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

  const activityOptions: { value: ActivityLevel; label: string }[] = [
    { value: 'sedentary', label: 'Sedentario' },
    { value: 'light', label: 'Ligero' },
    { value: 'moderate', label: 'Moderado' },
    { value: 'active', label: 'Activo' },
    { value: 'very_active', label: 'Muy Activo' },
  ];

  const goalOptions: { value: Goal; label: string }[] = [
    { value: 'lose_weight', label: 'Perder Peso' },
    { value: 'maintain', label: 'Mantener' },
    { value: 'gain_muscle', label: 'Ganar Músculo' },
  ];

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseInt(height);

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
        goal: goal,
        bmr: bmr,
        tdee: tdee,
        daily_calorie_goal: dailyCalorieGoal,
        daily_protein_goal: macroGoals.protein,
        daily_carbs_goal: macroGoals.carbs,
        daily_fats_goal: macroGoals.fats,
      });

      Alert.alert('Éxito', 'Perfil configurado correctamente', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}>
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Configura tu Perfil</Text>
          <Text className="text-base text-gray-600">Necesitamos algunos datos para calcular tus metas</Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Género</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: isMale ? '#4F46E5' : '#D1D5DB',
                backgroundColor: isMale ? '#EEF2FF' : 'transparent',
              }}
              onPress={() => setIsMale(true)}
            >
              <Text style={{ textAlign: 'center', fontWeight: '500', color: isMale ? '#4F46E5' : '#4B5563' }}>
                Hombre
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: !isMale ? '#4F46E5' : '#D1D5DB',
                backgroundColor: !isMale ? '#EEF2FF' : 'transparent',
              }}
              onPress={() => setIsMale(false)}
            >
              <Text style={{ textAlign: 'center', fontWeight: '500', color: !isMale ? '#4F46E5' : '#4B5563' }}>
                Mujer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Edad</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
            }}
            placeholder="25"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Peso (kg)</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
            }}
            placeholder="70"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Altura (cm)</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
            }}
            placeholder="175"
            value={height}
            onChangeText={setHeight}
            keyboardType="number-pad"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Nivel de Actividad</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {activityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: activityLevel === option.value ? '#4F46E5' : '#D1D5DB',
                  backgroundColor: activityLevel === option.value ? '#EEF2FF' : 'transparent',
                }}
                onPress={() => setActivityLevel(option.value)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: activityLevel === option.value ? '#4F46E5' : '#4B5563',
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Objetivo</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {goalOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: goal === option.value ? '#4F46E5' : '#D1D5DB',
                  backgroundColor: goal === option.value ? '#EEF2FF' : 'transparent',
                }}
                onPress={() => setGoal(option.value)}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: goal === option.value ? '#4F46E5' : '#4B5563',
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#4F46E5',
            borderRadius: 8,
            paddingVertical: 16,
          }}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 18 }}>
            {loading ? 'Guardando...' : 'Continuar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

