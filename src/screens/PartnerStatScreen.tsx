import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { OnboardingScreen } from './_OnboardingScreen';
import { Button } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { COUNTS } from '../data/seed';
import { img } from '../data/images';
import { colors, radii, spacing } from '../theme';

// Screen 10 — partner stat. A large "87%" with the supporting line, a photo, and
// a "Find my partner" CTA that kicks off the matching loader (screen 19).
export function PartnerStatScreen() {
  const { goNext } = useOnboardingNav();
  const partner = img('partner');

  return (
    <OnboardingScreen
      scroll
      footer={<Button label="Find my partner" onPress={goNext} />}
    >
      <View style={styles.statBlock}>
        <RichHeadline size={84} align="left" style={styles.bigStat}>
          {`**${COUNTS.finishedPercent}%**`}
        </RichHeadline>
        <RichHeadline size={26} align="left" lineHeight={32} style={styles.statement}>
          {'of *women* who **finished** had someone doing it *with* them'}
        </RichHeadline>
      </View>

      <View style={styles.imageWrap}>
        {partner ? (
          <Image source={partner} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imageFallback]} />
        )}
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  statBlock: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  bigStat: {
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  statement: { color: colors.ink },
  imageWrap: {
    borderRadius: radii.card,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: colors.disabledBg,
  },
  imageFallback: { backgroundColor: colors.blush },
});

export default PartnerStatScreen;
