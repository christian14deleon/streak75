import React from 'react';
import { SingleSelectScreen, type SelectOption } from './_SingleSelectScreen';
import { useAppStore } from '../store';

// Screen 5 — "What's your biggest challenge right now?" (2×2 image grid).
const OPTIONS: SelectOption[] = [
  { label: 'Staying consistent with workouts', imageKey: 'task_workout' },
  { label: 'Eating better, less junk', imageKey: 'task_clean' },
  { label: 'Sleep & energy levels', imageKey: 'life7' },
  { label: 'Mental clarity & focus', imageKey: 'life8' },
];

export function BiggestChallengeScreen() {
  const biggestChallenge = useAppStore((s) => s.biggestChallenge);
  const setBiggestChallenge = useAppStore((s) => s.setBiggestChallenge);

  return (
    <SingleSelectScreen
      question="What's your biggest **challenge** right now?"
      variant="imageGrid"
      options={OPTIONS}
      value={biggestChallenge}
      onSelect={setBiggestChallenge}
    />
  );
}

export default BiggestChallengeScreen;
