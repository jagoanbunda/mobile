import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { authService } from '@/services/api/auth';
import { tokenStorage } from '@/services/storage/token';
import { User, LoginRequest, RegisterRequest, UpdateProfileRequest } from '@/types';
import { ApiError } from '@/services/api/errors';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifying: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
  verifyAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = await tokenStorage.getUser();
        const token = await tokenStorage.getToken();

        if (storedUser && token) {
          setUser(storedUser);
          // Optionally verify token is still valid
          try {
            const freshUser = await authService.getMe();
            setUser(freshUser);
            await tokenStorage.setUser(freshUser);
          } catch (error) {
            // Token invalid, clear auth state
            if (error instanceof ApiError && error.isUnauthorized) {
              await tokenStorage.clear();
              setUser(null);
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    const updatedUser = await authService.updateProfile(data);
    setUser(updatedUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const freshUser = await authService.getMe();
    setUser(freshUser);
    await tokenStorage.setUser(freshUser);
  }, []);

  /**
   * Verify authentication status with token refresh support.
   * 1. Checks if token exists in storage
   * 2. Calls /auth/me to verify token validity
   * 3. If 401, attempts authService.refreshToken()
   * 4. If refresh succeeds, updates token and fetches fresh user
   * 5. If refresh fails, clears auth state and returns false
   * @returns true if authenticated, false otherwise
   */
  const verifyAuth = useCallback(async (): Promise<boolean> => {
    // Prevent concurrent verification
    if (isVerifying) {
      return !!user;
    }

    setIsVerifying(true);
    try {
      const token = await tokenStorage.getToken();
      
      // No token stored - not authenticated
      if (!token) {
        setUser(null);
        return false;
      }

      try {
        // Verify token by calling /auth/me
        const freshUser = await authService.getMe();
        setUser(freshUser);
        await tokenStorage.setUser(freshUser);
        return true;
      } catch (error) {
        // If 401, attempt token refresh
        if (error instanceof ApiError && error.isUnauthorized) {
          try {
            // Attempt to refresh the token
            await authService.refreshToken();
            
            // Token refreshed successfully, fetch fresh user data
            const freshUser = await authService.getMe();
            setUser(freshUser);
            await tokenStorage.setUser(freshUser);
            return true;
          } catch (refreshError) {
            // Refresh failed - clear auth state
            await tokenStorage.clear();
            setUser(null);
            return false;
          }
        }
        
        // Non-401 error (network, server error, etc.) - keep current state
        // but return false to indicate verification failed
        return false;
      }
    } finally {
      setIsVerifying(false);
    }
  }, [user, isVerifying]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isVerifying,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        verifyAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
