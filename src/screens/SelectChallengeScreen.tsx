import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingScreen } from './_OnboardingScreen';
import { AppPressable, CollageStrip } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { useChallengeStore } from '../store';
import { CHALLENGE_TEMPLATES } from '../data/challenges';
import { colors, radii, spacing, shadows } from '../theme';
import { fonts } from '../theme/typography';

type Tab = 'popular' | 'custom';

// Screen 11 — "Select your challenge." A two-tab picker. On "Most Popular",
// tapping a challenge collage loads that template's tasks into the challenge
// store and advances (→ finding loader → task editor). On "Custom", the card
// starts an empty challenge. Selection itself advances the flow, so there is no
// separate Continue button.
export function SelectChallengeScreen() {
  const { goNext } = useOnboardingNav();
  const loadTemplate = useChallengeStore((s) => s.loadTemplate);
  const loadCustom = useChallengeStore((s) => s.loadCustom);
  const [tab, setTab] = useState<Tab>('popular');

  const choosePopular = (id: string) => {
    const template = CHALLENGE_TEMPLATES.find((t) => t.id === id);
    if (template) loadTemplate(template);
    goNext();
  };

  const chooseCustom = () => {
    loadCustom();
    goNext();
  };

  return (
    <OnboardingScreen scroll>
      <RichHeadline size={32} align="left" style={styles.headline}>
        {'Select *your challenge*'}
      </RichHeadline>

      {/* Tab row with an underline indicator under the active tab. */}
      <View style={styles.tabs}>
        <TabButton label="Most Popular" active={tab === 'popular'} onPress={() => setTab('popular')} />
        <TabButton label="Custom" active={tab === 'custom'} onPress={() => setTab('custom')} />
      </View>

      {tab === 'popular' ? (
        <View style={styles.list}>
          {CHALLENGE_TEMPLATES.map((t) => (
            <CollageStrip
              key={t.id}
              images={t.images}
              joined={t.joined}
              name={t.name}
              height={120}
              onPress={() => choosePopular(t.id)}
              style={styles.collage}
            />
          ))}
        </View>
      ) : (
        <AppPressable onPress={chooseCustom} style={[styles.customCard, shadows.soft]}>
          <Text style={styles.customPlus}>+</Text>
          <Text style={styles.customTitle}>Create your own challenge</Text>
          <Text style={styles.customSub}>Start from a blank list and add your own daily tasks.</Text>
        </AppPressable>
      )}
    </OnboardingScreen>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <AppPressable onPress={onPress} style={styles.tabButton} hitSlop={6}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
      <View style={[styles.tabUnderline, active && styles.tabUnderlineActive]} />
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  headline: {
    color: colors.ink,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.xl,
  },
  tabButton: { alignItems: 'center' },
  tabLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.textMuted,
    paddingBottom: 8,
  },
  tabLabelActive: {
    fontFamily: fonts.sansSemiBold,
    color: colors.ink,
  },
  tabUnderline: {
    height: 2,
    width: '100%',
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  tabUnderlineActive: { backgroundColor: colors.ink },
  list: { gap: spacing.lg },
  collage: { marginBottom: spacing.xs },
  customCard: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  customPlus: {
    fontFamily: fonts.serifRegular,
    fontSize: 44,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  customTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    color: colors.ink,
    marginBottom: 6,
  },
  customSub: {
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default SelectChallengeScreen;
