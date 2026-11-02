import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';


SplashScreen.hideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <SafeAreaProvider>
        <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name='index' options={{title: 'Receipts'}}/>
        </Stack>
        <StatusBar barStyle='auto' />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}