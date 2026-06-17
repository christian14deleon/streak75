import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingScreen } from './_OnboardingScreen';
import { Button, RulerPicker } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { useChallengeStore } from '../store';
import {
  startOfDay,
  addDays,
  dayDiff,
  toDateString,
  fromDateString,
  formatStart,
  weekdayShort,
  monthShort,
} from '../utils/dateUtils';
import { colors, radii, spacing, shadows } from '../theme';
import { fonts } from '../theme/typography';

const MAX_OFFSET = 60; // up to ~2 months out

// Screen 15 — "When do you start?" The ruler scrubs a day OFFSET from today
// (0…60) which is mapped to a concrete start date and persisted as a local
// "YYYY-MM-DD" string (no timezone drift). The pill shows a friendly label
// ("Today" / "Tomorrow" / "Tue, Jun 16") and the derived line shows the
// explicit weekday + date. The challenge length screen reads this same start
// date to compute its inclusive range, so the two pickers stay consistent.
export function WhenStartScreen() {
  const { goNext } = useOnboardingNav();
  const startDate = useChallengeStore((s) => s.startDate);
  const setStartDate = useChallengeStore((s) => s.setStartDate);

  // Stable "today" for the lifetime of this screen (day-level precision).
  const today = useMemo(() => startOfDay(new Date()), []);

  const currentOffset = Math.max(
    0,
    Math.min(MAX_OFFSET, dayDiff(today, fromDateString(startDate)))
  );

  const dateForOffset = (offset: number) => addDays(today, offset);

  return (
    <OnboardingScreen footer={<Button label="Continue" onPress={goNext} />}>
      <RichHeadline size={32} align="left" style={styles.headline}>
        {'When do *you* start?'}
      </RichHeadline>

      <View style={styles.rulerArea}>
        <RulerPicker
          min={0}
          max={MAX_OFFSET}
          value={currentOffset}
          onChange={(offset) => setStartDate(toDateString(dateForOffset(offset)))}
          renderValuePill={(offset) => (
            <View style={[styles.valuePill, shadows.soft]}>
              <Text style={styles.valueText}>{formatStart(dateForOffset(offset), today)}</Text>
            </View>
          )}
          renderDerived={(offset) => {
            const d = dateForOffset(offset);
            return (
              <Text style={styles.derived}>
                {`${weekdayShort(d)}, ${monthShort(d.getMonth())} ${d.getDate()}`}
              </Text>
            );
          }}
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
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  valueText: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    color: colors.ink,
  },
  derived: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.textMuted,
  },
});

export default WhenStartScreen;
