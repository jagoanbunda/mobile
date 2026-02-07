/**
 * Nutrition Trends API Mock Factory
 *
 * Provides factory functions for creating typed mock data for nutrition trends endpoint.
 * Used for testing and development purposes.
 *
 * @example
 * ```ts
 * // Create default mock
 * const trends = createNutritionTrendsMock();
 *
 * // Create with custom childId
 * const trends = createNutritionTrendsMock({ childId: 5 });
 * ```
 *
 * API Contract:
 * - Endpoint: GET /api/v1/children/{childId}/nutrition-trends
 * - Response: NutritionTrendsResponse (see types/nutrition-trends.ts)
 * - Error Responses:
 *   - 401: { error: 'Unauthenticated' }
 *   - 403: { error: 'Forbidden' }
 *   - 404: { error: 'Child not found' }
 */

import type {
  NutritionTrendsResponse,
  NutritionTrendsData,
  DailyTrends,
  WeeklyTrends,
  MonthlyTrends,
  NutritionDailyMetricData,
  NutritionWeeklyMetricData,
  NutritionMonthlyMetricData,
  NutritionDailyDataPoint,
  NutritionWeeklyDataPoint,
  NutritionMonthlyDataPoint,
} from '@/types/nutrition-trends';
import type { DateString } from '@/types/common';
import type { TrendDirection } from '@/types/dashboard';

// =============================================================================
// Helper Types for Deep Partial Merge
// =============================================================================

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Deep merge two objects
 */
function deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      if (
        sourceValue !== undefined &&
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        (result as Record<string, unknown>)[key] = deepMerge(
          targetValue as object,
          sourceValue as DeepPartial<typeof targetValue>
        );
      } else if (sourceValue !== undefined) {
        (result as Record<string, unknown>)[key] = sourceValue;
      }
    }
  }
  return result;
}

/**
 * Generate date string in YYYY-MM-DD format
 */
function formatDateString(date: Date): DateString {
  return date.toISOString().split('T')[0] as DateString;
}

/**
 * Generate 30 days of daily data ending at a given date
 */
function generateDailyData(endDate: Date = new Date()): NutritionDailyDataPoint[] {
  const days: NutritionDailyDataPoint[] = [];
  const baseValue = 1100;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);

    days.push({
      date: formatDateString(date),
      value: baseValue + Math.random() * 200 - 100, // Random variation
    });
  }

  return days;
}

/**
 * Generate 12 weeks of weekly data ending at a given date
 */
function generateWeeklyData(endDate: Date = new Date()): NutritionWeeklyDataPoint[] {
  const weeks: NutritionWeeklyDataPoint[] = [];
  const baseValue = 1100;

  for (let i = 11; i >= 0; i--) {
    const weekEnd = new Date(endDate);
    weekEnd.setDate(weekEnd.getDate() - i * 7);

    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    weeks.push({
      week_start: formatDateString(weekStart),
      week_end: formatDateString(weekEnd),
      average: baseValue + (12 - i) * 20, // Gradual increase
    });
  }

  return weeks;
}

/**
 * Generate 12 months of monthly data ending at a given date
 */
