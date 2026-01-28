/** ISO 8601 date string (YYYY-MM-DD) */
export type DateString = string;

/** ISO 8601 datetime string (YYYY-MM-DDTHH:mm:ss+00:00) */
export type DateTimeString = string;

/** URL string */
export type UrlString = string;

/** Age representation */
export interface Age {
  months: number;
  days: number;
  label?: string; // e.g., "2 tahun"
}

/** Pagination metadata */
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/** Pagination links */
export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

/** Simple pagination (used by screenings) */
export interface SimplePagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
