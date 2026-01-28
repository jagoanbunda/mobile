import { Age, DateString, DateTimeString } from './common';
import { ScreeningOverallStatus } from './screening';

/** Gender enum */
export type Gender = 'male' | 'female' | 'other';

/** Child entity */
export interface Child {
  id: number;
  user_id: number;
  name: string;
  birthday: DateString;
  gender: Gender;
  avatar_url: string | null;
  birth_weight: number | null; // kg
  birth_height: number | null; // cm
  head_circumference: number | null; // cm
  is_active: boolean;
  age: Age;
  created_at: DateTimeString;
  updated_at: DateTimeString;
}

/** POST /children request */
export interface CreateChildRequest {
  name: string;
  birthday: DateString;
  gender: Gender;
  avatar_url?: string;
  birth_weight?: number;
  birth_height?: number;
  head_circumference?: number;
  is_active?: boolean;
}

/** PUT /children/{id} request */
export interface UpdateChildRequest {
  name?: string;
  birthday?: DateString;
  gender?: Gender;
  avatar_url?: string;
  birth_weight?: number;
  birth_height?: number;
  head_circumference?: number;
  is_active?: boolean;
}

/** GET /children response */
export type ChildrenResponse = Child[];

/** GET /children/{id} response */
export interface ChildResponse {
  child: Child;
}

/** POST /children response */
export interface CreateChildResponse {
  message: string;
  child: Child;
}

/** PUT /children/{id} response */
export interface UpdateChildResponse {
  message: string;
  child: Child;
}

/** Latest measurement summary */
export interface LatestMeasurement {
  date: DateString;
  weight: number;
  height: number;
  nutritional_status: string; // "Gizi Baik"
  stunting_status: string; // "Normal"
  wasting_status: string; // "Gizi Baik"
}

/** Latest screening summary */
export interface LatestScreening {
  date: DateString;
  overall_status: ScreeningOverallStatus;
}

/** Today's nutrition summary */
export interface TodayNutrition {
  calories: number;
  protein: number;
  carbohydrate: number;
  fat: number;
}

/** GET /children/{id}/summary response */
export interface ChildSummaryResponse {
  child: Child;
  age: Age;
  latest_measurement: LatestMeasurement | null;
  latest_screening: LatestScreening | null;
  today_nutrition: TodayNutrition;
}
