// frontend/services/api-client.ts
import { getAuthHeaders, logout, redirectToLogin } from '@/lib/auth';
import { retryNetworkCall } from '@/lib/retry-utils';
import { Task, TaskCreateData, TaskUpdateData, TaskListResponse, TaskQueryParams } from '@/types';

// Must match NEXT_PUBLIC_API_URL in .env.local
// Fallback uses 127.0.0.1 — NOT localhost — to avoid browser DNS resolution
// inconsistencies when backend binds to 127.0.0.1 explicitly.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const REQUEST_TIMEOUT = 30000; // 30 seconds

export class ApiError extends Error {
  public status: number;
  public error_code: string | null;

  constructor(message: string, status: number, error_code: string | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.error_code = error_code;
  }
}

class TaskApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      // Spread any caller-provided headers first, then override with auth headers
      ...(options.headers as Record<string, string> | undefined),
      ...getAuthHeaders(),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        // Clear stale credentials BEFORE redirecting — prevents redirect loops
        // where middleware sees the old cookie and bounces back to /dashboard.
        logout();
        redirectToLogin();
        throw new ApiError('Session expired. Please log in again.', 401);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          typeof errorData.detail === 'string'
            ? errorData.detail
            : Array.isArray(errorData.detail)
            ? errorData.detail.map((e: { msg: string }) => e.msg).join(', ')
            : `HTTP error ${response.status}`;
        throw new ApiError(errorMessage, response.status, errorData.error_code ?? null);
      }

      // DELETE → 204 No Content
      if (response.status === 204) {
        return undefined as unknown as T;
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timed out. Please try again.', 408);
      }
      // TypeError with "fetch" in the message = network unreachable / CORS blocked
      if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
        throw new ApiError(
          'Cannot reach the server. Make sure the backend is running on http://127.0.0.1:8000',
          0
        );
      }
      throw error;
    }
  }

  // ── Task endpoints ──────────────────────────────────────────────────────────

  async getTasks(params?: TaskQueryParams): Promise<TaskListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.completed !== undefined)
      queryParams.append('completed', String(params.completed));
    if (params?.limit !== undefined)
      queryParams.append('limit', String(params.limit));
    if (params?.offset !== undefined)
      queryParams.append('offset', String(params.offset));

    const queryString = queryParams.toString();
    const endpoint = `/api/tasks${queryString ? '?' + queryString : ''}`;

    // GET is idempotent — safe to retry
    return retryNetworkCall(
      () => this.request<TaskListResponse>(endpoint, { method: 'GET' }),
      { maxRetries: 3 }
    );
  }

  async createTask(taskData: TaskCreateData): Promise<Task> {
    // POST is NOT idempotent — never retry; duplicate tasks would be created
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: string, taskData: TaskUpdateData): Promise<Task> {
    // Full update via PATCH (backend treats PUT and PATCH identically)
    return retryNetworkCall(
      () =>
        this.request<Task>(`/api/tasks/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(taskData),
        }),
      { maxRetries: 1 }
    );
  }

  async patchTask(id: string, taskData: Partial<TaskUpdateData>): Promise<Task> {
    // Partial update — idempotent with same payload; retry once is safe
    return retryNetworkCall(
      () =>
        this.request<Task>(`/api/tasks/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(taskData),
        }),
      { maxRetries: 1 }
    );
  }

  async deleteTask(id: string): Promise<void> {
    // DELETE is idempotent — safe to retry
    return retryNetworkCall(
      () => this.request<void>(`/api/tasks/${id}`, { method: 'DELETE' }),
      { maxRetries: 2 }
    );
  }

  async toggleComplete(id: string): Promise<Task> {
    // Use the dedicated toggle endpoint — idempotent? No (toggle changes state),
    // so do NOT retry.
    return this.request<Task>(`/api/tasks/${id}/complete`, { method: 'PATCH' });
  }
}

export const taskApiService = new TaskApiService();
