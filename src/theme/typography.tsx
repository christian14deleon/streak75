import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle } from 'react-native';
import { colors } from './index';

// Font family names exactly as registered by the @expo-google-fonts packages.
// Using these constants everywhere avoids typos and keeps weight/style mapping
// in one place.
export const fonts = {
  // High-contrast serif for display headlines (Playfair Display).
  serifRegular: 'PlayfairDisplay_400Regular',
  serifBold: 'PlayfairDisplay_700Bold',
  serifItalic: 'PlayfairDisplay_400Regular_Italic',
  serifBoldItalic: 'PlayfairDisplay_700Bold_Italic',
  // Clean geometric sans for body / labels / buttons (Inter).
  sansRegular: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const;

type RichStyle = 'regular' | 'bold' | 'italic' | 'boldItalic';

const serifFamilyFor: Record<RichStyle, string> = {
  regular: fonts.serifRegular,
  bold: fonts.serifBold,
  italic: fonts.serifItalic,
  boldItalic: fonts.serifBoldItalic,
};

interface Token {
  text: string;
  style: RichStyle;
}

// Parse a markup string into styled tokens. Supported (single-level) markers:
//   ***both***  -> bold italic
//   **bold**    -> bold
//   *italic*    -> italic
//   plain       -> regular
// The headlines in this app mix weights/styles within one line; this lets each
// screen express that emphasis inline as plain strings (verbatim from the spec)
// instead of hand-building nested <Text> trees.
export function parseRich(input: string): Token[] {
  const tokens: Token[] = [];
  // Order matters: try the 3-star (bold italic) form before 2-star before 1-star.
  const re = /\*\*\*([^*]+?)\*\*\*|\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(input)) !== null) {
    if (m.index > lastIndex) {
      tokens.push({ text: input.slice(lastIndex, m.index), style: 'regular' });
    }
    if (m[1] !== undefined) tokens.push({ text: m[1], style: 'boldItalic' });
    else if (m[2] !== undefined) tokens.push({ text: m[2], style: 'bold' });
    else if (m[3] !== undefined) tokens.push({ text: m[3], style: 'italic' });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < input.length) {
    tokens.push({ text: input.slice(lastIndex), style: 'regular' });
  }
  return tokens;
}

interface RichHeadlineProps extends Omit<TextProps, 'children'> {
  children: string;
  size?: number;
  color?: string;
  align?: TextStyle['textAlign'];
  lineHeight?: number;
  // Base weight for the un-marked (regular) runs. The default is regular serif,
  // but a few headlines read better as a bold base with italic emphasis.
  baseStyle?: RichStyle;
  letterSpacing?: number;
}

// Renders a markup string as a serif display headline. Marked runs switch to
// the bold / italic / bold-italic Playfair face; everything else uses baseStyle.
export function RichHeadline({
  children,
  size = 36,
  color = colors.ink,
  align = 'center',
  lineHeight,
  baseStyle = 'regular',
  letterSpacing = 0,
  style,
  ...rest
}: RichHeadlineProps) {
  const tokens = parseRich(children);
  const resolvedLineHeight = lineHeight ?? Math.round(size * 1.12);

  return (
    <Text
      {...rest}
      style={[
        {
          fontSize: size,
          lineHeight: resolvedLineHeight,
          color,
          textAlign: align,
          letterSpacing,
          fontFamily: serifFamilyFor[baseStyle],
        },
        style,
      ]}
    >
      {tokens.map((t, i) => {
        // A marked run inside a bold-base headline should still resolve to a
        // sensible face: an italic mark on a bold base becomes bold-italic.
        let resolved = t.style;
        if (t.style === 'regular') resolved = baseStyle;
        else if (baseStyle === 'bold' && t.style === 'italic') resolved = 'boldItalic';
        return (
          <Text key={i} style={{ fontFamily: serifFamilyFor[resolved] }}>
            {t.text}
          </Text>
        );
      })}
    </Text>
  );
}

// A few reusable sans text presets for body copy, labels, and captions.
export const textStyles = StyleSheet.create({
  body: {
    fontFamily: fonts.sansRegular,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  bodyMuted: {
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    lineHeight: 21,
    color: colors.textMuted,
  },
  label: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.text,
  },
  labelMedium: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.text,
  },
  caption: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    color: colors.textFaint,
  },
  button: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 17,
    color: colors.white,
  },
  link: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});

export default RichHeadline;
