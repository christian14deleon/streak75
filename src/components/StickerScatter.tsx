import React from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle, DimensionValue } from 'react-native';
import { img } from '../data/images';

interface ScatterItem {
  image: string; // image-registry key
  size: number;
  rotate: number; // degrees
  top?: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;
  bottom?: DimensionValue;
}

type Preset = 'thatGirl' | 'matching';

// Hand-placed "cut-out sticker" layouts that float around the hype screens.
// Defined here (rather than in each screen) so the decorative composition lives
// in one place. `thatGirl` dresses screen 2 ("Become that girl"); `matching`
// frames the matching loader (screen 19).
const PRESETS: Record<Preset, ScatterItem[]> = {
  thatGirl: [
    { image: 'sticker_matcha', size: 92, rotate: -12, top: '6%', left: '8%' },
    { image: 'sticker_flower', size: 78, rotate: 10, top: '10%', right: '6%' },
    { image: 'sticker_book', size: 96, rotate: -8, top: '34%', right: '10%' },
    { image: 'sticker_tumbler', size: 80, rotate: 14, top: '40%', left: '6%' },
    { image: 'sticker_roller', size: 104, rotate: -6, bottom: '16%', left: '10%' },
    { image: 'sticker_camera', size: 86, rotate: 12, bottom: '12%', right: '8%' },
  ],
  matching: [
    { image: 'sticker_beach', size: 90, rotate: -10, top: '8%', left: '8%' },
    { image: 'sticker_books', size: 92, rotate: 12, top: '12%', right: '8%' },
    { image: 'sticker_lilies', size: 96, rotate: 8, bottom: '14%', left: '8%' },
    { image: 'sticker_matcha', size: 84, rotate: -12, bottom: '12%', right: '10%' },
  ],
};

interface StickerScatterProps {
  preset?: Preset;
  items?: ScatterItem[]; // override the preset with a custom layout
  style?: StyleProp<ViewStyle>;
}

// Renders decorative stickers absolutely within a fill container. Intended to
// sit BEHIND the screen's foreground content (place it first / lower z-index).
// pointerEvents is disabled so it never intercepts taps.
export function StickerScatter({ preset = 'thatGirl', items, style }: StickerScatterProps) {
  const layout = items ?? PRESETS[preset];

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      {layout.map((it, i) => {
        const source = img(it.image);
        if (!source) return null;
        return (
          <Image
            key={`${it.image}-${i}`}
            source={source}
            resizeMode="contain"
            style={{
              position: 'absolute',
              width: it.size,
              height: it.size,
              top: it.top,
              left: it.left,
              right: it.right,
              bottom: it.bottom,
              transform: [{ rotate: `${it.rotate}deg` }],
            }}
          />
        );
      })}
    </View>
  );
}

export default StickerScatter;
