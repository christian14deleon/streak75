import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Drives the loader screens (12 "Finding your perfect challenge" and 19
// "Matching your energy"): animates a 0→1 progress value over `ms`, then calls
// `onDone` exactly once. Returns the Animated.Value so the screen can bind it to
// a filling progress bar's width. Uses the classic Animated API (not Reanimated
// worklets) on purpose — a width tween is all we need and this avoids any
// New-Architecture/worklet edge cases for a throwaway transition.
export function useAutoAdvance(ms: number, onDone: () => void): Animated.Value {
  const progress = useRef(new Animated.Value(0)).current;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let finished = false;
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: ms,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false, // animating width => must run on JS driver
    });
    anim.start(({ finished: didFinish }) => {
      if (didFinish && !finished) {
        finished = true;
        onDoneRef.current();
      }
    });
    return () => {
      finished = true;
      anim.stop();
    };
    // Re-run only if the duration changes (onDone is captured via ref).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms]);

  return progress;
}

export default useAutoAdvance;
