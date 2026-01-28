import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

// Mock dependencies
jest.mock('@/context/AuthContext');
jest.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      surface: '#ffffff',
      primary: '#6200ee',
    },
  }),
}));
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockRouter = router as jest.Mocked<typeof router>;
const mockUseFocusEffect = useFocusEffect as jest.MockedFunction<typeof useFocusEffect>;

const TestChild = () => <Text testID="child">Protected Content</Text>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: execute focus effect callback immediately
    mockUseFocusEffect.mockImplementation((callback) => {
      callback();
    });
  });

  it('shows loading indicator when isLoading is true', () => {
    mockUseAuth.mockReturnValue({
      isLoading: true,
      isVerifying: false,
      isAuthenticated: false,
      verifyAuth: jest.fn().mockResolvedValue(false),
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      refreshUser: jest.fn(),
    });

    const { getByTestId, queryByTestId } = render(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>
    );

    // Should show loading, not children
    expect(queryByTestId('child')).toBeNull();
  });

  it('shows loading indicator when isVerifying is true', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isVerifying: true,
      isAuthenticated: true,
      verifyAuth: jest.fn().mockResolvedValue(true),
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      refreshUser: jest.fn(),
    });

    const { queryByTestId } = render(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>
    );

    // Should show loading, not children
    expect(queryByTestId('child')).toBeNull();
  });

  it('redirects to /auth/login when verifyAuth returns false', async () => {
    const mockVerifyAuth = jest.fn().mockResolvedValue(false);
    
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isVerifying: false,
      isAuthenticated: false,
      verifyAuth: mockVerifyAuth,
      user: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      refreshUser: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockVerifyAuth).toHaveBeenCalled();
      expect(mockRouter.replace).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('renders children when authenticated', async () => {
    const mockVerifyAuth = jest.fn().mockResolvedValue(true);
    
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isVerifying: false,
      isAuthenticated: true,
      verifyAuth: mockVerifyAuth,
      user: { id: 1, name: 'Test User', email: 'test@example.com' } as any,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      refreshUser: jest.fn(),
    });

    const { getByTestId } = render(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(getByTestId('child')).toBeTruthy();
    });
  });

  it('calls verifyAuth on focus', async () => {
    const mockVerifyAuth = jest.fn().mockResolvedValue(true);
    
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isVerifying: false,
      isAuthenticated: true,
      verifyAuth: mockVerifyAuth,
      user: { id: 1, name: 'Test User', email: 'test@example.com' } as any,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      refreshUser: jest.fn(),
    });

    render(
      <ProtectedRoute>
        <TestChild />
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(mockVerifyAuth).toHaveBeenCalled();
    });

    // Verify useFocusEffect was called (simulating focus behavior)
    expect(mockUseFocusEffect).toHaveBeenCalled();
  });
});
