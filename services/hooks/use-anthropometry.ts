import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { anthropometryService, AnthropometryListParams } from '@/services/api/anthropometry';
import { CreateAnthropometryRequest, UpdateAnthropometryRequest } from '@/types';

/** Query keys */
export const anthropometryKeys = {
  all: ['anthropometry'] as const,
  lists: () => [...anthropometryKeys.all, 'list'] as const,
  list: (childId: number, params?: AnthropometryListParams) =>
    [...anthropometryKeys.lists(), childId, params] as const,
  details: () => [...anthropometryKeys.all, 'detail'] as const,
  detail: (childId: number, measurementId: number) =>
    [...anthropometryKeys.details(), childId, measurementId] as const,
  latest: (childId: number) => [...anthropometryKeys.all, 'latest', childId] as const,
  growthChart: (childId: number) => [...anthropometryKeys.all, 'growth-chart', childId] as const,
};

/**
 * Fetch anthropometry measurements for a child (paginated)
 */
export function useAnthropometry(childId: number, params?: AnthropometryListParams) {
  return useQuery({
    queryKey: anthropometryKeys.list(childId, params),
    queryFn: () => anthropometryService.getAll(childId, params),
    enabled: childId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch anthropometry measurements with infinite scrolling
 */
export function useAnthropometryInfinite(childId: number, params?: Omit<AnthropometryListParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: [...anthropometryKeys.list(childId, params), 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      anthropometryService.getAll(childId, { ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    enabled: childId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch a single anthropometry measurement
 */
export function useAnthropometryDetail(childId: number, measurementId: number) {
  return useQuery({
    queryKey: anthropometryKeys.detail(childId, measurementId),
    queryFn: () => anthropometryService.getById(childId, measurementId),
    enabled: childId > 0 && measurementId > 0,
  });
}

/**
 * Fetch the latest anthropometry measurement
 */
export function useLatestAnthropometry(childId: number) {
  return useQuery({
    queryKey: anthropometryKeys.latest(childId),
    queryFn: () => anthropometryService.getLatest(childId),
    enabled: childId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch growth chart data
 */
export function useGrowthChart(childId: number) {
  return useQuery({
    queryKey: anthropometryKeys.growthChart(childId),
    queryFn: () => anthropometryService.getGrowthChart(childId),
    enabled: childId > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Create a new anthropometry measurement
 */
export function useCreateAnthropometry(childId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnthropometryRequest) =>
      anthropometryService.create(childId, data),
    onSuccess: () => {
      // Invalidate all anthropometry queries for this child
      queryClient.invalidateQueries({ queryKey: anthropometryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: anthropometryKeys.latest(childId) });
      queryClient.invalidateQueries({ queryKey: anthropometryKeys.growthChart(childId) });
      // Also invalidate child summary (latest_measurement)
      queryClient.invalidateQueries({ queryKey: ['children', childId, 'summary'] });
    },
  });
}

/**
 * Update an anthropometry measurement
 */
export function useUpdateAnthropometry(childId: number, measurementId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAnthropometryRequest) =>
      anthropometryService.update(childId, measurementId, data),
    onSuccess: (updatedMeasurement) => {
      // Update the detail cache
      queryClient.setQueryData(
        anthropometryKeys.detail(childId, measurementId),
        updatedMeasurement
      );
      // Invalidate lists and growth chart
      queryClient.invalidateQueries({ queryKey: anthropometryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: anthropometryKeys.latest(childId) });
      queryClient.invalidateQueries({ queryKey: anthropometryKeys.growthChart(childId) });
    },
  });
}

/**
 * Delete an anthropometry measurement
 */
export function useDeleteAnthropometry(childId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (measurementId: number) =>
      anthropometryService.delete(childId, measurementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: anthropometryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: anthropometryKeys.latest(childId) });
      queryClient.invalidateQueries({ queryKey: anthropometryKeys.growthChart(childId) });
    },
  });
}
