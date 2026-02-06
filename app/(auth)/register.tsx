import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from 'react-i18next'; // ✅ 1. Importar hook

export default function RegisterScreen() {
  const { t } = useTranslation(); // ✅ 2. Inicializar hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, signIn, loading } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert(t('register.errors.title'), t('register.errors.missingFields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('register.errors.title'), t('register.errors.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t('register.errors.title'), t('register.errors.passwordLength'));
      return;
    }

    const { error } = await signUp(email, password);
    
    if (error) {
      Alert.alert(t('register.errors.title'), error.message || t('register.errors.generic'));
    } else {
      // Intentar iniciar sesión automáticamente
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        Alert.alert(
          t('register.success.title'), 
          t('register.success.verifyEmail'), 
          [{ text: t('register.success.ok'), onPress: () => router.replace('/(auth)/login') }]
        );
        return;
      }

      Alert.alert(
        t('register.success.title'), 
        t('register.success.onboarding'), 
        [{ text: t('register.success.ok'), onPress: () => router.replace('/onboarding') }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          {/* ✅ Títulos traducidos */}
          <Text className="text-4xl font-bold text-gray-900 mb-2">
            {t('register.title')}
          </Text>
          <Text className="text-lg text-gray-600">
            {t('register.subtitle')}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            {t('register.emailLabel')}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder={t('register.emailPlaceholder')} // ✅ Placeholder traducido
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            {t('register.passwordLabel')}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            {t('register.confirmPasswordLabel')}
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          className="bg-indigo-600 rounded-lg py-4 mb-4"
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? t('register.loading') : t('register.submit')}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-600">
            {t('register.haveAccount')}
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-indigo-600 font-semibold">
                {t('register.loginLink')}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}