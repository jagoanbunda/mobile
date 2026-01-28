import { Age, DateString, DateTimeString, SimplePagination } from './common';

/** ASQ-3 Domain */
export interface Asq3Domain {
  id: number;
  code: string; // "communication", "gross_motor", etc.
  name: string; // "Komunikasi", "Motorik Kasar", etc.
  color: string; // hex color
  display_order: number;
}

/** GET /asq3/domains response */
export interface Asq3DomainsResponse {
  domains: Asq3Domain[];
}

/** ASQ-3 Age Interval */
export interface Asq3AgeInterval {
  id: number;
  age_months: number;
  age_label: string; // "24 Bulan"
  min_days?: number;
  max_days?: number;
}

/** GET /asq3/age-intervals response */
export interface Asq3AgeIntervalsResponse {
  age_intervals: Asq3AgeInterval[];
}

/** ASQ-3 Question */
export interface Asq3Question {
  id: number;
  question_text: string;
  domain_id: number;
  display_order: number;
  domain: Asq3Domain;
}

/** ASQ-3 Cutoff scores for a domain */
export interface Asq3Cutoff {
  cutoff_score: number;
  monitoring_score: number;
  domain: Asq3Domain;
}

/** Questions grouped by domain */
export type QuestionsByDomain = Record<string, Asq3Question[]>;

/** Cutoffs by domain code */
export type CutoffsByDomain = Record<string, Asq3Cutoff>;

/** GET /asq3/age-intervals/{id}/questions response */
export interface Asq3QuestionsResponse {
  age_interval: Asq3AgeInterval;
  questions_by_domain: QuestionsByDomain;
  cutoffs: CutoffsByDomain;
  total_questions: number;
}

/** ASQ-3 Recommendation */
export interface Asq3Recommendation {
  id: number;
  domain_id: number | null;
  age_interval_id: number | null;
  title: string;
  description: string;
  priority: number;
  domain: Asq3Domain | null;
  ageInterval: Asq3AgeInterval | null;
}

/** GET /asq3/recommendations response */
export interface Asq3RecommendationsResponse {
  recommendations: Asq3Recommendation[];
}

/** Screening status enum */
export type ScreeningStatus = 'in_progress' | 'completed' | 'cancelled';

/** Screening overall status enum */
export type ScreeningOverallStatus = 'sesuai' | 'pantau' | 'perlu_rujukan';

/** Domain result status enum */
export type DomainResultStatus = 'sesuai' | 'pantau' | 'perlu_rujukan';

/** Screening domain result */
export interface ScreeningDomainResult {
  domain: {
    code: string;
    name: string;
    color: string;
  };
  total_score: number;
  cutoff_score: number;
  monitoring_score: number;
  status: DomainResultStatus;
  status_label: string; // "Sesuai Harapan", "Perlu Pemantauan", "Perlu Rujukan"
}

/** Screening entity */
export interface Screening {
  id: number;
  child_id: number;
  screening_date: DateString;
  age_at_screening: Age;
  age_interval: Asq3AgeInterval;
  status: ScreeningStatus;
  status_label: string; // "Selesai", "Sedang Dikerjakan", "Dibatalkan"
  overall_status: ScreeningOverallStatus | null;
  overall_status_label: string | null;
  completed_at: DateTimeString | null;
  answers_count: number;
  results: ScreeningDomainResult[];
  notes: string | null;
  created_at: DateTimeString;
}

/** GET /children/{id}/screenings response */
export interface ScreeningsListResponse {
  screenings: Screening[];
  pagination: SimplePagination;
}

/** POST /children/{id}/screenings request */
export interface CreateScreeningRequest {
  screening_date?: DateString;
  notes?: string;
}

/** POST /children/{id}/screenings response */
export interface CreateScreeningResponse {
  message: string;
  screening: Screening;
}

/** GET /children/{id}/screenings/{id} response */
export interface ScreeningResponse {
  screening: Screening;
}

/** PUT /children/{id}/screenings/{id} request */
export interface UpdateScreeningRequest {
  notes?: string;
  status?: 'in_progress' | 'cancelled';
}

/** PUT /children/{id}/screenings/{id} response */
export interface UpdateScreeningResponse {
  message: string;
  screening: Screening;
}

/** Answer value enum */
export type AnswerValue = 'yes' | 'sometimes' | 'no';

/** Answer input */
export interface ScreeningAnswerInput {
  question_id: number;
  answer: AnswerValue;
}

/** POST /children/{id}/screenings/{id}/answers request */
export interface SubmitAnswersRequest {
  answers: ScreeningAnswerInput[];
}

/** POST /children/{id}/screenings/{id}/answers response */
export interface SubmitAnswersResponse {
  message: string;
  screening: Screening;
}

/** GET /children/{id}/screenings/{id}/results response */
export interface ScreeningResultsResponse {
  screening: {
    id: number;
    date: DateString;
    age_at_screening: number;
    status: ScreeningStatus;
    overall_status: ScreeningOverallStatus;
  };
  results: ScreeningDomainResult[];
  recommendations: Asq3Recommendation[];
}
