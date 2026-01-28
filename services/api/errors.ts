import { ErrorResponse, ValidationErrorResponse } from '@/types';

export class ApiError extends Error {
  public readonly status: number;
  public readonly data: ErrorResponse | ValidationErrorResponse;

  constructor(status: number, data: ErrorResponse | ValidationErrorResponse) {
    super(data.message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  /** Check if this is a validation error (422) */
  get isValidationError(): boolean {
    return this.status === 422 && 'errors' in this.data;
  }

  /** Check if unauthorized (401) */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** Check if forbidden (403) */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  /** Check if not found (404) */
  get isNotFound(): boolean {
    return this.status === 404;
  }

  /** Get validation errors if available */
  get validationErrors(): Record<string, string[]> | null {
    if (this.isValidationError && 'errors' in this.data) {
      return this.data.errors;
    }
    return null;
  }

  /** Get specific error code (e.g., 'NAKES_WEB_ONLY') */
  get errorCode(): string | null {
    return 'error_code' in this.data ? this.data.error_code ?? null : null;
  }

  /** Get first validation error for a field */
  getFieldError(field: string): string | null {
    const errors = this.validationErrors;
    if (errors && errors[field]?.length > 0) {
      return errors[field][0];
    }
    return null;
  }
}

/** Network error (no internet connection) */
export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

/** Unauthorized error (401) */
export class UnauthorizedError extends ApiError {
  constructor(data: ErrorResponse) {
    super(401, data);
    this.name = 'UnauthorizedError';
  }
}

/** Server error (5xx) */
export class ServerError extends ApiError {
  constructor(status: number, data: ErrorResponse) {
    super(status, data);
    this.name = 'ServerError';
  }
}

/** Validation error (422) */
export class ValidationError extends ApiError {
  constructor(data: ValidationErrorResponse) {
    super(422, data);
    this.name = 'ValidationError';
  }
}
