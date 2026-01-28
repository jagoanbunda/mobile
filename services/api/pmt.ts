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
    const response = await api.post<PmtLogMutationResponse>(
      `/pmt-schedules/${scheduleId}/log`,
      data
    );
    return response.schedule;
  },

  /**
   * Update PMT log
   */
  async updateLog(scheduleId: number, data: UpdatePmtLogRequest): Promise<PmtSchedule> {
    const response = await api.put<PmtLogMutationResponse>(
      `/pmt-schedules/${scheduleId}/log`,
      data
    );
    return response.schedule;
  },
};
