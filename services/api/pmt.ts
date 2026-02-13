import { api } from './client';
import {
  PmtMenu,
  PmtMenusResponse,
  PmtSchedule,
  PmtSchedulesResponse,
  CreatePmtScheduleRequest,
  CreatePmtScheduleResponse,
  PmtProgressResponse,
  CreatePmtLogRequest,
  UpdatePmtLogRequest,
  PmtLogMutationResponse,
  DateString,
} from '@/types';

export interface PmtScheduleListParams {
  start_date?: DateString;
  end_date?: DateString;
  [key: string]: unknown;
}

export interface PmtProgressParams {
  start_date?: DateString;
  end_date?: DateString;
  [key: string]: unknown;
}

export const pmtService = {
  /**
   * Get available PMT menus
   * @param ageMonths - Filter menus suitable for child's age
   */
  async getMenus(ageMonths?: number): Promise<PmtMenu[]> {
    const response = await api.get<PmtMenusResponse>('/pmt/menus', {
      age_months: ageMonths,
    });
    return response.menus;
  },

  /**
   * Get PMT schedules for a child
   * Defaults to current month if no dates provided
   */
  async getSchedules(childId: number, params?: PmtScheduleListParams): Promise<PmtSchedule[]> {
    const response = await api.get<PmtSchedulesResponse>(
      `/children/${childId}/pmt-schedules`,
      params
    );
    return response.schedules;
  },

  /**
   * Create a new PMT schedule
   */
  async createSchedule(childId: number, data: CreatePmtScheduleRequest): Promise<PmtSchedule> {
    const response = await api.post<CreatePmtScheduleResponse>(
      `/children/${childId}/pmt-schedules`,
      data
    );
    return response.schedule;
  },

  /**
   * Get PMT progress/statistics
   * Defaults to current month if no dates provided
   */
  async getProgress(childId: number, params?: PmtProgressParams): Promise<PmtProgressResponse> {
    return api.get<PmtProgressResponse>(`/children/${childId}/pmt-progress`, params);
  },

  /**
   * Log PMT consumption for a schedule
   */
  async createLog(scheduleId: number, data: CreatePmtLogRequest): Promise<PmtSchedule> {
    const formData = new FormData();
    formData.append('portion', data.portion);
    if (data.food_id !== undefined) {
      formData.append('food_id', String(data.food_id));
    }
    if (data.notes) {
      formData.append('notes', data.notes);
    }
    if (data.photo && data.photo.startsWith('file://')) {
      const filename = data.photo.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('photo', {
        uri: data.photo,
        name: filename,
        type,
      } as unknown as Blob);
    }
    const response = await api.postMultipart<PmtLogMutationResponse>(
      `/pmt-schedules/${scheduleId}/log`,
      formData
    );
    return response.schedule;
  },

  /**
   * Update PMT log
   */
  async updateLog(scheduleId: number, data: UpdatePmtLogRequest): Promise<PmtSchedule> {
    const formData = new FormData();
    if (data.portion) {
      formData.append('portion', data.portion);
    }
    if (data.food_id !== undefined) {
      formData.append('food_id', String(data.food_id));
    }
    if (data.notes) {
      formData.append('notes', data.notes);
    }
    if (data.photo && data.photo.startsWith('file://')) {
      const filename = data.photo.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('photo', {
        uri: data.photo,
        name: filename,
        type,
      } as unknown as Blob);
    }
    const response = await api.putMultipart<PmtLogMutationResponse>(
      `/pmt-schedules/${scheduleId}/log`,
      formData
    );
    return response.schedule;
  },
};
