import { useMemo } from 'react';
import {
  useNavigation,
  useRoute,
  StackActions,
  type NavigationProp,
} from '@react-navigation/native';
import { ONBOARDING_STEPS } from './onboardingSteps';
import { useAppStore } from '../store';
import type { OnboardingStackParamList } from './types';

type Nav = NavigationProp<OnboardingStackParamList>;

interface OnboardingNav {
  /** 0..1 fill for the progress pill (computed across showProgress steps). */
  progress: number;
  /** Whether the current step shows the progress pill. */
  showProgress: boolean;
  /** Whether the current step shows the back button. */
  showBack: boolean;
  /** True when this is the final onboarding step. */
  isLast: boolean;
  /** Advance to the next step (push). On the last step, finish onboarding. */
  goNext: () => void;
  /**
   * Advance to the next step, REPLACING the current one in the stack. Used by
   * the loader screens (12, 19) and the invite modal (20) so they don't linger
   * in the back stack (preventing "back" from landing on a loader that would
   * immediately auto-advance again).
   */
  replaceNext: () => void;
  /** Pop to the previous step, if possible. */
  goBack: () => void;
  canGoBack: boolean;
}

// Single source of truth for moving through onboarding. Order, progress, and
// per-step chrome all derive from the ONE ordered ONBOARDING_STEPS array, so
// reordering that array reorders the flow and recomputes progress automatically
// — no per-screen "go to NextScreenName" wiring to keep in sync.
export function useOnboardingNav(): OnboardingNav {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  return useMemo(() => {
    const steps = ONBOARDING_STEPS ?? [];
    const currentName = route.name as keyof OnboardingStackParamList;
    const index = steps.findIndex((s) => s.name === currentName);
    const current = index >= 0 ? steps[index] : undefined;
    const next = index >= 0 ? steps[index + 1] : undefined;
    const isLast = index >= 0 && index === steps.length - 1;

    // Progress is the current step's position among the steps flagged
    // showProgress, divided by how many such steps exist.
    const progressSteps = steps.filter((s) => s.showProgress);
    const posAmongProgress = progressSteps.findIndex((s) => s.name === currentName);
    const progress =
      progressSteps.length > 0 && posAmongProgress >= 0
        ? (posAmongProgress + 1) / progressSteps.length
        : 0;

    const finishOrGo = (replace: boolean) => {
      if (next) {
        if (replace) {
          navigation.dispatch(StackActions.replace(next.name as string));
        } else {
          // navigate (not push) so an already-mounted route is reused.
          (navigation as unknown as { navigate: (n: string) => void }).navigate(
            next.name as string
          );
        }
      } else {
        // Final step → flip the persisted flag; RootNavigator swaps to Main.
        completeOnboarding();
      }
    };

    return {
      progress,
      showProgress: !!current?.showProgress,
      showBack: !!current?.showBack,
      isLast,
      goNext: () => finishOrGo(false),
      replaceNext: () => finishOrGo(true),
      goBack: () => {
        if (navigation.canGoBack()) navigation.goBack();
      },
      canGoBack: navigation.canGoBack(),
    };
  }, [navigation, route.name, completeOnboarding]);
}

export default useOnboardingNav;
