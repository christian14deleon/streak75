import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Badge, PlanOption, AppPressable } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { useAppStore } from '../store';
import { PLANS, SUBSCRIPTION_TERMS } from '../data/plans';
import { COUNTS, formatCount, formatJoined } from '../data/seed';
import { img } from '../data/images';
import { colors, spacing } from '../theme';
import { fonts } from '../theme/typography';

const BENEFITS = [
  'Join the community',
  'Stay accountable with real people',
  'Build habits that actually stick',
];

const AVATAR_KEYS = ['avatar1', 'avatar2', 'avatar3', 'avatar_match'];

// Screen 21 — the MOCK paywall. Critically: NO payment is ever processed.
// Exactly one plan is always selected (monthly by default), so "Continue" is
// always enabled and simply advances the flow. The footer link text "Privacy
// police" is reproduced VERBATIM from the source (including the typo). "Restore"
// and "Terms of service" are inert.
export function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const { goNext } = useOnboardingNav();
  const selectedPlan = useAppStore((s) => s.selectedPlan);
  const setSelectedPlan = useAppStore((s) => s.setSelectedPlan);

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xl }]}>
      <ScrollView
        style={styles.scrollFlex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Overlapping circular collage of community photos. */}
        <View style={styles.avatarRow}>
          {AVATAR_KEYS.map((key, i) => {
            const source = img(key);
            return (
              <View
                key={key}
                style={[styles.avatarWrap, { marginLeft: i === 0 ? 0 : -18, zIndex: AVATAR_KEYS.length - i }]}
              >
                {source ? (
                  <Image source={source} style={styles.avatar} resizeMode="cover" />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback]} />
                )}
              </View>
            );
          })}
        </View>

        <Badge label={`${formatJoined(COUNTS.joined)} joined`} tone="white" small style={styles.joinedPill} />

        <RichHeadline size={32} align="center" style={styles.headline}>
          {`Join ${formatCount(COUNTS.joined)} *women* on their glow-up *journey*`}
        </RichHeadline>

        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <View key={b} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={22} color={colors.ink} />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          {PLANS.map((plan) => (
            <PlanOption
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              onPress={() => setSelectedPlan(plan.id)}
            />
          ))}
        </View>

        {/* Payment & renewal terms (from the source listing). Display-only. */}
        <View style={styles.terms}>
          <Text style={styles.termsTitle}>Payments and Renewal</Text>
          {SUBSCRIPTION_TERMS.map((line, i) => (
            <Text key={i} style={styles.termsLine}>{`• ${line}`}</Text>
          ))}
        </View>
      </ScrollView>


      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Continue" onPress={goNext} />
        <View style={styles.links}>
          {/* "Privacy police" is intentionally verbatim (typo preserved). */}
          <FooterLink label="Privacy police" />
          <FooterLink label="Restore" />
          <FooterLink label="Terms of service" />
        </View>
      </View>
    </View>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <AppPressable onPress={() => {}} hitSlop={6} style={styles.linkButton} soundOnPress={false}>
      <Text style={styles.linkText}>{label}</Text>
    </AppPressable>
  );
}

const AV = 56;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scrollFlex: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.screenH,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarWrap: {
    width: AV,
    height: AV,
    borderRadius: AV / 2,
    borderWidth: 3,
    borderColor: colors.bg,
    overflow: 'hidden',
  },
  avatar: { width: '100%', height: '100%', backgroundColor: colors.disabledBg },
  avatarFallback: { backgroundColor: colors.lilac },
  joinedPill: { marginBottom: spacing.lg },
  headline: {
    color: colors.ink,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.sm,
  },
  benefits: {
    alignSelf: 'stretch',
    gap: spacing.md,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  benefitText: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  plans: {
    alignSelf: 'stretch',
    gap: spacing.sm,
  },
  terms: {
    alignSelf: 'stretch',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  termsTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  termsLine: {
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textFaint,
    marginBottom: 4,
  },
  footer: {
    paddingHorizontal: spacing.screenH,
    paddingTop: spacing.sm,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  linkButton: { paddingVertical: 4 },
  linkText: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: colors.textFaint,
    textDecorationLine: 'underline',
  },
});

export default PaywallScreen;
