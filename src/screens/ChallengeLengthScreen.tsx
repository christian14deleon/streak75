import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingScreen } from './_OnboardingScreen';
import { Button, RulerPicker } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { useChallengeStore } from '../store';
import { fromDateString, formatLong } from '../utils/dateUtils';
import { colors, radii, spacing, shadows } from '../theme';
import { fonts } from '../theme/typography';

const MIN_DAYS = 7;
const MAX_DAYS = 150;

// Screen 14 — "Set challenge length?" A draggable ruler over 7…150 days. The
// value pill shows the day count; the derived line below shows the resulting
// INCLUSIVE date range (day 1 = start, day N = start + N-1), e.g.
// "Tue, Jun 16 → Sat, Aug 29" for 75 days starting today. The selection writes
// straight to the challenge store via setDuration.
export function ChallengeLengthScreen() {
  const { goNext } = useOnboardingNav();
  const durationDays = useChallengeStore((s) => s.durationDays);
  const setDuration = useChallengeStore((s) => s.setDuration);
  const startDate = useChallengeStore((s) => s.startDate);

  const start = fromDateString(startDate);

  return (
    <OnboardingScreen footer={<Button label="Continue" onPress={goNext} />}>
      <RichHeadline size={32} align="left" style={styles.headline}>
        {'Set challenge *length*?'}
      </RichHeadline>

      <View style={styles.rulerArea}>
        <RulerPicker
          min={MIN_DAYS}
          max={MAX_DAYS}
          value={durationDays}
          onChange={setDuration}
          renderValuePill={(n) => (
            <View style={[styles.valuePill, shadows.soft]}>
              <Text style={styles.valueNum}>{n}</Text>
              <Text style={styles.valueUnit}>days</Text>
            </View>
          )}
          renderDerived={(n) => (
            <Text style={styles.derived}>{formatLong(start, n)}</Text>
          )}
        />
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  headline: {
    color: colors.ink,
    marginTop: spacing.sm,
    marginBottom: spacing.xxxl,
  },
  rulerArea: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.huge,
  },
  valuePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  valueNum: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
    color: colors.ink,
  },
  valueUnit: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.textMuted,
    marginLeft: 6,
  },
  derived: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.textMuted,
  },
});

export default ChallengeLengthScreen;
