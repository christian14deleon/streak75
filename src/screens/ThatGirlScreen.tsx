import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, BackButton, StickerScatter } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { colors, spacing } from '../theme';

// Screen 2 — "Become that girl". A hype interstitial: cut-out lifestyle stickers
// scattered behind a big serif headline, with a back button and an "I'm ready"
// CTA. No progress pill (this isn't part of the questionnaire).
export function ThatGirlScreen() {
  const insets = useSafeAreaInsets();
  const { goNext, goBack } = useOnboardingNav();

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      {/* Decorative sticker layer sits behind everything. */}
      <StickerScatter preset="thatGirl" />

      <View style={styles.headerRow}>
        <BackButton onPress={goBack} />
      </View>

      <View style={styles.center}>
        <Ionicons name="sparkles" size={34} color={colors.ink} style={styles.sparkle} />
        <RichHeadline size={46} align="center" style={styles.headline}>
          {'Become *that girl*'}
        </RichHeadline>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          label="I'm ready"
          onPress={goNext}
          leftIcon={<Ionicons name="heart" size={18} color={colors.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  headerRow: {
    paddingHorizontal: spacing.screenH,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  headline: { color: colors.ink },
  sparkle: { marginBottom: spacing.lg },
  footer: {
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.sm,
  },
});

export default ThatGirlScreen;
