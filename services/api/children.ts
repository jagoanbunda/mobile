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

  /**
   * Create a new child with avatar file upload
   * Uses multipart/form-data for file upload
   */
  async createWithAvatar(
    data: CreateChildRequest,
    avatarUri?: string | null
  ): Promise<Child> {
    const formData = new FormData();

    // Add required text fields
    formData.append('name', data.name);
    formData.append('birthday', data.birthday);
    formData.append('gender', data.gender);

    // Add optional fields if provided
    if (data.birth_weight !== undefined) {
      formData.append('birth_weight', String(data.birth_weight));
    }
    if (data.birth_height !== undefined) {
      formData.append('birth_height', String(data.birth_height));
    }
    if (data.head_circumference !== undefined) {
      formData.append('head_circumference', String(data.head_circumference));
    }
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active ? '1' : '0');
    }

    // Add avatar file if provided (local URI)
    if (avatarUri && avatarUri.startsWith('file://')) {
      const filename = avatarUri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('avatar', {
        uri: avatarUri,
        name: filename,
        type,
      } as unknown as Blob);
    }

    const response = await api.postMultipart<CreateChildResponse>('/children', formData);
    return response.child;
  },

  /**
   * Update a child with avatar file upload
   * Uses multipart/form-data for file upload
   */
  async updateWithAvatar(
    childId: number,
    data: UpdateChildRequest,
    avatarUri?: string | null
  ): Promise<Child> {
    const formData = new FormData();

    // Add optional text fields if provided
    if (data.name !== undefined) {
      formData.append('name', data.name);
    }
    if (data.birthday !== undefined) {
      formData.append('birthday', data.birthday);
    }
    if (data.gender !== undefined) {
      formData.append('gender', data.gender);
    }
    if (data.birth_weight !== undefined) {
      formData.append('birth_weight', String(data.birth_weight));
    }
    if (data.birth_height !== undefined) {
      formData.append('birth_height', String(data.birth_height));
    }
    if (data.head_circumference !== undefined) {
      formData.append('head_circumference', String(data.head_circumference));
    }
    if (data.is_active !== undefined) {
      formData.append('is_active', data.is_active ? '1' : '0');
    }

    // Add avatar file if provided (local URI)
    if (avatarUri && avatarUri.startsWith('file://')) {
      const filename = avatarUri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('avatar', {
        uri: avatarUri,
        name: filename,
        type,
      } as unknown as Blob);
    }

    const response = await api.putMultipart<UpdateChildResponse>(
      `/children/${childId}`,
      formData
    );
    return response.child;
  },
};
