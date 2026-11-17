import { useAppSelector } from '@/store/hooks';
import { persistor, store } from '@/store/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

SplashScreen.hideAsync();

// One QueryClient per app (module-level, not per render).
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <ThemedNavigation />
            </SafeAreaProvider>
          </QueryClientProvider>
        </PersistGate>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

// A consumer of the Redux context — MUST sit below ReduxProvider (the
// provider-above-consumer rule). Reads the theme from state and applies it to navigation.
function ThemedNavigation() {
  const pref = useAppSelector((s) => s.settings.themePreference);
  const system = useColorScheme();
  const scheme = pref === 'system' ? system : pref;
  const isDark = scheme === 'dark';

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="expense/[id]" options={{ title: 'Expense details' }} />
        <Stack.Screen name="expense/new" options={{ title: 'New expense', presentation: 'modal' }} />
      </Stack>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
    </ThemeProvider>
  );
}
