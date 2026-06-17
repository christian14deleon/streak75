# Streak75

A **front-end-only** iOS/Android UI clone of a "75-day challenge" app, built with
**React Native + Expo (SDK 56)** and **TypeScript**. It reproduces the full
onboarding flow (23 screens) plus a working **Today** main screen with per-day
task check-offs, a month **calendar**, and **Friends/Profile** tabs.

There is **no backend, database, authentication, or payment processing**. Every
piece of state is local and persisted on-device with **Zustand + AsyncStorage**.
Sign-in, the paywall, partner-matching, invites, and "share to story" are all
**mocks** — they update local state and (where relevant) open the OS share
sheet, but nothing is sent anywhere.

> This is a UI/UX reconstruction for learning and prototyping. All photos are
> self-generated placeholder gradients, and the product name is "Streak75" (the
> original brand name and its photography are intentionally **not** shipped).

---

## Table of contents

1. [What's inside](#whats-inside)
2. [Project structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Run it in Android Studio — step by step](#run-it-in-android-studio--step-by-step)
5. [Engineering decisions worth knowing](#engineering-decisions-worth-knowing)
6. [How key systems work](#how-key-systems-work)
7. [Swapping in real assets & copy](#swapping-in-real-assets--copy)
8. [Troubleshooting](#troubleshooting)

---

## What's inside

- **23-screen onboarding flow**: welcome → "become that girl" → name → four
  questionnaire screens → friends/aesthetic previews → partner stat → matching
  loader → invite modal → challenge select → finding loader → **drag-reorderable
  task editor** → challenge-length ruler → start-date ruler → mock sign-in →
  mock paywall → like-app → congrats → "make it official" share screen.
- **Main app**: a **Today** screen that checks tasks off per calendar day and
  persists them, a **Calendar** modal that colours each day by completion, and
  **Friends** / **Profile** tabs (the Profile tab includes a "Start over" reset).
- **A reusable design system**: serif display headlines (Playfair Display) with
  inline weight/style mixing, an Inter body stack, a pastel "sticky-note"
  palette, and shared spacing/radii/shadow tokens.
- **A global tap-sound + haptic layer**: every button, card, and row is built on
  one `AppPressable` primitive, so taps play a click and a light haptic with
  zero per-call wiring.
- **Two draggable "ruler" pickers** (length and start date) and a
  **drag-to-reorder** task list.

---

## Project structure

```
streak75/
├── App.tsx                 # Root: fonts + store-hydration gate, providers, splash
├── index.js                # Entry (imports react-native-gesture-handler FIRST)
├── app.json                # Expo config (New Architecture on, plugins, edge-to-edge)
├── babel.config.js         # babel-preset-expo only (see Reanimated note below)
├── metro.config.js         # Adds .m4a/.mp3/.wav/.aac to asset extensions
├── tsconfig.json           # Expo base + strict + "@/*" path alias
├── assets/
│   ├── images/             # 32 self-made placeholder PNGs (life/task/sticker/avatar)
│   └── sounds/tap.m4a       # Tap click
└── src/
    ├── theme/              # index.ts (tokens) + typography.tsx (RichHeadline)
    ├── utils/              # dateUtils (INCLUSIVE), id, truncate, useAutoAdvance
    ├── types/              # Shared TS types
    ├── services/storage.ts # AsyncStorage + Zustand persistence adapter
    ├── data/               # images registry, challenges, plans, seed (friends/reviews/counts)
    ├── store/              # appStore + challengeStore (persisted) + hydration helper
    ├── sound/              # SoundProvider (expo-audio + expo-haptics)
    ├── components/         # 27 reusable components (+ barrel index.ts)
    ├── screens/            # 22 onboarding screens + _scaffolds, and screens/main/* 
    └── navigation/         # ONE ordered step list + hook + 3 navigators + types
```

The **single source of truth for the onboarding flow** is
`src/navigation/onboardingSteps.ts`. Reordering that one array reorders the whole
flow *and* recomputes the progress bar — there is no other place that encodes the
order.

---

## Prerequisites

You need three things installed on your machine:

1. **Node.js 18 LTS or newer** (Node 20 recommended). Check with `node -v`.
2. **Android Studio** (the latest stable). You'll use it for the Android SDK and
   the emulator (Android Virtual Device).
3. **A JDK** — Android Studio bundles JetBrains Runtime, and for development
   builds you want **JDK 17**. (Only needed for the "development build" path; the
   Expo Go path below does not compile native code on your machine.)

You do **not** need to install the Expo CLI globally — every command below uses
`npx`, which runs the project-local CLI that ships with the `expo` dependency.

---

## Run it in Android Studio — step by step

There are two ways to run the app. **Start with Path A (Expo Go)** — it's the
fastest and this app uses only Expo SDK modules plus one pure-JS library, so it
runs in Expo Go without a custom build. Use **Path B** only if you want a real
native build or Path A gives you trouble.

### Step 1 — Create and start an Android emulator

1. Open **Android Studio**.
2. On the welcome screen, open **More Actions ▸ Virtual Device Manager** (or, in
   an open project, **Tools ▸ Device Manager**).
3. Click **Create device** (the **+**). Pick a phone, e.g. **Pixel 7**, then
   **Next**.
4. Choose a **system image**. Pick a recent one (e.g. **API 34 / Android 14**).
   **Tip:** choose an image labelled with **(Google Play)** if available — it
   makes installing Expo Go trivial. Download it if needed, then **Next ▸
   Finish**.
5. Back in Device Manager, press the **▶ (Play)** button next to your new device
   to **boot the emulator**. Wait until you reach the Android home screen.

Keep the emulator running for the next steps.

### Step 2 — Install the project's dependencies

The zip ships **without** `node_modules` (you install them fresh so they match
your OS). In a terminal:

```bash
# 1) Unzip wherever you like, then enter the folder
cd streak75

# 2) Install dependencies
npm install

# 3) Align native module versions with the installed Expo SDK (recommended)
npx expo install --fix
```

`npm install` pulls the exact pinned versions; `npx expo install --fix` then
nudges any version that doesn't match your resolved Expo SDK into the supported
range. This step prevents most "version mismatch" warnings.

### Step 3 — Path A: run in Expo Go (recommended first)

With the emulator from Step 1 **already running**:

```bash
npx expo start
```

This starts the Metro bundler and prints a terminal menu. Then:

1. Press **`a`** in that terminal. Expo will detect your running emulator,
   **install Expo Go automatically** if it isn't there, open it, and load the
   app.
2. The first bundle takes a bit; subsequent reloads are fast.
3. Edit any file and save — the app **hot-reloads**. Press **`r`** to reload
   manually, or **`m`** to open the dev menu on the device.

> If pressing `a` can't find the device, make sure the emulator is fully booted
> (at the home screen) and that `adb devices` lists it. You can also open the
> **Expo Dev Tools** in the browser (press `?` to see all shortcuts) and click
> **Run on Android device/emulator**.

### Step 3 — Path B: build and run a native dev build (alternative)

This compiles a native Android app and installs it on the emulator. It needs the
Android SDK configured (Android Studio installs it) and **JDK 17**.

1. Make sure these environment variables are set (Android Studio usually sets the
   SDK location; verify in your shell profile):

   ```bash
   # Example for macOS/Linux — adjust the path to your SDK
   export ANDROID_HOME="$HOME/Library/Android/sdk"     # macOS
   # export ANDROID_HOME="$HOME/Android/Sdk"           # Linux
   export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
   ```

2. With the emulator running (or a device plugged in), run:

   ```bash
   npx expo run:android
   ```

   The first build runs Gradle and can take several minutes. When it finishes it
   installs the app on the emulator and connects Metro automatically. Later runs
   are much faster.

> **Opening the `android/` folder in Android Studio:** after the first
> `npx expo run:android`, an `android/` directory is generated. You can open
> *that* folder directly in Android Studio and press **Run ▶** there if you
> prefer the IDE's build/run button. (Before that first command there is no
> native project to open — this is a managed Expo app.)

### Quick reference

| Command | What it does |
| --- | --- |
| `npm install` | Install JS dependencies |
| `npx expo install --fix` | Align native module versions to the Expo SDK |
| `npx expo start` then `a` | Run in **Expo Go** on the emulator |
| `npx expo run:android` | Build + install a **native dev build** |
| press `r` / `m` | Reload / open dev menu (while Metro runs) |

---

## Engineering decisions worth knowing

These are deliberate choices (several differ from older tutorials) — they matter
if you extend the app:

1. **Reanimated 4 needs no Babel plugin.** `babel.config.js` is *only*
   `presets: ['babel-preset-expo']`. As of Reanimated 4 the worklet transform is
   bundled into `babel-preset-expo`. Manually adding
   `react-native-reanimated/plugin` (the old advice) double-applies the transform
   and breaks the build. Reanimated 4 also depends on `react-native-worklets`
   (installed) and the **New Architecture** (enabled in `app.json`).

2. **Drag-and-drop uses `react-native-draglist` (3.10.0).** It's built on
   `PanResponder` + `FlatList`, so it's pure JS and **New-Architecture-safe**,
   and it works in **Expo Go** with no native build. The task editor passes it
   `data` / `keyExtractor` / `onReordered(from, to)` / `renderItem`, and uses
   `ListHeaderComponent` / `ListFooterComponent` / `ListEmptyComponent` (it
   extends `FlatList` props).

3. **Audio uses `expo-audio`, not the deprecated `expo-av`.** The sound layer
   calls `setAudioModeAsync({ playsInSilentMode: true })` once, creates a single
   `AudioPlayer`, and does `seekTo(0)` + `play()` on each tap — all wrapped in
   `try/catch` so audio is best-effort.

4. **Fonts** come from `@expo-google-fonts/playfair-display` and
   `@expo-google-fonts/inter`, loaded via `expo-font`'s `useFonts`. The splash is
   held until fonts **and** persisted state are ready, so there's no font swap or
   flash of an unhydrated screen.

5. **Icons** (including the Apple/Google logos on the mock sign-in) come from
   `@expo/vector-icons` (Ionicons).

6. **State** is two Zustand stores persisted through a small AsyncStorage adapter
   (`createJSONStorage`). A `_hasHydrated` flag per store, surfaced via
   `useStoreHydration()`, gates the first render so navigation branches on the
   real persisted `onboardingComplete` value.

7. **Dates are inclusive.** A challenge of *N* days has day 1 = the start date and
   day *N* = start + (N−1). So 75 days starting **Tue, Jun 16** ends on **Sat,
   Aug 29** (not Aug 30). Every date surface derives from `src/utils/dateUtils.ts`
   so they can never disagree. Start date defaults to the device's "today".

8. **One card, everywhere.** The "day one" card reads tasks, start date, and
   duration straight from the challenge store, so the onboarding preview, the
   congrats card, and the shareable sticker always reflect the user's real
   edits.

9. **Text sharing uses React Native's built-in `Share` API.** `expo-sharing`
   targets *file* sharing; the "Send invites" and "Get my sticker" actions share
   a text message via `Share.share(...)`. `expo-sharing` remains installed so you
   can wire real image/sticker file sharing later.

---

## How key systems work

- **Navigation.** `src/navigation/onboardingSteps.ts` is the single ordered list
  of steps with per-step chrome flags (`showBack`, `showProgress`,
  `presentation`, `gestureEnabled`). `OnboardingNavigator` maps over it;
  `useOnboardingNav()` reads it to compute the next route and the progress
  fraction (progress shows on the 8 questionnaire steps). Loaders and the invite
  modal use `replaceNext()` and `gestureEnabled: false` so you can't swipe back
  onto a loader that would auto-advance again. `RootNavigator` swaps between the
  onboarding stack and the main app based on `onboardingComplete`.

- **Sound + haptics.** `SoundProvider` exposes `playTap()` (click + light
  haptic) and `selectionTick()` (selection haptic, used by the rulers and drag
  handles). `AppPressable` calls `playTap()` before your `onPress`, so every
  touchable inherits feedback.

- **Day rollover.** The Today screen keys completion by the **local** date
  (`dateKey(today)`), and "today" is captured at `startOfDay(new Date())`. Toggles
  write to `completedByDate[dateKey]` and persist; the calendar reads the same
  map and marks a day complete only when **every** task for that day is checked.

---

## Swapping in real assets & copy

- **Images.** Replace the PNGs in `assets/images/` (keep the same filenames) or
  edit the key→`require` registry in `src/data/images.ts`. Everything looks up
  images by key through `img(key)`, which fails safe if a key is missing.
- **Copy.** Onboarding question text lives in each screen; challenge templates,
  default tasks, plans, friends, reviews, and counts live in `src/data/`. The
  default task list and the questionnaire copy are intentionally verbatim,
  including the deliberate **"Privacy police"** wording on the paywall footer.
- **Sound.** Replace `assets/sounds/tap.m4a` (the metro config already resolves
  `.m4a/.mp3/.wav/.aac`).

---

## Troubleshooting

- **"Unable to resolve module …" / stale cache.** Restart Metro with a clean
  cache: `npx expo start -c`.
- **Version mismatch warnings.** Run `npx expo install --fix`, then restart.
- **Pressing `a` does nothing / device not found.** Ensure the emulator is fully
  booted (at the home screen) and `adb devices` lists exactly one device. Reopen
  the emulator from Android Studio's Device Manager if needed.
- **Expo Go won't install on the emulator.** Use a **Google Play** system image,
  or run the native build path (`npx expo run:android`) instead.
- **Reanimated/worklets errors after editing Babel.** Make sure
  `babel.config.js` contains **only** `babel-preset-expo` (no manual reanimated
  plugin), then clear cache: `npx expo start -c`.
- **Native build can't find the SDK / wrong Java.** Confirm `ANDROID_HOME` points
  to your SDK and that `java -version` reports **17** for `npx expo run:android`.
- **Gestures/drag not working.** `react-native-gesture-handler` must be the first
  import in `index.js` (it is) and the app is wrapped in
  `GestureHandlerRootView` (it is in `App.tsx`). Clear cache and reload if you
  changed the entry.

---

Built as a faithful front-end reconstruction: no network calls, no tracking, no
real purchases — just the UI, the flow, and the local state.
