import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { Easing } from "react-native";

SplashScreen.preventAutoHideAsync();

function AppStack() {
  const { colors } = useTheme();
  
  return (
    <AuthProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: colors.Background1 },
          animation: 'fade',
        }} 
      />
    </AuthProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'FunnelDisplay-Light': require('../assets/fonts/FunnelDisplay-Light.ttf'),
    'FunnelDisplay-Regular': require('../assets/fonts/FunnelDisplay-Regular.ttf'),
    'FunnelDisplay-Medium': require('../assets/fonts/FunnelDisplay-Medium.ttf'),
    'FunnelDisplay-SemiBold': require('../assets/fonts/FunnelDisplay-SemiBold.ttf'),
    'FunnelDisplay-Bold': require('../assets/fonts/FunnelDisplay-Bold.ttf'),
    'FunnelDisplay-ExtraBold': require('../assets/fonts/FunnelDisplay-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppStack />
    </ThemeProvider>
  );
}
