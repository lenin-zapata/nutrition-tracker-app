import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; // ✅ Importar i18n

const TAB_BAR_CONFIG = {
  activeTintColor: '#4F46E5',
  inactiveTintColor: '#6B7280',
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
};

export default function TabsLayout() {
  const { t } = useTranslation(); // ✅ Hook de traducción

  // Definimos las tabs DENTRO del componente para usar t()
  const tabs = [
    {
      name: 'home',
      title: t('tabs.home'), // "Inicio" o "Home"
      icon: 'home',
    },
    {
      name: 'add-food',
      title: t('tabs.add'), // "Agregar" o "Add"
      icon: 'add-circle',
    },
    {
      name: 'profile',
      title: t('tabs.profile'), // "Perfil" o "Profile"
      icon: 'person',
    },
  ] as const;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TAB_BAR_CONFIG.activeTintColor,
        tabBarInactiveTintColor: TAB_BAR_CONFIG.inactiveTintColor,
        tabBarStyle: {
          borderTopWidth: TAB_BAR_CONFIG.borderTopWidth,
          borderTopColor: TAB_BAR_CONFIG.borderTopColor,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title, // Título traducido
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon as any} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}