import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '@/app/auth/register';
import { useRegister } from '@/services/hooks/use-auth';
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
      error: '#d32f2f',
      textMuted: '#999999',
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
    back: jest.fn(),
  },
}));
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

const mockUseRegister = useRegister as jest.MockedFunction<typeof useRegister>;
const mockRouter = router as jest.Mocked<typeof router>;

const createMockMutation = (overrides = {}) => ({
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
  status: 'idle' as const,
  variables: undefined,
  failureCount: 0,
  failureReason: null,
  context: undefined,
  submittedAt: 0,
  ...overrides,
});

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRegister.mockReturnValue(createMockMutation());
  });

  it('shows validation error when name is empty', async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    
    // Fill other fields but leave name empty
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
    
    // Press register
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(getByText('Full name is required')).toBeTruthy();
    });
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('shows validation error when email is invalid format', async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    
    // Fill with invalid email
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
    
    // Press register
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('shows validation error when password is too short', async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    
    // Fill with short password
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'short');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'short');
    
    // Press register
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(getByText('Password must be at least 8 characters')).toBeTruthy();
    });
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('shows validation error when passwords do not match', async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    
    // Fill with mismatched passwords
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'different123');
    
    // Press register
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(getByText('Passwords do not match')).toBeTruthy();
    });
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('shows validation error when terms not accepted', async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    
    // Fill all fields but don't accept terms
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
    
    // Press register without accepting terms
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(getByText('You must accept the Terms & Conditions')).toBeTruthy();
    });
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('disables button and shows loading during submit', async () => {
    mockUseRegister.mockReturnValue(createMockMutation({
      isPending: true,
      status: 'pending',
      isIdle: false,
    }));

    const { queryByText } = render(<RegisterScreen />);
    
    // Button text should not be visible when loading
    expect(queryByText('Sign Up')).toBeNull();
  });

  it('navigates to /profile/add-child on success', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue({ user: { id: 1 } });
    mockUseRegister.mockReturnValue(createMockMutation({
      mutateAsync: mockMutateAsync,
    }));

    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    
    // Fill valid form
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
    
    // Accept terms
    fireEvent.press(getByText('I agree to the Terms & Conditions'));
    
    // Press register
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      });
      expect(mockRouter.replace).toHaveBeenCalledWith('/profile/add-child');
    });
  });

  it('displays API validation errors (e.g., email taken)', async () => {
    const mockMutateAsync = jest.fn().mockRejectedValue({
      status: 422,
      getFieldError: (field: string) => field === 'email' ? 'Email is already taken' : null,
      getFirstError: () => 'Email is already taken',
    });
    mockUseRegister.mockReturnValue(createMockMutation({
      mutateAsync: mockMutateAsync,
    }));

    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    
    // Fill valid form
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'existing@example.com');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');
    
    // Accept terms
    fireEvent.press(getByText('I agree to the Terms & Conditions'));
    
    // Press register
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(getByText('Email is already taken')).toBeTruthy();
    });
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
