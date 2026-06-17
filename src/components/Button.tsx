import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, ActivityIndicator } from 'react-native';
import { AppPressable } from './AppPressable';
import { colors, radii, sizes, shadows } from '../theme';
import { fonts } from '../theme/typography';

type Variant = 'primary' | 'secondary';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  // Optional leading glyph (e.g. Apple / Google logo, share icon).
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// The reusable CTA. Primary = full-width black pill with white semibold text
// (~58px tall, ~28px radius). Secondary = white pill, 1px border, dark text.
// Disabled = very light grey fill + grey text. Reproduces the
// "disabled-until-valid" pattern used on every onboarding "Continue".
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  leftIcon,
  fullWidth = true,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  const containerStyle: StyleProp<ViewStyle> = [
    styles.base,
    fullWidth && styles.fullWidth,
    isPrimary ? styles.primary : styles.secondary,
    isPrimary && !isDisabled ? shadows.pill : null,
    isDisabled ? styles.disabled : null,
    style,
  ];

  const textColor = isDisabled
    ? colors.disabledText
    : isPrimary
      ? colors.white
      : colors.ink;

  return (
    <AppPressable
      onPress={onPress}
      disabled={isDisabled}
      // Disabled buttons shouldn't click; valid ones use the normal tap sound.
      soundOnPress={!isDisabled}
      style={containerStyle}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      <View style={styles.inner}>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <>
            {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
            <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
              {label}
            </Text>
          </>
        )}
      </View>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: sizes.buttonHeight,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  fullWidth: { alignSelf: 'stretch' },
  primary: { backgroundColor: colors.ink },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    backgroundColor: colors.disabledBg,
    borderWidth: 0,
  },
  inner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  icon: { marginRight: 10 },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 17,
  },
});

export default Button;
