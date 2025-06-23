import { supabase } from '@/lib/supabase'
import { useRouter } from 'expo-router'
import { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import { Modalize } from 'react-native-modalize'
import {
  Button,
  Form,
  Input,
  Label,
  Separator,
  Text,
  TextArea,
  useTheme,
  XStack,
  YStack
} from 'tamagui'

type FormValues = {
  watched_at: string
  notes: string
}

async function addShow({
  values,
  show_id,
}: {
  values: FormValues
  show_id: number | undefined
}) {
  const user = await supabase.auth.getUser()
  if (!user.data.user) {
    console.error('User not found')
    return
  }
  const new_data = {
    ...values,
    user_id: user.data.user.id,
    show_id: show_id,
  }
  const { data: shows, error: showError } = await supabase
    .from('user_shows')
    .upsert(new_data)
    .eq('user_id', user.data.user.id)

  if (showError) {
    console.error('Error adding show:', showError)
  } else {
    console.log('Show added:', shows)
  }
}

export default function AddViewingDrawer({
  show,
}: {
  show: {
    show_id: number
    title: string
    description: string
    season: number
    image_filename: string
  } | null
}) {
  const modalRef = useRef<Modalize>(null)
  const router = useRouter()
  const theme = useTheme()

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      watched_at: '',
      notes: '',
    },
  })

  const onSubmit = (values: FormValues) => {
    addShow({ values, show_id: show?.show_id })
    reset()
    modalRef.current?.close()
    router.push(`/comparison/${show?.show_id}`)
  }

  return (
    <>
      <Button onPress={() => modalRef.current?.open()}>Add Viewing</Button>

      <Modalize
        ref={modalRef}
        adjustToContentHeight
        handlePosition="inside"
        keyboardAvoidingBehavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
        }}
        modalStyle={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.background.val,
          width: '100%', // ✅ full device width
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'hidden',
        }}
      >
        <YStack space="$4" padding="$4">
          <Text
            fontSize="$6"
            fontWeight="bold"
            fontFamily="InstrumentSans_400Regular"
            color="$color"
          >
            Add &#39;{show?.title}&#39; Viewing
          </Text>

          <Form onSubmit={handleSubmit(onSubmit)} space="$4">
            {/* Date Input */}
            <YStack space="$2">
              <Label>Date Viewed</Label>
              <Controller
                control={control}
                name="watched_at"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="YYYY-MM-DD"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </YStack>

            {/* Notes Input */}
            <YStack space="$2">
              <Label>Notes</Label>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <TextArea
                    placeholder="What did you think?"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                )}
              />
            </YStack>

            <Separator />

            {/* Actions */}
            <XStack space="$3" justifyContent="flex-end">
              <Button
                onPress={() => {
                  modalRef.current?.close()
                  reset()
                }}
              >
                Cancel
              </Button>
              <Form.Trigger asChild>
                <Button>Submit</Button>
              </Form.Trigger>
            </XStack>
          </Form>
        </YStack>
      </Modalize>
    </>
  )
}
