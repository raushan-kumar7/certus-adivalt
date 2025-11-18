import { ApiResponse } from '@/types';
import { CertusResponseBuilder } from '../builder';
import { CertusAdiValtError } from '@/certus';

/**
 * High-level response formatting utility for the CertusAdiValt system.
 *
 * Provides simplified, opinionated methods for formatting API responses with
 * sensible defaults and enhanced error handling. Acts as a facade over the
 * more granular CertusResponseBuilder for common use cases.
 *
 * @class ResponseFormatter
 *
 * @example
 * ```typescript
 * // In API controllers
 * return ResponseFormatter.formatSuccess(userData, {
 *   message: 'User retrieved successfully',
 *   requestId: req.requestId
 * });
 *
 * // Automatic error handling
 * try {
 *   await someOperation();
 * } catch (error) {
 *   return ResponseFormatter.formatError(error, {
 *     requestId: req.requestId,
 *     includeDetails: process.env.NODE_ENV === 'development'
 *   });
 * }
 *
 * // Simplified pagination
 * return ResponseFormatter.formatPaginated(users, {
 *   page: 1,
 *   limit: 20,
 *   total: 150
 * }, {
 *   requestId: req.requestId
 * });
 * ```
 */
export class ResponseFormatter {
  /**
   * Formats a successful API response with data payload.
   *
   * Provides a simplified interface for success responses with optional
   * message, request ID, and metadata. Wraps the CertusResponseBuilder.success()
   * method with a more convenient options object.
   *
   * @template T - Type of the data payload
   * @param {T} data - The main response data payload
   * @param {Object} [options] - Response formatting options
   * @param {string} [options.message] - Optional success message
   * @param {string} [options.requestId] - Optional request ID for tracing
   * @param {Record<string, unknown>} [options.meta] - Optional additional metadata
   * @returns {ApiResponse<T>} Formatted success response
   *
   * @example
   * ```typescript
   * // Basic success response
   * return ResponseFormatter.formatSuccess({ id: 1, name: 'John' });
   *
   * // Success with all options
   * return ResponseFormatter.formatSuccess(
   *   userData,
   *   {
   *     message: 'User profile retrieved successfully',
   *     requestId: 'req_123456',
   *     meta: {
   *       cache: { hit: true, ttl: 300 },
   *       permissions: ['read', 'write']
   *     }
   *   }
   * );
   *
   * // Array data with metadata
   * return ResponseFormatter.formatSuccess(products, {
   *   message: `${products.length} products found`,
   *   meta: { category: 'electronics', inStock: true }
   * });
   * ```
   */
  static formatSuccess<T = unknown>(
    data: T,
    options: {
      message?: string;
      requestId?: string;
      meta?: Record<string, unknown>;
    } = {}
  ): ApiResponse<T> {
    return CertusResponseBuilder.success(data, options.message, options.requestId, options.meta);
  }

  /**
   * Formats an error response from any type of error with enhanced handling.
   *
   * Automatically handles different error types and provides appropriate formatting:
   * - CertusAdiValtError: Preserves original error structure and context
   * - Error: Converts to CertusAdiValtError with optional detail masking
   * - Unknown: Creates generic internal server error response
   *
   * @param {unknown} error - The error to format (any type)
   * @param {Object} [options] - Error formatting options
   * @param {string} [options.requestId] - Optional request ID for tracing
   * @param {boolean} [options.includeDetails=false] - Whether to include detailed error messages in production
   * @returns {ApiResponse} Formatted error response
   *
   * @example
   * ```typescript
   * // Handle CertusAdiValtError (preserves original structure)
   * try {
   *   await userService.authenticate(credentials);
   * } catch (error) {
   *   return ResponseFormatter.formatError(error, {
   *     requestId: req.requestId
   *   });
   * }
   *
   * // Handle generic errors with detail masking
   * try {
   *   JSON.parse(invalidJson);
   * } catch (error) {
   *   return ResponseFormatter.formatError(error, {
   *     requestId: req.requestId,
   *     includeDetails: process.env.NODE_ENV === 'development' // Show details only in dev
   *   });
   * }
   *
   * // Handle unknown error types safely
   * try {
   *   await someRiskyOperation();
   * } catch (error) {
   *   // Even if error is not an Error instance, this will handle it gracefully
   *   return ResponseFormatter.formatError(error, {
   *     requestId: req.requestId
   *   });
   * }
   * ```
   */
  static formatError(
    error: unknown,
    options: {
      requestId?: string;
      includeDetails?: boolean;
    } = {}
  ): ApiResponse {
    // Handle CertusAdiValtError instances (preserve original structure)
    if (error instanceof CertusAdiValtError) {
      return CertusResponseBuilder.error(error, options.requestId);
    }

    // Handle standard Error instances
    if (error instanceof Error) {
      const certusError = new CertusAdiValtError(
        options.includeDetails ? error.message : 'Internal server error',
        'SRV_INTERNAL_ERROR',
        500,
        {},
        error
      );
      return CertusResponseBuilder.error(certusError, options.requestId);
    }

    // Handle unknown error types (non-Error objects, strings, etc.)
    const certusError = new CertusAdiValtError(
      'An unexpected error occurred',
      'SRV_INTERNAL_ERROR',
      500
    );
    return CertusResponseBuilder.error(certusError, options.requestId);
  }

  /**
   * Formats a paginated response with automatic pagination metadata calculation.
   *
   * Simplifies paginated responses by automatically calculating derived pagination
   * fields (totalPages, hasNext, hasPrev) from basic pagination parameters.
   *
   * @template T - Type of items in the data array
   * @param {T[]} data - Array of paginated items
   * @param {Object} pagination - Basic pagination parameters
   * @param {number} pagination.page - Current page number (1-based)
   * @param {number} pagination.limit - Number of items per page
   * @param {number} pagination.total - Total number of items across all pages
   * @param {Object} [options] - Pagination formatting options
   * @param {string} [options.requestId] - Optional request ID for tracing
   * @param {Record<string, unknown>} [options.meta] - Optional additional metadata
   * @returns {ApiResponse<T>} Formatted paginated response
   *
   * @example
   * ```typescript
   * // Basic pagination
   * return ResponseFormatter.formatPaginated(
   *   users,
   *   {
   *     page: 1,
   *     limit: 20,
   *     total: 150
   *   },
   *   {
   *     requestId: req.requestId
   *   }
   * );
   *
   * // Pagination with metadata
   * return ResponseFormatter.formatPaginated(
   *   products,
   *   {
   *     page: 2,
   *     limit: 25,
   *     total: 1000
   *   },
   *   {
   *     requestId: req.requestId,
   *     meta: {
   *       filters: { category: 'electronics', priceRange: '100-500' },
   *       sort: { by: 'name', order: 'asc' }
   *     }
   *   }
   * );
   *
   * // Empty pagination result
   * return ResponseFormatter.formatPaginated(
   *   [],
   *   {
   *     page: 1,
   *     limit: 20,
   *     total: 0
   *   },
   *   {
   *     message: 'No results found for your search criteria'
   *   }
   * );
   * ```
   */
  static formatPaginated<T = unknown>(
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
    },
    options: {
      requestId?: string;
      meta?: Record<string, unknown>;
    } = {}
  ): ApiResponse<T> {
    // Calculate derived pagination fields
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const hasNext = pagination.page < totalPages;
    const hasPrev = pagination.page > 1;

    const paginationParams = {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages,
      hasNext,
      hasPrev,
    };

    return CertusResponseBuilder.paginated(data, paginationParams, options.requestId, options.meta);
  }
}
