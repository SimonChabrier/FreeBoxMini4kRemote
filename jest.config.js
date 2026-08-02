module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-androidtv-remote|react-native-modpow|react-native-tcp-socket|react-native-keychain|@react-native-async-storage)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};
