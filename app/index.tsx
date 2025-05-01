import Auth from "@/components/Auth";
import { View } from "react-native";
import { Text } from "tamagui";

export default function Home() {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text fontFamily="InstrumentSans_400Regular" fontSize={20}>Welcome to</Text>
      <Text fontFamily="InstrumentSerif_400Regular" fontSize={50}>PocketPatron</Text>
      <Auth />
    </View>
  );
}