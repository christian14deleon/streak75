import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, radii, shadows } from '../theme';
import { fonts } from '../theme/typography';

type Tone = 'black' | 'green' | 'white';

interface BadgeProps {
  label: string;
  tone?: Tone;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
}

// Pill badge used for "Most popular" (black), "Save 75%" (green),
// "+30% success with friends" (black), and the white "+N joined" /
// "Among 24,000+ women" shadowed pills.
export function Badge({ label, tone = 'black', style, small = false }: BadgeProps) {
  const toneStyle =
    tone === 'black'
      ? { backgroundColor: colors.badgeBlack }
      : tone === 'green'
        ? { backgroundColor: colors.badgeGreen }
        : { backgroundColor: colors.white };

  const textColor = tone === 'white' ? colors.text : colors.white;

  return (
    <View
      style={[
        styles.base,
        small ? styles.small : null,
        toneStyle,
        tone === 'white' ? shadows.pill : null,
        style,
      ]}
    >
      <Text style={[styles.label, small ? styles.labelSmall : null, { color: textColor }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  small: { paddingHorizontal: 11, paddingVertical: 5 },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  labelSmall: { fontSize: 12 },
});

export default Badge;
