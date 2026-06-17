import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingScreen } from './_OnboardingScreen';
import { Button, DeviceFrame, TaskCheckCard, RulerProgress } from '../components';
import { RichHeadline } from '../theme/typography';
import { useOnboardingNav } from '../navigation/useOnboardingNav';
import { useChallengeStore } from '../store';
import { colors, spacing, radii } from '../theme';
import { fonts } from '../theme/typography';

// Screen 9 — "Your daily to-do, your aesthetic." Shows a phone mockup containing
// a Today-style preview. Crucially it reads the SAME challenge store the editor
// writes to, so the preview always reflects the real (default or edited) task
// list — never a hard-coded mock. Non-interactive (a marketing preview).
export function DailyTodoScreen() {
  const { goNext } = useOnboardingNav();
  const tasks = useChallengeStore((s) => s.tasks);
  const durationDays = useChallengeStore((s) => s.durationDays);

  const preview = tasks.slice(0, 3);

  return (
    <OnboardingScreen
      scroll
      footer={<Button label="Continue" onPress={goNext} />}
    >
      <RichHeadline size={30} align="left" style={styles.headline}>
        {'Your daily to-do, your *aesthetic*.'}
      </RichHeadline>

      <DeviceFrame style={styles.frame} aspectRatio={0.52}>
        <View style={styles.previewInner}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewKicker}>TODAY</Text>
            <View style={styles.dayPill}>
              <Text style={styles.dayPillText}>Day 1</Text>
            </View>
          </View>

          <RulerProgress current={1} total={durationDays} tickCount={28} style={styles.ruler} />

          <View style={styles.previewList}>
            {preview.map((task) => (
              <TaskCheckCard key={task.id} task={task} done={false} interactive={false} />
            ))}
          </View>
        </View>
      </DeviceFrame>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  headline: {
    color: colors.ink,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  frame: {
    width: 232,
    marginBottom: spacing.lg,
  },
  previewInner: {
    flex: 1,
    paddingTop: 44, // clear the notch
    paddingHorizontal: 14,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  previewKicker: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    letterSpacing: 1.5,
    color: colors.ink,
  },
  dayPill: {
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dayPillText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 12,
    color: colors.textMuted,
  },
  ruler: { marginBottom: 16 },
  previewList: { gap: 10 },
});

export default DailyTodoScreen;
