export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  'https://web.jagoanbunda.udahdikerjain.my.id/api/v1';

// Base URL without /api/v1 for storage paths
export const BASE_URL = API_URL.replace(/\/api\/v1$/, '');

// Storage URL for uploaded files (avatars, etc.)
export const STORAGE_URL = `${BASE_URL}/storage`;

/**
 * Get full avatar URL from relative path
 * @param avatarPath - relative path from avatar_url field (e.g., "avatars/abc123.jpg")
 * @returns full URL or null if no path provided
 */
export const getAvatarUrl = (avatarPath: string | null | undefined): string | null => {
  if (!avatarPath) return null;
  // If already a full URL, return as-is
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }
  return `${STORAGE_URL}/${avatarPath}`;
};

export const IS_DEV = __DEV__;
