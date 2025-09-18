// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactNative = require('eslint-plugin-react-native');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    plugins: {
      'react-native': reactNative,
    },
    rules: {
      'no-console': 'off', //désactive le warning console.log
      'react-native/no-inline-styles': 'warn', //warn si styles en ligne
      'react-native/no-color-literals': 'off', //désactive l’interdiction des couleurs en ligne
      'react-native/no-unused-styles': 'error', //error si styles non utilisés
    },
  },
]);
