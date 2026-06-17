import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage, STORAGE_KEYS } from '../services/storage';
import { DEFAULT_PLAN_ID } from '../data/plans';
import { INVITE } from '../data/seed';
import type { PlanId, PartnerChoice } from '../types';

interface AppState {
  // Onboarding questionnaire answers.
  name: string;
  why: string | null; // screen 4
  biggestChallenge: string | null; // screen 5
  idealDay: string | null; // screen 6
  hearAbout: string | null; // screen 7

  // Flags / flow state.
  onboardingComplete: boolean;
  isSignedIn: boolean; // mock sign-in (screen 16)
  selectedPlan: PlanId; // mock paywall (screen 21)
  partnerChoice: PartnerChoice; // screen 20
  inviteCode: string; // seeded mock (screen 20)
  inviterName: string; // seeded (screen 20)
  likedApp: boolean | null; // screen 17
  sharedSticker: boolean; // screen 23

  // Hydration bookkeeping (true once persisted state has loaded).
  _hasHydrated: boolean;

  // Actions.
  setName: (v: string) => void;
  setWhy: (v: string) => void;
  setBiggestChallenge: (v: string) => void;
  setIdealDay: (v: string) => void;
  setHearAbout: (v: string) => void;
  setSignedIn: (v: boolean) => void;
  setSelectedPlan: (v: PlanId) => void;
  setPartnerChoice: (v: PartnerChoice) => void;
  setLikedApp: (v: boolean) => void;
  setSharedSticker: (v: boolean) => void;
  completeOnboarding: () => void;
  setHasHydrated: (v: boolean) => void;
  resetAll: () => void;
}

const initialAnswers = {
  name: '',
  why: null,
  biggestChallenge: null,
  idealDay: null,
  hearAbout: null,
  onboardingComplete: false,
  isSignedIn: false,
  selectedPlan: DEFAULT_PLAN_ID as PlanId,
  partnerChoice: null as PartnerChoice,
  inviteCode: INVITE.inviteCode,
  inviterName: INVITE.inviterName,
  likedApp: null,
  sharedSticker: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialAnswers,
      _hasHydrated: false,

      setName: (v) => set({ name: v }),
      setWhy: (v) => set({ why: v }),
      setBiggestChallenge: (v) => set({ biggestChallenge: v }),
      setIdealDay: (v) => set({ idealDay: v }),
      setHearAbout: (v) => set({ hearAbout: v }),
      setSignedIn: (v) => set({ isSignedIn: v }),
      setSelectedPlan: (v) => set({ selectedPlan: v }),
      setPartnerChoice: (v) => set({ partnerChoice: v }),
      setLikedApp: (v) => set({ likedApp: v }),
      setSharedSticker: (v) => set({ sharedSticker: v }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      resetAll: () => set({ ...initialAnswers }),
    }),
    {
      name: STORAGE_KEYS.appStore,
      storage: createJSONStorage(() => zustandStorage),
      // Don't persist the hydration flag itself.
      partialize: ({ _hasHydrated, ...rest }) => rest,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
