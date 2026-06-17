import React from 'react';
import { StyleSheet } from 'react-native';
import { OnboardingScreen } from './_OnboardingScreen';
import { Button, CongratsCard } from '../components';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { spacing } from '../theme';

// Screen 22 — "Congrats. You're ready to start your challenge." Shows the
// canonical DayOneCard (which reflects the user's real tasks and inclusive
// dates) beneath the headline, with a pinned "Start now" CTA that advances to
// the final share screen.
export function CongratsScreen() {
  const { goNext } = useOnboardingNav();

  return (
    <OnboardingScreen
      scroll
      contentStyle={styles.content}
      footer={<Button label="Start now" onPress={goNext} />}
    >
      <CongratsCard />
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg,
  },
});

export default CongratsScreen;
