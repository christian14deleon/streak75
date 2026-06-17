import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppPressable } from './AppPressable';
import { colors, radii, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { img } from '../data/images';
import type { Task } from '../types';

interface TaskCheckCardProps {
  task: Task;
  done: boolean;
  onToggle?: () => void;
  // When false, renders as a static (non-pressable) preview row — used inside
  // the device-framed preview on screen 9, which only mirrors the task list.
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
}

// A checkable daily-task row for the Today screen (18): a square photo
// thumbnail, the task text (emoji inline), and a circular check on the right.
// Tapping the whole row toggles completion; because it is built on AppPressable
// the toggle plays the tap sound + light haptic automatically.
export function TaskCheckCard({
  task,
  done,
  onToggle,
  interactive = true,
  style,
}: TaskCheckCardProps) {
  const source = img(task.image);

  const inner = (
    <>
      <View style={styles.thumbWrap}>
        {source ? (
          <Image source={source} style={styles.thumb} resizeMode="cover" />
        ) : (
          <View style={[styles.thumb, styles.thumbFallback]} />
        )}
      </View>
      <Text style={[styles.text, done && styles.textDone]} numberOfLines={2}>
        {task.text}
      </Text>
      <View style={[styles.check, done && styles.checkDone]}>
        {done ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
      </View>
    </>
  );

  if (!interactive) {
    return <View style={[styles.row, shadows.soft, style]}>{inner}</View>;
  }

  return (
    <AppPressable
      onPress={onToggle}
      style={[styles.row, shadows.soft, style]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
    >
      {inner}
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 10,
  },
  thumbWrap: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  thumb: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.disabledBg,
  },
  thumbFallback: { backgroundColor: colors.peach },
  text: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
    marginHorizontal: 12,
  },
  textDone: {
    color: colors.textFaint,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
});

export default TaskCheckCard;
