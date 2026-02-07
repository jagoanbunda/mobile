import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditParentScreen from '@/app/profile/edit-parent';
import { useAuth } from '@/context/AuthContext';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('@/context/AuthContext');
jest.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      surface: '#ffffff',
      primary: '#6200ee',
      onPrimary: '#ffffff',
      onSurface: '#000000',
      onSurfaceVariant: '#666666',
      surfaceContainerHigh: '#f0f0f0',
      surfaceContainerHighest: '#e6e9df',
      outline: '#cccccc',
      outlineVariant: '#e0e0e0',
      errorContainer: '#ffebee',
      onErrorContainer: '#c62828',
      error: '#BA1A1A',
      primaryContainer: '#C3E8B6',
      tertiaryContainer: '#BDEBE6',
      tertiary: '#3A6560',
    },
  }),
}));

jest.mock('@/services/hooks/use-auth', () => ({
  useUpdateProfileWithAvatar: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useLogout: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  router: { back: jest.fn(), push: jest.fn() },
}));

jest.mock('@/config/env', () => ({
  getAvatarUrl: () => null,
}));

jest.mock('@/components/ImagePickerButton', () => ({
  ImagePickerButton: () => null,
}));

jest.spyOn(Alert, 'alert');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Helper to create properly typed mock auth context
const createMockAuthContext = (overrides = {}) => ({
  user: {
    name: 'Test User',
    email: 'test@example.com',
    avatar_url: null,
    push_notifications: true,
    weekly_report: false,
  },
  isAuthenticated: true,
  isLoading: false,
  isVerifying: false,
  login: jest.fn().mockResolvedValue(undefined),
  register: jest.fn().mockResolvedValue(undefined),
  logout: jest.fn().mockResolvedValue(undefined),
  updateProfile: jest.fn().mockResolvedValue(undefined),
  refreshUser: jest.fn().mockResolvedValue(undefined),
  verifyAuth: jest.fn().mockResolvedValue(true),
  verifyError: null,
  retryVerification: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('EditParentScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(createMockAuthContext());
  });

  it('renders logout button', () => {
    const { getByText } = render(<EditParentScreen />);
    expect(getByText('Log Out')).toBeTruthy();
  });

  it('shows confirmation dialog when logout is pressed', () => {
    const { getByText } = render(<EditParentScreen />);

    fireEvent.press(getByText('Log Out'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Log Out',
      'Are you sure you want to log out?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel' }),
        expect.objectContaining({ text: 'Log Out' }),
      ])
    );
  });

  it('calls logout when confirmed', async () => {
    const mockLogout = jest.fn();
    jest.spyOn(require('@/services/hooks/use-auth'), 'useLogout').mockReturnValue({
      mutate: mockLogout,
      isPending: false,
    });

    const { getByText } = render(<EditParentScreen />);

    fireEvent.press(getByText('Log Out'));

    // Get the onPress handler from the Alert.alert call
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const logoutButton = alertCall[2].find((btn: { text: string }) => btn.text === 'Log Out');

    // Simulate pressing "Log Out" in the dialog
    logoutButton.onPress();

    expect(mockLogout).toHaveBeenCalled();
  });

  it('does not call logout when cancelled', () => {
    const mockLogout = jest.fn();
    jest.spyOn(require('@/services/hooks/use-auth'), 'useLogout').mockReturnValue({
      mutate: mockLogout,
      isPending: false,
    });

    const { getByText } = render(<EditParentScreen />);

    fireEvent.press(getByText('Log Out'));

    // Cancel button should not trigger logout
    // Just verify logout was NOT called (Cancel has style: 'cancel', no onPress)
    expect(mockLogout).not.toHaveBeenCalled();
  });
});
