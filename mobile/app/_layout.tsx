import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="textDetector" />
      <Stack.Screen name="urlDetector" />
      <Stack.Screen name="selfie" />
    </Stack>
  );
}
