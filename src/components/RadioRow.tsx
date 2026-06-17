import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppPressable } from './AppPressable';
import { Radio } from './Radio';
import { colors, radii, shadows } from '../theme';
import { fonts } from '../theme/typography';

interface RadioRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  // Optional leading Ionicons glyph, shown in a soft tinted circle.
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

// Full-width white pill row with a trailing radio and an optional leading icon.
// Used by the vertical single-select lists (e.g. screen 7 "How did you hear").
export function RadioRow({ label, selected, onPress, icon, style }: RadioRowProps) {
  return (
    <AppPressable
      onPress={onPress}
      style={[styles.row, shadows.soft, selected && styles.rowSelected, style]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      {icon ? (
        <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
          <Ionicons name={icon} size={18} color={selected ? colors.white : colors.ink} />
        </View>
      ) : null}
      <Text style={styles.label}>{label}</Text>
      <Radio selected={selected} size={22} />
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  rowSelected: { borderColor: colors.ink },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconWrapSelected: { backgroundColor: colors.ink },
  label: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.text,
    marginRight: 12,
  },
});

export default RadioRow;
