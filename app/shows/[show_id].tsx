import AddViewingSheet from '@/components/ShowDetails';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Image, ScrollView, Text, XStack, YStack } from 'tamagui';

export default function ShowDetails() {
    const [show, setShow] = useState<{ show_id: number; title: string; description: string, season: number, image_filename: string } | null>(null);
    const { show_id } = useLocalSearchParams();


    async function fetchShowDetails(show_id: number) {
        const { data, error } = await supabase.from('shows').select('*').eq('show_id', show_id).single();
        if (error) {
            console.error('Error fetching show details:', error);
        } else {
            setShow(data || null);
        }
    }
    useEffect(() => {
        if (show_id) {
            fetchShowDetails(Number(show_id));
        }
    }, []);

    return (
        <YStack flex={1} alignItems="center" justifyContent="center" gap="$2" margin="$3" padding="$2">
            <XStack gap={"$2"}>
                <Image
                    source={{
                        uri: `https://vygupxxkyumsyvqotetf.supabase.co/storage/v1/object/public/pocket-patron-covers/covers/${show?.image_filename.slice(5,)}`,
                    }}
                    width={200}
                    height={300}
                />
                <YStack>
                    <Text fontFamily="InstrumentSerif_400Regular" fontSize={50}>{show?.title}</Text>
                    <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>{show?.season}</Text>
                    <Button>Add Viewing</Button>
                </YStack>
            </XStack>
            <ScrollView>
                <AddViewingSheet />
                <Text>
                    {show?.description}
                </Text>
            </ScrollView>
        </YStack>
    );
}