import { useAuth } from '@/components/ctx';
import RatingCircle from '@/components/RatingBadge';
import { Screen } from '@/components/Screen';
import AddViewingSheet from '@/components/ShowDetails';
import { supabase } from '@/lib/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, XStack, YStack } from 'tamagui';


export default function ShowDetails() {
    const [show, setShow] = useState<{ show_id: number; title: string; description: string, season: number, image_filename: string } | null>(null);
    const [userShow, setUserShow] = useState<{ show_id: number; watched_at: Date, score: number, notes: string } | null>(null);
    const [communityAverage, setCommunityAverage] = useState<number>(0);
    const { show_id } = useLocalSearchParams();
    const router = useRouter();
    const { session } = useAuth();
    const userID = session?.user.id;


    async function fetchShowDetails(show_id: number) {
        const { data, error } = await supabase.from('shows').select('*').eq('show_id', show_id).single();
        if (error) {
            console.error('Error fetching show details:', error);
        } else {
            setShow(data || null);
        }
    }

    async function getUserShowDetails(show_id: number) {
        try {
            const { data, error } = await supabase.from('user_shows').select('*').eq('show_id', show_id).eq('user_id', userID).single();
            setUserShow(data || null);
        }
        catch (error) {
            
        }

        try {
            const { data: communityData, error: communityError } = await supabase
                .from('user_shows')
                .select('score')
                .eq('show_id', show_id);
            if (communityData) {
                const scores = communityData.map((entry) => entry.score);
                const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
                setCommunityAverage(averageScore);
            } 
        }
        catch (error) {
        }

    }
    useEffect(() => {
        if (show_id) {
            fetchShowDetails(Number(show_id));
            getUserShowDetails(Number(show_id));
        }
    }, []);
    console.log(communityAverage)
    return (
        <Screen>
        <YStack flex={1} alignItems="center" justifyContent="center" gap="$2" margin="$3" padding="$2">
            <XStack gap={"$2"} margin={"$2"}>
                <Image
                    source={{
                        uri: `https://vygupxxkyumsyvqotetf.supabase.co/storage/v1/object/public/pocket-patron-covers/covers/${show?.image_filename.slice(5,)}`,
                        
                    }}
                    // source={require('@/assets/images/2025_Death_Becomes_Her.png')}
                    width={150}
                    height={250}
                />
                <YStack maxWidth={"60%"}>
                    <Text fontFamily="InstrumentSans_700Bold" fontSize={30}>{show?.title}</Text>
                    <Text fontFamily="InstrumentSans_400Regular" fontSize={20} opacity={0.5}>{show?.season}</Text>
                    {/* <Button onPress={() => router.push(`/comparison/${show_id}`)}>Compare</Button> */} 
                    <XStack gap="$2" padding="$2" alignItems="center" justifyContent="center">
                        {userShow ? (
                        <YStack gap="$1" padding="$2" alignItems="center" justifyContent="center" width={"33%"}>
                            <RatingCircle rating = {userShow.score} size = {45} fontSize = {15} strokeWidthInput={5}/>
                            <Text fontFamily="InstrumentSans_400Regular" fontSize={15} textAlign='center'>You</Text>
                        </YStack>
                        ) : (
                            <YStack gap="$1" padding="$2" alignItems="center" justifyContent="center" width={"33%"}>
                            <Text fontFamily="InstrumentSans_400Regular" fontSize={15} textAlign='center'></Text>
                        </YStack>
                        )}
                        {communityAverage === 0 ? (
                        <>
                        <YStack gap="$1" padding="$2" alignItems="center" justifyContent="center" width={"33%"}>
                            <RatingCircle rating = {communityAverage} size = {45} fontSize = {15} strokeWidthInput={5}/>
                            <Text fontFamily="InstrumentSans_400Regular" fontSize={15} textAlign='center'>Community</Text>
                        </YStack>
                        <YStack gap="$1" padding="$2" alignItems="center" justifyContent="center" width={"33%"}>
                            <RatingCircle rating = {communityAverage} size = {45} fontSize = {15} strokeWidthInput={5}/>
                            <Text fontFamily="InstrumentSans_400Regular" fontSize={15} textAlign='center'>Friends</Text>
                        </YStack>
                        </>
                        ) : <></>
                        }
                    </XStack>
                    <YStack borderTopColor={"white"} borderTopWidth={1} alignItems="center" justifyContent="center" width={"100%"}>
                        <XStack gap="$2" padding="$2" alignItems="center" justifyContent="center">
                            <Text fontFamily="InstrumentSans_400Regular" fontSize={15} >Show Viewings</Text>
                            <Ionicons name="chevron-forward" size={20} color="white" />
                        </XStack>
                    </YStack>
                </YStack>
            </XStack>
            <AddViewingSheet show={show}/>
            <ScrollView>
                <Text fontFamily="InstrumentSans_400Regular" fontSize={15} padding="$2">
                    {show?.description}
                </Text>
            </ScrollView>
        </YStack>
        </Screen>
    );
}