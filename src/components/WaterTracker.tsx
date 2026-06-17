import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppPressable } from './AppPressable';
import { colors, radii, spacing, shadows } from '../theme';
import { fonts } from '../theme/typography';

interface WaterTrackerProps {
  value: number; // glasses filled today
  goal: number; // daily goal
  onChange: (n: number) => void;
  style?: StyleProp<ViewStyle>;
}

// Daily water-intake tracker for the Today screen — a row of glass icons you tap
// to fill toward the daily goal. Tapping a glass fills up to it; tapping the
// last filled glass empties it. Built on AppPressable so each tap plays the
// click + haptic. The count is persisted per day by the caller.
const WATER_BLUE = '#5FA8E0';

export function WaterTracker({ value, goal, onChange, style }: WaterTrackerProps) {
  const filled = Math.max(0, Math.min(goal, value));

  const onTapGlass = (index: number) => {
    const target = index + 1;
    // Tapping the currently-last-filled glass empties that one (toggle down).
    onChange(filled === target ? index : target);
  };

  return (
    <View style={[styles.card, shadows.soft, style]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="water" size={18} color={WATER_BLUE} />
          <Text style={styles.title}>Water</Text>
        </View>
        <Text style={styles.count}>{`${filled} of ${goal} glasses`}</Text>
      </View>

      <View style={styles.glasses}>
        {Array.from({ length: goal }, (_, i) => {
          const isFilled = i < filled;
          return (
            <AppPressable
              key={i}
              onPress={() => onTapGlass(i)}
              style={styles.glass}
              hitSlop={4}
              accessibilityLabel={`Glass ${i + 1}`}
            >
              <Ionicons
                name={isFilled ? 'water' : 'water-outline'}
                size={26}
                color={isFilled ? WATER_BLUE : colors.hairline}
              />
            </AppPressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
  },
  count: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.textMuted,
  },
  glasses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  glass: {
    padding: 4,
  },
});

export default WaterTracker;
