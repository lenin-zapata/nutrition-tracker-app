import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, signIn, loading } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const { error } = await signUp(email, password);
    if (error) {
      Alert.alert('Error', error.message || 'Error al registrar');
    } else {
      // Intentar iniciar sesión automáticamente para asegurar que exista una sesión
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        // Si no se puede iniciar sesión automáticamente, avisar y llevar al usuario al onboarding de todos modos
        Alert.alert('Éxito', 'Cuenta creada. Por favor verifica tu correo y luego inicia sesión.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') },
        ]);
        return;
      }

      Alert.alert('Éxito', 'Cuenta creada. Redirigiendo al onboarding...', [
        { text: 'OK', onPress: () => router.replace('/onboarding') },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-gray-900 mb-2">Crear Cuenta</Text>
          <Text className="text-lg text-gray-600">Regístrate para comenzar</Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Contraseña</Text>
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
          <Text className="text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</Text>
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
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-600">¿Ya tienes cuenta? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-indigo-600 font-semibold">Inicia Sesión</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

