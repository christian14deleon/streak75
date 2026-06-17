import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, radii, shadows } from '../theme';

interface DeviceFrameProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  // Aspect ratio (width / height) of the inner screen. Defaults to a tall phone.
  aspectRatio?: number;
  // Screen background behind the children.
  screenColor?: string;
}

// A stylized phone mockup: a dark rounded bezel with a centered notch pill and a
// rounded inner "screen" that clips its children. Used to frame the daily-to-do
// preview (screen 9) and as the canvas for the shareable story frame (screen 23).
export function DeviceFrame({
  children,
  style,
  aspectRatio = 0.49,
  screenColor = colors.bg,
}: DeviceFrameProps) {
  return (
    <View style={[styles.bezel, shadows.floating, { aspectRatio }, style]}>
      <View style={[styles.screen, { backgroundColor: screenColor }]}>
        {children}
        {/* Notch sits above the screen content but inside the bezel. */}
        <View pointerEvents="none" style={styles.notch} />
      </View>
    </View>
  );
}

const BEZEL_PAD = 8;

const styles = StyleSheet.create({
  bezel: {
    backgroundColor: colors.ink,
    borderRadius: 40,
    padding: BEZEL_PAD,
    alignSelf: 'center',
  },
  screen: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
  },
  notch: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    width: 92,
    height: 22,
    borderRadius: 12,
    backgroundColor: colors.ink,
  },
});

export default DeviceFrame;
