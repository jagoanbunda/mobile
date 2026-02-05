/**
 * Dashboard API Mock Factory
 *
 * Provides factory functions for creating typed mock data for dashboard endpoint.
 * Used for testing and development purposes.
 *
 * @example
 * ```ts
 * // Create default mock
 * const dashboard = createDashboardMock();
 *
 * // Create with custom child name
 * const dashboard = createDashboardMock({ child: { name: 'Budi' } });
 *
 * // Create individual components
 * const ring = createProgressRingMock({ current: 500, target: 1000 });
 * const task = createTaskMock({ type: 'ASQ3', priority: 'high' });
 * const tip = createTipMock({ category: 'nutrition' });
 * ```
 *
 * API Contract:
 * - Endpoint: GET /api/v1/children/{childId}/dashboard
 * - Response: DashboardResponse (see types/dashboard.ts)
 * - Error Responses:
 *   - 401: { error: 'Unauthenticated' }
 *   - 403: { error: 'Forbidden' }
 *   - 404: { error: 'Child not found' }
 */

import type {
  DashboardResponse,
  ChildProfile,
  ProgressRingData,
  ProgressRingsData,
  WeeklyDataPoint,
  WeeklyTrendData,
  TaskReminder,
  PersonalizedTip,
  TaskReminderType,
  TipCategory,
} from '@/types/dashboard';
import type { DateString } from '@/types/common';

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
  return date.toISOString().split('T')[0];
}

/**
 * Generate 4 weeks of weekly data ending at a given date
 */
function generateWeeklyData(endDate: Date = new Date()): WeeklyDataPoint[] {
  const weeks: WeeklyDataPoint[] = [];
  const baseCalories = 1100;

  for (let i = 3; i >= 0; i--) {
    const weekEnd = new Date(endDate);
    weekEnd.setDate(weekEnd.getDate() - i * 7);

    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    weeks.push({
      week_start: formatDateString(weekStart),
      week_end: formatDateString(weekEnd),
      average_calories: baseCalories + (3 - i) * 50, // Gradual increase
    });
  }

  return weeks;
}

// =============================================================================
// Individual Mock Factories
// =============================================================================

/**
 * Create a mock progress ring data object
 *
 * @param overrides - Partial overrides for the progress ring
 * @returns ProgressRingData with realistic default values
 *
 * @example
 * ```ts
 * const caloriesRing = createProgressRingMock({
 *   current: 850,
 *   target: 1350,
 *   unit: 'kcal'
 * });
 * ```
 */
export function createProgressRingMock(
  overrides: Partial<ProgressRingData> = {}
): ProgressRingData {
  const current = overrides.current ?? 850;
  const target = overrides.target ?? 1350;
  const percentage = overrides.percentage ?? Math.round((current / target) * 100);

  return {
    current,
    target,
    percentage,
    unit: overrides.unit ?? 'kcal',
  };
}

/**
 * Create mock progress rings for all 5 nutrition metrics
 *
 * @param overrides - Partial overrides for specific rings
 * @returns ProgressRingsData with realistic Indonesian nutrition targets
 *
 * @example
 * ```ts
 * const rings = createProgressRingsMock({
 *   calories: { current: 1000 }
 * });
 * ```
 */
export function createProgressRingsMock(
  overrides: DeepPartial<ProgressRingsData> = {}
): ProgressRingsData {
  return {
    calories: createProgressRingMock({
      current: 850,
      target: 1350,
      unit: 'kcal',
      ...overrides.calories,
    }),
    protein: createProgressRingMock({
      current: 15,
      target: 20,
      unit: 'g',
      ...overrides.protein,
    }),
    carbs: createProgressRingMock({
      current: 120,
      target: 155,
      unit: 'g',
      ...overrides.carbs,
    }),
    fat: createProgressRingMock({
      current: 30,
      target: 45,
      unit: 'g',
      ...overrides.fat,
    }),
    fiber: createProgressRingMock({
      current: 8,
      target: 16,
      unit: 'g',
      ...overrides.fiber,
    }),
  };
}

/**
 * Create a mock task reminder
 *
 * @param overrides - Partial overrides for the task
 * @returns TaskReminder with Indonesian text
 *
 * @example
 * ```ts
 * const task = createTaskMock({ type: 'PMT', priority: 'medium' });
 * ```
 */
export function createTaskMock(overrides: Partial<TaskReminder> = {}): TaskReminder {
  const type: TaskReminderType = overrides.type ?? 'ASQ3';

  const taskDefaults: Record<TaskReminderType, Omit<TaskReminder, 'type'>> = {
    ASQ3: {
      title: 'Skrining ASQ-3',
      description: 'Skrining perkembangan usia 18 bulan belum dilakukan',
      priority: 'high',
    },
    PMT: {
      title: 'Jadwal PMT',
      description: 'Sesi PMT hari ini belum tercatat',
      priority: 'medium',
    },
    Anthropometry: {
      title: 'Pengukuran Antropometri',
      description: 'Pengukuran berat dan tinggi badan bulan ini belum dilakukan',
      priority: 'medium',
    },
  };

  const defaults = taskDefaults[type];

  return {
    type,
    title: overrides.title ?? defaults.title,
    description: overrides.description ?? defaults.description,
    priority: overrides.priority ?? defaults.priority,
  };
}

