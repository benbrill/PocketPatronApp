import RatingCircle from '@/components/RatingBadge'
import { Screen } from '@/components/Screen'
import { supabase } from '@/lib/supabase'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useEffect, useState } from 'react'
import { Image, Input, ScrollView, Separator, Text, View, XStack, YStack } from 'tamagui'

type UserShow = {
    show_id: number;
    shows: { title: string; image_filename: string };
    profiles: { display_name: string };
    last_updated_at: string;
    notes: string;
    score: number;
  };

  

export default function Friends() {
    const [friends, setFriends] = useState<{ display_name: string; avatar_url: string }[] | null>(null)
    const [userShows, setUserShows] = useState<UserShow[] | null>(null);

    useEffect(() => {
        const getFriends = async () => {
            const { data, error } = await supabase 
            .from('profiles')
            .select('display_name, avatar_url')
            setFriends(data || [])
        }
        const getUserShows = async() => {
            const { data, error } = await supabase
            .from('user_shows')
            .select(`
              show_id,
              last_updated_at,
              notes,
              score,
              shows (
                title,
                image_filename
              ),
              profiles (
                display_name
              )
              `)
              .order('last_updated_at', { ascending: false })
              .range(0,5) as unknown as { data: UserShow[]; error: any };
            
            if (error) {
                console.error('Error fetching user shows:', error)
            } else {
                // console.log('User shows:', data)
                setUserShows(data);
            }
        }
        getFriends()
        getUserShows()
    }, [])

    const dateDiff = (date: string) => {
        const now = new Date();
        const updatedAt = new Date(date);
        const diffInMs = now.getTime() - updatedAt.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInMonths / 12);

        if (diffInYears > 0) return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
        if (diffInMonths > 0) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
        if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    return (
        <Screen>
            <ScrollView>
            <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>Friends</Text>
            <Input placeholder='Search for fellow Patrons'/>
            <YStack gap="$2" padding={20} flex={1}>
                {userShows && userShows.length > 0 ? (
                    userShows.map((show, index) => (
                        <View key={index}>
                        <XStack gap="$2" alignItems="center" flex={1} padding={10}>
                            {show.shows.image_filename && <Image source={require('@/assets/images/2025_Death_Becomes_Her.png')} width={60} height={100}/>}
                            <YStack flex={1}>
                                <Text fontFamily="InstrumentSans_400Regular" fontSize={10}>{show.profiles.display_name} ranked</Text>
                                <Text fontFamily="InstrumentSans_700Bold" fontSize={20} maxWidth={250}>{show.shows.title}</Text>
                                <Text fontFamily="InstrumentSans_400Regular" fontSize={10}>
                                    {dateDiff(show.last_updated_at)}
                                </Text>
                                <Text fontFamily="InstrumentSans_400Regular" fontSize={10} maxWidth={250} opacity={0.5} paddingTop={10}> 
                                    {show.notes}
                                </Text>
                            </YStack>
                            <RatingCircle rating={show.score} size={50}/>
                        </XStack>
                        <Separator />
                        </View>
                    ))
                ) :(
                    <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>No shows found</Text>
                )}    
            </YStack>
            {friends && friends.length > 0 ? (
                <YStack gap="$2" padding={20} flex={1}>
                    {friends.map((friend, index) => (
                        <XStack key={index} gap="$2" alignItems="center">
                            {friend.avatar_url && <Image source={{uri: friend.avatar_url}} width={50} height={50} borderRadius={25} />}
                            <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>{friend.display_name}</Text>
                            <Ionicons name="chevron-forward" size={20} color="white" />
                            <Ionicons name="person-add-outline" size={24} color="white" />
                        </XStack>
                    ))}
                </YStack>
            ) : (
                <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>No friends found</Text>
            )}
            </ScrollView>
        </Screen>
    )
}