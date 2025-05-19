import BroadwayShows from '@/components/BroadwayShows'
import { Screen } from '@/components/Screen'
import { ScrollView, Text, YStack } from 'tamagui'

export default function Home() {
    return (
        <Screen>
        <YStack         
        flex={1}
        gap="$2">
        <ScrollView>
        <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>Welcome to</Text>
        <Text fontFamily="InstrumentSerif_400Regular" fontSize={50}>PocketPatron</Text>
        <YStack flex={1} alignItems="center" justifyContent="center" gap="$2" margin="$3" padding="$2">
            {/* <Text>Welcome {userData.display_name}</Text> */}
            <Text>
                You&apos;ve watched shows!
            </Text>
        </YStack>
            <BroadwayShows />
            {/* <DisplayShows /> */}
        </ScrollView>
        </YStack>
        </Screen>
    )
}