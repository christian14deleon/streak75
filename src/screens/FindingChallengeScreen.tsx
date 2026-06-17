import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { useAutoAdvance } from '../utils/useAutoAdvance';
import { colors, radii, spacing } from '../theme';

// Screen 12 — "Finding your perfect challenge." A brief no-chrome loader with a
// filling progress bar (driven by the Animated value from useAutoAdvance). When
// the fill completes it REPLACES itself with the task editor (screen 13) so the
// loader doesn't remain in the back stack.
export function FindingChallengeScreen() {
  const { replaceNext } = useOnboardingNav();
  const progress = useAutoAdvance(1800, replaceNext);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <RichHeadline size={34} align="center" style={styles.headline}>
          {'Finding *your* **perfect** challenge'}
        </RichHeadline>

        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  headline: {
    color: colors.ink,
    marginBottom: spacing.xxl,
  },
  track: {
    width: '70%',
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.disabledBg,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.ink,
  },
});

export default FindingChallengeScreen;
