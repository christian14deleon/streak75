import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, radii } from '../theme';

interface ProgressBarProps {
  // 0..1 fill fraction.
  progress: number;
  style?: StyleProp<ViewStyle>;
  height?: number;
  width?: number | `${number}%`;
}

// The thin centered progress pill shown only on the questionnaire screens
// (~3–10). Fills left→right as the user advances. Track is light grey; fill is
// ink black.
export function ProgressBar({
  progress,
  style,
  height = 6,
  width = 200,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View
      style={[
        styles.track,
        { height, width, borderRadius: height / 2 },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.disabledBg,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.ink,
  },
});

export default ProgressBar;
