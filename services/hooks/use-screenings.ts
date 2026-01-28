import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { asq3Service, screeningService } from '@/services/api/screenings';
import { CreateScreeningRequest, SubmitAnswersRequest } from '@/types';

/** Query keys */
export const asq3Keys = {
  all: ['asq3'] as const,
  domains: () => [...asq3Keys.all, 'domains'] as const,
  ageIntervals: () => [...asq3Keys.all, 'age-intervals'] as const,
  questions: (intervalId: number) => [...asq3Keys.all, 'questions', intervalId] as const,
  recommendations: (params?: { domain_id?: number; age_interval_id?: number }) =>
    [...asq3Keys.all, 'recommendations', params] as const,
};

export const screeningKeys = {
  all: ['screenings'] as const,
  lists: () => [...screeningKeys.all, 'list'] as const,
  list: (childId: number) => [...screeningKeys.lists(), childId] as const,
  details: () => [...screeningKeys.all, 'detail'] as const,
  detail: (childId: number, screeningId: number) =>
    [...screeningKeys.details(), childId, screeningId] as const,
  results: (childId: number, screeningId: number) =>
    [...screeningKeys.all, 'results', childId, screeningId] as const,
};

// === ASQ-3 Master Data ===

/**
 * Fetch ASQ-3 domains
 */
export function useAsq3Domains() {
  return useQuery({
    queryKey: asq3Keys.domains(),
    queryFn: () => asq3Service.getDomains(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (static data)
  });
}

/**
 * Fetch ASQ-3 age intervals
 */
export function useAsq3AgeIntervals() {
  return useQuery({
    queryKey: asq3Keys.ageIntervals(),
    queryFn: () => asq3Service.getAgeIntervals(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (static data)
  });
}

/**
 * Fetch questions for an age interval
 */
export function useAsq3Questions(intervalId: number) {
  return useQuery({
    queryKey: asq3Keys.questions(intervalId),
    queryFn: () => asq3Service.getQuestions(intervalId),
    enabled: intervalId > 0,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (static data)
  });
}

/**
 * Fetch recommendations
 */
export function useAsq3Recommendations(params?: { domain_id?: number; age_interval_id?: number }) {
  return useQuery({
    queryKey: asq3Keys.recommendations(params),
    queryFn: () => asq3Service.getRecommendations(params),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

// === Screenings ===

/**
 * Fetch screenings for a child
 */
export function useScreenings(childId: number) {
  return useQuery({
    queryKey: screeningKeys.list(childId),
    queryFn: () => screeningService.getAll(childId),
    enabled: childId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch a single screening
 */
export function useScreening(childId: number, screeningId: number) {
  return useQuery({
    queryKey: screeningKeys.detail(childId, screeningId),
    queryFn: () => screeningService.getById(childId, screeningId),
    enabled: childId > 0 && screeningId > 0,
  });
}

/**
 * Fetch screening results with recommendations
 */
export function useScreeningResults(childId: number, screeningId: number) {
  return useQuery({
    queryKey: screeningKeys.results(childId, screeningId),
    queryFn: () => screeningService.getResults(childId, screeningId),
    enabled: childId > 0 && screeningId > 0,
  });
}

/**
 * Start a new screening
 */
export function useCreateScreening(childId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data?: CreateScreeningRequest) => screeningService.create(childId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: screeningKeys.list(childId) });
    },
  });
}

/**
 * Submit answers for a screening
 */
export function useSubmitAnswers(childId: number, screeningId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitAnswersRequest) =>
      screeningService.submitAnswers(childId, screeningId, data),
    onSuccess: (screening) => {
      // Update screening detail cache
      queryClient.setQueryData(screeningKeys.detail(childId, screeningId), screening);
      
      // If completed, invalidate lists and results
      if (screening.status === 'completed') {
        queryClient.invalidateQueries({ queryKey: screeningKeys.list(childId) });
        queryClient.invalidateQueries({ queryKey: screeningKeys.results(childId, screeningId) });
        // Invalidate child summary (latest_screening)
        queryClient.invalidateQueries({ queryKey: ['children', childId, 'summary'] });
      }
    },
  });
}

/**
 * Cancel a screening
 */
export function useCancelScreening(childId: number, screeningId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => screeningService.update(childId, screeningId, { status: 'cancelled' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: screeningKeys.list(childId) });
      queryClient.invalidateQueries({ queryKey: screeningKeys.detail(childId, screeningId) });
    },
  });
}

// === Composite Hooks ===

/**
 * Get the latest completed screening for a child
 */
export function useLatestScreening(childId: number) {
  const { data, ...rest } = useScreenings(childId);
  
  const latestCompleted = data?.screenings.find(s => s.status === 'completed') ?? null;
  
  return {
    ...rest,
    data: latestCompleted,
  };
}

/**
 * Check if child has an in-progress screening
 */
export function useInProgressScreening(childId: number) {
  const { data, ...rest } = useScreenings(childId);
  
  const inProgress = data?.screenings.find(s => s.status === 'in_progress') ?? null;
  
  return {
    ...rest,
    data: inProgress,
  };
}
