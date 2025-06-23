import Auth from "@/components/Auth";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import 'react-native-gesture-handler';
// index.js or App.js
import { Text } from "tamagui";

export default function Home() {
  const params = useLocalSearchParams()
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>Welcome to</Text>
      <Text fontFamily="InstrumentSerif_400Regular" fontSize={50}>PocketPatron</Text>
      <Auth reason={params.reason}/>
    </View>
  );
}