import React from 'react';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="profile/dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="profile/budgets/create" options={{ headerShown: false }} />
      <Stack.Screen name="profile/budgets/list" options={{ headerShown: false }} />
      <Stack.Screen name="profile/budgets/requests" options={{ headerShown: false }} />
      <Stack.Screen name="profile/budgets/create-request" options={{ headerShown: false }} />
      <Stack.Screen name="profile/budgets/edit-request" options={{ headerShown: false }} />
      <Stack.Screen name="profile/clients/client" options={{ headerShown: false }} />
      <Stack.Screen name="profile/clients/clientList" options={{ headerShown: false }} />
    </Stack>
  );
}
