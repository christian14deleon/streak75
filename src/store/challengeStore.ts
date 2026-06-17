import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage, STORAGE_KEYS } from '../services/storage';
import { DEFAULT_TASKS, DEFAULT_DURATION_DAYS } from '../data/challenges';
import { makeId } from '../utils/id';
import { toDateString } from '../utils/dateUtils';
import type { Task, ChallengeTemplate, CompletionMap, StickerColor } from '../types';

function seedTasks(): Task[] {
  // Materialize the default task set with fresh ids. Done so screen 9's preview
  // and the task editor (screen 13) are both populated out of the box, and so
  // every DayOneCard has tasks before the user touches anything.
  return DEFAULT_TASKS.map((t) => ({
    id: makeId('task'),
    text: t.text,
    image: t.image,
  }));
}

interface ChallengeState {
  selectedChallengeName: string;
  tasks: Task[];
  durationDays: number;
  startDate: string; // "YYYY-MM-DD" local; defaults to device today
  completedByDate: CompletionMap;
  waterByDate: Record<string, number>; // glasses logged per date key
  waterGoal: number; // daily glass goal

  _hasHydrated: boolean;

  // Template / source selection.
  loadTemplate: (template: ChallengeTemplate) => void;
  loadCustom: () => void;

  // Task CRUD + ordering (all persisted).
  addTask: (text: string, image?: string) => void;
  updateTask: (id: string, patch: Partial<Pick<Task, 'text' | 'image' | 'color'>>) => void;
  removeTask: (id: string) => void;
  reorderTasks: (from: number, to: number) => void;
  setTaskColor: (id: string, color: StickerColor) => void;

  // Length / start.
  setDuration: (n: number) => void;
  setStartDate: (dateString: string) => void;

  // Daily check-offs.
  toggleTaskDone: (dateKey: string, taskId: string) => void;
  isTaskDone: (dateKey: string, taskId: string) => boolean;

  // Daily water intake (glasses).
  setWater: (dateKey: string, count: number) => void;

  setHasHydrated: (v: boolean) => void;
  resetChallenge: () => void;
}

function makeInitial() {
  return {
    selectedChallengeName: 'Streak75 Challenge',
    tasks: seedTasks(),
    durationDays: DEFAULT_DURATION_DAYS,
    startDate: toDateString(new Date()), // device "today" on first launch
    completedByDate: {} as CompletionMap,
    waterByDate: {} as Record<string, number>,
    waterGoal: 8,
  };
}

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, get) => ({
      ...makeInitial(),
      _hasHydrated: false,

      loadTemplate: (template) =>
        set({
          selectedChallengeName: template.name,
          tasks: template.tasks.map((t) => ({
            id: makeId('task'),
            text: t.text,
            image: t.image,
            color: t.color,
          })),
        }),

      loadCustom: () =>
        set({
          selectedChallengeName: 'Custom Challenge',
          tasks: [],
        }),

      addTask: (text, image) =>
        set((state) => ({
          tasks: [...state.tasks, { id: makeId('task'), text, image }],
        })),

      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      reorderTasks: (from, to) =>
        set((state) => {
          if (
            from === to ||
            from < 0 ||
            to < 0 ||
            from >= state.tasks.length ||
            to >= state.tasks.length
          ) {
            return {} as Partial<ChallengeState>;
          }
          const next = state.tasks.slice();
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return { tasks: next };
        }),

      setTaskColor: (id, color) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, color } : t)),
        })),

      setDuration: (n) => set({ durationDays: Math.max(1, Math.round(n)) }),
      setStartDate: (dateString) => set({ startDate: dateString }),

      toggleTaskDone: (dateKey, taskId) =>
        set((state) => {
          const map: CompletionMap = { ...state.completedByDate };
          const current = new Set(map[dateKey] ?? []);
          if (current.has(taskId)) current.delete(taskId);
          else current.add(taskId);
          map[dateKey] = Array.from(current);
          return { completedByDate: map };
        }),

      isTaskDone: (dateKey, taskId) => {
        const list = get().completedByDate[dateKey];
        return !!list && list.includes(taskId);
      },

      setWater: (dateKey, count) =>
        set((state) => {
          const clamped = Math.max(0, Math.min(state.waterGoal, Math.round(count)));
          return { waterByDate: { ...state.waterByDate, [dateKey]: clamped } };
        }),

      setHasHydrated: (v) => set({ _hasHydrated: v }),
      resetChallenge: () => set({ ...makeInitial() }),
    }),
    {
      name: STORAGE_KEYS.challengeStore,
      storage: createJSONStorage(() => zustandStorage),
      partialize: ({ _hasHydrated, ...rest }) => rest,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
