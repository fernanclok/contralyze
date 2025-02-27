import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from './AuthProvider';
import { UserProvider } from './userContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import FlashMessage from 'react-native-flash-message';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UserProvider>
          <AuthProvider>
            <Stack> 
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="profile/budgets/requests" options={{ headerShown: false }} />
              <Stack.Screen name="profile/budgets/create" options={{ headerShown: false }} />
              <Stack.Screen name="profile/budgets/list" options={{ headerShown: false }} />
              <Stack.Screen name="profile/clients/client" options={{ headerShown: false }} />
              <Stack.Screen name="profile/clients/clientList" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <FlashMessage position="top" floating={true} />
          </AuthProvider>
        </UserProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
