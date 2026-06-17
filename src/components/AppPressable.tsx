import React, { useCallback } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import { useSound } from '../sound/SoundProvider';

type StyleFn = (state: { pressed: boolean }) => StyleProp<ViewStyle>;

interface AppPressableProps extends Omit<PressableProps, 'style' | 'onPress'> {
  style?: StyleProp<ViewStyle> | StyleFn;
  onPress?: (e: GestureResponderEvent) => void;
  // Set false to suppress the click (e.g. drag handles that only need haptics,
  // or controls that fire sound elsewhere).
  soundOnPress?: boolean;
  // Default pressed-state dimming for tactile feedback; set 1 to disable.
  pressedOpacity?: number;
}

// The single touchable primitive for the whole app. Its onPress plays the tap
// sound + light haptic (via useSound) and THEN calls the caller's handler, so
// every button, card, row, and icon built on top of this gets audio/haptic
// feedback with zero extra wiring.
export function AppPressable({
  style,
  onPress,
  soundOnPress = true,
  pressedOpacity = 0.6,
  disabled,
  children,
  ...rest
}: AppPressableProps) {
  const { playTap } = useSound();

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (disabled) return;
      if (soundOnPress) playTap();
      onPress?.(e);
    },
    [disabled, soundOnPress, playTap, onPress]
  );

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      onPress={handlePress}
      style={(state) => {
        const base = typeof style === 'function' ? style(state) : style;
        return [base, state.pressed && !disabled ? { opacity: pressedOpacity } : null];
      }}
    >
      {children}
    </Pressable>
  );
}

export default AppPressable;
