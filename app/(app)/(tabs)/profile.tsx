import { useAuth } from "@/components/ctx";
import { Screen } from "@/components/Screen";
import ShowRankings from "@/components/ShowRankings";
import { useUserProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { Avatar, Button, ScrollView, Text, XStack, YStack } from "tamagui";



export default function Profile() {
    const { session } = useAuth();
    const userID = session?.user.id
    const {data: profile, isLoading, error} = useUserProfile(userID)


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




    return(
        <Screen>
        <ScrollView>
            <YStack width="100%" height="100%" padding={20} gap={20}>
                <XStack gap={10} alignItems="center" justifyContent="center">
                    <Avatar circular size="$10">
                        <Avatar.Image
                        accessibilityLabel="Cam"
                        source={ {uri: profile?.avatar_url || "https://example.com/default-avatar.png"}}
                        />
                        <Avatar.Fallback backgroundColor="$yellow10" />
                    </Avatar>   
                    <YStack flex={1} gap={5} padding={15}>
                        <Text fontSize={20} fontFamily={"InstrumentSans_400Regular"} fontWeight={700}>{profile?.display_name}</Text>
                        <Text fontSize={15} fontFamily={"InstrumentSans_400Regular"} fontWeight={400}>{profile?.full_name}</Text>
                        <Button
                            onPress={async () => {
                                await supabase.auth.signOut();
                            }}
                            backgroundColor="$red10"
                            color="white"
                            borderRadius={5}
                        >
                            Sign Out
                        </Button>
                    </YStack>
                </XStack>
                <ShowRankings />
            </YStack>
        </ScrollView>
        </Screen>
    )
}
