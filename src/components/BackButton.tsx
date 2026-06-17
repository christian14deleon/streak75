import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppPressable } from './AppPressable';
import { colors, sizes, shadows } from '../theme';

interface BackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

// Circular white back button (chevron-left, soft shadow), top-left on the
// onboarding screens.
export function BackButton({ onPress, style }: BackButtonProps) {
  return (
    <AppPressable
      onPress={onPress}
      style={[styles.btn, shadows.soft, style]}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Back"
    >
      <Ionicons name="chevron-back" size={22} color={colors.ink} />
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: sizes.backButton,
    height: sizes.backButton,
    borderRadius: sizes.backButton / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BackButton;
