import DisplayShows from '@/components/DisplayShows'
import { Link } from 'expo-router'
import { Text, YStack } from 'tamagui'

export default function Home() {
    return (
        <YStack         
        flex={1}
        gap="$2"
        margin="$3"
        padding="$2">
        <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>Welcome to</Text>
        <Text fontFamily="InstrumentSerif_400Regular" fontSize={50}>PocketPatron</Text>
        <Link href={"/profile"}>Profile</Link>
        <DisplayShows />
        </YStack>
    )
}