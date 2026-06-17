import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { img } from '../data/images';
import type { FriendSeed } from '../types';

interface FriendCardProps {
  friend: FriendSeed;
  style?: StyleProp<ViewStyle>;
}

// A friend's progress card for the social proof screen (screen 8): a circular
// avatar, their name, a small "Day N" pill, and their daily checklist with the
// completed items checked off. Purely display — all data is local seed content.
export function FriendCard({ friend, style }: FriendCardProps) {
  const avatar = img(friend.avatar);

  return (
    <View style={[styles.card, shadows.card, style]}>
      <View style={styles.header}>
        {avatar ? (
          <Image source={avatar} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]} />
        )}
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>
            {friend.name}
          </Text>
          <View style={styles.dayPill}>
            <Text style={styles.dayPillText}>{`Day ${friend.day}`}</Text>
          </View>
        </View>
      </View>

      <View style={styles.list}>
        {friend.checklist.map((item, i) => (
          <View key={i} style={styles.checkRow}>
            <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
              {item.done ? (
                <Ionicons name="checkmark" size={12} color={colors.white} />
              ) : null}
            </View>
            <Text
              style={[styles.checkLabel, item.done && styles.checkLabelDone]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: 16,
    width: 250,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.disabledBg,
  },
  avatarFallback: { backgroundColor: colors.lilac },
  headerText: { marginLeft: 12, flex: 1 },
  name: {
    fontFamily: fonts.serifBold,
    fontSize: 18,
    color: colors.ink,
    textTransform: 'lowercase',
  },
  dayPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.bg,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  dayPillText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.2,
  },
  list: { gap: 10 },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxDone: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  checkLabel: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.text,
  },
  checkLabelDone: {
    color: colors.textFaint,
    textDecorationLine: 'line-through',
  },
});

export default FriendCard;
