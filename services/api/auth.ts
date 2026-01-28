import { api } from './client';
import { tokenStorage } from '@/services/storage/token';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  MeResponse,
  RefreshTokenResponse,
  MessageResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  User,
} from '@/types';

export const authService = {
  /**
   * Login with email and password
   * Stores token and user data on success
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    await tokenStorage.setToken(response.token);
    await tokenStorage.setUser(response.user);
    return response;
  },

  /**
   * Register a new parent account
   * Stores token and user data on success
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    await tokenStorage.setToken(response.token);
    await tokenStorage.setUser(response.user);
    return response;
  },

  /**
   * Logout and revoke current token
   * Clears local storage
   */
  async logout(): Promise<void> {
    try {
      await api.post<MessageResponse>('/auth/logout');
    } finally {
      // Always clear local storage, even if API call fails
      await tokenStorage.clear();
    }
  },

  /**
   * Get current authenticated user
   */
  async getMe(): Promise<User> {
    const response = await api.get<MeResponse>('/auth/me');
    return response.user;
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh');
    await tokenStorage.setToken(response.token);
    return response.token;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await api.put<UpdateProfileResponse>(
      '/auth/profile',
      data
    );
    await tokenStorage.setUser(response.user);
    return response.user;
  },

  /**
   * Update user profile with avatar file upload
   * Uses multipart/form-data for file upload
   */
  async updateProfileWithAvatar(
    data: UpdateProfileRequest,
    avatarUri?: string | null
  ): Promise<User> {
    const formData = new FormData();

    // Add text fields
    if (data.name !== undefined) {
      formData.append('name', data.name);
    }
    if (data.phone !== undefined) {
      formData.append('phone', data.phone);
    }
    if (data.push_notifications !== undefined) {
      formData.append('push_notifications', data.push_notifications ? '1' : '0');
    }
    if (data.weekly_report !== undefined) {
      formData.append('weekly_report', data.weekly_report ? '1' : '0');
    }

    // Add avatar file if provided (local URI)
    if (avatarUri && avatarUri.startsWith('file://')) {
      const filename = avatarUri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('avatar', {
        uri: avatarUri,
        name: filename,
        type,
      } as unknown as Blob);
    }

    const response = await api.putMultipart<UpdateProfileResponse>(
      '/auth/profile',
      formData
    );
    await tokenStorage.setUser(response.user);
    return response.user;
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await tokenStorage.getToken();
    return token !== null;
  },

  /**
   * Get stored user (without API call)
   */
  async getStoredUser(): Promise<User | null> {
    return tokenStorage.getUser();
  },
};
