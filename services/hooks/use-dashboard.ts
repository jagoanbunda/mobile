import { useQuery } from '@tanstack/react-query';
import { createDashboardMock } from '@/services/__mocks__/dashboardMock';
import type { DashboardResponse } from '@/types/dashboard';

/**
 * Query keys for dashboard data
 *
 * @example
 * ```ts
 * dashboardKeys.all         // ['dashboard']
 * dashboardKeys.child(1)    // ['dashboard', 1]
 * ```
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  child: (childId: number) => [...dashboardKeys.all, childId] as const,
};

/**
 * Fetches aggregated dashboard data for a child.
 *
 * Returns nutrition progress rings, weekly trends, pending tasks, and personalized tips.
 * Currently uses mock data during development.
 *
 * @param childId - The ID of the child to fetch dashboard data for
 * @returns React Query result with dashboard data, loading state, error, and refetch
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useDashboard(childId);
 *
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 *
 * return <Dashboard data={data} />;
 * ```
 */
export function useDashboard(childId: number) {
  return useQuery<DashboardResponse>({
    queryKey: dashboardKeys.child(childId),
    queryFn: async () => {
      // TODO: Replace with actual API call when backend ready
      // return dashboardService.get(childId);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      return createDashboardMock({ child: { id: childId } });
    },
    enabled: childId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
