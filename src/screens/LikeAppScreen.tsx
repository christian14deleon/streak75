import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as StoreReview from 'expo-store-review';
import { OnboardingScreen } from './_OnboardingScreen';
import { AppPressable } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { useAppStore } from '../store';
import { colors, radii, spacing, shadows } from '../theme';
import { fonts } from '../theme/typography';

// Screen 17 — "Do you like the app?" Two big thumb choices. A thumbs-up records
// the preference and, if the platform supports it, asks the OS for a native
// store review (best-effort, fully guarded). A thumbs-down simply records and
// continues. Either way the flow advances.
export function LikeAppScreen() {
  const { goNext } = useOnboardingNav();
  const setLikedApp = useAppStore((s) => s.setLikedApp);

  const onLike = async () => {
    setLikedApp(true);
    try {
      if (await StoreReview.isAvailableAsync()) {
        await StoreReview.requestReview();
      }
    } catch {
      /* best-effort: never block the flow on review availability */
    }
    goNext();
  };

  const onDislike = () => {
    setLikedApp(false);
    goNext();
  };

  return (
    <OnboardingScreen>
      <View style={styles.body}>
        <View style={[styles.primeCard, shadows.card]}>
          <View style={styles.stars}>
            {Array.from({ length: 5 }, (_, i) => (
              <Ionicons key={i} name="star" size={20} color={colors.ink} style={styles.star} />
            ))}
          </View>
          <Text style={styles.primeText}>Loved by women on their glow-up journey</Text>
        </View>

        <RichHeadline size={34} align="center" style={styles.headline}>
          {'Do *you* like the app?'}
        </RichHeadline>

        <View style={styles.choices}>
          <AppPressable onPress={onDislike} style={[styles.choice, shadows.soft]}>
            <Ionicons name="thumbs-down" size={34} color={colors.textMuted} />
          </AppPressable>
          <AppPressable onPress={onLike} style={[styles.choice, styles.choiceUp, shadows.soft]}>
            <Ionicons name="thumbs-up" size={34} color={colors.white} />
          </AppPressable>
        </View>
      </View>
    </OnboardingScreen>
  );
}

const SQUARE = 92;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primeCard: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  stars: { flexDirection: 'row', marginBottom: spacing.md },
  star: { marginHorizontal: 2 },
  primeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  headline: {
    color: colors.ink,
    marginBottom: spacing.xxxl,
  },
  choices: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  choice: {
    width: SQUARE,
    height: SQUARE,
    borderRadius: radii.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceUp: {
    backgroundColor: colors.ink,
  },
});

export default LikeAppScreen;
