import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';

// Global tap-sound + haptic layer.
//
// Implemented ONCE here so it can't be forgotten per-screen: AppPressable
// consumes useSound().playTap and every interactive component is built on
// AppPressable, so the click + light haptic fire everywhere automatically.
//
// Audio uses expo-audio (the current API; expo-av is deprecated):
//   - setAudioModeAsync({ playsInSilentMode: true }) lets the click play even
//     when the iOS ringer switch is on silent. On Android this is a harmless
//     no-op. We intentionally pass a MINIMAL mode object — over-specifying the
//     mode (e.g. mixing interruption + silent options) can throw an
//     "impossible audio mode" error on iOS.
//   - The player is created once at mount (preloaded) so the first tap is
//     instant; each tap seeks to 0 and plays so rapid taps retrigger cleanly.
//
// Everything is guarded with try/catch: if audio can't initialize (web, missing
// asset, simulator quirks), playTap simply does nothing rather than crashing.

interface SoundContextValue {
  playTap: () => void; // click + light impact (buttons, cards, rows)
  selectionTick: () => void; // selection haptic (ruler scrub, loader appear)
}

const SoundContext = createContext<SoundContextValue>({
  playTap: () => {},
  selectionTick: () => {},
});

const TAP_SOURCE = require('../../assets/sounds/tap.m4a');

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const playerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await setAudioModeAsync({ playsInSilentMode: true });
      } catch {
        /* no-op: non-fatal, click just may not play on silent */
      }
      try {
        const player = createAudioPlayer(TAP_SOURCE);
        if (mounted) {
          playerRef.current = player;
        } else {
          // Component unmounted before the player was assigned; dispose it.
          disposePlayer(player);
        }
      } catch {
        playerRef.current = null;
      }
    })();

    return () => {
      mounted = false;
      const player = playerRef.current;
      playerRef.current = null;
      disposePlayer(player);
    };
  }, []);

  const value = useMemo<SoundContextValue>(
    () => ({
      playTap: () => {
        // Sound (best-effort) ...
        try {
          const player = playerRef.current;
          if (player) {
            player.seekTo(0);
            player.play();
          }
        } catch {
          /* no-op */
        }
        // ... plus a light tactile tap.
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {
          /* no-op */
        }
      },
      selectionTick: () => {
        try {
          Haptics.selectionAsync();
        } catch {
          /* no-op */
        }
      },
    }),
    []
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

// Dispose the audio player across possible expo-audio API shapes.
function disposePlayer(player: AudioPlayer | null) {
  if (!player) return;
  try {
    const anyPlayer = player as unknown as {
      remove?: () => void;
      release?: () => void;
    };
    if (typeof anyPlayer.remove === 'function') anyPlayer.remove();
    else if (typeof anyPlayer.release === 'function') anyPlayer.release();
  } catch {
    /* no-op */
  }
}

export function useSound(): SoundContextValue {
  return useContext(SoundContext);
}

export default SoundProvider;
