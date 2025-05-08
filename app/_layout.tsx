import { AuthProvider } from "@/components/ctx";
import { InstrumentSans_400Regular, InstrumentSans_700Bold } from "@expo-google-fonts/instrument-sans";
import { InstrumentSerif_400Regular } from "@expo-google-fonts/instrument-serif";
import { TamaguiProvider } from "@tamagui/core";
// import { ToastProvider } from '@tamagui/toast';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { useEffect } from "react";
import { PortalProvider, YStack, } from "tamagui";
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

const queryClient = new QueryClient();

function RootLayoutNav() {
  // const colorScheme = useColorScheme();
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <PortalProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {/* <ToastProvider> */}
              <YStack f={1} bg = "#141414">
                <Slot /> 
              </YStack>
            {/* </ToastProvider> */}
          </QueryClientProvider>
        </AuthProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}