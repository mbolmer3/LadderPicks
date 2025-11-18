import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WagerProvider } from "@/contexts/WagerContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="create-wager/stage-1" 
        options={{ 
          title: "Create Wager",
          headerStyle: { backgroundColor: '#0a0a0f' },
          headerTintColor: '#00d9ff',
        }} 
      />
      <Stack.Screen 
        name="create-wager/stage-2" 
        options={{ 
          title: "Set Risk Level",
          headerStyle: { backgroundColor: '#0a0a0f' },
          headerTintColor: '#00d9ff',
        }} 
      />
      <Stack.Screen 
        name="create-wager/stage-3" 
        options={{ 
          title: "Review Prediction",
          headerStyle: { backgroundColor: '#0a0a0f' },
          headerTintColor: '#00d9ff',
        }} 
      />
      <Stack.Screen 
        name="create-wager/stage-4" 
        options={{ 
          title: "Confirm Wager",
          headerStyle: { backgroundColor: '#0a0a0f' },
          headerTintColor: '#00d9ff',
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagerProvider>
        <GestureHandlerRootView>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </WagerProvider>
    </QueryClientProvider>
  );
}
