import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Receipts',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color as string} size={size} />,
        }}
      />
    </Tabs>
  );
}
