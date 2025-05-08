import { useAuth } from "@/components/ctx";
import RatingBadge from "@/components/RatingBadge";
import { Screen } from "@/components/Screen";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, XStack, YStack } from "tamagui";


type Show = {
    shows: {
        show_id: number
        title: string
        description: string
        season: number
        image_filename: string
    }
    score: number
    show_id: number
    title: string
    description: string
    season: number
    watched_at: Date
    image_filename: string
  }

export default function Profile() {
    const [shows, setShows] = useState<Show[]>([])
    const {session } = useAuth();
    const userID = session?.user.id

    useEffect(() => {
        const getData = async () => {
            const {data: shows} = await supabase.from("user_shows").select('*, shows(*)').eq('user_id', userID).order('score', {ascending: false});
            return shows
        }
        getData().then((data) => {
            if (data) {
                setShows(data);
            }
        });
    }, [userID]);

    // const toast = useToastController()
    // const { reason } = useLocalSearchParams()
  
    // useEffect(() => {
    //   // 🎯 Show toast if URL contains `reason`
    //   if (reason === 'not-enough-shows') {
    //     toast.show('You need at least two shows to start ranking.', {
    //       duration: 4000,
    //       variant: 'outline',
    //     })
    //   }
    // }, [reason])



    const maxScore = Math.max(...shows.map((show) => show.score));
    const normalizedShows = shows.map((show) => ({
        ...show,
        normalizedScore: Math.log(show.score + 1) / Math.log(maxScore + 1) * 10,
    }));

    return(
        <Screen>
        <ScrollView>
            <YStack width="100%" height="100%" padding={20} gap={20}>
                <Text fontSize={30} fontFamily="InstrumentSans_400Regular">Profile</Text>
                    {normalizedShows.length > 0 ? normalizedShows.map((show) => (
                        <XStack key={show.show_id} alignItems="center" justifyContent="center" gap={10}>
                            <Link href={`/shows/${show.show_id}`}>
                                <Image
                                source={require('@/assets/images/2025_Death_Becomes_Her.png')}
                                width={75}
                                height={115}
                                />
                            </Link>
                            <YStack flex={1} gap={5} padding={15}>
                                <Link href={`/shows/${show.show_id}`}>
                                    <Text fontSize={20} fontFamily={"InstrumentSans_400Regular"} fontWeight={700}>{show.shows.title}</Text>
                                </Link>
                                <Text opacity={0.5}>{show.shows.season}</Text>
                            </YStack>
                            <YStack alignItems="center" justifyContent="center" gap={5}>
                                <RatingBadge rating={show.normalizedScore} size = {60}/>
                                <Text fontSize={15} opacity={0.5}>{new Date(show.watched_at).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' })}</Text>
                            </YStack>
                        </XStack>
                    )): 
                    <Text fontSize={20} fontFamily="InstrumentSans_400Regular">No shows found</Text>}
            </YStack>
        </ScrollView>
        </Screen>
    )
}
