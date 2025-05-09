import { useAuth } from '@/components/ctx'
import { supabase } from '@/lib/supabase'
import { Redirect, Slot, Stack } from 'expo-router'
import { useEffect, useState } from 'react'

export default function ProtectedLayout() {
  const { session, loading: authLoading } = useAuth()
  const [profileCreated, setProfileCreated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkUserProfile = async () => {
      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (error || !profile) {
          setProfileCreated(false)
        } else {
          setProfileCreated(true)
        }
      }
    }

    checkUserProfile()
  }, [session])

  if (authLoading || profileCreated === null) return null
  if (!session) return <Redirect href="/?reason=timed-out" />
  if (!profileCreated) return <Redirect href="/create-profile" />

  return (
    <Stack>
      {/* Automatically adds back button if user navigates to shows/[show_id] */}
      <Stack.Screen
        name="shows/[show_id]"
        options={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          headerTitle: '',
        }}
      />
      {/* All other screens default to no header */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Slot />
    </Stack>
  )
}
