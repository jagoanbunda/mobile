import { screeningService } from '@/services/api/screenings';
import { api } from '@/services/api/client';
import { ScreeningProgressResponse } from '@/types';

// Mock the API client
jest.mock('@/services/api/client', () => ({
  api: {
    get: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('screeningService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProgress', () => {
    const childId = 123;
    const screeningId = 456;

    const mockProgressResponse: ScreeningProgressResponse = {
      screening_id: screeningId,
      status: 'in_progress',
      total_questions: 30,
      answered_questions: 15,
      progress_percent: 50,
      last_saved_at: '2026-02-04T06:30:00+00:00',
      domains: [
        {
          domain_code: 'communication',
          domain_name: 'Komunikasi',
          answered_questions: 4,
          total_questions: 6,
          progress_percent: 67,
        },
      ],
      answered_question_ids: [1, 2, 3, 5, 7],
      answers: [
        {
          question_id: 1,
          answer: 'yes',
          score: 10,
          created_at: '2026-02-04T06:00:00+00:00',
        },
      ],
    };

    it('should call correct API endpoint', async () => {
      mockedApi.get.mockResolvedValue({ data: mockProgressResponse });

      await screeningService.getProgress(childId, screeningId);

      expect(mockedApi.get).toHaveBeenCalledTimes(1);
      expect(mockedApi.get).toHaveBeenCalledWith(
        `/children/${childId}/screenings/${screeningId}/progress`
      );
    });

    it('should return unwrapped progress data', async () => {
      mockedApi.get.mockResolvedValue({ data: mockProgressResponse });

      const result = await screeningService.getProgress(childId, screeningId);

      expect(result).toEqual(mockProgressResponse);
      expect(result.screening_id).toBe(screeningId);
      expect(result.progress_percent).toBe(50);
    });

    it('should pass through API errors', async () => {
      const error = new Error('API Error');
      mockedApi.get.mockRejectedValue(error);

      await expect(screeningService.getProgress(childId, screeningId)).rejects.toThrow('API Error');
    });
  });
});
