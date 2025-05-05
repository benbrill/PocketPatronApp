import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Avatar, Button, Input, Text, XStack, YStack } from 'tamagui';


export default function CreateProfile() {
    const [fullName, setFullName] = useState('')
    const [username, setUsername] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [image, setImage] = useState<string | null>('http://picsum.photos/200/300');

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

    // async function getUserInfo() {
    //     const user = await supabase.auth.getUser();
    //     console.log(user.data.user?.email)
    // }
    // getUserInfo()

    async function handleSubmit() {
        let imageUrl = null;
        if (image) {
            const response = await fetch(image);
            const blob = await response.blob();
            const mimeType = blob.type || 'image/jpeg'; // fallback
            const fileExt = mimeType.split('/')[1]; // "jpeg", "png", etc.

            const fileName = `${username}-${Date.now()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, blob, {
                contentType: mimeType,
                upsert: true,
            });

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                return;
            }

            imageUrl = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName).data.publicUrl;

            console.log('Image uploaded successfully:', imageUrl);
        }
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        const {error: dbError } = await supabase.from('profiles').insert({
            user_id: userId,
            full_name: fullName,
            display_name: username,
            birthdate: birthdate,
            avatar_url: imageUrl
        })
        if (dbError) {
            console.error('Error inserting data:', dbError);
            return;
        } else {
            router.push('/home');
        }
    }



    return (
        <YStack flex={1} padding={20} gap="$2" justifyContent='center'>
            <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>Welcome to</Text>
            <Text fontFamily="InstrumentSerif_400Regular" fontSize={50} pb="$4">PocketPatron</Text>
            <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>Finish creating your profile</Text>
            <XStack justifyContent='space-around' gap="$2" alignItems='center' pb="$4">
            <YStack gap="$2">
                <Avatar circular size="$10">
                    <Avatar.Image
                    accessibilityLabel="Cam"
                    source={image ? { uri: image } : undefined}
                    />
                    <Avatar.Fallback backgroundColor="$yellow10" />
                </Avatar>
                <Button onPress={pickImage}>Upload Pic</Button>
            </YStack>
                <YStack gap="$2">
                    <Input 
                    placeholder="Full Name" 
                    onChangeText={(text) => setFullName(text)}
                    />
                    <Input 
                    placeholder="Username" 
                    onChangeText={(text) => setUsername(text)}
                    />
                    <Input 
                    placeholder="Birthdate (YYYY-MM-DD)"
                    onChangeText={(text) => setBirthdate(text)}
                    />
                </YStack>
            </XStack>
            <Button onPress={handleSubmit}>Submit</Button>
        </YStack>
    )
}