import type { FriendSeed, ReviewSeed } from '../types';

// Static seed data. None of this is fetched — it is all local placeholder
// content for the front-end clone.

// Three overlapping friend cards on the value-prop screen (screen 8). One
// checklist item is pre-checked on each, mirroring the original.
export const FRIENDS: FriendSeed[] = [
  {
    id: 'f1',
    name: 'maya',
    avatar: 'avatar1',
    day: 75,
    checklist: [
      { label: 'Walk 10,000 steps', done: true },
      { label: 'Read 10 pages', done: false },
      { label: 'Workout', done: false },
      { label: 'Follow a strict diet', done: false },
    ],
  },
  {
    id: 'f2',
    name: 'zoe',
    avatar: 'avatar2',
    day: 75,
    checklist: [
      { label: 'Walk 10,000 steps', done: true },
      { label: 'Read 10 pages', done: false },
      { label: 'Workout', done: false },
      { label: 'Follow a strict diet', done: false },
    ],
  },
  {
    id: 'f3',
    name: 'lena',
    avatar: 'avatar3',
    day: 75,
    checklist: [
      { label: 'Walk 10,000 steps', done: true },
      { label: 'Read 10 pages', done: false },
      { label: 'Workout', done: false },
      { label: 'Follow a strict diet', done: false },
    ],
  },
];

// Horizontally scrolling reviews under the task editor (screen 13). Copy is
// verbatim placeholder seed text.
export const REVIEWS: ReviewSeed[] = [
  {
    id: 'r1',
    username: 'zoe_runner',
    stars: 5,
    blurb: 'me and my roommate survived lol',
  },
  {
    id: 'r2',
    username: 'mayajaymes',
    stars: 5,
    blurb: 'honestly brutal the first week',
  },
  {
    id: 'r3',
    username: 'soft.girl.era',
    stars: 5,
    blurb: 'the aesthetic kept me going ngl',
  },
  {
    id: 'r4',
    username: 'disciplined.dani',
    stars: 5,
    blurb: 'day 75 and i feel unstoppable',
  },
];

// Headline counts used across onboarding (kept as data so they're swappable and
// consistent everywhere they appear).
export const COUNTS = {
  joined: 200000, // "200,000 joined" (welcome / paywall)
  women: 24000, // "Among 24,000+ women" (matching loader, screen 19)
  finishedPercent: 87, // "87%" (partner stat, screen 10)
  successBoost: 30, // "+30% success with friends" (invite, screen 20)
} as const;

// Invite card (screen 20) seed values. The code is a locally-seeded MOCK string;
// no real invitations are created or sent. `inviterName` is a placeholder — the
// original truncates long names to "Christ…'s", and InviteCard reproduces that
// ellipsis behavior for any long name.
export const INVITE = {
  inviterName: 'Alex',
  inviteCode: '2054 9764',
} as const;

// Friendly number formatter for the "+N joined" pills, e.g. 20000 -> "+20,000".
export function formatJoined(n: number): string {
  return `+${n.toLocaleString('en-US')}`;
}

export function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}
