// Streak75 design system — single source of truth for color, spacing, radii,
// and shadow. No screen or component should hard-code these values; import from
// here so the whole app stays visually consistent and is trivially re-themeable.

export const colors = {
  // Backgrounds: pure / near white.
  bg: '#FAFAF8',
  white: '#FFFFFF',

  // Ink / text.
  ink: '#0A0A0A', // primary black (buttons, headlines)
  text: '#161616',
  textMuted: '#6B6B6B',
  textFaint: '#9A9A9A',

  // Borders / hairlines.
  border: '#E7E5E0',
  borderStrong: '#0A0A0A',
  hairline: '#D9D7D1',

  // Disabled button.
  disabledBg: '#EFEDE9',
  disabledText: '#B4B1AB',

  // Accent pastels for sticky notes (rotate through these).
  mint: '#CBE8D2',
  butter: '#F6E7A8',
  blush: '#F4CBD4',
  lilac: '#E0D4F0',
  peach: '#F7D7BE',

  // Stronger pastel text/number ink on stickies.
  mintInk: '#2F6B45',
  butterInk: '#8A6B12',
  blushInk: '#9C2F46',

  // Badge pills.
  badgeBlack: '#0A0A0A',
  badgeGreen: '#2BB673',
  badgeGreenSoft: '#E3F6EC',

  // Gradient tile endpoints (warm / cool / orange / green).
  gradSunriseA: '#FFD9A0',
  gradSunriseB: '#FFB48A',
  gradCoolA: '#BFD9F2',
  gradCoolB: '#9CC0EC',
  gradOrangeA: '#FFC58A',
  gradOrangeB: '#FF9E80',
  gradGreenA: '#C7E9C0',
  gradGreenB: '#9FD79A',

  // Misc.
  shadow: '#000000',
  scrim: 'rgba(10,10,10,0.45)',
  ringHairline: '#CFCDC7',
  storyBar: '#FFFFFF',
} as const;

// Rotating sticky-note palette helper (color + ink for the hand-drawn number).
export const stickyPalette = [
  { bg: colors.mint, ink: colors.mintInk },
  { bg: colors.butter, ink: colors.butterInk },
  { bg: colors.blush, ink: colors.blushInk },
] as const;

export function stickyFor(index: number) {
  return stickyPalette[index % stickyPalette.length];
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  screenH: 20, // default horizontal screen padding
} as const;

export const radii = {
  sm: 10,
  md: 16,
  lg: 20,
  card: 24,
  xl: 28, // pill / large button radius
  pill: 999,
} as const;

export const sizes = {
  buttonHeight: 58,
  inputHeight: 56,
  backButton: 44,
  closeButton: 36,
  radio: 24,
  tabBarHeight: 64,
} as const;

// Soft diffuse card shadow (works cross-platform: iOS shadow* + Android
// elevation). Spread as ...shadows.card into a style object.
export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  soft: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  pill: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  floating: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
} as const;

export const theme = { colors, spacing, radii, sizes, shadows, stickyPalette };
export default theme;
