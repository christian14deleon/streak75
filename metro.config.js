// Metro configuration for Streak75.
// Starts from Expo's default config and makes sure our audio (.m4a) and image
// (.png) assets resolve as bundled assets. Expo already handles png by default;
// we add the audio extensions explicitly so require('../assets/sounds/tap.m4a')
// resolves cleanly across platforms.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const extraAssetExts = ['m4a', 'mp3', 'wav', 'aac'];
for (const ext of extraAssetExts) {
  if (!config.resolver.assetExts.includes(ext)) {
    config.resolver.assetExts.push(ext);
  }
}

module.exports = config;
