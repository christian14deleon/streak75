import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { DeviceFrame } from './DeviceFrame';
import { DayOneCard } from './DayOneCard';
import { colors } from '../theme';
import { fonts } from '../theme/typography';
import { img } from '../data/images';

interface ShareStoryFrameProps {
  style?: StyleProp<ViewStyle>;
}

// A faux Instagram-story export used on the "make it official" screen (23): a
// segmented story progress bar, a "you · just now" header, a full-bleed portrait
// background, a large day number overlay, and the DayOneCard layered on as a
// share sticker. Everything is local/mock — nothing is actually posted. The
// DayOneCard reads the live challenge store, so the sticker reflects the user's
// real tasks and dates.
export function ShareStoryFrame({ style }: ShareStoryFrameProps) {
  const portrait = img('portrait');
  const avatar = img('avatar_you');

  return (
    <DeviceFrame style={style} screenColor={colors.ink}>
      {/* Full-bleed background portrait. */}
      {portrait ? (
        <Image source={portrait} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.bgFallback]} />
      )}
      {/* Darkening scrim for legibility of overlays. */}
      <View style={[StyleSheet.absoluteFill, styles.scrim]} pointerEvents="none" />

      {/* Segmented story progress bar. */}
      <View style={styles.segments}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.segmentTrack}>
            <View style={[styles.segmentFill, { width: i === 0 ? '100%' : '0%' }]} />
          </View>
        ))}
      </View>

      {/* Header: avatar + "you" + "just now". */}
      <View style={styles.header}>
        {avatar ? (
          <Image source={avatar} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]} />
        )}
        <Text style={styles.handle}>you</Text>
        <Text style={styles.timestamp}>just now</Text>
      </View>

      {/* Big day-number overlay. */}
      <Text style={styles.bigDay}>09</Text>

      {/* DayOneCard share sticker, slightly rotated near the lower third. */}
      <View style={styles.sticker}>
        <DayOneCard variant="sticker" maxTasks={5} />
      </View>
    </DeviceFrame>
  );
}

const styles = StyleSheet.create({
  bgFallback: { backgroundColor: colors.lilac },
  scrim: { backgroundColor: 'rgba(10,10,10,0.18)' },
  segments: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    gap: 4,
  },
  segmentTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
    backgroundColor: colors.white,
  },
  header: {
    position: 'absolute',
    top: 26,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.disabledBg,
  },
  avatarFallback: { backgroundColor: colors.blush },
  handle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.white,
    marginLeft: 8,
  },
  timestamp: {
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 8,
  },
  bigDay: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    fontFamily: fonts.serifBoldItalic,
    fontSize: 96,
    color: 'rgba(255,255,255,0.92)',
  },
  sticker: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: '12%',
    transform: [{ rotate: '-3deg' }],
  },
});

export default ShareStoryFrame;
