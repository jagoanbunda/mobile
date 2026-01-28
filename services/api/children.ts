import { api } from './client';
import {
  Child,
  ChildResponse,
  ChildrenResponse,
  CreateChildRequest,
  CreateChildResponse,
  UpdateChildRequest,
  UpdateChildResponse,
  ChildSummaryResponse,
  MessageResponse,
} from '@/types';

export const childService = {
  /**
   * Get all children for the authenticated user
   * @param activeOnly - If true, only return active children
   */
  async getAll(activeOnly?: boolean): Promise<Child[]> {
    const params = activeOnly ? { active_only: '1' } : undefined;
    const response = await api.get<{ data: ChildrenResponse }>('/children', params);
    return response.data;
  },

  /**
   * Get a single child by ID
   */
  async getById(childId: number): Promise<Child> {
    const response = await api.get<ChildResponse>(`/children/${childId}`);
    return response.child;
  },

  /**
   * Create a new child
   */
  async create(data: CreateChildRequest): Promise<Child> {
    const response = await api.post<CreateChildResponse>('/children', data);
    return response.child;
  },

  /**
   * Update a child
   */
  async update(childId: number, data: UpdateChildRequest): Promise<Child> {
    const response = await api.put<UpdateChildResponse>(`/children/${childId}`, data);
    return response.child;
  },

  /**
   * Delete (soft delete) a child
   */
  async delete(childId: number): Promise<void> {
    await api.delete<MessageResponse>(`/children/${childId}`);
  },

  /**
   * Get child health summary including latest measurements, screening, and nutrition
   */
  async getSummary(childId: number): Promise<ChildSummaryResponse> {
    return api.get<ChildSummaryResponse>(`/children/${childId}/summary`);
  },
};
