/* eslint-env jest */
jest.mock('react-native-modpow', () => '0');

jest.mock('react-native-tcp-socket', () => ({
  connectTLS: jest.fn(),
  createConnection: jest.fn(),
}));

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);
