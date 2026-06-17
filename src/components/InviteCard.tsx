import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { RichHeadline } from '../theme/typography';
import { colors, radii, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { truncatePossessive } from '../utils/truncate';

interface InviteCardProps {
  inviterName: string;
  code: string;
  style?: StyleProp<ViewStyle>;
  rotate?: number;
}

// The shareable invite card on the "start with friends" modal (screen 20). A
// warm, slightly-rotated "paper" card (faux texture via layered tints + a
// dashed hairline border) carrying the invite headline, a large spaced invite
// CODE, and a caption. Long inviter names are truncated to the original app's
// "Christ…'s" possessive form via truncatePossessive. The code is a local MOCK
// — no invitation is actually created or sent.
export function InviteCard({ inviterName, code, style, rotate = -2 }: InviteCardProps) {
  const possessive = truncatePossessive(inviterName);

  return (
    <View style={[styles.card, shadows.floating, { transform: [{ rotate: `${rotate}deg` }] }, style]}>
      {/* Faux paper grain: two very soft offset tints. */}
      <View pointerEvents="none" style={styles.grainA} />
      <View pointerEvents="none" style={styles.grainB} />

      <RichHeadline size={24} align="center" style={styles.headline}>
        {`You're *invited* to join ${possessive} challenge`}
      </RichHeadline>

      <Text style={styles.code}>{code}</Text>

      <Text style={styles.caption}>Use this code to join</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FBF6EC', // warm paper
    borderRadius: radii.card,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.hairline,
    paddingHorizontal: 26,
    paddingVertical: 30,
    overflow: 'hidden',
  },
  grainA: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  grainB: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(246,231,168,0.25)',
  },
  headline: {
    color: colors.ink,
    marginBottom: 22,
  },
  code: {
    fontFamily: fonts.serifBold,
    fontSize: 34,
    letterSpacing: 8,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 12,
  },
  caption: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default InviteCard;
