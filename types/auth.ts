import { User } from './user';

/** POST /auth/login request */
export interface LoginRequest {
  email: string;
  password: string;
  revoke_others?: boolean;
}

/** POST /auth/register request */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

/** Login/Register response */
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

/** POST /auth/refresh response */
export interface RefreshTokenResponse {
  message: string;
  token: string;
}

/** GET /auth/me response */
export interface MeResponse {
  user: User;
}

/** Simple message response */
export interface MessageResponse {
  message: string;
}

/** Error response */
export interface ErrorResponse {
  message: string;
  error_code?: string; // e.g., 'NAKES_WEB_ONLY'
}

/** Validation error response (422) */
export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}
