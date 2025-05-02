import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Separator, Text, XStack, YStack } from "tamagui";


export default function ShowComparison() {
    const [userShows, setUserShows] = useState<{ show_id: number; title: string; description: string, season: number, image_filename: string }[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchUserShows() {
        const user = await supabase.auth.getUser();
        console.log(user)
        if (!user.data.user) {
            console.error('User not found');
            return;
        }
        const { data: shows, error: showError } = await supabase.from('user_shows').select('*').eq('user_id', user.data.user?.id);
        if (showError) {
            console.error('Error fetching shows:', showError);
        } else {
            setUserShows(shows || []);
        }
        setLoading(false);
    }

    if (loading) {
        fetchUserShows();
    }

    console.log(userShows)

    return (
        <YStack flex={1} alignItems="center" justifyContent="center">
            <XStack width={"100%"} height={50} alignItems="center" justifyContent="center" gap="$1" padding="$4">
                <Separator borderColor="white" borderWidth={1}/>
                <Text fontFamily="InstrumentSerif_400Regular" fontSize={30} padding={10}>vs</Text>
                <Separator borderColor="white" borderWidth={1}/>
            </XStack>
        </YStack>
    )
}