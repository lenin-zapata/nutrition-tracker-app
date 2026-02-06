import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native'; // ✅ 1. Importante para detectar Android

const TAB_BAR_CONFIG = {
  activeTintColor: '#4F46E5',
  inactiveTintColor: '#6B7280',
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
};

export default function TabsLayout() {
  const { t } = useTranslation();

  const tabs = [
    {
      name: 'home',
      title: t('tabs.home'),
      icon: 'home',
    },
    {
      name: 'add-food',
      title: t('tabs.add'),
      icon: 'add-circle',
    },
    {
      name: 'profile',
      title: t('tabs.profile'),
      icon: 'person',
    },
  ] as const;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TAB_BAR_CONFIG.activeTintColor,
        tabBarInactiveTintColor: TAB_BAR_CONFIG.inactiveTintColor,
        
        // ✅ 2. Aquí está la corrección visual
        tabBarStyle: {
          borderTopWidth: TAB_BAR_CONFIG.borderTopWidth,
          borderTopColor: TAB_BAR_CONFIG.borderTopColor,
          backgroundColor: '#FFFFFF', // Asegura fondo blanco
          
          // Altura: Android necesita menos (60), iOS necesita más por el Home Indicator (90)
          height: Platform.OS === 'android' ? 55 : 80, 
          
          // Padding inferior: Android poco (10), iOS mucho (30)
          paddingBottom: Platform.OS === 'android' ? 10 : 30,
          paddingTop: 5,
        },
        // Opcional: Ocultar el texto si quieres ganar más espacio, 
        // pero con las medidas de arriba se verá bien con texto.
        tabBarLabelStyle: {
           fontSize: 12,
           fontWeight: '500',
        }
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon as any} size={24} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}