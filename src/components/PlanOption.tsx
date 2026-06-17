import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { AppPressable } from './AppPressable';
import { Radio } from './Radio';
import { Badge } from './Badge';
import { colors, radii, shadows } from '../theme';
import { fonts } from '../theme/typography';
import type { Plan } from '../types';

interface PlanOptionProps {
  plan: Plan;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

// One selectable plan row on the mock paywall (screen 21): a rounded card with a
// leading radio, the plan title and price, and — when present — a small badge
// tab ("Most popular" / "Save 75%") that overlaps the top edge. Selected => 2px
// ink border; unselected rows read slightly muted. Selecting NEVER charges
// anything; it only updates which plan is highlighted in the store.
export function PlanOption({ plan, selected, onPress, style }: PlanOptionProps) {
  return (
    <View style={[styles.wrap, style]}>
      {plan.badge ? (
        <View style={styles.badgeWrap} pointerEvents="none">
          <Badge label={plan.badge.label} tone={plan.badge.tone} small />
        </View>
      ) : null}

      <AppPressable
        onPress={onPress}
        style={[styles.card, shadows.soft, selected && styles.cardSelected]}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
      >
        <Radio selected={selected} size={22} muted={!selected} />
        <View style={styles.textWrap}>
          <Text style={[styles.title, !selected && styles.titleMuted]}>{plan.title}</Text>
        </View>
        <Text style={[styles.price, !selected && styles.priceMuted]}>{plan.price}</Text>
      </AppPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    // Reserve room for the badge tab that pokes above the card.
    paddingTop: 12,
  },
  badgeWrap: {
    position: 'absolute',
    top: 0,
    right: 16,
    zIndex: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  cardSelected: { borderColor: colors.ink },
  textWrap: { flex: 1, marginLeft: 14 },
  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 17,
    color: colors.ink,
  },
  titleMuted: { color: colors.textMuted },
  price: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.ink,
  },
  priceMuted: { color: colors.textFaint },
});

export default PlanOption;
