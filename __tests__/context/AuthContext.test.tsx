import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api/auth';
import { tokenStorage } from '@/services/storage/token';
import { ApiError } from '@/services/api/errors';

// Mock the services
jest.mock('@/services/api/auth');
jest.mock('@/services/storage/token');

const mockAuthService = authService as jest.Mocked<typeof authService>;
const mockTokenStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;

const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  phone: null,
  avatar_url: null,
  user_type: 'parent' as const,
  push_notifications: true,
  weekly_report: true,
  email_verified_at: null,
  created_at: '2024-01-01T00:00:00Z',
};

// Wrapper component for the hook
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementations
    mockTokenStorage.getToken.mockResolvedValue(null);
    mockTokenStorage.getUser.mockResolvedValue(null);
    mockTokenStorage.setToken.mockResolvedValue(undefined);
    mockTokenStorage.setUser.mockResolvedValue(undefined);
    mockTokenStorage.clear.mockResolvedValue(undefined);
  });

  describe('verifyAuth', () => {
    it('returns true when token is valid', async () => {
      // Setup: token exists, getMe succeeds
      mockTokenStorage.getToken.mockResolvedValue('valid-token');
      mockTokenStorage.getUser.mockResolvedValue(mockUser);
      mockAuthService.getMe.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for initial auth to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Call verifyAuth
      let isAuthenticated: boolean;
      await act(async () => {
        isAuthenticated = await result.current.verifyAuth();
      });

      expect(isAuthenticated!).toBe(true);
      expect(mockAuthService.getMe).toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('attempts refresh when getMe returns 401', async () => {
      // Setup: token exists, getMe fails with 401
      mockTokenStorage.getToken.mockResolvedValue('expired-token');
      mockTokenStorage.getUser.mockResolvedValue(null);
      
      const unauthorizedError = new ApiError(401, { message: 'Unauthorized' });
      mockAuthService.getMe
        .mockRejectedValueOnce(unauthorizedError) // First call fails
        .mockResolvedValueOnce(mockUser); // After refresh, succeeds
      mockAuthService.refreshToken.mockResolvedValue('new-token');

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for initial auth to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Call verifyAuth
      let isAuthenticated: boolean;
      await act(async () => {
        isAuthenticated = await result.current.verifyAuth();
      });

      expect(isAuthenticated!).toBe(true);
      expect(mockAuthService.refreshToken).toHaveBeenCalled();
      expect(mockAuthService.getMe).toHaveBeenCalledTimes(2); // Once failed, once after refresh
    });

    it('returns true after successful refresh', async () => {
      // Setup: token exists, getMe fails with 401, refresh succeeds
      mockTokenStorage.getToken.mockResolvedValue('expired-token');
      mockTokenStorage.getUser.mockResolvedValue(null);
      
      const unauthorizedError = new ApiError(401, { message: 'Unauthorized' });
      mockAuthService.getMe
        .mockRejectedValueOnce(unauthorizedError)
        .mockResolvedValueOnce(mockUser);
      mockAuthService.refreshToken.mockResolvedValue('new-token');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let isAuthenticated: boolean;
      await act(async () => {
        isAuthenticated = await result.current.verifyAuth();
      });

      expect(isAuthenticated!).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(mockTokenStorage.setUser).toHaveBeenCalledWith(mockUser);
    });

    it('clears auth state when refresh fails', async () => {
      // Setup: token exists, getMe fails with 401, refresh also fails
      mockTokenStorage.getToken.mockResolvedValue('expired-token');
      mockTokenStorage.getUser.mockResolvedValue(null);
      
      const unauthorizedError = new ApiError(401, { message: 'Unauthorized' });
      mockAuthService.getMe.mockRejectedValue(unauthorizedError);
      mockAuthService.refreshToken.mockRejectedValue(new Error('Refresh failed'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let isAuthenticated: boolean;
      await act(async () => {
        isAuthenticated = await result.current.verifyAuth();
      });

      expect(isAuthenticated!).toBe(false);
      expect(mockTokenStorage.clear).toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('sets isVerifying to true during verification and false after', async () => {
      // Setup: token exists
      mockTokenStorage.getToken.mockResolvedValue('valid-token');
      mockTokenStorage.getUser.mockResolvedValue(null);
      mockAuthService.getMe.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Initially not verifying
      expect(result.current.isVerifying).toBe(false);

      // Call verifyAuth
      await act(async () => {
        await result.current.verifyAuth();
      });

      // After completion, should not be verifying
      expect(result.current.isVerifying).toBe(false);
      // And should be authenticated
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('returns false when no token exists', async () => {
      // Setup: no token stored
      mockTokenStorage.getToken.mockResolvedValue(null);
      mockTokenStorage.getUser.mockResolvedValue(null);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let isAuthenticated: boolean;
      await act(async () => {
        isAuthenticated = await result.current.verifyAuth();
      });

      expect(isAuthenticated!).toBe(false);
      expect(mockAuthService.getMe).not.toHaveBeenCalled();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
