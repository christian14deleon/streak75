import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes } from '../theme';

interface RadioProps {
  selected: boolean;
  size?: number;
  // When part of a single-select group with an active item, inactive items can
  // render slightly muted (handled by callers via the `muted` flag).
  muted?: boolean;
}

// Selection indicator: hollow circle when unselected, solid black circle with a
// white check when selected. Used by option cards, radio rows, and plan rows.
export function Radio({ selected, size = sizes.radio, muted = false }: RadioProps) {
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: muted ? colors.hairline : colors.ink,
        },
        selected && styles.selected,
      ]}
    >
      {selected ? (
        <Ionicons name="checkmark" size={size * 0.62} color={colors.white} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  selected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
});

export default Radio;
