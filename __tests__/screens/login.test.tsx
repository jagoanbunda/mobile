import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/app/auth/login';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

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
      outline: '#cccccc',
      outlineVariant: '#e0e0e0',
      errorContainer: '#ffebee',
      onErrorContainer: '#c62828',
    },
  }),
}));
jest.mock('expo-router', () => ({
  Stack: {
    Screen: () => null,
  },
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockRouter = router as jest.Mocked<typeof router>;

// Helper to create properly typed mock auth context
const createMockAuthContext = (overrides = {}) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isVerifying: false,
  login: jest.fn().mockResolvedValue(undefined),
  register: jest.fn().mockResolvedValue(undefined),
  logout: jest.fn().mockResolvedValue(undefined),
  updateProfile: jest.fn().mockResolvedValue(undefined),
  refreshUser: jest.fn().mockResolvedValue(undefined),
  verifyAuth: jest.fn().mockResolvedValue(true),
  ...overrides,
});

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(createMockAuthContext());
  });

  it('shows validation error when email is empty', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    // Leave email empty, fill password
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    
    // Press login
    fireEvent.press(getByText('Log In'));
    
    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
    });
  });

  it('shows validation error when password is empty', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    // Fill email, leave password empty
    fireEvent.changeText(getByPlaceholderText('Email or Username'), 'test@example.com');
    
    // Press login
    fireEvent.press(getByText('Log In'));
    
    await waitFor(() => {
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('shows validation error for invalid email format', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    // Fill invalid email
    fireEvent.changeText(getByPlaceholderText('Email or Username'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    
    // Press login
    fireEvent.press(getByText('Log In'));
    
    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('calls login on successful form submission', async () => {
    const mockLogin = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue(createMockAuthContext({
      login: mockLogin,
    }));

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    // Fill valid credentials
    fireEvent.changeText(getByPlaceholderText('Email or Username'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    
    // Press login
    fireEvent.press(getByText('Log In'));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    // Navigation should NOT be called - it's handled by conditional rendering now
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('displays API error message on login failure', async () => {
    const mockLogin = jest.fn().mockRejectedValue({
      status: 401,
      message: 'Invalid credentials',
    });
    mockUseAuth.mockReturnValue(createMockAuthContext({
      login: mockLogin,
    }));

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    // Fill valid credentials
    fireEvent.changeText(getByPlaceholderText('Email or Username'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    
    // Press login
    fireEvent.press(getByText('Log In'));
    
    await waitFor(() => {
      expect(getByText('Invalid email or password')).toBeTruthy();
    });
  });

  it('navigates to register page when Sign Up is pressed', () => {
    const { getByText } = render(<LoginScreen />);
    
    // Press Sign Up link
    fireEvent.press(getByText('Sign Up'));
    
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/register');
  });
});
