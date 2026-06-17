import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { AppPressable } from './AppPressable';
import { Radio } from './Radio';
import { colors, radii, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { img } from '../data/images';

interface OptionCardProps {
  label: string;
  imageKey?: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

// Image-topped rounded card for the 2×2 single-select grids (screens 4, 5).
// Shows a photo, a label, and a selection radio. Selected => 2px ink border.
export function OptionCard({ label, imageKey, selected, onPress, style }: OptionCardProps) {
  const source = img(imageKey);
  return (
    <AppPressable
      onPress={onPress}
      style={[
        styles.card,
        shadows.soft,
        selected && styles.cardSelected,
        style,
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View style={styles.imageWrap}>
        {source ? (
          <Image source={source} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imageFallback]} />
        )}
      </View>
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
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    padding: 8,
  },
  cardSelected: { borderColor: colors.ink },
  imageWrap: {
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 104,
    backgroundColor: colors.disabledBg,
  },
  imageFallback: { backgroundColor: colors.mint },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 8,
  },
  label: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.text,
  },
});

export default OptionCard;
