import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TAB_BAR_CONFIG = {
  activeTintColor: '#4F46E5',
  inactiveTintColor: '#6B7280',
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
};

const TABS = [
  {
    name: 'home',
    title: 'Inicio',
    icon: 'home',
  },
  {
    name: 'add-food',
    title: 'Agregar',
    icon: 'add-circle',
  },
  {
    name: 'profile',
    title: 'Perfil',
    icon: 'person',
  },
] as const;

export default function TabsLayout() {
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
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon as any} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
