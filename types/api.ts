import { ErrorResponse, ValidationErrorResponse } from './auth';

/** API Result type for error handling */
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ErrorResponse | ValidationErrorResponse };

/** Type guard for validation errors */
export function isValidationError(
  error: ErrorResponse | ValidationErrorResponse
): error is ValidationErrorResponse {
  return 'errors' in error;
}

/** HTTP Methods */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** Request options */
export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
}
