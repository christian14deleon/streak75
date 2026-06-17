import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppPressable } from './AppPressable';
import { colors, sizes, shadows } from '../theme';

interface CloseButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

// Circular white close (X) button, top-right — used on the invite modal
// (screen 20) and any other dismissible sheet.
export function CloseButton({ onPress, style }: CloseButtonProps) {
  return (
    <AppPressable
      onPress={onPress}
      style={[styles.btn, shadows.soft, style]}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Close"
    >
      <Ionicons name="close" size={22} color={colors.ink} />
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: sizes.closeButton,
    height: sizes.closeButton,
    borderRadius: sizes.closeButton / 2,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CloseButton;
