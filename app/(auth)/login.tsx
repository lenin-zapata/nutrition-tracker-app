import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // ✅ Importamos los iconos
import { useAuthStore } from '@/store/authStore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupLast: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  // ✅ NUEVOS ESTILOS PARA EL CONTENEDOR DE PASSWORD
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  inputPassword: {
    flex: 1, // Toma todo el espacio disponible
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  // ----------------------------------------------
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#4f46e5',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  signupSection: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#4b5563',
  },
  signupLink: {
    color: '#4f46e5',
    fontWeight: '600',
  },
});

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // ✅ Estado para controlar la visibilidad (false = oculto por defecto)
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, loading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } else {
      // ✅ Redirección directa al Home para evitar pantalla blanca en raíz
      router.replace('/(tabs)/home');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroupLast}>
          <Text style={styles.label}>Contraseña</Text>
          
          {/* ✅ Contenedor especial con el icono */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword} // Si showPassword es true, NO es seguro (se ve)
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={24} 
                color="#6b7280" 
              />
            </TouchableOpacity>
          </View>

        </View>

        <TouchableOpacity 
          style={styles.forgotPasswordContainer}
          onPress={() => router.push('/forgot-password')}
          disabled={loading}
        >
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Text>
        </TouchableOpacity>

        <View style={styles.signupSection}>
          <Text style={styles.signupText}>¿No tienes cuenta? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Regístrate</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}