import { api } from './client';
import {
  Asq3Domain,
  Asq3DomainsResponse,
  Asq3AgeInterval,
  Asq3AgeIntervalsResponse,
  Asq3QuestionsResponse,
  Asq3Recommendation,
  Asq3RecommendationsResponse,
  Screening,
  ScreeningsListResponse,
  ScreeningResponse,
  CreateScreeningRequest,
  CreateScreeningResponse,
  UpdateScreeningRequest,
  UpdateScreeningResponse,
  SubmitAnswersRequest,
  SubmitAnswersResponse,
  ScreeningResultsResponse,
} from '@/types';

/** ASQ-3 Master Data Service */
export const asq3Service = {
  /**
   * Get all ASQ-3 domains
   */
  async getDomains(): Promise<Asq3Domain[]> {
    const response = await api.get<Asq3DomainsResponse>('/asq3/domains');
    return response.domains;
  },

  /**
   * Get all age intervals
   */
  async getAgeIntervals(): Promise<Asq3AgeInterval[]> {
    const response = await api.get<Asq3AgeIntervalsResponse>('/asq3/age-intervals');
    return response.age_intervals;
  },

  /**
   * Get questions for a specific age interval
   */
  async getQuestions(intervalId: number): Promise<Asq3QuestionsResponse> {
    return api.get<Asq3QuestionsResponse>(`/asq3/age-intervals/${intervalId}/questions`);
  },

  /**
   * Get recommendations (optionally filtered)
   */
  async getRecommendations(params?: {
    domain_id?: number;
    age_interval_id?: number;
  }): Promise<Asq3Recommendation[]> {
    const response = await api.get<Asq3RecommendationsResponse>('/asq3/recommendations', params);
    return response.recommendations;
  },
};

/** Screening Service */
export const screeningService = {
  /**
   * Get all screenings for a child
   */
  async getAll(childId: number, perPage?: number): Promise<ScreeningsListResponse> {
    return api.get<ScreeningsListResponse>(`/children/${childId}/screenings`, {
      per_page: perPage,
    });
  },

  /**
   * Get a single screening with details
   */
  async getById(childId: number, screeningId: number): Promise<Screening> {
    const response = await api.get<ScreeningResponse>(
      `/children/${childId}/screenings/${screeningId}`
    );
    return response.screening;
  },

  /**
   * Start a new screening session
   */
  async create(childId: number, data?: CreateScreeningRequest): Promise<Screening> {
    const response = await api.post<CreateScreeningResponse>(
      `/children/${childId}/screenings`,
      data
    );
    return response.screening;
  },

  /**
   * Update screening (notes or cancel)
   */
  async update(
    childId: number,
    screeningId: number,
    data: UpdateScreeningRequest
  ): Promise<Screening> {
    const response = await api.put<UpdateScreeningResponse>(
      `/children/${childId}/screenings/${screeningId}`,
      data
    );
    return response.screening;
  },

  /**
   * Submit answers for a screening
   * Auto-completes when all questions answered
   */
  async submitAnswers(
    childId: number,
    screeningId: number,
    data: SubmitAnswersRequest
  ): Promise<Screening> {
    const response = await api.post<SubmitAnswersResponse>(
      `/children/${childId}/screenings/${screeningId}/answers`,
      data
    );
    return response.screening;
  },

  /**
   * Get screening results with recommendations
   */
  async getResults(childId: number, screeningId: number): Promise<ScreeningResultsResponse> {
    return api.get<ScreeningResultsResponse>(
      `/children/${childId}/screenings/${screeningId}/results`
    );
  },
};
