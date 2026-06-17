import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppPressable } from './AppPressable';
import { Radio } from './Radio';
import { colors, radii, shadows } from '../theme';
import { fonts } from '../theme/typography';

export type GradientName = 'sunrise' | 'cool' | 'orange' | 'green';

const GRADIENTS: Record<GradientName, [string, string]> = {
  sunrise: [colors.gradSunriseA, colors.gradSunriseB],
  cool: [colors.gradCoolA, colors.gradCoolB],
  orange: [colors.gradOrangeA, colors.gradOrangeB],
  green: [colors.gradGreenA, colors.gradGreenB],
};

interface GradientTileProps {
  label: string;
  gradient: GradientName;
  selected: boolean;
  onPress: () => void;
  // Optional Ionicons glyph shown as a floating badge in the tile's top-left.
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

// Soft gradient tile for the "ideal day" 2×2 (screen 6). The gradient fills the
// tile; an optional icon badge floats top-left, and a radio + label sit at the
// bottom on a subtle scrim for legibility.
export function GradientTile({ label, gradient, selected, onPress, icon, style }: GradientTileProps) {
  const pair = GRADIENTS[gradient];
  return (
    <AppPressable
      onPress={onPress}
      style={[styles.tile, shadows.soft, selected && styles.tileSelected, style]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <LinearGradient
        colors={pair}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {icon ? (
        <View style={styles.iconBadge}>
          <Ionicons name={icon} size={20} color={colors.ink} />
        </View>
      ) : null}
      <View style={styles.labelRow}>
        <Radio selected={selected} size={20} />
        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>
      </View>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    height: 132,
    borderRadius: radii.card,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  tileSelected: { borderColor: colors.ink },
  iconBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.78)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    flex: 1,
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    color: colors.text,
  },
});

export default GradientTile;
