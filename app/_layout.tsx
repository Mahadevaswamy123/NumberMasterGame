import { Stack } from 'expo-router';
import { GameProvider } from '../contexts/GameContext';

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="game" options={{ headerShown: false }} />
      </Stack>
    </GameProvider>
  );
}
