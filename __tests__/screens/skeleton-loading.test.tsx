import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { View } from 'react-native';

// Import screens
import HomeScreen from '@/app/(tabs)/index';
import InputScreen from '@/app/(tabs)/input';
import ProgressScreen from '@/app/(tabs)/progress';
import ScreeningTabScreen from '@/app/(tabs)/screening';
import PMTTabScreen from '@/app/(tabs)/pmt';

// Mock dependencies
jest.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      surface: '#ffffff',
      primary: '#6200ee',
      background: '#ffffff',
      surfaceContainerHigh: '#f0f0f0',
    },
    isDark: false,
  }),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', avatar_url: null },
  }),
}));

jest.mock('expo-router', () => ({
  Stack: {
    Screen: () => null,
  },
  router: {
    push: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock Skeleton components
jest.mock('@/components/Skeleton', () => {
  const { View } = require('react-native');
  return {
    ProfileHeaderSkeleton: () => <View testID="profile-header-skeleton" />,
    CardSkeleton: () => <View testID="card-skeleton" />,
    ListItemSkeleton: () => <View testID="list-item-skeleton" />,
    ChartSkeleton: () => <View testID="chart-skeleton" />,
    StatCardSkeleton: () => <View testID="stat-card-skeleton" />,
    Skeleton: () => <View testID="base-skeleton" />,
  };
});

// Mock Hooks
const mockUseActiveChild = jest.fn();
const mockUseDashboard = jest.fn();
const mockUseFoodSearch = jest.fn();
const mockUseFoodCategories = jest.fn();
const mockUseCreateFoodLog = jest.fn();
const mockUseCreateFood = jest.fn();
const mockUseGrowthChart = jest.fn();
const mockUseLatestScreening = jest.fn();
const mockUseInProgressScreening = jest.fn();
const mockUseCurrentMonthPmtProgress = jest.fn();
const mockUseTodayPmtSchedule = jest.fn();
const mockUsePmtSchedules = jest.fn();

jest.mock('@/services/hooks/use-children', () => ({
  useActiveChild: () => mockUseActiveChild(),
}));

jest.mock('@/services/hooks/use-dashboard', () => ({
  useDashboard: () => mockUseDashboard(),
}));

jest.mock('@/services/hooks/use-foods', () => ({
  useFoodSearch: () => mockUseFoodSearch(),
  useFoodCategories: () => mockUseFoodCategories(),
  useCreateFoodLog: () => mockUseCreateFoodLog(),
  useCreateFood: () => mockUseCreateFood(),
}));

jest.mock('@/services/hooks/use-anthropometry', () => ({
  useGrowthChart: () => mockUseGrowthChart(),
}));

jest.mock('@/services/hooks/use-screenings', () => ({
  useLatestScreening: () => mockUseLatestScreening(),
  useInProgressScreening: () => mockUseInProgressScreening(),
}));

jest.mock('@/services/hooks/use-pmt', () => ({
  useCurrentMonthPmtProgress: () => mockUseCurrentMonthPmtProgress(),
  useTodayPmtSchedule: () => mockUseTodayPmtSchedule(),
  usePmtSchedules: () => mockUsePmtSchedules(),
}));

// Setup default mocks
const setupDefaultMocks = () => {
  mockUseActiveChild.mockReturnValue({ data: { id: 1 }, isLoading: false });
  mockUseDashboard.mockReturnValue({ data: null, isLoading: false });
  mockUseFoodSearch.mockReturnValue({ data: [], isLoading: false });
  mockUseFoodCategories.mockReturnValue({ data: [], isLoading: false });
  mockUseCreateFoodLog.mockReturnValue({ mutate: jest.fn(), isPending: false });
  mockUseCreateFood.mockReturnValue({ mutate: jest.fn(), isPending: false });
  mockUseGrowthChart.mockReturnValue({ data: { measurements: [] }, isLoading: false });
  mockUseLatestScreening.mockReturnValue({ data: null, isLoading: false });
  mockUseInProgressScreening.mockReturnValue({ data: null });
  mockUseCurrentMonthPmtProgress.mockReturnValue({ data: null, isLoading: false });
  mockUseTodayPmtSchedule.mockReturnValue({ data: null, isLoading: false });
  mockUsePmtSchedules.mockReturnValue({ data: [], isLoading: false });
};

describe('Skeleton Loading Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  it('Home Tab shows skeletons when loading', async () => {
    mockUseDashboard.mockReturnValue({ data: null, isLoading: true });
    
    const { getByTestId, getAllByTestId } = render(<HomeScreen />);
    
    await waitFor(() => {
      expect(getByTestId('profile-header-skeleton')).toBeTruthy();
      expect(getByTestId('card-skeleton')).toBeTruthy();
      expect(getByTestId('chart-skeleton')).toBeTruthy();
      expect(getAllByTestId('stat-card-skeleton').length).toBeGreaterThan(0);
    });
  });

  it('Input Tab shows skeletons when categories loading', async () => {
    mockUseFoodCategories.mockReturnValue({ data: null, isLoading: true });
    
    const { getAllByTestId } = render(<InputScreen />);
    
    await waitFor(() => {
      expect(getAllByTestId('list-item-skeleton').length).toBeGreaterThan(0);
    });
  });

  it('Progress Tab shows skeletons when loading', async () => {
    mockUseGrowthChart.mockReturnValue({ data: null, isLoading: true });
    
    const { getByTestId, getAllByTestId } = render(<ProgressScreen />);
    
    await waitFor(() => {
      expect(getByTestId('chart-skeleton')).toBeTruthy();
      expect(getAllByTestId('stat-card-skeleton').length).toBeGreaterThan(0);
    });
  });

  it('Screening Tab shows skeletons when loading', async () => {
    mockUseLatestScreening.mockReturnValue({ data: null, isLoading: true });
    
    const { getByTestId, getAllByTestId } = render(<ScreeningTabScreen />);
    
    await waitFor(() => {
      expect(getByTestId('card-skeleton')).toBeTruthy();
      expect(getAllByTestId('list-item-skeleton').length).toBeGreaterThan(0);
    });
  });

  it('PMT Tab shows skeletons when loading', async () => {
    mockUseCurrentMonthPmtProgress.mockReturnValue({ data: null, isLoading: true });
    
    const { getByTestId, getAllByTestId } = render(<PMTTabScreen />);
    
    await waitFor(() => {
      expect(getByTestId('card-skeleton')).toBeTruthy();
      expect(getAllByTestId('list-item-skeleton').length).toBeGreaterThan(0);
    });
  });
});
