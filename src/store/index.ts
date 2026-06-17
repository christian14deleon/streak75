import { useAppStore } from './appStore';
import { useChallengeStore } from './challengeStore';

export { useAppStore } from './appStore';
export { useChallengeStore } from './challengeStore';

/**
 * True only once BOTH persisted stores have rehydrated from AsyncStorage.
 * App.tsx gates the first render on this so navigation branches on the real
 * persisted `onboardingComplete` value instead of its default `false`.
 */
export function useStoreHydration(): boolean {
  const appHydrated = useAppStore((s) => s._hasHydrated);
  const challengeHydrated = useChallengeStore((s) => s._hasHydrated);
  return appHydrated && challengeHydrated;
}

/** Convenience for a "start over" dev action (not wired into the UI by default). */
export function resetAllStores() {
  useAppStore.getState().resetAll();
  useChallengeStore.getState().resetChallenge();
}
