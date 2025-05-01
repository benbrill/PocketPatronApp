import { InstrumentSans_400Regular, InstrumentSans_700Bold } from "@expo-google-fonts/instrument-sans";
import { InstrumentSerif_400Regular } from "@expo-google-fonts/instrument-serif";
import { TamaguiProvider } from "@tamagui/core";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { PortalProvider } from "tamagui";
import config from "../tamagui.config";

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_700Bold,
    InstrumentSerif_400Regular
  });

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  return (
    <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
      <PortalProvider>
        <Slot /> 
      </PortalProvider>
    </TamaguiProvider>
  );
}