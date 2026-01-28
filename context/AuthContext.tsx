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
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
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
