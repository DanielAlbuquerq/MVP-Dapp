const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Watch the directory three levels up
config.watchFolders = [...(config.watchFolders || []), path.resolve(__dirname, '../../..')];

module.exports = withNativeWind(config, { input: './global.css' })