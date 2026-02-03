import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PMTTabScreen from '@/app/(tabs)/pmt';
import { router } from 'expo-router';

// Mock dependencies - must be at top and use 'mock' prefix for variables
jest.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      surface: '#ffffff',
      primary: '#6200ee',
      onPrimary: '#ffffff',
      onSurface: '#000000',
      onSurfaceVariant: '#666666',
      surfaceContainerHigh: '#f0f0f0',
      outline: '#cccccc',
      outlineVariant: '#e0e0e0',
      errorContainer: '#ffebee',
      onErrorContainer: '#c62828',
      error: '#c62828',
      onError: '#ffffff',
      card: '#ffffff',
      primaryContainer: '#e8def8',
      secondaryContainer: '#e8def8',
    },
  }),
}));

jest.mock('expo-router', () => ({
  Stack: {
    Screen: () => null,
  },
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock PMT hooks with 'mock' prefix (Jest hoisting requirement)
const mockProgressData = {
  period: { start_date: '2026-02-01', end_date: '2026-02-28' },
  summary: {
    total_scheduled: 30,
    total_logged: 14,
    pending: 16,
    compliance_rate: 46.67,
    consumption_rate: 85.0,
  },
  consumption_breakdown: { habis: 10, half: 3, quarter: 1, none: 0 },
};

const mockTodaySchedule = {
  id: 1,
  child_id: 1,
  scheduled_date: '2026-02-04',
  is_logged: false,
  menu: {
    id: 1,
    name: 'Bubur Kacang Hijau',
    image_url: null,
    calories: 250,
    protein: 8,
  },
  log: null,
  created_at: '2026-02-01T00:00:00Z',
};

const mockSchedulesList = [
  mockTodaySchedule,
  {
    id: 2,
    child_id: 1,
    scheduled_date: '2026-02-03',
    is_logged: true,
    menu: {
      id: 2,
      name: 'Sup Ayam Jagung',
      image_url: null,
      calories: 300,
      protein: 15,
    },
    log: {
      id: 1,
      portion: 'habis',
      portion_percentage: 100,
      portion_label: 'Habis',
      photo_url: null,
      notes: null,
      logged_at: '2026-02-03T10:00:00Z',
    },
    created_at: '2026-02-01T00:00:00Z',
  },
];

// Mock return values that can be changed per test
const mockUseCurrentMonthPmtProgress = jest.fn();
const mockUseTodayPmtSchedule = jest.fn();
const mockUsePmtSchedules = jest.fn();
const mockUseActiveChild = jest.fn();

jest.mock('@/services/hooks/use-pmt', () => ({
  useCurrentMonthPmtProgress: (...args: unknown[]) => mockUseCurrentMonthPmtProgress(...args),
  useTodayPmtSchedule: (...args: unknown[]) => mockUseTodayPmtSchedule(...args),
  usePmtSchedules: (...args: unknown[]) => mockUsePmtSchedules(...args),
}));

jest.mock('@/services/hooks/use-children', () => ({
  useActiveChild: () => mockUseActiveChild(),
}));

// Mock NetworkErrorView components
jest.mock('@/components/NetworkErrorView', () => {
  const { View, Text, TouchableOpacity } = jest.requireActual('react-native');
  return {
    NetworkErrorView: ({ onRetry }: { error: Error | null; onRetry?: () => void }) => (
      <View testID="network-error">
        <Text>Network Error</Text>
        {onRetry && (
          <TouchableOpacity testID="retry-button" onPress={onRetry}>
            <Text>Coba Lagi</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    EmptyStateView: ({ title, message }: { title: string; message?: string }) => (
      <View testID="empty-state">
        <Text>{title}</Text>
        {message && <Text>{message}</Text>}
      </View>
    ),
  };
});

const mockRouter = router as jest.Mocked<typeof router>;

// Helper to setup default mock returns
const setupDefaultMocks = () => {
  mockUseActiveChild.mockReturnValue({
    data: { id: 1, name: 'Test Child' },
    isLoading: false,
    isError: false,
  });

  mockUseCurrentMonthPmtProgress.mockReturnValue({
    data: mockProgressData,
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });

  mockUseTodayPmtSchedule.mockReturnValue({
    data: mockTodaySchedule,
    isLoading: false,
    isError: false,
  });

  mockUsePmtSchedules.mockReturnValue({
    data: mockSchedulesList,
    isLoading: false,
    isError: false,
  });
};

describe('PMTTabScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  describe('Loading State', () => {
    it('shows ActivityIndicator when progress is loading', async () => {
      mockUseCurrentMonthPmtProgress.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      const { getByTestId } = render(<PMTTabScreen />);

      await waitFor(() => {
        expect(getByTestId('loading-indicator')).toBeTruthy();
      });
    });

    it('shows ActivityIndicator when child data is loading', async () => {
      mockUseActiveChild.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
      });

      const { getByTestId } = render(<PMTTabScreen />);

      await waitFor(() => {
        expect(getByTestId('loading-indicator')).toBeTruthy();
      });
    });
  });

  describe('Error State', () => {
    it('shows NetworkErrorView with retry button on error', async () => {
      const mockRefetch = jest.fn();
      mockUseCurrentMonthPmtProgress.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('Network error'),
        refetch: mockRefetch,
      });

      const { getByTestId, getByText } = render(<PMTTabScreen />);

      await waitFor(() => {
        expect(getByTestId('network-error')).toBeTruthy();
        expect(getByText('Coba Lagi')).toBeTruthy();
      });
    });

    it('calls refetch when retry button is pressed', async () => {
      const mockRefetch = jest.fn();
      mockUseCurrentMonthPmtProgress.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('Network error'),
        refetch: mockRefetch,
      });

      const { getByTestId } = render(<PMTTabScreen />);

      await waitFor(() => {
        const retryButton = getByTestId('retry-button');
        fireEvent.press(retryButton);
        expect(mockRefetch).toHaveBeenCalled();
      });
    });
  });

  describe('Empty State', () => {
    it('shows EmptyStateView when no progress data exists', async () => {
      mockUseCurrentMonthPmtProgress.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      const { getByTestId } = render(<PMTTabScreen />);

      await waitFor(() => {
        expect(getByTestId('empty-state')).toBeTruthy();
      });
    });

    it('shows appropriate message when no PMT schedules', async () => {
      mockUsePmtSchedules.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });

      mockUseCurrentMonthPmtProgress.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      const { getByTestId } = render(<PMTTabScreen />);

      await waitFor(() => {
        expect(getByTestId('empty-state')).toBeTruthy();
      });
    });
  });

  describe('Success State', () => {
    it('renders progress percentage correctly', async () => {
      const { getByText } = render(<PMTTabScreen />);

      await waitFor(() => {
        // Should show compliance_rate as percentage (46%)
        expect(getByText(/46/)).toBeTruthy();
      });
    });

    it('renders today menu name correctly', async () => {
      const { getByText } = render(<PMTTabScreen />);

      await waitFor(() => {
        expect(getByText(/Bubur Kacang Hijau/)).toBeTruthy();
      });
    });

    it('renders history items', async () => {
      const { getByText } = render(<PMTTabScreen />);

      await waitFor(() => {
        // The component currently shows hardcoded history, but API-connected
        // version should show actual schedule data
        expect(getByText(/Sup Ayam Jagung/)).toBeTruthy();
      });
    });
  });

  describe('Navigation', () => {
    it('navigates to /pmt/report when "Lapor Hari Ini" is pressed', async () => {
      const { getByText } = render(<PMTTabScreen />);

      await waitFor(() => {
        const reportButton = getByText('Lapor Hari Ini');
        fireEvent.press(reportButton);
        expect(mockRouter.push).toHaveBeenCalledWith('/pmt/report');
      });
    });

    it('navigates to /pmt/history when "Riwayat" is pressed', async () => {
      const { getByText } = render(<PMTTabScreen />);

      await waitFor(() => {
        const historyButton = getByText('Riwayat');
        fireEvent.press(historyButton);
        expect(mockRouter.push).toHaveBeenCalledWith('/pmt/history');
      });
    });

    it('navigates to /pmt/history when "Lihat Semua" is pressed', async () => {
      const { getByText } = render(<PMTTabScreen />);

      await waitFor(() => {
        const viewAllButton = getByText('Lihat Semua');
        fireEvent.press(viewAllButton);
        expect(mockRouter.push).toHaveBeenCalledWith('/pmt/history');
      });
    });
  });
});
