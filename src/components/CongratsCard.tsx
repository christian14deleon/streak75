import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { RichHeadline } from '../theme/typography';
import { DayOneCard } from './DayOneCard';
import { colors, spacing } from '../theme';

interface CongratsCardProps {
  headline?: string; // rich markup string
  style?: StyleProp<ViewStyle>;
}

// The visual cluster for the congrats screen (22): a serif headline above the
// canonical DayOneCard (which reads the live challenge store). The screen owns
// the pinned "Start now" CTA; this component just composes the headline + card
// so the layout stays consistent.
export function CongratsCard({
  headline = "Congrats. You're *ready* to start your challenge",
  style,
}: CongratsCardProps) {
  return (
    <View style={[styles.wrap, style]}>
      <RichHeadline size={34} align="center" style={styles.headline}>
        {headline}
      </RichHeadline>
      <DayOneCard variant="full" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'stretch' },
  headline: {
    color: colors.ink,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.sm,
  },
});

export default CongratsCard;
