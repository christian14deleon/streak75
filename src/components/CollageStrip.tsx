import React from 'react';
import { View, Text, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { AppPressable } from './AppPressable';
import { Badge } from './Badge';
import { colors, radii, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { img } from '../data/images';
import { formatJoined } from '../data/seed';

interface CollageStripProps {
  images: string[]; // image-registry keys (uses up to 4)
  joined?: number; // for the floating "+N joined" pill
  name?: string; // label beneath the strip
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  height?: number;
  showPill?: boolean;
  showName?: boolean;
}

// A horizontal 4-image collage strip with a floating white "+N joined" pill and
// a name label beneath. This is the recurring "challenge preview" block on the
// Welcome screen (1), the Select-Challenge cards (11), and the header collage on
// the task editor (13). Tapping it (when onPress is given) selects that
// challenge. Built on AppPressable so selection plays the tap sound.
export function CollageStrip({
  images,
  joined,
  name,
  onPress,
  style,
  height = 118,
  showPill = true,
  showName = true,
}: CollageStripProps) {
  const cells = images.slice(0, 4);
  const Container: React.ComponentType<any> = onPress ? AppPressable : View;
  const containerProps = onPress ? { onPress } : {};

  return (
    <Container {...containerProps} style={[styles.wrap, style]}>
      <View style={[styles.strip, shadows.soft, { height }]}>
        {cells.map((key, i) => {
          const source = img(key);
          return (
            <View
              key={`${key}-${i}`}
              style={[styles.cell, i < cells.length - 1 && styles.cellGap]}
            >
              {source ? (
                <Image source={source} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={[styles.image, styles.imageFallback]} />
              )}
            </View>
          );
        })}

        {showPill && typeof joined === 'number' ? (
          <View style={styles.pill} pointerEvents="none">
            <Badge label={`${formatJoined(joined)} joined`} tone="white" small />
          </View>
        ) : null}
      </View>

      {showName && name ? <Text style={styles.name}>{name}</Text> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch' },
  strip: {
    flexDirection: 'row',
    borderRadius: radii.card,
    backgroundColor: colors.white,
    padding: 6,
  },
  cell: {
    flex: 1,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  cellGap: { marginRight: 6 },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.disabledBg,
  },
  imageFallback: { backgroundColor: colors.mint },
  pill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  name: {
    fontFamily: fonts.serifBold,
    fontSize: 19,
    color: colors.ink,
    marginTop: 10,
    marginLeft: 2,
  },
});

export default CollageStrip;
