import BroadwayShows from '@/components/BroadwayShows'
import { Screen } from '@/components/Screen'
import { FlatList } from 'react-native'
import { Text, YStack } from 'tamagui'

export default function Home() {
  return (
    <Screen>
      <YStack flex={1} gap="$2">
        <FlatList
          ListHeaderComponent={
            <>
              <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>Welcome to</Text>
              <Text fontFamily="InstrumentSerif_400Regular" fontSize={50}>PocketPatron</Text>
              <YStack
                flex={1}
                alignItems="center"
                justifyContent="center"
                gap="$2"
                margin="$3"
                padding="$2"
              >
                <Text>You&apos;ve watched shows!</Text>
              </YStack>
            </>
          }
          data={[{ key: 'broadway-shows' }]} // dummy data
          renderItem={() => <BroadwayShows />}
        />
      </YStack>
    </Screen>
  )
}
