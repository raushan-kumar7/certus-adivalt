// import type { PaginationParams } from './common';

// export interface SuccessResponse<T = unknown> {
//   success: true;
//   data: T;
//   message?: string;
//   timestamp: string;
//   requestId?: string;
//   meta?: Record<string, unknown>;
// }

// export interface ErrorResponse {
//   success: false;
//   error: {
//     code: string;
//     message: string;
//     details?: string;
//     statusCode: number;
//     timestamp: string;
//     context?: Record<string, unknown>;
//     requestId?: string;
//   };
// }

// export interface PaginatedResponse<T = unknown> {
//   success: true;
//   data: T[];
//   pagination: PaginationParams;
//   timestamp: string;
//   requestId?: string;
//   meta?: Record<string, unknown>;
// }

// export interface EmptyResponse {
//   success: true;
//   message?: string;
//   timestamp: string;
//   requestId?: string;
// }

// export type ApiResponse<T = unknown> =
//   | SuccessResponse<T>
//   | ErrorResponse
//   | PaginatedResponse<T>
//   | EmptyResponse;

import type { PaginationParams } from './common';

/**
 * Success response wrapper for standard API results.
 *
 * @template T - Type of returned data
 */
export interface SuccessResponse<T = unknown> {
  success: true;

  /** Main response payload */
  data: T;

  /** Optional success message */
  message?: string;

  /** ISO timestamp */
  timestamp: string;

  /** Request tracing ID */
  requestId?: string;

  /** Extra metadata */
  meta?: Record<string, unknown>;
}

/**
 * Standard structure for error API responses.
 */
export interface ErrorResponse {
  success: false;

  error: {
    /** Machine-readable error code */
    code: string;

    /** Human-readable message */
    message: string;

    /** Developer-friendly details */
    details?: string;

    /** HTTP status code */
    statusCode: number;

    /** ISO timestamp */
    timestamp: string;

    /** Additional contextual data */
    context?: Record<string, unknown>;

    /** Request tracking ID */
    requestId?: string;
  };
}

/**
 * Paginated list response.
 *
 * @template T - Item type
 */
export interface PaginatedResponse<T = unknown> {
  success: true;

  /** List of items */
  data: T[];

  /** Pagination metadata */
  pagination: PaginationParams;

  /** ISO timestamp */
  timestamp: string;

  /** Request ID */
  requestId?: string;

  /** Extra meta fields */
  meta?: Record<string, unknown>;
}

/**
 * Response used when no data is returned (e.g., DELETE).
 */
export interface EmptyResponse {
  success: true;

  /** Optional message */
  message?: string;

  /** ISO timestamp */
  timestamp: string;

  /** Request ID */
  requestId?: string;
}

/**
 * Union of all possible API response shapes.
 */
export type ApiResponse<T = unknown> =
  | SuccessResponse<T>
  | ErrorResponse
  | PaginatedResponse<T>
  | EmptyResponse;