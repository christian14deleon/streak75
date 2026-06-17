// Shared domain types for Streak75.

export type StickerColor = 'mint' | 'butter' | 'blush';

// A single editable daily task. `text` includes the trailing emoji inline
// (verbatim copy convention), e.g. "Drink ONLY water 💧". `image` is a key into
// the static image registry (see src/data/images.ts) for the Today thumbnail.
export interface Task {
  id: string;
  text: string;
  image?: string; // image registry key, optional
  color?: StickerColor; // optional sticky-note tint override
}

export type PlanId = 'monthly' | 'yearly' | 'weekly';

export interface Plan {
  id: PlanId;
  title: string;
  price: string; // verbatim display string, e.g. "₱ 999.00/month"
  badge?: { label: string; tone: 'black' | 'green' };
  defaultSelected?: boolean;
}

export type PartnerChoice = 'solo' | 'invited' | null;

// A seeded challenge template shown on the Welcome and Select-Challenge screens.
export interface ChallengeTemplate {
  id: string;
  name: string;
  joined: number; // for the "+N joined" pill
  images: string[]; // 4 image registry keys for the collage strip
  tasks: Array<{ text: string; image?: string; color?: StickerColor }>;
}

export interface FriendSeed {
  id: string;
  name: string;
  avatar: string; // image registry key
  day: number;
  checklist: Array<{ label: string; done: boolean }>;
}

export interface ReviewSeed {
  id: string;
  username: string;
  stars: number;
  blurb: string;
}

// Map of "YYYY-MM-DD" -> set of completed task ids (stored as string[] for JSON).
export type CompletionMap = Record<string, string[]>;
