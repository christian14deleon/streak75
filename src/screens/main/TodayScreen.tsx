import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { AppPressable, RulerProgress, TaskCheckCard, WaterTracker } from '../../components';
import { useChallengeStore, useAppStore } from '../../store';
import {
  startOfDay,
  fromDateString,
  dayNumber,
  dateKey,
  weekdayShort,
  monthShort,
} from '../../utils/dateUtils';
import { img } from '../../data/images';
import { colors, radii, spacing, shadows } from '../../theme';
import { fonts } from '../../theme/typography';
import type { MainStackParamList } from '../../navigation/types';

// Main screen — Today. The header has a calendar button (opens the month
// calendar), a centered pastel "Day N" badge, and a pencil button (opens the
// task editor in main mode). Below: a circular progress photo, the day pill,
// a ruler progress strip, and the day's checkable task list. Toggling a task
// writes to completedByDate under today's date key and persists immediately —
// the calendar reads the same map.
export function TodayScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const tasks = useChallengeStore((s) => s.tasks);
  const startDate = useChallengeStore((s) => s.startDate);
  const durationDays = useChallengeStore((s) => s.durationDays);
  const completedByDate = useChallengeStore((s) => s.completedByDate);
  const toggleTaskDone = useChallengeStore((s) => s.toggleTaskDone);
  const waterByDate = useChallengeStore((s) => s.waterByDate);
  const waterGoal = useChallengeStore((s) => s.waterGoal);
  const setWater = useChallengeStore((s) => s.setWater);
  const name = useAppStore((s) => s.name);

  const today = useMemo(() => startOfDay(new Date()), []);
  const key = dateKey(today);
  const dayN = dayNumber(fromDateString(startDate), today);
  const doneToday = completedByDate[key] ?? [];
  const completedCount = tasks.filter((t) => doneToday.includes(t.id)).length;

  const portrait = img('portrait');
  const dateLabel = `${weekdayShort(today)}, ${monthShort(today.getMonth())} ${today.getDate()}`;

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      {/* Header row */}
      <View style={styles.header}>
        <AppPressable
          onPress={() => navigation.navigate('Calendar')}
          style={[styles.circleBtn, shadows.soft]}
          accessibilityLabel="Open calendar"
        >
          <Ionicons name="calendar-outline" size={20} color={colors.ink} />
        </AppPressable>

        <View style={styles.dayBadge}>
          <Text style={styles.dayBadgeText}>{`Day ${dayN}`}</Text>
        </View>

        <AppPressable
          onPress={() => navigation.navigate('TaskEditor', { fromMain: true })}
          style={[styles.circleBtn, shadows.soft]}
          accessibilityLabel="Edit tasks"
        >
          <Ionicons name="pencil" size={18} color={colors.ink} />
        </AppPressable>
      </View>

      <ScrollView
        style={styles.scrollFlex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xxxl }]}
      >
        <View style={styles.greetingRow}>
          <Ionicons name="sparkles" size={18} color={colors.ink} />
          <Text style={styles.greeting}>{name ? `Hi, ${name}` : 'Today'}</Text>
        </View>
        <Text style={styles.date}>{dateLabel}</Text>

        {/* Circular progress photo */}
        <View style={styles.photoRing}>
          {portrait ? (
            <Image source={portrait} style={styles.photo} resizeMode="cover" />
          ) : (
            <View style={[styles.photo, styles.photoFallback]} />
          )}
        </View>

        <RulerProgress current={dayN} total={durationDays} tickCount={48} style={styles.ruler} />
        <Text style={styles.progressText}>
          {`${completedCount} of ${tasks.length} done today`}
        </Text>

        {/* Daily water intake */}
        <WaterTracker
          value={waterByDate[key] ?? 0}
          goal={waterGoal}
          onChange={(n) => setWater(key, n)}
          style={styles.water}
        />

        {/* Task list */}
        <View style={styles.list}>
          {tasks.map((task) => (
            <TaskCheckCard
              key={task.id}
              task={task}
              done={doneToday.includes(task.id)}
              onToggle={() => toggleTaskDone(key, task.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const PHOTO = 132;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scrollFlex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenH,
    marginBottom: spacing.md,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadge: {
    backgroundColor: colors.mint,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
  },
  dayBadgeText: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: colors.mintInk,
    letterSpacing: 0.3,
  },
  scroll: {
    paddingHorizontal: spacing.screenH,
    alignItems: 'center',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.sm,
  },
  greeting: {
    fontFamily: fonts.serifBold,
    fontSize: 30,
    color: colors.ink,
  },
  date: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  photoRing: {
    width: PHOTO + 12,
    height: PHOTO + 12,
    borderRadius: (PHOTO + 12) / 2,
    borderWidth: 1,
    borderColor: colors.ringHairline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    ...shadows.soft,
    marginBottom: spacing.xl,
  },
  photo: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: PHOTO / 2,
    backgroundColor: colors.disabledBg,
  },
  photoFallback: { backgroundColor: colors.blush },
  ruler: { alignSelf: 'stretch', marginBottom: spacing.sm },
  water: { alignSelf: 'stretch', marginBottom: spacing.lg },
  progressText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  list: {
    alignSelf: 'stretch',
    gap: spacing.md,
  },
});

export default TodayScreen;
