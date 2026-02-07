module.exports = {
  preset: 'jest-expo',
  globals: {
    __DEV__: true,
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  resolver: '<rootDir>/jest-resolver.js',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|nativewind|react-native-reanimated|@tanstack/react-query)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'node',
  // Suppress DevMenu and other TurboModule warnings
  globals: {
    __DEV__: true,
  },
};
