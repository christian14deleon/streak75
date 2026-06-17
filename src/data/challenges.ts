import type { ChallengeTemplate } from '../types';

// The canonical default daily tasks. Copy is VERBATIM, including the trailing
// emoji on each line. This exact list seeds the task editor (screen 13) and
// therefore drives every DayOneCard (screens 9, 22, 23) and the Today screen
// (screen 18) until the user edits it.
export const DEFAULT_TASKS: Array<{ text: string; image?: string }> = [
  { text: 'Eat clean (no junk food and no alcohol) 🥗', image: 'task_clean' },
  { text: 'Drink ONLY water 💧', image: 'task_water' },
  { text: 'Walk 10,000 steps a day 👟', image: 'task_walk' },
  { text: 'One 45-minute workout per day 💪', image: 'task_workout' },
  {
    text: 'Read any book (10 pages) or listen to a podcast (5+ min) 📖',
    image: 'task_read',
  },
];

// Seeded challenge templates surfaced on the Welcome (screen 1) and
// Select-Challenge (screen 11) screens. Each carries a collage of 4 image keys,
// a "+N joined" count, and its own starter task list. The first template is the
// headline "Streak75 Challenge"; the rest mirror the challenge types from the
// source listing: 75 Soft, 75 Medium, 75 Day Hard, Glow Within, Better Me,
// Sugar Free, and Mental Wellness.
export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  {
    id: 'streak75',
    name: 'Streak75 Challenge',
    joined: 20000,
    images: ['life1', 'life2', 'life3', 'life4'],
    tasks: DEFAULT_TASKS,
  },
  {
    id: 'soft',
    name: '75 Soft',
    joined: 7500,
    images: ['life1', 'life3', 'life5', 'life7'],
    tasks: [
      { text: 'Move your body 30 minutes 💪', image: 'task_workout' },
      { text: 'Swap one snack for fruit 🍓', image: 'task_clean' },
      { text: 'Read or journal 10 minutes 📖', image: 'task_read' },
      { text: 'Drink more water 💧', image: 'task_water' },
    ],
  },
  {
    id: 'medium',
    name: '75 Medium',
    joined: 5000,
    images: ['life2', 'life4', 'life6', 'life8'],
    tasks: [
      { text: 'One 45-minute workout per day 💪', image: 'task_workout' },
      { text: 'Drink ONLY water 💧', image: 'task_water' },
      { text: 'Walk 8,000 steps a day 👟', image: 'task_walk' },
      { text: 'Read 10 pages a day 📖', image: 'task_read' },
    ],
  },
  {
    id: 'hard',
    name: '75 Day Hard',
    joined: 10000,
    images: ['life5', 'life6', 'life7', 'life8'],
    tasks: [
      { text: 'Two 45-minute workouts (one outdoors) 💪', image: 'task_workout' },
      { text: 'Drink 1 gallon of water 💧', image: 'task_water' },
      { text: 'Read 10 pages (non-fiction) 📖', image: 'task_read' },
      { text: 'No alcohol, no cheat meals 🥗', image: 'task_clean' },
      { text: 'Walk 10,000 steps a day 👟', image: 'task_walk' },
    ],
  },
  {
    id: 'glow',
    name: 'Glow Within',
    joined: 3200,
    images: ['life3', 'life5', 'life2', 'life6'],
    tasks: [
      { text: 'Morning + night skincare routine ✨', image: 'task_clean' },
      { text: 'Drink 2L of water 💧', image: 'task_water' },
      { text: 'Move your body 30 minutes 💪', image: 'task_workout' },
      { text: 'Journal one win today ✍️', image: 'task_read' },
      { text: 'Get 8 hours of sleep 🌙', image: 'task_walk' },
    ],
  },
  {
    id: 'better',
    name: 'Better Me',
    joined: 1854,
    images: ['life8', 'life1', 'life4', 'life5'],
    tasks: [
      { text: 'Make your bed every morning 🛏️', image: 'task_clean' },
      { text: '10-minute meditation 🧘', image: 'task_workout' },
      { text: 'Write 3 gratitudes ✍️', image: 'task_read' },
      { text: 'Walk outside daily 👟', image: 'task_walk' },
      { text: 'Lights out by 11pm 🌙', image: 'task_water' },
    ],
  },
  {
    id: 'sugar',
    name: 'Sugar Free',
    joined: 2100,
    images: ['life4', 'life7', 'life1', 'life8'],
    tasks: [
      { text: 'No added sugar today 🚫', image: 'task_clean' },
      { text: 'Swap dessert for fruit 🍓', image: 'task_walk' },
      { text: 'Drink ONLY water 💧', image: 'task_water' },
      { text: 'Eat whole foods only 🥗', image: 'task_workout' },
      { text: 'Check labels before you buy 📖', image: 'task_read' },
    ],
  },
  {
    id: 'mental',
    name: 'Mental Wellness',
    joined: 4800,
    images: ['life6', 'life2', 'life8', 'life3'],
    tasks: [
      { text: '10-minute meditation 🧘', image: 'task_workout' },
      { text: 'Write 3 gratitudes ✍️', image: 'task_read' },
      { text: 'Screen-free hour before bed 🌙', image: 'task_clean' },
      { text: 'Step outside for fresh air 👟', image: 'task_walk' },
      { text: 'Drink water, stay hydrated 💧', image: 'task_water' },
    ],
  },
];

export function templateById(id: string): ChallengeTemplate | undefined {
  return CHALLENGE_TEMPLATES.find((t) => t.id === id);
}

// Default duration for a fresh challenge.
export const DEFAULT_DURATION_DAYS = 75;
