import DisplayShows from '@/components/DisplayShows'
import { Screen } from '@/components/Screen'
import { Link } from 'expo-router'
import { Text, YStack } from 'tamagui'

export default function Home() {
    return (
        <Screen>
        <YStack         
        flex={1}
        gap="$2">
        <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>Welcome to</Text>
        <Text fontFamily="InstrumentSerif_400Regular" fontSize={50}>PocketPatron</Text>
        <Link href={"/profile"}>Profile</Link>
        <DisplayShows />
        </YStack>
        </Screen>
    )
}