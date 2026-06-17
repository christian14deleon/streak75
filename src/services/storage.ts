// Persistence service for Streak75.
//
// This is the ONLY module that talks to AsyncStorage directly. Screens and
// stores go through here (or through the zustand `persist` adapter below) so
// storage is centralized, easy to mock, and trivial to swap later. No network
// is ever involved — everything is local to the device.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

/** Read a JSON value by key, or return the fallback if missing/corrupt. */
export async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Write a JSON value by key. Swallows errors (front-end-only, non-critical). */
export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* no-op */
  }
}

/** Remove a single key. */
export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    /* no-op */
  }
}

/**
 * Storage adapter compatible with zustand's `persist` middleware
 * (createJSONStorage expects get/set/remove returning string | null).
 * Kept here so the AsyncStorage dependency stays confined to this file.
 */
export const zustandStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      /* no-op */
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      /* no-op */
    }
  },
};

// Centralized key names (persisted bundles). Individual fields live inside the
// two persisted store blobs; these are the top-level storage slots.
export const STORAGE_KEYS = {
  appStore: 'streak75.app.v1',
  challengeStore: 'streak75.challenge.v1',
} as const;
