import { useState } from 'react'
import {
    Button,
    Input,
    Label,
    Sheet,
    Text,
    TextArea,
    XStack,
    YStack,
} from 'tamagui'

export default function AddViewingSheet() {
  const [open, setOpen] = useState(false)
  const [dateViewed, setDateViewed] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = () => {
    console.log('Submit viewing:', { dateViewed, notes })
    // TODO: send to Supabase
    setOpen(false)
  }

  return (
    <>
      {/* Button to trigger sheet */}
      <Button onPress={() => setOpen(true)}>Add Viewing</Button>

      {/* Sheet */}
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[50]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame padding="$4" space="$4" backgroundColor="$background">
          <Sheet.Handle />

          <YStack space="$4">
            <Text fontSize="$6" fontWeight="bold">
              Add Viewing
            </Text>

            <YStack space="$2">
              <Label>Date Viewed</Label>
              <Input
                placeholder="YYYY-MM-DD"
                value={dateViewed}
                onChangeText={setDateViewed}
              />
            </YStack>

            <YStack space="$2">
              <Label>Notes</Label>
              <TextArea
                placeholder="What did you think?"
                value={notes}
                onChangeText={setNotes}
              />
            </YStack>

            <XStack space="$3" justifyContent="flex-end">
              <Button onPress={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onPress={handleSubmit}>Submit</Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
