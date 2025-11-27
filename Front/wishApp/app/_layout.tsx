import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from "react";
import { socket } from "../socket";

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("WebSocket CONNECTED:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket DISCONNECTED");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
