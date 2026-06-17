import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../theme';

interface RulerProgressProps {
  current: number; // current day (1-based)
  total: number; // total days
  style?: StyleProp<ViewStyle>;
  tickCount?: number;
}

// Thin decorative ruler-style progress indicator under the Day pill on the
// Today screen. Renders a fixed row of ticks; the leading fraction is inked to
// reflect challenge progress. Purely visual (not draggable).
export function RulerProgress({ current, total, style, tickCount = 44 }: RulerProgressProps) {
  const fraction = total > 0 ? Math.max(0, Math.min(1, current / total)) : 0;
  const filledCount = Math.round(fraction * tickCount);

  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: tickCount }, (_, i) => {
        const filled = i < filledCount;
        const major = i % 5 === 0;
        return (
          <View
            key={i}
            style={[
              styles.tick,
              { height: major ? 18 : 11 },
              filled ? styles.filled : styles.empty,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tick: {
    width: 2,
    borderRadius: 1,
  },
  filled: { backgroundColor: colors.ink },
  empty: { backgroundColor: colors.hairline },
});

export default RulerProgress;
