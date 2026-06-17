import { ImageSourcePropType } from 'react-native';

// Static image registry. React Native's Metro bundler requires literal,
// statically-analyzable require() paths — you cannot build the path at runtime.
// So every bundled image is required here once, and the rest of the app refers
// to images by string key (Task.image, ChallengeTemplate.images, etc.) and
// resolves them through img(). The keys below match the filenames produced by
// the asset generator exactly.
export const images = {
  // Lifestyle / collage photos (placeholders — not the original app's media).
  life1: require('../../assets/images/life1.png'),
  life2: require('../../assets/images/life2.png'),
  life3: require('../../assets/images/life3.png'),
  life4: require('../../assets/images/life4.png'),
  life5: require('../../assets/images/life5.png'),
  life6: require('../../assets/images/life6.png'),
  life7: require('../../assets/images/life7.png'),
  life8: require('../../assets/images/life8.png'),

  // Task thumbnails.
  task_clean: require('../../assets/images/task_clean.png'),
  task_water: require('../../assets/images/task_water.png'),
  task_walk: require('../../assets/images/task_walk.png'),
  task_workout: require('../../assets/images/task_workout.png'),
  task_read: require('../../assets/images/task_read.png'),

  // Cut-out stickers for the scatter screens (2 & 19).
  sticker_beach: require('../../assets/images/sticker_beach.png'),
  sticker_book: require('../../assets/images/sticker_book.png'),
  sticker_books: require('../../assets/images/sticker_books.png'),
  sticker_camera: require('../../assets/images/sticker_camera.png'),
  sticker_flower: require('../../assets/images/sticker_flower.png'),
  sticker_fruit: require('../../assets/images/sticker_fruit.png'),
  sticker_lilies: require('../../assets/images/sticker_lilies.png'),
  sticker_matcha: require('../../assets/images/sticker_matcha.png'),
  sticker_notebook: require('../../assets/images/sticker_notebook.png'),
  sticker_roller: require('../../assets/images/sticker_roller.png'),
  sticker_tumbler: require('../../assets/images/sticker_tumbler.png'),

  // Avatars.
  avatar1: require('../../assets/images/avatar1.png'),
  avatar2: require('../../assets/images/avatar2.png'),
  avatar3: require('../../assets/images/avatar3.png'),
  avatar_match: require('../../assets/images/avatar_match.png'),
  avatar_you: require('../../assets/images/avatar_you.png'),

  // Single-purpose photos.
  flowers: require('../../assets/images/flowers.png'),
  partner: require('../../assets/images/partner.png'),
  portrait: require('../../assets/images/portrait.png'),
} as const;

export type ImageKey = keyof typeof images;

// Safe lookup: returns undefined for missing/empty keys so callers can fall back
// to a colored placeholder instead of crashing.
export function img(key?: string): ImageSourcePropType | undefined {
  if (!key) return undefined;
  return (images as Record<string, ImageSourcePropType>)[key];
}

export default images;
