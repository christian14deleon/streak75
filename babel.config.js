// Babel configuration for Streak75.
//
// IMPORTANT (Expo SDK 56 / Reanimated 4):
// Do NOT manually add 'react-native-reanimated/plugin' here. As of Reanimated 4,
// the required Babel transform is bundled into `babel-preset-expo` and runs
// automatically. Adding the old plugin entry by hand DOUBLE-applies the worklet
// transform and breaks the build. (This corrects the older instruction that said
// to append the reanimated plugin last — that guidance predates Reanimated 4.)
//
// Reanimated 4 also relies on `react-native-worklets` (installed) and the New
// Architecture (enabled in app.json).
//
// Only if you eject to the bare React Native CLI (NOT Expo) would you instead add
// 'react-native-worklets/plugin' as the LAST plugin. Under Expo, leave this alone.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