function generateMonthlyData(endDate: Date = new Date()): NutritionMonthlyDataPoint[] {
  const months: NutritionMonthlyDataPoint[] = [];
  const baseValue = 1100;

  for (let i = 11; i >= 0; i--) {
    const date = new Date(endDate);
    date.setMonth(date.getMonth() - i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    months.push({
      month: `${year}-${month}`,
      average: baseValue + (12 - i) * 30, // Gradual increase
    });
  }

  return months;
}

// =============================================================================
// Individual Mock Factories
// =============================================================================

/**
 * Create a mock daily nutrition metric data
 *
 * @param overrides - Partial overrides for the metric
 * @returns NutritionDailyMetricData with realistic default values
 */
export function createDailyMetricMock(
  overrides: DeepPartial<NutritionDailyMetricData> = {}
): NutritionDailyMetricData {
  return {
    days: (overrides.days as NutritionDailyDataPoint[] | undefined) ?? generateDailyData(),
    average: overrides.average ?? 1100,
    trend_direction: (overrides.trend_direction ?? 'up') as TrendDirection,
  };
}

/**
 * Create mock daily trends for all metrics
 *
 * @param overrides - Partial overrides for specific metrics
 * @returns DailyTrends with realistic default values
 */
export function createDailyTrendsMock(
  overrides: DeepPartial<DailyTrends> = {}
): DailyTrends {
  return {
    calories: createDailyMetricMock({
      average: 1100,
      trend_direction: 'up',
      ...overrides.calories,
    }),
    protein: createDailyMetricMock({
      average: 18,
      trend_direction: 'stable',
      ...overrides.protein,
    }),
    carbohydrate: createDailyMetricMock({
      average: 140,
      trend_direction: 'up',
      ...overrides.carbohydrate,
    }),
    fat: createDailyMetricMock({
      average: 35,
      trend_direction: 'stable',
      ...overrides.fat,
    }),
  };
}

/**
 * Create a mock weekly nutrition metric data
 *
 * @param overrides - Partial overrides for the metric
 * @returns NutritionWeeklyMetricData with realistic default values
 */
export function createWeeklyMetricMock(
  overrides: DeepPartial<NutritionWeeklyMetricData> = {}
): NutritionWeeklyMetricData {
  return {
    weeks: (overrides.weeks as NutritionWeeklyDataPoint[] | undefined) ?? generateWeeklyData(),
    average: overrides.average ?? 1100,
    trend_direction: (overrides.trend_direction ?? 'up') as TrendDirection,
  };
}

/**
 * Create mock weekly trends for all metrics
 *
 * @param overrides - Partial overrides for specific metrics
 * @returns WeeklyTrends with realistic default values
 */
export function createWeeklyTrendsMock(
  overrides: DeepPartial<WeeklyTrends> = {}
): WeeklyTrends {
  return {
    calories: createWeeklyMetricMock({
      average: 1100,
      trend_direction: 'up',
      ...overrides.calories,
    }),
    protein: createWeeklyMetricMock({
      average: 18,
      trend_direction: 'stable',
      ...overrides.protein,
    }),
    carbohydrate: createWeeklyMetricMock({
      average: 140,
      trend_direction: 'up',
      ...overrides.carbohydrate,
    }),
    fat: createWeeklyMetricMock({
      average: 35,
      trend_direction: 'stable',
      ...overrides.fat,
    }),
  };
}

/**
 * Create a mock monthly nutrition metric data
 *
 * @param overrides - Partial overrides for the metric
 * @returns NutritionMonthlyMetricData with realistic default values
 */
export function createMonthlyMetricMock(
  overrides: DeepPartial<NutritionMonthlyMetricData> = {}
): NutritionMonthlyMetricData {
  return {
    months: (overrides.months as NutritionMonthlyDataPoint[] | undefined) ?? generateMonthlyData(),
    average: overrides.average ?? 1100,
    trend_direction: (overrides.trend_direction ?? 'up') as TrendDirection,
  };
}

/**
 * Create mock monthly trends for all metrics
 *
 * @param overrides - Partial overrides for specific metrics
 * @returns MonthlyTrends with realistic default values
 */
export function createMonthlyTrendsMock(
  overrides: DeepPartial<MonthlyTrends> = {}
): MonthlyTrends {
  return {
    calories: createMonthlyMetricMock({
      average: 1100,
      trend_direction: 'up',
      ...overrides.calories,
    }),
    protein: createMonthlyMetricMock({
      average: 18,
      trend_direction: 'stable',
      ...overrides.protein,
    }),
    carbohydrate: createMonthlyMetricMock({
      average: 140,
      trend_direction: 'up',
      ...overrides.carbohydrate,
    }),
    fat: createMonthlyMetricMock({
      average: 35,
      trend_direction: 'stable',
      ...overrides.fat,
    }),
  };
}

// =============================================================================
// Main Nutrition Trends Mock Factory
// =============================================================================

/**
 * Create a complete mock NutritionTrendsResponse
 *
 * Generates realistic mock data matching the API contract for
 * GET /api/v1/children/{childId}/nutrition-trends
 *
 * @param overrides - Deep partial overrides for any part of the response
 * @returns NutritionTrendsResponse with all required fields populated
 *
 * @example
 * ```ts
 * // Default mock
 * const trends = createNutritionTrendsMock();
 *
 * // Custom childId
 * const trends = createNutritionTrendsMock({ childId: 5 });
 *
 * // Custom nutrition data
 * const trends = createNutritionTrendsMock({
 *   daily: {
 *     calories: { average: 1200 }
 *   }
 * });
 * ```
 */
export function createNutritionTrendsMock(
  overrides: DeepPartial<NutritionTrendsResponse> & { childId?: number } = {}
): NutritionTrendsResponse {
  const defaultResponse: NutritionTrendsResponse = {
    data: {
      daily: createDailyTrendsMock(),
      weekly: createWeeklyTrendsMock(),
      monthly: createMonthlyTrendsMock(),
    },
  };

  const result: NutritionTrendsResponse = {
    data: {
      daily: overrides.data?.daily
        ? deepMerge(defaultResponse.data.daily, overrides.data.daily)
        : defaultResponse.data.daily,
      weekly: overrides.data?.weekly
        ? deepMerge(defaultResponse.data.weekly, overrides.data.weekly)
        : defaultResponse.data.weekly,
      monthly: overrides.data?.monthly
        ? deepMerge(defaultResponse.data.monthly, overrides.data.monthly)
        : defaultResponse.data.monthly,
    },
  };

  return result;
}

// =============================================================================
// API Error Response Mocks
// =============================================================================

/**
 * API Error response shape
 */
export interface ApiErrorResponse {
  error: string;
  message?: string;
}

/**
 * Create mock API error responses
 */
export const mockApiErrors = {
  unauthenticated: { error: 'Unauthenticated' } as ApiErrorResponse,
  forbidden: { error: 'Forbidden' } as ApiErrorResponse,
  notFound: { error: 'Child not found' } as ApiErrorResponse,
  serverError: { error: 'Internal Server Error' } as ApiErrorResponse,
};
