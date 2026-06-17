import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { RichHeadline } from '../theme/typography';
import { colors, radii, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { useChallengeStore } from '../store';
import { fromDateString, formatCard } from '../utils/dateUtils';

interface DayOneCardProps {
  // 'full' is the standalone card (screens 22). 'sticker' is the smaller,
  // tighter version layered onto the story frame (screen 23).
  variant?: 'full' | 'sticker';
  maxTasks?: number;
  style?: StyleProp<ViewStyle>;
}

// The signature "day one" card. It reads tasks, start date, and duration
// directly from the challenge store so it ALWAYS reflects whatever the user set
// in the task editor and length/start pickers — the editor, the congrats card,
// and the shareable sticker can never disagree. The date line uses the shared
// inclusive-range formatter ("jun 16 → aug 29").
export function DayOneCard({ variant = 'full', maxTasks, style }: DayOneCardProps) {
  const tasks = useChallengeStore((s) => s.tasks);
  const startDate = useChallengeStore((s) => s.startDate);
  const durationDays = useChallengeStore((s) => s.durationDays);

  const isSticker = variant === 'sticker';
  const start = fromDateString(startDate);
  const range = formatCard(start, durationDays);

  const shown = typeof maxTasks === 'number' ? tasks.slice(0, maxTasks) : tasks;

  return (
    <View
      style={[
        styles.card,
        isSticker ? styles.cardSticker : styles.cardFull,
        isSticker ? shadows.card : shadows.floating,
        style,
      ]}
    >
      <RichHeadline
        size={isSticker ? 26 : 34}
        align="left"
        baseStyle="regular"
        style={styles.title}
      >
        {'*day* one'}
      </RichHeadline>

      <Text style={[styles.range, isSticker && styles.rangeSticker]}>{range}</Text>

      <View style={[styles.list, isSticker && styles.listSticker]}>
        {shown.map((task, i) => (
          <View key={task.id} style={styles.taskRow}>
            <Text style={[styles.num, isSticker && styles.numSticker]}>{i + 1}</Text>
            <Text
              style={[styles.taskText, isSticker && styles.taskTextSticker]}
              numberOfLines={2}
            >
              {task.text}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.footer, isSticker && styles.footerSticker]}>
        STREAK75 CHALLENGE   ·   BY STREAK75
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
  },
  cardFull: { padding: 22 },
  cardSticker: { padding: 16, borderRadius: radii.lg },
  title: {
    color: colors.ink,
    marginBottom: 2,
  },
  range: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 16,
  },
  rangeSticker: { fontSize: 12, marginBottom: 12 },
  list: { gap: 12 },
  listSticker: { gap: 8 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  num: {
    fontFamily: fonts.serifBoldItalic,
    fontSize: 18,
    color: colors.ink,
    width: 22,
  },
  numSticker: { fontSize: 15, width: 18 },
  taskText: {
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
  },
  taskTextSticker: { fontSize: 12, lineHeight: 16 },
  footer: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.textFaint,
    marginTop: 18,
  },
  footerSticker: { fontSize: 8, marginTop: 12, letterSpacing: 1 },
});

export default DayOneCard;
