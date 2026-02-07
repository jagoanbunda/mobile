const React = require('react');
const { View } = require('react-native');

module.exports = {
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
  usePathname: jest.fn(() => '/'),
  useFocusEffect: jest.fn((callback) => {
    callback();
  }),
  Redirect: jest.fn(({ href }) => null),
  Stack: {
    Screen: jest.fn(() => null),
  },
  Tabs: Object.assign(
    function Tabs({ children }) {
      return React.createElement(View, { testID: 'mock-tabs' }, children);
    },
    { Screen: jest.fn(() => null) }
  ),
  Link: jest.fn(({ children }) => children),
};
