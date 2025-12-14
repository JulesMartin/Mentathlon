import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Setup' }} />
        <Stack.Screen name="alarm-config" options={{ title: 'Configurer l\'alarme' }} />
        <Stack.Screen name="alarm-ringing" options={{ title: 'Réveil' }} />
        <Stack.Screen name="lock" options={{ title: 'Déverrouillage' }} />
        <Stack.Screen name="morning-flow" options={{ title: 'Morning Flow' }} />
        <Stack.Screen name="flow-editor" options={{ title: 'Flow Editor' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
