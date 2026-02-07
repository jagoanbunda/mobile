import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/api/auth';
import { useAuth } from '@/context/AuthContext';
import { LoginRequest, RegisterRequest, UpdateProfileRequest } from '@/types';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout: contextLogout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await contextLogout(); // This calls authService.logout() AND sets user to null
    },
    onSuccess: () => {
      queryClient.clear(); // Clear all queries on logout
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      authService.updateProfile(data),
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });
}

export function useUpdateProfileWithAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, avatarUri }: { data: UpdateProfileRequest; avatarUri?: string | null }) =>
      authService.updateProfileWithAvatar(data, avatarUri),
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });
}
