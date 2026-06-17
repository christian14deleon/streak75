import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { AppPressable } from './AppPressable';
import { colors, radii, shadows, stickyFor, stickyPalette } from '../theme';
import { fonts } from '../theme/typography';
import { useSound } from '../sound/SoundProvider';
import type { Task, StickerColor } from '../types';

interface StickyTaskRowProps {
  task: Task;
  number: number; // 1-based display number
  onEditPress: () => void;
  // Provided by react-native-draglist's renderItem; attach to the drag handle.
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isActive?: boolean;
}

const COLOR_INDEX: Record<StickerColor, number> = { mint: 0, butter: 1, blush: 2 };

// One row in the reorderable task editor (screen 13): left drag handle (≡), a
// colored sticky square with a hand-styled number, the free-text task (emoji
// inline), and a circular pencil edit button. The handle starts/stops the drag
// via onPressIn/onPressOut (the gesture model react-native-draglist exposes).
export function StickyTaskRow({
  task,
  number,
  onEditPress,
  onDragStart,
  onDragEnd,
  isActive = false,
}: StickyTaskRowProps) {
  const { selectionTick } = useSound();
  const palette =
    task.color != null ? stickyPalette[COLOR_INDEX[task.color]] : stickyFor(number - 1);

  return (
    <View style={[styles.row, isActive && styles.rowActive]}>
      {/* Drag handle */}
      <Pressable
        onPressIn={() => {
          selectionTick();
          onDragStart?.();
        }}
        onPressOut={() => onDragEnd?.()}
        hitSlop={10}
        style={styles.handle}
        accessibilitylabel="Drag to reorder"
      >
        <Ionicons name="reorder-three" size={26} color={colors.textFaint} />
      </Pressable>

      {/* Colored sticky square with number */}
      <View style={[styles.sticky, { backgroundColor: palette.bg }]}>
        <Text style={[styles.stickyNumber, { color: palette.ink }]}>{number}</Text>
      </View>

      {/* Task text */}
      <Text style={styles.text} numberOfLines={3}>
        {task.text}
      </Text>

      {/* Pencil edit */}
      <AppPressable onPress={onEditPress} style={styles.pencil} hitSlop={8}>
        <Feather name="edit-2" size={16} color={colors.ink} />
      </AppPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
    ...shadows.soft,
  },
  rowActive: {
    ...shadows.floating,
    transform: [{ scale: 1.02 }],
  },
  handle: {
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sticky: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    transform: [{ rotate: '-3deg' }],
  },
  stickyNumber: {
    fontFamily: fonts.serifBoldItalic,
    fontSize: 20,
  },
  text: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
    marginRight: 8,
  },
  pencil: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StickyTaskRow;
