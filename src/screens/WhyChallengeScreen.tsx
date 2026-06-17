import React from 'react';
import { SingleSelectScreen, type SelectOption } from './_SingleSelectScreen';
import { useAppStore } from '../store';

// Screen 4 — "Why do you want to complete a challenge?" (2×2 image grid).
const OPTIONS: SelectOption[] = [
  { label: 'Become my best self', imageKey: 'life1' },
  { label: 'Reset my life', imageKey: 'life2' },
  { label: 'Feel confident', imageKey: 'life3' },
  { label: 'Build discipline', imageKey: 'life4' },
];

export function WhyChallengeScreen() {
  const why = useAppStore((s) => s.why);
  const setWhy = useAppStore((s) => s.setWhy);

  return (
    <SingleSelectScreen
      question="Why do you want to **complete** a challenge?"
      variant="imageGrid"
      options={OPTIONS}
      value={why}
      onSelect={setWhy}
    />
  );
}

export default WhyChallengeScreen;
