import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PMTHistoryScreen from '@/app/pmt/history';
import { router } from 'expo-router';

// Mock dependencies - IMPORTANT: expo-router is already mocked in jest.setup.js
jest.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      surface: '#ffffff',
      primary: '#6200ee',
      onPrimary: '#ffffff',
      onSurface: '#000000',
      onSurfaceVariant: '#666666',
      surfaceContainerHigh: '#f0f0f0',
      surfaceContainerHighest: '#e8e8e8',
      outline: '#cccccc',
      outlineVariant: '#e0e0e0',
      primaryContainer: '#e8def8',
      onPrimaryContainer: '#21005d',
      tertiary: '#7d5260',
      tertiaryContainer: '#ffd8e4',
      onTertiaryContainer: '#31111d',
      card: '#ffffff',
      errorContainer: '#ffebee',
      onErrorContainer: '#c62828',
    },
  }),
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock PMT hooks
const mockUseCurrentMonthPmtProgress = jest.fn();
const mockUseCurrentMonthPmtSchedules = jest.fn();

jest.mock('@/services/hooks/use-pmt', () => ({
  useCurrentMonthPmtProgress: () => mockUseCurrentMonthPmtProgress(),
  useCurrentMonthPmtSchedules: () => mockUseCurrentMonthPmtSchedules(),
}));

// Mock children hook
const mockUseActiveChild = jest.fn();

jest.mock('@/services/hooks/use-children', () => ({
  useActiveChild: () => mockUseActiveChild(),
}));

// Mock NetworkErrorView and EmptyStateView components
jest.mock('@/components/NetworkErrorView', () => {
  // require within mock factory to avoid scope issues
  const MockReact = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    NetworkErrorView: ({ onRetry }: { error: Error | null; onRetry?: () => void }) => {
      return MockReact.createElement(View, { testID: 'network-error' },
        MockReact.createElement(Text, null, 'Network Error'),
        onRetry && MockReact.createElement(TouchableOpacity, { testID: 'retry-button', onPress: onRetry },
          MockReact.createElement(Text, null, 'Coba Lagi')
        )
      );
    },
    EmptyStateView: ({ title }: { title: string; message?: string }) => {
      const MockReact2 = require('react');
      const { View: View2, Text: Text2 } = require('react-native');
      return MockReact2.createElement(View2, { testID: 'empty-state' },
        MockReact2.createElement(Text2, null, title || 'Belum Ada Riwayat')
      );
    },
  };
});

const mockRouter = router as jest.Mocked<typeof router>;

// Mock data matching types from types/pmt.ts
const mockProgressData = {
  period: { start_date: '2026-02-01', end_date: '2026-02-28' },
  summary: { total_scheduled: 30, total_logged: 14, pending: 16, compliance_rate: 46.67, consumption_rate: 85.0 },
  consumption_breakdown: { habis: 10, half: 3, quarter: 1, none: 0 },
};

const mockSchedulesData = [
  {
    id: 1,
    child_id: 1,
    scheduled_date: '2026-02-04',
    is_logged: true,
    menu: { id: 1, name: 'Sup Ayam Jagung', image_url: null, calories: 200, protein: 15 },
    log: { id: 1, portion: 'habis' as const, portion_percentage: 100, portion_label: 'Habis', photo_url: null, notes: 'Anak suka', logged_at: '2026-02-04T12:00:00Z' },
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 2,
    child_id: 1,
    scheduled_date: '2026-02-03',
    is_logged: true,
    menu: { id: 2, name: 'Puding Buah Naga', image_url: null, calories: 150, protein: 5 },
    log: { id: 2, portion: 'half' as const, portion_percentage: 50, portion_label: 'Setengah', photo_url: null, notes: null, logged_at: '2026-02-03T12:00:00Z' },
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 3,
    child_id: 1,
    scheduled_date: '2026-02-02',
    is_logged: true,
    menu: { id: 3, name: 'Bola Tahu Kukus', image_url: null, calories: 180, protein: 12 },
    log: { id: 3, portion: 'none' as const, portion_percentage: 0, portion_label: 'Tidak dimakan', photo_url: null, notes: null, logged_at: '2026-02-02T12:00:00Z' },
    created_at: '2026-02-01T00:00:00Z',
  },
];

