import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CloseButton, AppPressable } from '../../components';
import { useChallengeStore } from '../../store';
import {
  startOfDay,
  addDays,
  dayDiff,
  fromDateString,
  endDateInclusive,
  dateKey,
  MONTHS_SHORT,
  WEEKDAYS_SHORT,
} from '../../utils/dateUtils';
import { colors, radii, spacing } from '../../theme';
import { fonts } from '../../theme/typography';

type DayStatus = 'completed' | 'missed' | 'today' | 'future' | 'outside';

// Main Calendar modal. Renders a month grid where each day reflects whether ALL
// of that day's tasks were completed (a day "counts" only if every task is
// checked). Past in-challenge days with anything unchecked read as missed;
// today is ringed; days before the start or after the inclusive end are neutral.
// It reads the same completedByDate map the Today screen writes, so the two are
// always in agreement. Months can be paged with the chevrons.
export function CalendarModal() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const tasks = useChallengeStore((s) => s.tasks);
  const startDate = useChallengeStore((s) => s.startDate);
  const durationDays = useChallengeStore((s) => s.durationDays);
  const completedByDate = useChallengeStore((s) => s.completedByDate);

  const today = useMemo(() => startOfDay(new Date()), []);
  const start = fromDateString(startDate);
  const end = endDateInclusive(start, durationDays);

  // Month cursor starts on the month containing today.
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const allDone = (d: Date): boolean => {
    if (tasks.length === 0) return false;
    const done = completedByDate[dateKey(d)] ?? [];
    return tasks.every((t) => done.includes(t.id));
  };

  const statusFor = (d: Date): DayStatus => {
    const inChallenge = dayDiff(start, d) >= 0 && dayDiff(d, end) >= 0;
    if (dayDiff(today, d) === 0) return 'today';
    if (!inChallenge) return 'outside';
    if (allDone(d)) return 'completed';
    if (dayDiff(d, today) > 0) return 'missed'; // past and not fully done
    return 'future';
  };

  // Build the grid cells (leading blanks + each day of the month).
  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const leading = firstOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < leading; i++) out.push(null);
    for (let day = 1; day <= daysInMonth; day++) out.push(new Date(year, month, day));
    return out;
  }, [cursor]);

  const canGoPrev = true;
  const goPrev = () => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  const goNextMonth = () => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Calendar</Text>
        <CloseButton onPress={() => navigation.goBack()} />
      </View>

      {/* Month switcher */}
      <View style={styles.monthRow}>
        <AppPressable onPress={goPrev} style={styles.chev} hitSlop={8} disabled={!canGoPrev}>
          <Ionicons name="chevron-back" size={20} color={colors.ink} />
        </AppPressable>
        <Text style={styles.monthLabel}>
          {`${MONTHS_SHORT[cursor.getMonth()]} ${cursor.getFullYear()}`}
        </Text>
        <AppPressable onPress={goNextMonth} style={styles.chev} hitSlop={8}>
          <Ionicons name="chevron-forward" size={20} color={colors.ink} />
        </AppPressable>
      </View>

      {/* Weekday headers */}
      <View style={styles.weekRow}>
        {WEEKDAYS_SHORT.map((w, i) => (
          <Text key={i} style={styles.weekday}>
            {w[0]}
          </Text>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.grid}>
        {cells.map((d, i) => {
          if (!d) return <View key={`b${i}`} style={styles.cell} />;
          const status = statusFor(d);
          return (
            <View key={dateKey(d)} style={styles.cell}>
              <View style={[styles.dot, dotStyle(status)]}>
                {status === 'completed' ? (
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                ) : (
                  <Text style={[styles.dayNum, dayNumStyle(status)]}>{d.getDate()}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <LegendItem color={colors.mint} label="Completed" />
        <LegendItem color={colors.blush} label="Missed" />
        <LegendItem ring label="Today" />
      </View>
    </View>
  );
}

function dotStyle(status: DayStatus) {
  switch (status) {
    case 'completed':
      return { backgroundColor: colors.mint };
    case 'missed':
      return { backgroundColor: colors.blush };
    case 'today':
      return { borderWidth: 2, borderColor: colors.ink, backgroundColor: colors.white };
    default:
      return { backgroundColor: 'transparent' };
  }
}

function dayNumStyle(status: DayStatus) {
  if (status === 'missed') return { color: colors.blushInk };
  if (status === 'today') return { color: colors.ink, fontFamily: fonts.sansBold };
  if (status === 'outside' || status === 'future') return { color: colors.textFaint };
  return { color: colors.ink };
}

function LegendItem({ color, ring, label }: { color?: string; ring?: boolean; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          ring
            ? { borderWidth: 2, borderColor: colors.ink, backgroundColor: colors.white }
            : { backgroundColor: color },
        ]}
      />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const CELL_DOT = 38;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenH,
    marginBottom: spacing.lg,
  },
  heading: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    color: colors.ink,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
  },
  chev: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 17,
    color: colors.ink,
  },
  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenH,
    marginBottom: spacing.sm,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.textFaint,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.screenH,
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: CELL_DOT,
    height: CELL_DOT,
    borderRadius: CELL_DOT / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.xxl,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 14, height: 14, borderRadius: 7 },
  legendLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.textMuted,
  },
});

export default CalendarModal;
