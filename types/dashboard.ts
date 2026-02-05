import { DateString } from './common';

/** Trend direction for weekly data */
export type TrendDirection = 'up' | 'down' | 'stable';

/** Task reminder type */
export type TaskReminderType = 'ASQ3' | 'PMT' | 'Anthropometry';

/** Task priority level */
export type TaskPriority = 'high' | 'medium' | 'low';

/** Personalized tip category */
export type TipCategory = 'reminder' | 'nutrition' | 'development' | 'health';

/** Child profile for dashboard (simplified) */
export interface ChildProfile {
  id: number;
  name: string;
  age_in_months: number;
}

/** Progress ring data for nutrition tracking */
export interface ProgressRingData {
  /** Current value achieved */
  current: number;
  /** Target value to reach */
  target: number;
  /** Percentage of target achieved (0-100) */
  percentage: number;
  /** Unit of measurement (e.g., 'kcal', 'g') */
  unit: string;
}

/** Weekly nutrition data point */
export interface WeeklyDataPoint {
  week_start: DateString;
  week_end: DateString;
  average_calories: number;
}

/** Weekly trend data for nutrition tracking */
export interface WeeklyTrendData {
  /** Array of 4 weekly data points */
  weeks: WeeklyDataPoint[];
  /** Direction of the trend */
  trend_direction: TrendDirection;
}

/** Task reminder for pending actions */
export interface TaskReminder {
  /** Type of task */
  type: TaskReminderType;
  /** Task title */
  title: string;
  /** Task description */
  description: string;
  /** Priority level */
  priority: TaskPriority;
}

/** Personalized tip for the user */
export interface PersonalizedTip {
  /** Emoji icon for the tip */
  icon: string;
  /** Tip message */
  message: string;
  /** Tip category */
  category: TipCategory;
}

/** Progress rings data structure (5 nutrition metrics) */
export interface ProgressRingsData {
  calories: ProgressRingData;
  protein: ProgressRingData;
  carbs: ProgressRingData;
  fat: ProgressRingData;
  fiber: ProgressRingData;
}

/** GET /children/{id}/dashboard response */
export interface DashboardResponse {
  /** Child profile */
  child: ChildProfile;
  /** Progress rings for 5 nutrition metrics */
  progressRings: ProgressRingsData;
  /** Weekly trend data */
  weeklyTrend: WeeklyTrendData;
  /** List of pending task reminders */
  tasks: TaskReminder[];
  /** List of personalized tips */
  tips: PersonalizedTip[];
}
