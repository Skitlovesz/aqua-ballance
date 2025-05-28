
  
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'gif', 'svg');

config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

config.resolver.unstable_enablePackageExports = false;

module.exports = config;