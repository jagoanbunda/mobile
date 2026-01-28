import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pmtService, PmtScheduleListParams, PmtProgressParams } from '@/services/api/pmt';
import { 
  CreatePmtScheduleRequest, 
  CreatePmtLogRequest, 
  UpdatePmtLogRequest,
} from '@/types';

/** Query keys */
export const pmtKeys = {
  all: ['pmt'] as const,
  menus: () => [...pmtKeys.all, 'menus'] as const,
  menusByAge: (ageMonths?: number) => [...pmtKeys.menus(), { ageMonths }] as const,
  schedules: () => [...pmtKeys.all, 'schedules'] as const,
  scheduleList: (childId: number, params?: PmtScheduleListParams) =>
    [...pmtKeys.schedules(), childId, params] as const,
  progress: () => [...pmtKeys.all, 'progress'] as const,
  progressData: (childId: number, params?: PmtProgressParams) =>
    [...pmtKeys.progress(), childId, params] as const,
};

/**
 * Fetch PMT menus
 */
export function usePmtMenus(ageMonths?: number) {
  return useQuery({
    queryKey: pmtKeys.menusByAge(ageMonths),
    queryFn: () => pmtService.getMenus(ageMonths),
    staleTime: 60 * 60 * 1000, // 1 hour (menus are relatively static)
  });
}

/**
 * Fetch PMT schedules for a child
 */
export function usePmtSchedules(childId: number, params?: PmtScheduleListParams) {
  return useQuery({
    queryKey: pmtKeys.scheduleList(childId, params),
    queryFn: () => pmtService.getSchedules(childId, params),
    enabled: childId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch current month's PMT schedules
 */
export function useCurrentMonthPmtSchedules(childId: number) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  
  return usePmtSchedules(childId, { start_date: startDate, end_date: endDate });
}

/**
 * Fetch PMT progress statistics
 */
export function usePmtProgress(childId: number, params?: PmtProgressParams) {
  return useQuery({
    queryKey: pmtKeys.progressData(childId, params),
    queryFn: () => pmtService.getProgress(childId, params),
    enabled: childId > 0,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch current month's PMT progress
 */
export function useCurrentMonthPmtProgress(childId: number) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  
  return usePmtProgress(childId, { start_date: startDate, end_date: endDate });
}

/**
 * Create a PMT schedule
 */
export function useCreatePmtSchedule(childId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePmtScheduleRequest) => pmtService.createSchedule(childId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pmtKeys.schedules() });
      queryClient.invalidateQueries({ queryKey: pmtKeys.progress() });
    },
  });
}

/**
 * Log PMT consumption
 */
export function useCreatePmtLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: number; data: CreatePmtLogRequest }) =>
      pmtService.createLog(scheduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pmtKeys.schedules() });
      queryClient.invalidateQueries({ queryKey: pmtKeys.progress() });
    },
  });
}

/**
 * Update PMT log
 */
export function useUpdatePmtLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: number; data: UpdatePmtLogRequest }) =>
      pmtService.updateLog(scheduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pmtKeys.schedules() });
      queryClient.invalidateQueries({ queryKey: pmtKeys.progress() });
    },
  });
}

// === Utility Hooks ===

/**
 * Get today's PMT schedule (if any)
 */
export function useTodayPmtSchedule(childId: number) {
  const today = new Date().toISOString().split('T')[0];
  const { data: schedules, ...rest } = usePmtSchedules(childId, {
    start_date: today,
    end_date: today,
  });

  return {
    ...rest,
    data: schedules?.[0] ?? null,
  };
}

/**
 * Get pending (unlogged) schedules
 */
export function usePendingPmtSchedules(childId: number) {
  const { data: schedules, ...rest } = useCurrentMonthPmtSchedules(childId);

  const pending = schedules?.filter(s => !s.is_logged) ?? [];

  return {
    ...rest,
    data: pending,
  };
}
