import '@testing-library/jest-native/extend-expect';

// Suppress TurboModule errors for DevMenu
global.RN$Bridging_createCallableModule = jest.fn();

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Note: expo-router is mocked in individual test files to avoid module resolution issues

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
  hideAsync: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Suppress console warnings for DevMenu and other deprecated modules
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0]?.includes?.('DevMenu') ||
    args[0]?.includes?.('ProgressBarAndroid') ||
    args[0]?.includes?.('SafeAreaView') ||
    args[0]?.includes?.('Clipboard')
  ) {
    return;
  }
  originalWarn(...args);
};
