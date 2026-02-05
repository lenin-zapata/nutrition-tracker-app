import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentWrapper: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  headerSection: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#4b5563' },
  inputGroup: { marginBottom: 16 },
  inputGroupLast: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, backgroundColor: '#fff' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, backgroundColor: '#fff' },
  inputPassword: { flex: 1, paddingVertical: 12, fontSize: 16 },
  eyeIcon: { marginLeft: 8 },
  forgotPasswordContainer: { alignItems: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { color: '#4f46e5', fontWeight: '600', fontSize: 14 },
  loginButton: { backgroundColor: '#4f46e5', borderRadius: 8, paddingVertical: 16, marginBottom: 16 },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 18 },
  signupSection: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { color: '#4b5563' },
  signupLink: { color: '#4f46e5', fontWeight: '600' },
});

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading } = useAuthStore();
  
  // 2. Inicializar el hook 't' (translate)
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      // Usamos t() para traducir los errores también
      Alert.alert(t('common.error'), t('auth.errorMissingFields'));
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      Alert.alert(t('common.error'), error.message || t('common.error'));
    } else {
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
          {/* 3. Reemplazar textos fijos por t('clave') */}
          <Text style={styles.title}>{t('auth.welcome')}</Text>
          <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('auth.email')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('auth.placeholderEmail')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroupLast}>
          <Text style={styles.label}>{t('auth.password')}</Text>
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
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
          <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? t('auth.loggingIn') : t('auth.loginButton')}
          </Text>
        </TouchableOpacity>

        <View style={styles.signupSection}>
          <Text style={styles.signupText}>{t('auth.noAccount')} </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.signupLink}>{t('auth.register')}</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}