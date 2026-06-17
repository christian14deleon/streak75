import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  type Theme,
} from '@react-navigation/native';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainNavigator } from './MainNavigator';
import { useAppStore } from '../store';
import { colors } from '../theme';

// Themed so navigator backgrounds match the app's warm off-white instead of the
// library's default white (prevents white flashes between screens/modals).
const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.white,
    text: colors.ink,
    primary: colors.ink,
    border: colors.border,
    notification: colors.ink,
  },
};

// The single switch between the onboarding flow and the main app. It reads the
// persisted onboardingComplete flag (App.tsx has already waited for hydration),
// so a returning user who finished onboarding lands straight in the main app,
// and a "Start over" reset (which flips the flag back to false) returns here to
// onboarding automatically.
export function RootNavigator() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);

  return (
    <NavigationContainer theme={navTheme}>
      {onboardingComplete ? <MainNavigator /> : <OnboardingNavigator />}
    </NavigationContainer>
  );
}

export default RootNavigator;
