import type { PaginationParams } from './common';

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  requestId?: string;
  meta?: Record<string, unknown>;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
    statusCode: number;
    timestamp: string;
    context?: Record<string, unknown>;
    requestId?: string;
  };
}

export interface PaginatedResponse<T = unknown> {
  success: true;
  data: T[];
  pagination: PaginationParams;
  timestamp: string;
  requestId?: string;
  meta?: Record<string, unknown>;
}

export interface EmptyResponse {
  success: true;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export type ApiResponse<T = unknown> =
  | SuccessResponse<T>
  | ErrorResponse
  | PaginatedResponse<T>
  | EmptyResponse;
