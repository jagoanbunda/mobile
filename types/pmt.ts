import { DateString, DateTimeString } from './common';

/** PMT Menu nutrition */
export interface PmtMenuNutrition {
  calories: number;
  protein: number;
}

/** PMT Menu age range */
export interface PmtMenuAgeRange {
  min_months: number;
  max_months: number;
}

/** PMT Menu entity */
export interface PmtMenu {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  nutrition: PmtMenuNutrition;
  age_range: PmtMenuAgeRange;
  is_active: boolean;
}

/** GET /pmt/menus response */
export interface PmtMenusResponse {
  menus: PmtMenu[];
}

/** PMT Portion enum */
export type PmtPortion = 'habis' | 'half' | 'quarter' | 'none';

/** PMT Portion percentage mapping */
export const PMT_PORTION_PERCENTAGE: Record<PmtPortion, number> = {
  habis: 100,
  half: 50,
  quarter: 25,
  none: 0,
};

/** PMT Portion label mapping */
export const PMT_PORTION_LABEL: Record<PmtPortion, string> = {
  habis: 'Habis',
  half: 'Setengah',
  quarter: 'Seperempat',
  none: 'Tidak dimakan',
};

/** PMT Log entity */
export interface PmtLog {
  id: number;
  portion: PmtPortion;
  portion_percentage: number;
  portion_label: string;
  photo_url: string | null;
  notes: string | null;
  logged_at: DateTimeString;
}

/** PMT Schedule menu (simplified) */
export interface PmtScheduleMenu {
  id: number;
  name: string;
  image_url: string | null;
  calories: number;
  protein: number;
}

/** PMT Schedule entity */
export interface PmtSchedule {
  id: number;
  child_id: number;
  scheduled_date: DateString;
  is_logged: boolean;
  menu: PmtScheduleMenu;
  log: PmtLog | null;
  created_at: DateTimeString;
}

/** GET /children/{id}/pmt-schedules response */
export interface PmtSchedulesResponse {
  schedules: PmtSchedule[];
}

/** POST /children/{id}/pmt-schedules request */
export interface CreatePmtScheduleRequest {
  menu_id: number;
  scheduled_date: DateString;
}

/** POST /children/{id}/pmt-schedules response */
export interface CreatePmtScheduleResponse {
  message: string;
  schedule: PmtSchedule;
}

/** PMT Progress period */
export interface PmtProgressPeriod {
  start_date: DateString;
  end_date: DateString;
}

/** PMT Progress summary */
export interface PmtProgressSummary {
  total_scheduled: number;
  total_logged: number;
  pending: number;
  compliance_rate: number; // percentage
  consumption_rate: number; // percentage
}

/** PMT Consumption breakdown */
export interface PmtConsumptionBreakdown {
  habis: number;
  half: number;
  quarter: number;
  none: number;
}

/** GET /children/{id}/pmt-progress response */
export interface PmtProgressResponse {
  period: PmtProgressPeriod;
  summary: PmtProgressSummary;
  consumption_breakdown: PmtConsumptionBreakdown;
}

/** POST /pmt-schedules/{id}/log request */
export interface CreatePmtLogRequest {
  portion: PmtPortion;
  photo_url?: string;
  notes?: string;
}

/** PUT /pmt-schedules/{id}/log request */
export interface UpdatePmtLogRequest {
  portion?: PmtPortion;
  photo_url?: string;
  notes?: string;
}

/** POST/PUT /pmt-schedules/{id}/log response */
export interface PmtLogMutationResponse {
  message: string;
  schedule: PmtSchedule;
}
