import React from 'react';
import { SingleSelectScreen, type SelectOption } from './_SingleSelectScreen';
import { useAppStore } from '../store';

// Screen 7 — "How did you hear about Streak75?" (vertical radio list with a
// leading icon per source).
const OPTIONS: SelectOption[] = [
  { label: 'TikTok', icon: 'logo-tiktok' },
  { label: 'Pinterest', icon: 'logo-pinterest' },
  { label: 'Content Creator', icon: 'videocam-outline' },
  { label: 'Instagram', icon: 'logo-instagram' },
  { label: 'Friend', icon: 'person-outline' },
  { label: 'Family', icon: 'people-outline' },
  { label: 'Other', icon: 'ellipsis-horizontal' },
];

export function HowHeardScreen() {
  const hearAbout = useAppStore((s) => s.hearAbout);
  const setHearAbout = useAppStore((s) => s.setHearAbout);

  return (
    <SingleSelectScreen
      question="How did *you* hear about Streak75?"
      variant="list"
      options={OPTIONS}
      value={hearAbout}
      onSelect={setHearAbout}
    />
  );
}

export default HowHeardScreen;
