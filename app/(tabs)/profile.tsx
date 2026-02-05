import { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; // ✅ Importar i18n

export default function ProfileScreen() {
  const { t } = useTranslation(); // ✅ Hook de traducción
  const { user, signOut } = useAuthStore();
  const { profile, fetchProfile } = useUserProfileStore();

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user]);

  const handleSignOut = async () => {
    Alert.alert(
      t('profile.logoutAlert.title'),
      t('profile.logoutAlert.message'),
      [
        { text: t('profile.logoutAlert.cancel'), style: 'cancel' },
        {
          text: t('profile.logoutAlert.confirm'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>{t('profile.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.screenTitle}>{t('profile.title')}</Text>

        {/* Información del usuario */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('profile.personalInfo')}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('profile.email')}</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>
          
          {profile.age && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('profile.age')}</Text>
              <Text style={styles.value}>{profile.age} {t('profile.years')}</Text>
            </View>
          )}
          
          {profile.weight_kg && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('profile.weight')}</Text>
              <Text style={styles.value}>{profile.weight_kg} kg</Text>
            </View>
          )}
          
          {profile.height_cm && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('profile.height')}</Text>
              <Text style={styles.value}>{profile.height_cm} cm</Text>
            </View>
          )}
        </View>

        {/* Metas */}
        <View style={[styles.card, styles.cardBlue]}>
          <Text style={styles.cardTitle}>{t('profile.dailyGoals')}</Text>
          
          {profile.daily_calorie_goal && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('profile.calories')}</Text>
              <Text style={styles.value}>
                {Math.round(profile.daily_calorie_goal)} kcal
              </Text>
            </View>
          )}
          
          {profile.daily_protein_goal && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('profile.protein')}</Text>
              <Text style={styles.value}>
                {Math.round(profile.daily_protein_goal)}g
              </Text>
            </View>
          )}
          
          {profile.daily_carbs_goal && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('profile.carbs')}</Text>
              <Text style={styles.value}>
                {Math.round(profile.daily_carbs_goal)}g
              </Text>
            </View>
          )}
          
          {profile.daily_fats_goal && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>{t('profile.fats')}</Text>
              <Text style={styles.value}>
                {Math.round(profile.daily_fats_goal)}g
              </Text>
            </View>
          )}
        </View>

        {/* Métricas calculadas */}
        {(profile.bmr || profile.tdee) && (
          <View style={[styles.card, styles.cardGreen]}>
            <Text style={styles.cardTitle}>{t('profile.metrics')}</Text>
            
            {profile.bmr && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>{t('profile.bmr')}</Text>
                <Text style={styles.value}>
                  {Math.round(profile.bmr)} kcal
                </Text>
              </View>
            )}
            
            {profile.tdee && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>{t('profile.tdee')}</Text>
                <Text style={styles.value}>
                  {Math.round(profile.tdee)} kcal
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Opciones */}
        <TouchableOpacity
          style={styles.actionButton}
          // ENVIAMOS EL PARÁMETRO editing=true
          onPress={() => router.push('/onboarding?editing=true')}
        >
          <Ionicons name="settings-outline" size={24} color="#4F46E5" />
          <Text style={styles.actionButtonText}>{t('profile.editProfile')}</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" style={styles.chevron} />
        </TouchableOpacity>
       

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={[styles.actionButtonText, styles.logoutText]}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#4B5563',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#F9FAFB', // gray-50
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  cardBlue: {
    backgroundColor: '#EEF2FF', // indigo-50
  },
  cardGreen: {
    backgroundColor: '#ECFDF5', // green-50
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  actionButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  chevron: {
    marginLeft: 'auto',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2', // red-50
  },
  logoutText: {
    color: '#EF4444',
  },
});