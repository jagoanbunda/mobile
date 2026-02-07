// Setup file specifically for tabs-layout tests
// This must be loaded BEFORE jest.setup.js to properly mock expo-router

// Mock expo-router FIRST before anything else tries to load it
jest.mock('expo-router', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  };
  
  const mockTabs = function Tabs({ children }) {
    return React.createElement(View, { testID: 'mock-tabs' }, children);
  };
  mockTabs.Screen = jest.fn(({ children }) => null);
  
  return {
    router: mockRouter,
    useRouter: () => mockRouter,
    useLocalSearchParams: jest.fn(() => ({})),
    useSegments: jest.fn(() => []),
    usePathname: jest.fn(() => '/'),
    useFocusEffect: jest.fn((callback) => callback()),
    Redirect: jest.fn(({ href }) => null),
    Stack: {
      Screen: jest.fn(() => null),
    },
    Tabs: mockTabs,
    Link: jest.fn(({ children }) => children),
  };
});

// Now load the standard setup
require('./jest.setup.js');
