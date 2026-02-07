import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/services/api/errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 401 Unauthorized - let auth context handle it
        if (error instanceof ApiError && error.isUnauthorized) {
          return false;
        }
        // Retry once for other errors
        return failureCount < 1;
      },
      refetchOnWindowFocus: false, // Mobile optimization
    },
    mutations: {
      retry: 0,
    },
  },
});
