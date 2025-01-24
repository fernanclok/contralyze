// import React from 'react';
// import { Tabs } from 'expo-router';
// import { Platform } from 'react-native';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import { SafeAreaProvider } from 'react-native-safe-area-context'
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import  LoginScreen  from '../login';
// import RegisterScreen from '../register';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   const Stack = createStackNavigator();
//   return (
//     <Tabs initialRouteName="login"
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarStyle: {
//           ...Platform.select({
//             ios: {
//               // Use a transparent background on iOS to show the blur effect
//               position: 'absolute',
//             },
//             android: {
//               position: 'absolute',
//             },
//             web: {
//               position: 'absolute',
//             },
//             default: {},
//           }),
//         },
//       }}>
//       <Tabs.Screen
//         name="register"
//         options={{ headerShown: false, title: 'Register', tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2" color={color} /> }}
//       />
//       <Tabs.Screen
//         name="login"
//         options={{
//           headerShown: false,
//           title: 'Login',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//     // <SafeAreaProvider>
//     //   <NavigationContainer>
//     //     <Stack.Navigator initialRouteName="login">
//     //       <Stack.Screen name="login" component={LoginScreen} />
//     //       <Stack.Screen name="register" component={RegisterScreen} />
//     //     </Stack.Navigator>
//     //   </NavigationContainer>
//     // </SafeAreaProvider>
//   );
// }
