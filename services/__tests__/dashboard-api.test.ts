/**
 * Dashboard API Mock Tests
 *
 * Verifies that mock factories produce valid DashboardResponse types.
 * Tests are type-only (no React Native dependencies) to work with Bun.
 */

import { describe, expect, it } from 'bun:test';

import {
  createDashboardMock,
  createProgressRingMock,
  createProgressRingsMock,
  createTaskMock,
  createTipMock,
  createWeeklyTrendMock,
  createChildProfileMock,
  createDashboardApiResponse,
  mockApiErrors,
} from '../__mocks__/dashboardMock';

import type {
  DashboardResponse,
  ProgressRingData,
  ProgressRingsData,
  TaskReminder,
  PersonalizedTip,
  WeeklyTrendData,
  ChildProfile,
} from '@/types/dashboard';

describe('Dashboard Mock Factory', () => {
  describe('createDashboardMock', () => {
    it('creates valid DashboardResponse with all required fields', () => {
      const dashboard: DashboardResponse = createDashboardMock();

      expect(dashboard).toBeDefined();
      expect(dashboard.child).toBeDefined();
      expect(dashboard.progressRings).toBeDefined();
      expect(dashboard.weeklyTrend).toBeDefined();
      expect(dashboard.tasks).toBeDefined();
      expect(dashboard.tips).toBeDefined();
    });

    it('has child profile with required fields', () => {
      const dashboard = createDashboardMock();

      expect(dashboard.child.id).toBe(1);
      expect(dashboard.child.name).toBe('Anak Pertama');
      expect(dashboard.child.age_in_months).toBe(20);
    });

    it('has 5 progress rings with all nutrients', () => {
      const dashboard = createDashboardMock();
      const rings = dashboard.progressRings;

      expect(rings.calories).toBeDefined();
      expect(rings.protein).toBeDefined();
      expect(rings.carbs).toBeDefined();
      expect(rings.fat).toBeDefined();
      expect(rings.fiber).toBeDefined();
    });

    it('has 4 weeks of trend data', () => {
      const dashboard = createDashboardMock();

      expect(dashboard.weeklyTrend.weeks).toHaveLength(4);
      expect(dashboard.weeklyTrend.trend_direction).toBe('up');
    });

    it('has tasks with Indonesian text', () => {
      const dashboard = createDashboardMock();

      expect(dashboard.tasks.length).toBeGreaterThanOrEqual(2);
      expect(dashboard.tasks[0].title).toBe('Skrining ASQ-3');
      expect(dashboard.tasks[0].type).toBe('ASQ3');
    });

    it('has tips with Indonesian text', () => {
      const dashboard = createDashboardMock();

      expect(dashboard.tips.length).toBeGreaterThanOrEqual(2);
      expect(dashboard.tips[0].message).toContain('makanan');
    });

    it('supports partial overrides for child', () => {
      const dashboard = createDashboardMock({
        child: { name: 'Budi Santoso' },
      });

      expect(dashboard.child.name).toBe('Budi Santoso');
      expect(dashboard.child.id).toBe(1); // Default preserved
    });

    it('supports partial overrides for progress rings', () => {
      const dashboard = createDashboardMock({
        progressRings: {
          calories: { current: 1000 },
        },
      });

      expect(dashboard.progressRings.calories.current).toBe(1000);
      expect(dashboard.progressRings.calories.target).toBe(1350); // Default preserved
    });

    it('supports replacing tasks array', () => {
      const customTasks: TaskReminder[] = [
        createTaskMock({ type: 'Anthropometry' }),
      ];

      const dashboard = createDashboardMock({
        tasks: customTasks,
      });

      expect(dashboard.tasks).toHaveLength(1);
      expect(dashboard.tasks[0].type).toBe('Anthropometry');
    });
  });

  describe('createProgressRingMock', () => {
    it('creates valid ProgressRingData', () => {
      const ring: ProgressRingData = createProgressRingMock();

      expect(ring.current).toBe(850);
      expect(ring.target).toBe(1350);
      expect(ring.unit).toBe('kcal');
      expect(ring.percentage).toBe(63); // Math.round(850/1350*100)
    });

    it('calculates percentage from current/target', () => {
      const ring = createProgressRingMock({
        current: 50,
        target: 100,
      });

      expect(ring.percentage).toBe(50);
    });

    it('supports overriding percentage explicitly', () => {
      const ring = createProgressRingMock({
        current: 50,
        target: 100,
        percentage: 75, // Override calculated value
      });

      expect(ring.percentage).toBe(75);
    });
  });

  describe('createProgressRingsMock', () => {
    it('creates all 5 rings with correct units', () => {
      const rings: ProgressRingsData = createProgressRingsMock();

      expect(rings.calories.unit).toBe('kcal');
      expect(rings.protein.unit).toBe('g');
      expect(rings.carbs.unit).toBe('g');
      expect(rings.fat.unit).toBe('g');
      expect(rings.fiber.unit).toBe('g');
    });

    it('supports deep overrides for individual rings', () => {
      const rings = createProgressRingsMock({
        protein: { current: 25, target: 30 },
      });

      expect(rings.protein.current).toBe(25);
      expect(rings.protein.target).toBe(30);
      expect(rings.calories.current).toBe(850); // Other defaults preserved
    });
  });

  describe('createTaskMock', () => {
    it('creates valid TaskReminder with defaults for ASQ3', () => {
      const task: TaskReminder = createTaskMock();

      expect(task.type).toBe('ASQ3');
      expect(task.title).toBe('Skrining ASQ-3');
      expect(task.priority).toBe('high');
    });

    it('creates valid TaskReminder for PMT type', () => {
      const task = createTaskMock({ type: 'PMT' });

      expect(task.type).toBe('PMT');
      expect(task.title).toBe('Jadwal PMT');
      expect(task.priority).toBe('medium');
    });

    it('creates valid TaskReminder for Anthropometry type', () => {
      const task = createTaskMock({ type: 'Anthropometry' });

      expect(task.type).toBe('Anthropometry');
      expect(task.title).toBe('Pengukuran Antropometri');
    });
  });

  describe('createTipMock', () => {
    it('creates valid PersonalizedTip with defaults for reminder', () => {
      const tip: PersonalizedTip = createTipMock();

      expect(tip.category).toBe('reminder');
      expect(tip.icon).toBe('📝');
      expect(tip.message).toContain('mencatat');
    });

    it('creates valid PersonalizedTip for nutrition category', () => {
      const tip = createTipMock({ category: 'nutrition' });

      expect(tip.category).toBe('nutrition');
      expect(tip.icon).toBe('🥗');
      expect(tip.message).toContain('serat');
    });

    it('creates valid PersonalizedTip for development category', () => {
      const tip = createTipMock({ category: 'development' });

      expect(tip.category).toBe('development');
      expect(tip.icon).toBe('🧒');
    });

    it('creates valid PersonalizedTip for health category', () => {
      const tip = createTipMock({ category: 'health' });

      expect(tip.category).toBe('health');
      expect(tip.icon).toBe('💊');
    });
  });

  describe('createWeeklyTrendMock', () => {
    it('creates 4 weeks of trend data', () => {
      const trend: WeeklyTrendData = createWeeklyTrendMock();

      expect(trend.weeks).toHaveLength(4);
      expect(trend.trend_direction).toBe('up');
    });

    it('has valid date ranges', () => {
      const trend = createWeeklyTrendMock();

      trend.weeks.forEach((week) => {
        expect(week.week_start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(week.week_end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(typeof week.average_calories).toBe('number');
      });
    });

    it('supports trend direction override', () => {
      const trend = createWeeklyTrendMock({ trend_direction: 'down' });

      expect(trend.trend_direction).toBe('down');
    });
  });

  describe('createChildProfileMock', () => {
    it('creates valid ChildProfile', () => {
      const child: ChildProfile = createChildProfileMock();

      expect(child.id).toBe(1);
      expect(child.name).toBe('Anak Pertama');
      expect(child.age_in_months).toBe(20);
    });

    it('supports overrides', () => {
      const child = createChildProfileMock({
        id: 5,
        name: 'Budi',
        age_in_months: 36,
      });

      expect(child.id).toBe(5);
      expect(child.name).toBe('Budi');
      expect(child.age_in_months).toBe(36);
    });
  });

  describe('createDashboardApiResponse', () => {
    it('wraps dashboard data in data property', () => {
      const response = createDashboardApiResponse();

      expect(response.data).toBeDefined();
      expect(response.data.child).toBeDefined();
      expect(response.data.progressRings).toBeDefined();
    });
  });

  describe('mockApiErrors', () => {
    it('has unauthenticated error', () => {
      expect(mockApiErrors.unauthenticated.error).toBe('Unauthenticated');
    });

    it('has forbidden error', () => {
      expect(mockApiErrors.forbidden.error).toBe('Forbidden');
    });

    it('has notFound error', () => {
      expect(mockApiErrors.notFound.error).toBe('Child not found');
    });
  });
});
