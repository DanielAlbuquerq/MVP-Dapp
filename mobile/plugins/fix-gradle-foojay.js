const { withSettingsGradle } = require('@expo/config-plugins');

module.exports = function fixFoojayPlugin(config) {
  return withSettingsGradle(config, (modConfig) => {
    // Replaces the broken 0.5.0 version with the compatible 1.0.0+ version
    modConfig.modResults.contents = modConfig.modResults.contents.replace(
      /id\(['"]org\.gradle\.toolchains\.foojay-resolver-convention['"]\)\s*version\s*['"][^'"]+['"]/g,
      "id('org.gradle.toolchains.foojay-resolver-convention') version '1.0.0'"
    );
    return modConfig;
  });
};
