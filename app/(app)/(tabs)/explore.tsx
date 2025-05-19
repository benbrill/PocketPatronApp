import DisplayShows from '@/components/DisplayShows';
import { Screen } from '@/components/Screen';
import { View } from 'tamagui';

export default function Explore() {
    return (
        <Screen>
            <View flex={1} justifyContent='center' alignItems='center'>
                <DisplayShows/>
            </View>
        </Screen>
    )
}