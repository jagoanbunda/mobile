import { DateString } from './common';
import { TrendDirection } from './dashboard';

/** Daily nutrition data point */
export interface NutritionDailyDataPoint {
  /** Date in YYYY-MM-DD format */
  date: DateString;
  /** Nutrient value for the day */
  value: number;
}

/** Daily nutrition metric data */
export interface NutritionDailyMetricData {
  /** Array of daily data points */
  days: NutritionDailyDataPoint[];
  /** Average value across the period */
  average: number;
  /** Direction of the trend */
  trend_direction: TrendDirection;
}

/** Weekly nutrition data point */
export interface NutritionWeeklyDataPoint {
  /** Start date of the week (YYYY-MM-DD) */
  week_start: DateString;
  /** End date of the week (YYYY-MM-DD) */
  week_end: DateString;
  /** Average value for the week */
  average: number;
}

/** Weekly nutrition metric data */
export interface NutritionWeeklyMetricData {
  /** Array of weekly data points */
  weeks: NutritionWeeklyDataPoint[];
  /** Average value across the period */
  average: number;
  /** Direction of the trend */
  trend_direction: TrendDirection;
}

/** Monthly nutrition data point */
export interface NutritionMonthlyDataPoint {
  /** Month identifier (e.g., "2024-01") */
  month: string;
  /** Average value for the month */
  average: number;
}

/** Monthly nutrition metric data */
export interface NutritionMonthlyMetricData {
  /** Array of monthly data points */
  months: NutritionMonthlyDataPoint[];
  /** Average value across the period */
  average: number;
  /** Direction of the trend */
  trend_direction: TrendDirection;
}

/** Daily nutrition trends for all metrics */
export interface DailyTrends {
  /** Calories trend data */
  calories: NutritionDailyMetricData;
  /** Protein trend data */
  protein: NutritionDailyMetricData;
  /** Carbohydrate trend data */
  carbohydrate: NutritionDailyMetricData;
  /** Fat trend data */
  fat: NutritionDailyMetricData;
}

/** Weekly nutrition trends for all metrics */
export interface WeeklyTrends {
  /** Calories trend data */
  calories: NutritionWeeklyMetricData;
  /** Protein trend data */
  protein: NutritionWeeklyMetricData;
  /** Carbohydrate trend data */
  carbohydrate: NutritionWeeklyMetricData;
  /** Fat trend data */
  fat: NutritionWeeklyMetricData;
}

/** Monthly nutrition trends for all metrics */
export interface MonthlyTrends {
  /** Calories trend data */
  calories: NutritionMonthlyMetricData;
  /** Protein trend data */
  protein: NutritionMonthlyMetricData;
  /** Carbohydrate trend data */
  carbohydrate: NutritionMonthlyMetricData;
  /** Fat trend data */
  fat: NutritionMonthlyMetricData;
}

/** Nutrition trends data structure */
export interface NutritionTrendsData {
  /** Daily nutrition trends */
  daily: DailyTrends;
  /** Weekly nutrition trends */
  weekly: WeeklyTrends;
  /** Monthly nutrition trends */
  monthly: MonthlyTrends;
}

/** GET /children/{id}/nutrition-trends response */
export interface NutritionTrendsResponse {
  /** Nutrition trends data */
  data: NutritionTrendsData;
}
