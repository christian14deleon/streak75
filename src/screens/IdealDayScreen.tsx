import React from 'react';
import { SingleSelectScreen, type SelectOption } from './_SingleSelectScreen';
import { useAppStore } from '../store';

// Screen 6 — "What does your ideal day look like?" (2×2 gradient tiles).
const OPTIONS: SelectOption[] = [
  { label: 'Early mornings, structured', gradient: 'sunrise', icon: 'sunny-outline' },
  { label: 'Flexible, but consistent', gradient: 'cool', icon: 'sync-outline' },
  { label: 'Balanced work hard, rest too', gradient: 'orange', icon: 'scale-outline' },
  { label: 'Gentle reset, start fresh', gradient: 'green', icon: 'leaf-outline' },
];

export function IdealDayScreen() {
  const idealDay = useAppStore((s) => s.idealDay);
  const setIdealDay = useAppStore((s) => s.setIdealDay);

  return (
    <SingleSelectScreen
      question="What does your **ideal** day look like?"
      variant="gradientGrid"
      options={OPTIONS}
      value={idealDay}
      onSelect={setIdealDay}
    />
  );
}

export default IdealDayScreen;
