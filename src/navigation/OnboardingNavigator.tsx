import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ONBOARDING_STEPS } from './onboardingSteps';
import type { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

// The onboarding flow as a native stack. Every screen and its presentation are
// generated from the single ONBOARDING_STEPS array, so the navigator never
// drifts from the flow definition or the progress logic. Loaders and the invite
// modal disable the back-swipe gesture (gestureEnabled:false) so the user can't
// swipe back onto a loader that would immediately auto-advance again.
export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      {ONBOARDING_STEPS.map((step) => {
        const isModal = step.presentation === 'modal';
        return (
          <Stack.Screen
            key={step.name}
            name={step.name}
            component={step.component}
            options={{
              presentation: isModal ? 'modal' : 'card',
              gestureEnabled: step.gestureEnabled ?? true,
              ...(isModal ? { animation: 'slide_from_bottom' } : null),
            }}
          />
        );
      })}
    </Stack.Navigator>
  );
}

export default OnboardingNavigator;
