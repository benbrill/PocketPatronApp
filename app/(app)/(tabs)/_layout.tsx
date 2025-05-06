
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { YStack } from 'tamagui';

export default function TabLayout() {
  
  return (
    <YStack f={1} bg="#141414">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2f8a44',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { backgroundColor: '#141414',
            height: 60,
            borderTopWidth: 0,
           }, // optional: match tab bar
        }}
      >
        <Tabs.Screen name="home" options={{ title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color="white" /> }} />
        <Tabs.Screen name="friends" options={{ title: 'Community', 
          tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color="white" /> }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={24} color="white" /> }} />
      </Tabs>
    </YStack>
  )
}