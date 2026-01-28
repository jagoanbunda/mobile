import { DateTimeString } from './common';

/** User type enum */
export type UserType = 'parent' | 'nakes';

/** User entity */
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  user_type: UserType;
  push_notifications: boolean;
  weekly_report: boolean;
  email_verified_at: DateTimeString | null;
  created_at: DateTimeString;
}

/** PUT /auth/profile request */
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar_url?: string;
  push_notifications?: boolean;
  weekly_report?: boolean;
}

/** PUT /auth/profile response */
export interface UpdateProfileResponse {
  message: string;
  user: User;
}
