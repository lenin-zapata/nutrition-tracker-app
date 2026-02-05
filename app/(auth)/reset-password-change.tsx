import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // ✅ Iconos
import { useAuthStore } from '@/store/authStore';

export default function ResetPasswordChangeScreen() {
  const router = useRouter();
  const { updatePassword } = useAuthStore();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // ✅ Estados independientes para cada campo
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!password || !confirmPassword) {
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

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('¡Éxito!', 'Tu contraseña ha sido actualizada.', [
        { 
          text: 'Ir al Inicio', 
          onPress: () => router.replace('/(tabs)/home') 
        }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
         headerShown: true, 
         title: 'Cambiar Contraseña',
         headerBackVisible: false 
      }} />

      <Text style={styles.title}>Nueva Contraseña</Text>
      <Text style={styles.subtitle}>Ingresa tu nueva contraseña para recuperar el acceso.</Text>

      {/* CAMPO 1: Nueva Contraseña */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nueva Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CAMPO 2: Confirmar Contraseña */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirmar Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Actualizar Contraseña</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#FFF' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32, textAlign: 'center' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  
  // ✅ ESTILOS PARA EL INPUT CON OJO (reutilizados)
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  inputPassword: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  // ------------------------------------

  button: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});