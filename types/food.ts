import { DateString, DateTimeString, PaginatedResponse } from './common';

/** Nutrition values */
export interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber?: number;
  sugar?: number;
}

/** Food entity */
export interface Food {
  id: number;
  name: string;
  category: string;
  icon: string | null;
  serving_size: number; // grams
  nutrition: Nutrition;
  is_system: boolean;
  is_active: boolean;
}

/** POST /foods request */
export interface CreateFoodRequest {
  name: string;
  category: string;
  icon?: string;
  serving_size: number;
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber?: number;
  sugar?: number;
}

/** PUT /foods/{id} request */
export interface UpdateFoodRequest {
  name?: string;
  category?: string;
  icon?: string;
  serving_size?: number;
  calories?: number;
  protein?: number;
  fat?: number;
  carbohydrate?: number;
  fiber?: number;
  sugar?: number;
}

/** GET /foods response */
export type FoodsListResponse = PaginatedResponse<Food>;

/** GET /foods/{id} response */
export interface FoodResponse {
  food: Food;
}

/** POST/PUT /foods response */
export interface FoodMutationResponse {
  message: string;
  food: Food;
}

/** GET /foods-categories response */
export interface FoodCategoriesResponse {
  categories: string[];
}

/** Meal time enum */
export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/** Food log item */
export interface FoodLogItem {
  id: number;
  food: {
    id: number;
    name: string;
    category: string;
    icon: string | null;
  };
  quantity: number;
  serving_size: number; // grams
  nutrition: Nutrition;
}

/** Food log totals */
export interface FoodLogTotals {
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
}

/** Food log entity */
export interface FoodLog {
  id: number;
  child_id: number;
  log_date: DateString;
  meal_time: MealTime;
  meal_time_label: string; // "Sarapan", "Makan Siang", etc.
  totals: FoodLogTotals;
  items: FoodLogItem[];
  notes: string | null;
  created_at: DateTimeString;
}

/** Food log item input */
export interface FoodLogItemInput {
  food_id: number;
  quantity: number;
  serving_size?: number;
}

/** POST /children/{id}/food-logs request */
export interface CreateFoodLogRequest {
  log_date: DateString;
  meal_time: MealTime;
  notes?: string;
  items: FoodLogItemInput[];
}

/** PUT /children/{id}/food-logs/{id} request */
export interface UpdateFoodLogRequest {
  log_date?: DateString;
  meal_time?: MealTime;
  notes?: string;
  items?: FoodLogItemInput[];
}

/** GET /children/{id}/food-logs response */
export type FoodLogsListResponse = PaginatedResponse<FoodLog>;

/** GET /children/{id}/food-logs/{id} response */
export interface FoodLogResponse {
  food_log: FoodLog;
}

/** POST/PUT /children/{id}/food-logs response */
export interface FoodLogMutationResponse {
  message: string;
  food_log: FoodLog;
}

/** Nutrition summary period */
export type NutritionPeriod = 'day' | 'week' | 'month';

/** Meal time nutrition breakdown */
export interface MealTimeNutrition {
  count: number;
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
}

/** GET /children/{id}/nutrition-summary response */
export interface NutritionSummaryResponse {
  period: NutritionPeriod;
  start_date: DateString;
  end_date: DateString;
  total_meals: number;
  totals: FoodLogTotals;
  by_meal_time: {
    breakfast?: MealTimeNutrition;
    lunch?: MealTimeNutrition;
    dinner?: MealTimeNutrition;
    snack?: MealTimeNutrition;
  };
  daily_average?: FoodLogTotals; // Only for week/month periods
}
