import { Tabs } from 'expo-router'
import { YStack } from 'tamagui'

export default function TabLayout() {
  return (
    <YStack f={1} bg="#141414">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#141414' }, // optional: match tab bar
        }}
      >
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </YStack>
  )
}
