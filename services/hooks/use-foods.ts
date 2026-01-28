import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foodService, FoodListParams } from '@/services/api/foods';
import { foodLogService, FoodLogListParams, NutritionSummaryParams } from '@/services/api/food-logs';
import { CreateFoodRequest, CreateFoodLogRequest, UpdateFoodLogRequest, NutritionPeriod } from '@/types';
import { childKeys } from './use-children';

/** Query keys */
export const foodKeys = {
  all: ['foods'] as const,
  lists: () => [...foodKeys.all, 'list'] as const,
  list: (params?: FoodListParams) => [...foodKeys.lists(), params] as const,
  details: () => [...foodKeys.all, 'detail'] as const,
  detail: (id: number) => [...foodKeys.details(), id] as const,
  categories: () => [...foodKeys.all, 'categories'] as const,
};

export const foodLogKeys = {
  all: ['food-logs'] as const,
  lists: () => [...foodLogKeys.all, 'list'] as const,
  list: (childId: number, params?: FoodLogListParams) => 
    [...foodLogKeys.lists(), childId, params] as const,
  details: () => [...foodLogKeys.all, 'detail'] as const,
  detail: (childId: number, logId: number) => [...foodLogKeys.details(), childId, logId] as const,
  summaries: () => [...foodLogKeys.all, 'summary'] as const,
  summary: (childId: number, params?: NutritionSummaryParams) =>
    [...foodLogKeys.summaries(), childId, params] as const,
};

/**
 * Fetch foods with search/filter
 */
export function useFoods(params?: FoodListParams) {
  return useQuery({
    queryKey: foodKeys.list(params),
    queryFn: () => foodService.getAll(params),
    staleTime: 10 * 60 * 1000, // 10 minutes (food catalog rarely changes)
  });
}

/**
 * Search foods (debounced search input)
 */
export function useFoodSearch(search: string, category?: string) {
  return useQuery({
    queryKey: foodKeys.list({ search, category }),
    queryFn: () => foodService.getAll({ search, category, per_page: 50 }),
    enabled: search.length >= 2 || !!category,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch food categories
 */
export function useFoodCategories() {
  return useQuery({
    queryKey: foodKeys.categories(),
    queryFn: () => foodService.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour (categories are static)
  });
}

/**
 * Create a custom food
 */
export function useCreateFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFoodRequest) => foodService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodKeys.lists() });
    },
  });
}

/**
 * Fetch food logs for a child
 */
export function useFoodLogs(childId: number, params?: FoodLogListParams) {
  return useQuery({
    queryKey: foodLogKeys.list(childId, params),
    queryFn: () => foodLogService.getAll(childId, params),
    enabled: childId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch food logs for today
 */
export function useTodayFoodLogs(childId: number) {
  const today = new Date().toISOString().split('T')[0];
  return useFoodLogs(childId, { start_date: today, end_date: today });
}

/**
 * Create a food log
 */
export function useCreateFoodLog(childId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFoodLogRequest) => foodLogService.create(childId, data),
    onSuccess: () => {
      // Invalidate food logs list
      queryClient.invalidateQueries({ queryKey: foodLogKeys.lists() });
      // Invalidate nutrition summary
      queryClient.invalidateQueries({ queryKey: foodLogKeys.summaries() });
      // Invalidate child summary (today_nutrition)
      queryClient.invalidateQueries({ queryKey: childKeys.summary(childId) });
    },
  });
}

/**
 * Update a food log
 */
export function useUpdateFoodLog(childId: number, logId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFoodLogRequest) => foodLogService.update(childId, logId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodLogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: foodLogKeys.detail(childId, logId) });
      queryClient.invalidateQueries({ queryKey: foodLogKeys.summaries() });
    },
  });
}

/**
 * Delete a food log
 */
export function useDeleteFoodLog(childId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: number) => foodLogService.delete(childId, logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foodLogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: foodLogKeys.summaries() });
      queryClient.invalidateQueries({ queryKey: childKeys.summary(childId) });
    },
  });
}

/**
 * Fetch nutrition summary
 */
export function useNutritionSummary(childId: number, params?: NutritionSummaryParams) {
  return useQuery({
    queryKey: foodLogKeys.summary(childId, params),
    queryFn: () => foodLogService.getNutritionSummary(childId, params),
    enabled: childId > 0,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch today's nutrition summary
 */
export function useTodayNutrition(childId: number) {
  const today = new Date().toISOString().split('T')[0];
  return useNutritionSummary(childId, { period: 'day', date: today });
}

/**
 * Fetch weekly nutrition summary
 */
export function useWeeklyNutrition(childId: number) {
  return useNutritionSummary(childId, { period: 'week' });
}

/**
 * Fetch a single food log by ID
 */
export function useFoodLogDetail(childId: number, logId: number) {
  return useQuery({
    queryKey: foodLogKeys.detail(childId, logId),
    queryFn: () => foodLogService.getById(childId, logId),
    enabled: childId > 0 && logId > 0,
    staleTime: 2 * 60 * 1000,
  });
}