/**
 * Create a mock personalized tip
 *
 * @param overrides - Partial overrides for the tip
 * @returns PersonalizedTip with Indonesian text
 *
 * @example
 * ```ts
 * const tip = createTipMock({ category: 'nutrition' });
 * ```
 */
export function createTipMock(overrides: Partial<PersonalizedTip> = {}): PersonalizedTip {
  const category: TipCategory = overrides.category ?? 'reminder';

  const tipDefaults: Record<TipCategory, Omit<PersonalizedTip, 'category'>> = {
    reminder: {
      icon: '📝',
      message: 'Jangan lupa mencatat makanan anak hari ini',
    },
    nutrition: {
      icon: '🥗',
      message: 'Asupan serat masih kurang, tambahkan sayur dan buah',
    },
    development: {
      icon: '🧒',
      message: 'Ajak anak bermain untuk merangsang perkembangan motorik',
    },
    health: {
      icon: '💊',
      message: 'Pastikan anak mendapat imunisasi sesuai jadwal',
    },
  };

  const defaults = tipDefaults[category];

  return {
    icon: overrides.icon ?? defaults.icon,
    message: overrides.message ?? defaults.message,
    category,
  };
}

/**
 * Create mock weekly trend data
 *
 * @param overrides - Partial overrides for the trend data
 * @returns WeeklyTrendData with 4 weeks of data
 *
 * @example
 * ```ts
 * const trend = createWeeklyTrendMock({ trend_direction: 'up' });
 * ```
 */
export function createWeeklyTrendMock(
  overrides: DeepPartial<WeeklyTrendData> = {}
): WeeklyTrendData {
  return {
    weeks:
      overrides.weeks && overrides.weeks.length > 0
        ? (overrides.weeks as WeeklyDataPoint[])
        : generateWeeklyData(),
    trend_direction: overrides.trend_direction ?? 'up',
  };
}

/**
 * Create a mock child profile
 *
 * @param overrides - Partial overrides for the child profile
 * @returns ChildProfile with Indonesian name
 *
 * @example
 * ```ts
 * const child = createChildProfileMock({ name: 'Budi', age_in_months: 24 });
 * ```
 */
export function createChildProfileMock(
  overrides: Partial<ChildProfile> = {}
): ChildProfile {
  return {
    id: overrides.id ?? 1,
    name: overrides.name ?? 'Anak Pertama',
    age_in_months: overrides.age_in_months ?? 20,
  };
}

// =============================================================================
// Main Dashboard Mock Factory
// =============================================================================

/**
 * Create a complete mock DashboardResponse
 *
 * Generates realistic mock data matching the API contract for
 * GET /api/v1/children/{childId}/dashboard
 *
 * @param overrides - Deep partial overrides for any part of the response
 * @returns DashboardResponse with all required fields populated
 *
 * @example
 * ```ts
 * // Default mock
 * const dashboard = createDashboardMock();
 *
 * // Custom child name
 * const dashboard = createDashboardMock({
 *   child: { name: 'Budi Santoso', age_in_months: 24 }
 * });
 *
 * // Custom nutrition data
 * const dashboard = createDashboardMock({
 *   progressRings: {
 *     calories: { current: 1000, target: 1200 }
 *   }
 * });
 * ```
 */
export function createDashboardMock(
  overrides: DeepPartial<DashboardResponse> = {}
): DashboardResponse {
  const defaultResponse: DashboardResponse = {
    child: createChildProfileMock(),
    progressRings: createProgressRingsMock(),
    weeklyTrend: createWeeklyTrendMock(),
    tasks: [
      createTaskMock({ type: 'ASQ3', priority: 'high' }),
      createTaskMock({ type: 'PMT', priority: 'medium' }),
    ],
    tips: [
      createTipMock({ category: 'reminder' }),
      createTipMock({ category: 'nutrition' }),
    ],
  };

  // Handle arrays specially - replace rather than merge
  const result: DashboardResponse = {
    child: overrides.child
      ? deepMerge(defaultResponse.child, overrides.child)
      : defaultResponse.child,
    progressRings: overrides.progressRings
      ? deepMerge(defaultResponse.progressRings, overrides.progressRings)
      : defaultResponse.progressRings,
    weeklyTrend: overrides.weeklyTrend
      ? deepMerge(defaultResponse.weeklyTrend, overrides.weeklyTrend)
      : defaultResponse.weeklyTrend,
    tasks: overrides.tasks
      ? (overrides.tasks as TaskReminder[])
      : defaultResponse.tasks,
    tips: overrides.tips
      ? (overrides.tips as PersonalizedTip[])
      : defaultResponse.tips,
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

// =============================================================================
// Wrapped API Response (matches actual API structure)
// =============================================================================

/**
 * Full API response wrapper with data property
 */
export interface DashboardApiResponse {
  data: DashboardResponse;
}

/**
 * Create mock wrapped API response
 *
 * @param overrides - Overrides for the dashboard data
 * @returns Full API response with data wrapper
 */
export function createDashboardApiResponse(
  overrides: DeepPartial<DashboardResponse> = {}
): DashboardApiResponse {
  return {
    data: createDashboardMock(overrides),
  };
}
