import { api } from './client';
import { NutritionTrendsResponse } from '@/types';

export const nutritionTrendsService = {
  /**
   * Get nutrition trends for a child
   * @param childId - The child's ID
   * @returns Nutrition trends data including daily, weekly, and monthly trends
   */
  async getNutritionTrends(childId: number): Promise<NutritionTrendsResponse> {
    return api.get<NutritionTrendsResponse>(`/children/${childId}/nutrition-trends`);
  },
};
