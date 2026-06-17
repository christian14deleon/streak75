import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Button, CollageStrip, AppPressable } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { CHALLENGE_TEMPLATES } from '../data/challenges';
import { COUNTS, formatJoined } from '../data/seed';
import { colors, spacing } from '../theme';
import { fonts } from '../theme/typography';
import type { OnboardingStackParamList } from '../navigation/types';

// Screen 1 — Welcome. A scrolling marketing wall of aesthetic challenge collages
// (each with a "+N joined" pill and name), with the headline and primary CTA
// pinned at the bottom. "Get Started" begins onboarding; "Already have an
// account?" jumps straight to the (mock) sign-in screen.
export function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { goNext } = useOnboardingNav();
  const navigation = useNavigation<NavigationProp<OnboardingStackParamList>>();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollFlex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.kickerRow}>
          <Ionicons name="people" size={15} color={colors.textMuted} />
          <Text style={styles.kicker}>{`${formatJoined(COUNTS.joined)} joined`}</Text>
        </View>
        {CHALLENGE_TEMPLATES.map((t) => (
          <CollageStrip
            key={t.id}
            images={t.images}
            joined={t.joined}
            name={t.name}
            height={132}
            style={styles.collage}
          />
        ))}
      </ScrollView>

      {/* Pinned bottom: headline + CTA + sign-in link. A soft gradient-free
          backing keeps the CTA legible over the scrolling imagery. */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <RichHeadline size={40} align="center" style={styles.headline}>
          {'Choose *your challenge*'}
        </RichHeadline>
        <Button
          label="Get Started"
          onPress={goNext}
          leftIcon={<Ionicons name="sparkles" size={18} color={colors.white} />}
        />
        <AppPressable
          onPress={() => navigation.navigate('SignIn')}
          style={styles.link}
          hitSlop={8}
        >
          <Text style={styles.linkText}>Already have an account?</Text>
        </AppPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scrollFlex: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.sm,
    paddingBottom: spacing.huge,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  kicker: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  collage: { marginBottom: spacing.lg },
  footer: {
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.lg,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  headline: {
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  link: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  linkText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
