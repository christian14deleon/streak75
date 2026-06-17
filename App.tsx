import React, { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import { SoundProvider } from './src/sound/SoundProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useStoreHydration } from './src/store';
import { colors } from './src/theme';

// Keep the native splash up until fonts + persisted state are ready, so the
// first frame the user sees is the fully-themed, hydrated app (no flash of a
// half-loaded onboarding screen, no font swap).
SplashScreen.preventAutoHideAsync().catch(() => {
  /* no-op: preventing the splash is best-effort */
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_700Bold_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Both Zustand stores persist to AsyncStorage; we wait until both have
  // rehydrated before rendering so navigation can branch on onboardingComplete
  // with the correct value rather than the default.
  const hydrated = useStoreHydration();

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  useEffect(() => {
    // A tiny floor so the splash doesn't flicker on very fast cold starts.
    const t = setTimeout(() => setMinTimeElapsed(true), 250);
    return () => clearTimeout(t);
  }, []);

  const ready = (fontsLoaded || !!fontError) && hydrated && minTimeElapsed;

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      try {
        await SplashScreen.hideAsync();
      } catch {
        /* no-op */
      }
    }
  }, [ready]);

  if (!ready) {
    // Render nothing meaningful while the native splash is still showing.
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <SoundProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </SoundProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