// Helper to setup default mock returns
const setupDefaultMocks = () => {
  mockUseActiveChild.mockReturnValue({
    data: { id: 1, name: 'Test Child' },
    isLoading: false,
    isError: false,
    children: [{ id: 1 }],
  });

  mockUseCurrentMonthPmtProgress.mockReturnValue({
    data: mockProgressData,
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });

  mockUseCurrentMonthPmtSchedules.mockReturnValue({
    data: mockSchedulesData,
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  });
};

describe('PMTHistoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  describe('Loading State', () => {
    it('shows ActivityIndicator when loading progress data', () => {
      mockUseCurrentMonthPmtProgress.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
      mockUseCurrentMonthPmtSchedules.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      const { getByTestId } = render(<PMTHistoryScreen />);

      expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('shows ActivityIndicator when loading schedules data only', () => {
      mockUseCurrentMonthPmtProgress.mockReturnValue({
        data: mockProgressData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
      mockUseCurrentMonthPmtSchedules.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      const { getByTestId } = render(<PMTHistoryScreen />);

      expect(getByTestId('loading-indicator')).toBeTruthy();
    });
  });

  describe('Error State', () => {
    it('shows NetworkErrorView with "Coba Lagi" button when progress fetch fails', async () => {
      mockUseCurrentMonthPmtProgress.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('API error'),
        refetch: jest.fn(),
      });

      const { getByText, getByTestId } = render(<PMTHistoryScreen />);

      expect(getByTestId('network-error')).toBeTruthy();
      expect(getByText('Coba Lagi')).toBeTruthy();
    });

    it('shows NetworkErrorView with "Coba Lagi" button when schedules fetch fails', async () => {
      mockUseCurrentMonthPmtProgress.mockReturnValue({
        data: mockProgressData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
      mockUseCurrentMonthPmtSchedules.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('Network error'),
        refetch: jest.fn(),
      });

      const { getByText, getByTestId } = render(<PMTHistoryScreen />);

      expect(getByTestId('network-error')).toBeTruthy();
      expect(getByText('Coba Lagi')).toBeTruthy();
    });

    it('calls refetch when "Coba Lagi" button is pressed', async () => {
      const mockRefetch = jest.fn();
      mockUseCurrentMonthPmtProgress.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('API error'),
        refetch: mockRefetch,
      });

      const { getByTestId } = render(<PMTHistoryScreen />);

      fireEvent.press(getByTestId('retry-button'));

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });
  });

  describe('Empty State', () => {
    it('shows empty state view when schedules array is empty', () => {
      mockUseCurrentMonthPmtProgress.mockReturnValue({
        data: mockProgressData,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
      mockUseCurrentMonthPmtSchedules.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      const { getByText } = render(<PMTHistoryScreen />);

      expect(getByText(/Belum Ada Riwayat/i)).toBeTruthy();
    });
  });

  describe('Success State', () => {
    it('renders program card with "Program PMT" text', () => {
      const { getByText } = render(<PMTHistoryScreen />);

      expect(getByText(/Program PMT/i)).toBeTruthy();
    });

    it('renders progress bar section', () => {
      const { getByText } = render(<PMTHistoryScreen />);

      expect(getByText(/Progress/i)).toBeTruthy();
    });

    it('renders menu names from schedule data', () => {
      const { getByText } = render(<PMTHistoryScreen />);

      expect(getByText('Sup Ayam Jagung')).toBeTruthy();
      expect(getByText('Puding Buah Naga')).toBeTruthy();
      expect(getByText('Bola Tahu Kukus')).toBeTruthy();
    });

    it('renders "Riwayat Konsumsi" section header', () => {
      const { getByText } = render(<PMTHistoryScreen />);

      expect(getByText('Riwayat Konsumsi')).toBeTruthy();
    });
  });

  describe('Status Badges', () => {
    it('renders "Habis" badge for habis portion', () => {
      const { getByText } = render(<PMTHistoryScreen />);

      expect(getByText('Habis')).toBeTruthy();
    });

    it('renders "1/2 Porsi" badge for half portion', () => {
      const { getByText } = render(<PMTHistoryScreen />);

      expect(getByText('1/2 Porsi')).toBeTruthy();
    });

    it('renders "Tidak Lapor" badge for none portion', () => {
      const { getByText } = render(<PMTHistoryScreen />);

      expect(getByText('Tidak Lapor')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('calls router.back() when back button is pressed', () => {
      const { getByTestId } = render(<PMTHistoryScreen />);

      fireEvent.press(getByTestId('back-button'));

      expect(mockRouter.back).toHaveBeenCalled();
    });
  });
});
