import { DateString, DateTimeString, PaginatedResponse } from './common';
import { Gender } from './child';

/** Measurement location enum */
export type MeasurementLocation = 'posyandu' | 'home' | 'clinic' | 'hospital' | 'other';

/** Z-Scores for growth assessment */
export interface ZScores {
  weight_for_age: number;
  height_for_age: number;
  weight_for_height: number;
  bmi_for_age: number;
  head_circumference: number | null;
}

/** Nutritional status assessment */
export interface NutritionalStatus {
  nutritional: string; // "Gizi Baik", "Gizi Kurang", etc.
  stunting: string; // "Normal", "Stunted", etc.
  wasting: string; // "Gizi Baik", "Wasting", etc.
}

/** Anthropometry measurement entity */
export interface Anthropometry {
  id: number;
  child_id: number;
  measurement_date: DateString;
  weight: number; // kg
  height: number; // cm
  head_circumference: number | null; // cm
  bmi: number;
  is_lying: boolean;
  measurement_location: MeasurementLocation | null;
  z_scores: ZScores;
  status: NutritionalStatus;
  notes: string | null;
  created_at: DateTimeString;
}

/** POST /children/{id}/anthropometry request */
export interface CreateAnthropometryRequest {
  measurement_date: DateString;
  weight: number;
  height: number;
  head_circumference?: number;
  is_lying?: boolean;
  measurement_location?: MeasurementLocation;
  notes?: string;
}

/** PUT /children/{id}/anthropometry/{id} request */
export interface UpdateAnthropometryRequest {
  measurement_date?: DateString;
  weight?: number;
  height?: number;
  head_circumference?: number;
  is_lying?: boolean;
  measurement_location?: MeasurementLocation;
  notes?: string;
}

/** GET /children/{id}/anthropometry response */
export type AnthropometryListResponse = PaginatedResponse<Anthropometry>;

/** GET /children/{id}/anthropometry/{id} response */
export interface AnthropometryResponse {
  measurement: Anthropometry;
}

/** POST/PUT /children/{id}/anthropometry response */
export interface AnthropometryMutationResponse {
  message: string;
  measurement: Anthropometry;
}

/** Growth chart child info */
export interface GrowthChartChild {
  id: number;
  name: string;
  gender: Gender;
  birthday: DateString;
}

/** Growth chart measurement point */
export interface GrowthChartMeasurement {
  date: DateString;
  age_months: number;
  weight: number;
  height: number;
  head_circumference: number | null;
  weight_for_age_zscore: number;
  height_for_age_zscore: number;
  weight_for_height_zscore: number;
}

/** GET /children/{id}/growth-chart response */
export interface GrowthChartResponse {
  child: GrowthChartChild;
  measurements: GrowthChartMeasurement[];
}
