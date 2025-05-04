import { useAuth } from '@/components/ctx'
import { Redirect, Slot } from 'expo-router'

export default function ProtectedLayout() {
  const { session, loading } = useAuth()

  if (loading) return null
  if (!session) return <Redirect href="/?reason=timed-out" />

  return <Slot />
}
