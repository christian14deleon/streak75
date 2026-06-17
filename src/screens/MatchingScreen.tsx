import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StickerScatter, MatchingLoader } from '../components';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { COUNTS, formatCount } from '../data/seed';
import { colors } from '../theme';

// Screen 19 — matching loader. No chrome: corner stickers frame a pulsing avatar
// while the app "matches your energy", then it auto-advances. It REPLACES itself
// in the stack (replaceNext) so pressing back later never lands on a loader that
// would re-trigger and bounce the user forward again. Advances to the invite
// modal (screen 20).
export function MatchingScreen() {
  const { replaceNext } = useOnboardingNav();

  return (
    <View style={styles.root}>
      <StickerScatter preset="matching" />
      <View style={styles.center}>
        <MatchingLoader
          headline="Matching *your* energy"
          countLabel={`Among ${formatCount(COUNTS.women)}+ women`}
          avatarKey="avatar_match"
          durationMs={2200}
          onDone={replaceNext}
        />
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
    paddingHorizontal: 24,
  },
});

export default MatchingScreen;
