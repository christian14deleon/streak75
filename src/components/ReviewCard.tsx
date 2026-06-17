import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, shadows } from '../theme';
import { fonts } from '../theme/typography';
import type { ReviewSeed } from '../types';

interface ReviewCardProps {
  review: ReviewSeed;
  style?: StyleProp<ViewStyle>;
}

// A compact testimonial card for the horizontally-scrolling review rail under
// the task editor (screen 13). Shows a 5-star row, the blurb, and the handle.
export function ReviewCard({ review, style }: ReviewCardProps) {
  return (
    <View style={[styles.card, shadows.soft, style]}>
      <View style={styles.stars}>
        {Array.from({ length: 5 }, (_, i) => (
          <Ionicons
            key={i}
            name="star"
            size={13}
            color={i < review.stars ? colors.ink : colors.hairline}
            style={styles.star}
          />
        ))}
      </View>
      <Text style={styles.blurb} numberOfLines={3}>
        {review.blurb}
      </Text>
      <Text style={styles.username} numberOfLines={1}>
        {`@${review.username}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 210,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 16,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: { marginRight: 2 },
  blurb: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 10,
  },
  username: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: colors.textFaint,
  },
});

export default ReviewCard;
