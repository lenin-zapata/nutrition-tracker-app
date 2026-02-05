import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      
      Alert.alert(
        'Correo enviado', 
        'Revisa tu bandeja de entrada. Hemos enviado un enlace para restablecer tu contraseña.',
        [{ text: 'Volver al Login', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón Atrás */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-open-outline" size={48} color="#4F46E5" />
        </View>

        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa tu correo y te enviaremos las instrucciones para restablecerla.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="ejemplo@correo.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.resetButtonText}>Enviar Instrucciones</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  backButton: { marginTop: 50, marginLeft: 20, width: 40 },
  content: { flex: 1, padding: 24, justifyContent: 'center' }, // Centrado verticalmente
  
  iconContainer: {
    alignSelf: 'center',
    backgroundColor: '#EEF2FF',
    padding: 20,
    borderRadius: 50,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#111827' },
  
  resetButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  resetButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});