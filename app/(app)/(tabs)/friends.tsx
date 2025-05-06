import { Screen } from '@/components/Screen'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Text, View } from 'tamagui'

export default function Friends() {
    const [friends, setFriends] = useState<{ display_name: string; avatar_url: string }[] | null>(null)

    useEffect(() => {
        const getFriends = async () => {
            const { data, error } = await supabase 
            .from('profiles')
            .select('display_name, avatar_url')

            setFriends(data || [])
        }
        getFriends()
    }, [])
    console.log(friends)
    return (
        <Screen>
            <View flex={1} alignItems="center" justifyContent="center">
                <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>Friends</Text>
            </View>
        </Screen>
    )
}