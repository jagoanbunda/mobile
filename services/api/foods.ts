import { api } from './client';
import {
  Food,
  FoodResponse,
  FoodsListResponse,
  CreateFoodRequest,
  UpdateFoodRequest,
  FoodMutationResponse,
  FoodCategoriesResponse,
  MessageResponse,
} from '@/types';

export interface FoodListParams {
  search?: string;
  category?: string;
  per_page?: number;
}

export const foodService = {
  /**
   * Get paginated list of foods (system + user's custom)
   */
  async getAll(params?: FoodListParams): Promise<FoodsListResponse> {
    return api.get<FoodsListResponse>('/foods', params as Record<string, unknown>);
  },

  /**
   * Get a single food by ID
   */
  async getById(foodId: number): Promise<Food> {
    const response = await api.get<FoodResponse>(`/foods/${foodId}`);
    return response.food;
  },

  /**
   * Create a custom food
   */
  async create(data: CreateFoodRequest): Promise<Food> {
    const response = await api.post<FoodMutationResponse>('/foods', data);
    return response.food;
  },

  /**
   * Update a custom food (only user's own foods)
   */
  async update(foodId: number, data: UpdateFoodRequest): Promise<Food> {
    const response = await api.put<FoodMutationResponse>(`/foods/${foodId}`, data);
    return response.food;
  },

  /**
   * Delete a custom food (only user's own foods)
   */
  async delete(foodId: number): Promise<void> {
    await api.delete<MessageResponse>(`/foods/${foodId}`);
  },

  /**
   * Get all food categories
   */
  async getCategories(): Promise<string[]> {
    const response = await api.get<FoodCategoriesResponse>('/foods-categories');
    return response.categories;
  },
};
