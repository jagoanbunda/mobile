import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/app/auth/login';
import { useLogin } from '@/services/hooks/use-auth';
import { router } from 'expo-router';

// Mock dependencies
jest.mock('@/services/hooks/use-auth');
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

const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;
const mockRouter = router as jest.Mocked<typeof router>;

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLogin.mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue({ user: { id: 1 } }),
      isPending: false,
      error: null,
      mutate: jest.fn(),
      reset: jest.fn(),
      data: undefined,
      isError: false,
      isIdle: true,
      isPaused: false,
      isSuccess: false,
      status: 'idle',
      variables: undefined,
      failureCount: 0,
      failureReason: null,
      context: undefined,
      submittedAt: 0,
    });
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
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
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
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
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
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('disables button and shows loading during submit', async () => {
    mockUseLogin.mockReturnValue({
      mutateAsync: jest.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
      isPending: true,
      error: null,
      mutate: jest.fn(),
      reset: jest.fn(),
      data: undefined,
      isError: false,
      isIdle: false,
      isPaused: false,
      isSuccess: false,
      status: 'pending',
      variables: undefined,
      failureCount: 0,
      failureReason: null,
      context: undefined,
      submittedAt: 0,
    });

    const { queryByText } = render(<LoginScreen />);
    
    // Button text should not be visible when loading
    expect(queryByText('Log In')).toBeNull();
  });

  it('navigates to /(tabs) on successful login', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue({ user: { id: 1 } });
    mockUseLogin.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null,
      mutate: jest.fn(),
      reset: jest.fn(),
      data: undefined,
      isError: false,
      isIdle: true,
      isPaused: false,
      isSuccess: false,
      status: 'idle',
      variables: undefined,
      failureCount: 0,
      failureReason: null,
      context: undefined,
      submittedAt: 0,
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    // Fill valid credentials
    fireEvent.changeText(getByPlaceholderText('Email or Username'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    
    // Press login
    fireEvent.press(getByText('Log In'));
    
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('displays API error message on login failure', async () => {
    const mockMutateAsync = jest.fn().mockRejectedValue({
      status: 401,
      message: 'Invalid credentials',
    });
    mockUseLogin.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      error: null,
      mutate: jest.fn(),
      reset: jest.fn(),
      data: undefined,
      isError: false,
      isIdle: true,
      isPaused: false,
      isSuccess: false,
      status: 'idle',
      variables: undefined,
      failureCount: 0,
      failureReason: null,
      context: undefined,
      submittedAt: 0,
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    
    // Fill valid credentials
    fireEvent.changeText(getByPlaceholderText('Email or Username'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    
    // Press login
    fireEvent.press(getByText('Log In'));
    
    await waitFor(() => {
      expect(getByText('Invalid email or password')).toBeTruthy();
    });
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
