import type {
  ChildProfile,
  ProgressRingData,
  ProgressRingsData,
  WeeklyDataPoint,
  WeeklyTrendData,
  TaskReminder,
  PersonalizedTip,
  DashboardResponse,
  TrendDirection,
  TaskReminderType,
  TaskPriority,
  TipCategory,
} from '../dashboard';

describe('Dashboard Types', () => {
  describe('ChildProfile', () => {
    it('should have correct structure', () => {
      const child: ChildProfile = {
        id: 1,
        name: 'Budi',
        age_in_months: 20,
      };

      expect(child.id).toBe(1);
      expect(child.name).toBe('Budi');
      expect(child.age_in_months).toBe(20);
    });
  });

  describe('ProgressRingData', () => {
    it('should have correct structure', () => {
      const ring: ProgressRingData = {
        current: 850,
        target: 1350,
        percentage: 63,
        unit: 'kcal',
      };

      expect(ring.current).toBe(850);
      expect(ring.target).toBe(1350);
      expect(ring.percentage).toBe(63);
      expect(ring.unit).toBe('kcal');
    });
  });

  describe('ProgressRingsData', () => {
    it('should have all 5 nutrition rings', () => {
      const rings: ProgressRingsData = {
        calories: { current: 850, target: 1350, percentage: 63, unit: 'kcal' },
        protein: { current: 15, target: 20, percentage: 75, unit: 'g' },
        carbs: { current: 120, target: 155, percentage: 77, unit: 'g' },
        fat: { current: 30, target: 45, percentage: 67, unit: 'g' },
        fiber: { current: 8, target: 16, percentage: 50, unit: 'g' },
      };

      expect(Object.keys(rings)).toHaveLength(5);
      expect(rings.calories.unit).toBe('kcal');
      expect(rings.protein.unit).toBe('g');
    });
  });

  describe('WeeklyTrendData', () => {
    it('should have weeks array and trend direction', () => {
      const trendDirections: TrendDirection[] = ['up', 'down', 'stable'];

      const trend: WeeklyTrendData = {
        weeks: [
          { week_start: '2026-01-13', week_end: '2026-01-19', average_calories: 1100 },
          { week_start: '2026-01-20', week_end: '2026-01-26', average_calories: 1150 },
          { week_start: '2026-01-27', week_end: '2026-02-02', average_calories: 1200 },
          { week_start: '2026-02-03', week_end: '2026-02-09', average_calories: 1250 },
        ],
        trend_direction: 'up',
      };

      expect(trend.weeks).toHaveLength(4);
      expect(trendDirections).toContain(trend.trend_direction);
    });
  });

  describe('TaskReminder', () => {
    it('should have correct structure with valid types', () => {
      const types: TaskReminderType[] = ['ASQ3', 'PMT', 'Anthropometry'];
      const priorities: TaskPriority[] = ['high', 'medium', 'low'];

      const task: TaskReminder = {
        type: 'ASQ3',
        title: 'ASQ-3 Screening Due',
        description: 'Your child is due for developmental screening',
        priority: 'high',
      };

      expect(types).toContain(task.type);
      expect(priorities).toContain(task.priority);
      expect(task.title).toBeDefined();
      expect(task.description).toBeDefined();
    });
  });

  describe('PersonalizedTip', () => {
    it('should have correct structure', () => {
      const categories: TipCategory[] = ['reminder', 'nutrition', 'development', 'health'];

      const tip: PersonalizedTip = {
        icon: '📝',
        message: 'Complete your daily food log',
        category: 'reminder',
      };

      expect(tip.icon).toBe('📝');
      expect(categories).toContain(tip.category);
    });
  });

  describe('DashboardResponse', () => {
    it('should aggregate all dashboard data', () => {
      const response: DashboardResponse = {
        child: {
          id: 1,
          name: 'Budi',
          age_in_months: 20,
        },
        progressRings: {
          calories: { current: 850, target: 1350, percentage: 63, unit: 'kcal' },
          protein: { current: 15, target: 20, percentage: 75, unit: 'g' },
          carbs: { current: 120, target: 155, percentage: 77, unit: 'g' },
          fat: { current: 30, target: 45, percentage: 67, unit: 'g' },
          fiber: { current: 8, target: 16, percentage: 50, unit: 'g' },
        },
        weeklyTrend: {
          weeks: [
            { week_start: '2026-01-13', week_end: '2026-01-19', average_calories: 1100 },
            { week_start: '2026-01-20', week_end: '2026-01-26', average_calories: 1150 },
            { week_start: '2026-01-27', week_end: '2026-02-02', average_calories: 1200 },
            { week_start: '2026-02-03', week_end: '2026-02-09', average_calories: 1250 },
          ],
          trend_direction: 'up',
        },
        tasks: [
          {
            type: 'ASQ3',
            title: 'ASQ-3 Screening Due',
            description: 'Your child is due for developmental screening',
            priority: 'high',
          },
        ],
        tips: [
          {
            icon: '📝',
            message: 'Complete your daily food log',
            category: 'reminder',
          },
        ],
      };

      expect(response.child.id).toBe(1);
      expect(Object.keys(response.progressRings)).toHaveLength(5);
      expect(response.weeklyTrend.weeks).toHaveLength(4);
      expect(response.tasks).toHaveLength(1);
      expect(response.tips).toHaveLength(1);
    });
  });
});
