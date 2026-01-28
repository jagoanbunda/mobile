import { api } from './client';
import {
  Anthropometry,
  AnthropometryListResponse,
  AnthropometryResponse,
  AnthropometryMutationResponse,
  CreateAnthropometryRequest,
  UpdateAnthropometryRequest,
  GrowthChartResponse,
  DateString,
} from '@/types';

export interface AnthropometryListParams {
  page?: number;
  per_page?: number;
  start_date?: DateString;
  end_date?: DateString;
  [key: string]: unknown;
}

export const anthropometryService = {
  /**
   * Get all anthropometry measurements for a child
   */
  async getAll(childId: number, params?: AnthropometryListParams): Promise<AnthropometryListResponse> {
    return api.get<AnthropometryListResponse>(`/children/${childId}/anthropometry`, params);
  },

  /**
   * Get a single anthropometry measurement
   */
  async getById(childId: number, measurementId: number): Promise<Anthropometry> {
    const response = await api.get<AnthropometryResponse>(
      `/children/${childId}/anthropometry/${measurementId}`
    );
    return response.measurement;
  },

  /**
   * Create a new anthropometry measurement
   */
  async create(childId: number, data: CreateAnthropometryRequest): Promise<Anthropometry> {
    const response = await api.post<AnthropometryMutationResponse>(
      `/children/${childId}/anthropometry`,
      data
    );
    return response.measurement;
  },

  /**
   * Update an anthropometry measurement
   */
  async update(
    childId: number,
    measurementId: number,
    data: UpdateAnthropometryRequest
  ): Promise<Anthropometry> {
    const response = await api.put<AnthropometryMutationResponse>(
      `/children/${childId}/anthropometry/${measurementId}`,
      data
    );
    return response.measurement;
  },

  /**
   * Delete an anthropometry measurement
   */
  async delete(childId: number, measurementId: number): Promise<void> {
    await api.delete(`/children/${childId}/anthropometry/${measurementId}`);
  },

  /**
   * Get growth chart data for a child
   * Returns measurements with z-scores for chart visualization
   */
  async getGrowthChart(childId: number): Promise<GrowthChartResponse> {
    return api.get<GrowthChartResponse>(`/children/${childId}/growth-chart`);
  },

  /**
   * Get the latest anthropometry measurement for a child
   */
  async getLatest(childId: number): Promise<Anthropometry | null> {
    const response = await api.get<AnthropometryListResponse>(
      `/children/${childId}/anthropometry`,
      { per_page: 1 }
    );
    return response.data[0] ?? null;
  },
};
