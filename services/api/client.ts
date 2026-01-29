import { API_URL } from '@/config/env';
import { tokenStorage } from '@/services/storage/token';
import { ApiError } from './errors';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make an authenticated HTTP request
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await tokenStorage.getToken();

    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An unexpected error occurred',
      }));
      throw new ApiError(response.status, errorData);
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const url = params
      ? `${endpoint}?${this.buildQueryString(params)}`
      : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * PUT request with multipart/form-data (for file uploads)
   */
  async putMultipart<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = await tokenStorage.getToken();
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        // Note: Do NOT set Content-Type header - fetch will set it automatically with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An unexpected error occurred',
      }));
      throw new ApiError(response.status, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  /**
   * POST request with multipart/form-data (for file uploads)
   */
  async postMultipart<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = await tokenStorage.getToken();
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        // Note: Do NOT set Content-Type header - fetch will set it automatically with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An unexpected error occurred',
      }));
      throw new ApiError(response.status, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  /**
   * Build query string from params object
   */
  private buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }
}

// Export singleton instance
export const api = new ApiClient();
