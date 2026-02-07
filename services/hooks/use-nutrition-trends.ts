import { useQuery } from '@tanstack/react-query';
import { nutritionTrendsService } from '@/services/api/nutrition-trends';
import type { NutritionTrendsResponse } from '@/types/nutrition-trends';

/**
 * Query keys for nutrition trends data
 *
 * @example
 * ```ts
 * nutritionTrendsKeys.all         // ['nutrition-trends']
 * nutritionTrendsKeys.child(1)    // ['nutrition-trends', 1]
 * ```
 */
export const nutritionTrendsKeys = {
  all: ['nutrition-trends'] as const,
  child: (childId: number) => [...nutritionTrendsKeys.all, childId] as const,
};

/**
 * Fetches nutrition trends data for a child.
 *
 * Returns daily, weekly, and monthly nutrition trends for calories, protein, carbohydrates, and fat.
 *
 * @param childId - The ID of the child to fetch nutrition trends for
 * @returns React Query result with nutrition trends data, loading state, error, and refetch
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useNutritionTrends(childId);
 *
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 *
 * return <NutritionTrends data={data} />;
 * ```
 */
export function useNutritionTrends(childId: number) {
  return useQuery<NutritionTrendsResponse>({
    queryKey: nutritionTrendsKeys.child(childId),
    queryFn: () => nutritionTrendsService.getNutritionTrends(childId),
    enabled: childId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
