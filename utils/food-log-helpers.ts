import { FoodLog, MealTime } from '@/types';
import { DateString } from '@/types/common';

/**
 * Section structure for SectionList grouping
 */
export interface FoodLogSection {
  /** Display title in Indonesian: "Selasa, 28 Januari" */
  title: string;
  /** ISO date string for sorting: "2026-01-28" */
  date: DateString;
  /** Food logs for this date */
  data: FoodLog[];
}

/** Indonesian day names */
const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/** Indonesian month names */
const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/** Meal time sort order */
const MEAL_ORDER: Record<MealTime, number> = {
  breakfast: 0,
  lunch: 1,
  dinner: 2,
  snack: 3,
};

/**
 * Formats a date string (YYYY-MM-DD) to Indonesian format: "Selasa, 28 Januari"
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted Indonesian date string
 */
export function formatDateIndonesian(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  const dayName = DAYS[date.getDay()];
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  return `${dayName}, ${day} ${month}`;
}

/**
 * Formats a Date object to ISO date string (YYYY-MM-DD)
 * @param date - Date object
 * @returns ISO date string
 */
export function formatToDateString(date: Date): DateString {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}` as DateString;
}

/**
 * Groups flat food logs array into sections by date.
 * @param logs - Array of FoodLog from API
 * @returns Array of FoodLogSection for SectionList, sorted newest first
 */
export function groupFoodLogsByDate(logs: FoodLog[]): FoodLogSection[] {
  if (!logs || logs.length === 0) {
    return [];
  }

  // Group logs by date
  const grouped = logs.reduce(
    (acc, log) => {
      const date = log.log_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    },
    {} as Record<string, FoodLog[]>
  );

  // Convert to sections array, sorted by date descending (newest first)
  return Object.entries(grouped)
    .map(([date, data]) => ({
      title: formatDateIndonesian(date),
      date: date as DateString,
      data: data.sort((a, b) => MEAL_ORDER[a.meal_time] - MEAL_ORDER[b.meal_time]),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Gets a default date range (last 7 days)
 */
export function getDefaultDateRange(): { start: DateString; end: DateString } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);

  return {
    start: formatToDateString(start),
    end: formatToDateString(end),
  };
}
