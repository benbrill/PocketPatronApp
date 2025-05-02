import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Button,
    Form,
    Input,
    Label,
    Sheet,
    Text,
    TextArea,
    XStack,
    YStack,
} from 'tamagui';
  
type FormValues = {
watched_at: string;
notes: string;
};

async function addShow({ values, show_id }: { values: FormValues; show_id: number | undefined }) {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        console.error('User not found');
        return;
    }
    const new_data = {...values, user_id: user.data.user?.id, show_id: show_id};
    console.log('Adding show:', new_data);
    const { data: shows, error: showError } = await supabase.from('user_shows').upsert(new_data).eq('user_id', user);
    if (showError) {
        console.error('Error adding show:', showError);
    } else {
        console.log('Show added:', shows);
    }
}

export default function AddViewingSheet({
    show,
  }: {
    show: {
      show_id: number;
      title: string;
      description: string;
      season: number;
      image_filename: string;
    } | null;
  }) {
    const [open, setOpen] = useState(false);
  
    const {
      control,
      handleSubmit,
      reset,
    } = useForm<FormValues>({
      defaultValues: {
        watched_at: '',
        notes: '',
      },
    });
  
    const onSubmit = (values: FormValues) => {
      // TODO: send to Supabase
      addShow({ values, show_id: show?.show_id });
      reset();
      setOpen(false);
    };
  
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
              <Text fontSize="$6" fontWeight="bold" fontFamily="InstrumentSans_400Regular">
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
                      />
                    )}
                  />
                </YStack>
  
                {/* Actions */}
                <XStack space="$3" justifyContent="flex-end">
                  <Button onPress={() => setOpen(false)}>Cancel</Button>
                  <Form.Trigger asChild>
                    <Button>Submit</Button>
                  </Form.Trigger>
                </XStack>
              </Form>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </>
    );
  }
  