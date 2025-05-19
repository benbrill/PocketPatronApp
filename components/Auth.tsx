import * as AuthSession from 'expo-auth-session'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, AppState, Image, StyleSheet } from 'react-native'
import { Button, Input, Text, XStack, YStack } from 'tamagui'
import { supabase } from '../lib/supabase'

// Start Supabase session auto-refresh
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth({ reason }: { reason: string | string[] }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'pocketpatron', // Match app.json
  })

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) router.push('/home')
    }
    checkSession()
  }, [])

  async function signInWithEmail() {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setError(error?.message || '')

    if (data.session) router.push('/home')
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else {
      Alert.alert('Please check your inbox for email verification.')
    }

    setLoading(false)
  }

  async function signInWithGoogle() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <YStack width={300} minHeight={250} overflow="hidden" gap="$2" margin="$3" padding="$2">
      <Input
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />

      <Input
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize="none"
      />

      {error ? <Text color="red">{error}</Text> : null}
      {reason ? <Text color="red">{reason}</Text> : null}

      <Button disabled={loading} onPress={signInWithEmail}>
        Sign In
      </Button>
      <Button disabled={loading} onPress={signUpWithEmail}>
        Sign Up
      </Button>

      <XStack mt="$2" gap="$2" alignItems="center" justifyContent="center">
        <Button
          theme="blue"
          disabled={loading}
          onPress={signInWithGoogle}
          icon={
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png' }}
              style={{ width: 18, height: 18 }}
            />
          }
        >
          Continue with Google
        </Button>
      </XStack>
    </YStack>
  )
}

const styles = StyleSheet.create({
  verticallySpaced: {
    paddingVertical: 8,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})
