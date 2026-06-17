import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, Easing, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { RichHeadline } from '../theme/typography';
import { Badge } from './Badge';
import { colors, shadows } from '../theme';
import { img } from '../data/images';
import { useAutoAdvance } from '../utils/useAutoAdvance';
import { useSound } from '../sound/SoundProvider';

interface MatchingLoaderProps {
  headline: string; // rich markup string, e.g. "Matching *your* energy"
  countLabel: string; // e.g. "Among 24,000+ women"
  avatarKey?: string;
  durationMs?: number;
  onDone: () => void;
  style?: StyleProp<ViewStyle>;
}

// The center cluster of the matching loader (screen 19): an avatar inside a
// hairline ring that gently pulses, a serif headline, and a count pill. After
// `durationMs` it calls onDone exactly once (the screen then advances). The
// pulse uses the classic Animated API (transform scale, native driver) and is
// independent of the auto-advance progress driver.
export function MatchingLoader({
  headline,
  countLabel,
  avatarKey = 'avatar_match',
  durationMs = 2000,
  onDone,
  style,
}: MatchingLoaderProps) {
  const { selectionTick } = useSound();
  const pulse = useRef(new Animated.Value(0)).current;

  // Drive the auto-advance (we don't bind its value to anything visual here —
  // the pulse is the visible motion — but it guarantees the single onDone call).
  useAutoAdvance(durationMs, onDone);

  useEffect(() => {
    // A soft selection tick as the matching UI appears.
    selectionTick();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });

  const avatar = img(avatarKey);

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.ringArea}>
        {/* Expanding pulse halo behind the avatar. */}
        <Animated.View
          style={[
            styles.pulseRing,
            { opacity: ringOpacity, transform: [{ scale: ringScale }] },
          ]}
        />
        <View style={styles.ring}>
          {avatar ? (
            <Image source={avatar} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]} />
          )}
        </View>
      </View>

      <RichHeadline size={32} align="center" style={styles.headline}>
        {headline}
      </RichHeadline>

      <Badge label={countLabel} tone="white" style={styles.countPill} />
    </View>
  );
}

const RING = 132;
const AVATAR = 108;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  ringArea: {
    width: RING + 40,
    height: RING + 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  pulseRing: {
    position: 'absolute',
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    borderWidth: 2,
    borderColor: colors.ringHairline,
  },
  ring: {
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    borderWidth: 1,
    borderColor: colors.ringHairline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    ...shadows.soft,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: colors.disabledBg,
  },
  avatarFallback: { backgroundColor: colors.lilac },
  headline: { color: colors.ink, marginBottom: 18 },
  countPill: { alignSelf: 'center' },
});

export default MatchingLoader;
