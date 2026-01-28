import { api } from './client';
import {
  FoodLog,
  FoodLogResponse,
  FoodLogsListResponse,
  CreateFoodLogRequest,
  UpdateFoodLogRequest,
  FoodLogMutationResponse,
  NutritionSummaryResponse,
  NutritionPeriod,
  MessageResponse,
  DateString,
  MealTime,
} from '@/types';

export interface FoodLogListParams {
  start_date?: DateString;
  end_date?: DateString;
  meal_time?: MealTime;
  per_page?: number;
}

export interface NutritionSummaryParams {
  period?: NutritionPeriod;
  date?: DateString;
}

export const foodLogService = {
  /**
   * Get food logs for a child
   */
  async getAll(childId: number, params?: FoodLogListParams): Promise<FoodLogsListResponse> {
    return api.get<FoodLogsListResponse>(`/children/${childId}/food-logs`, params as Record<string, unknown>);
  },

  /**
   * Get a single food log
   */
  async getById(childId: number, logId: number): Promise<FoodLog> {
    const response = await api.get<FoodLogResponse>(`/children/${childId}/food-logs/${logId}`);
    return response.food_log;
  },

  /**
   * Create a new food log
   */
  async create(childId: number, data: CreateFoodLogRequest): Promise<FoodLog> {
    const response = await api.post<FoodLogMutationResponse>(
      `/children/${childId}/food-logs`,
      data
    );
    return response.food_log;
  },

  /**
   * Update a food log
   */
  async update(childId: number, logId: number, data: UpdateFoodLogRequest): Promise<FoodLog> {
    const response = await api.put<FoodLogMutationResponse>(
      `/children/${childId}/food-logs/${logId}`,
      data
    );
    return response.food_log;
  },

  /**
   * Delete a food log
   */
  async delete(childId: number, logId: number): Promise<void> {
    await api.delete<MessageResponse>(`/children/${childId}/food-logs/${logId}`);
  },

  /**
   * Get nutrition summary for a period
   */
  async getNutritionSummary(
    childId: number,
    params?: NutritionSummaryParams
  ): Promise<NutritionSummaryResponse> {
    return api.get<NutritionSummaryResponse>(`/children/${childId}/nutrition-summary`, params as Record<string, unknown>);
  },
};
