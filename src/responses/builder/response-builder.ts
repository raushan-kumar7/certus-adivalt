import { CertusAdiValtError } from '../../certus';
import {
  EmptyResponse,
  ErrorResponse,
  PaginatedResponse,
  PaginationParams,
  SuccessResponse,
} from '../../types';

/**
 * Response builder utility for creating standardized API responses in the CertusAdiValt system.
 *
 * Provides factory methods for creating consistent, well-structured API responses
 * following the CertusAdiValt response format standards. Ensures all responses
 * include proper timestamps, success indicators, and optional metadata.
 *
 * @class CertusResponseBuilder
 *
 * @example
 * ```typescript
 * // Success response with data
 * return CertusResponseBuilder.success(userData, 'User retrieved successfully', requestId);
 *
 * // Error response
 * try {
 *   await someOperation();
 * } catch (error) {
 *   return CertusResponseBuilder.error(error, requestId);
 * }
 *
 * // Paginated response
 * return CertusResponseBuilder.paginated(users, pagination, requestId, { totalUsers: 1000 });
 *
 * // Empty response for DELETE operations
 * return CertusResponseBuilder.deleted('User deleted successfully', requestId);
 * ```
 */
export class CertusResponseBuilder {
  /**
   * Generates an ISO 8601 timestamp for response standardization.
   *
   * @private
   * @returns {string} ISO 8601 formatted timestamp
   *
   * @example
   * ```typescript
   * const timestamp = CertusResponseBuilder.generateTimestamp();
   * // Returns: "2024-01-15T10:30:00.000Z"
   * ```
   */
  private static generateTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Creates a standard success response with data payload.
   *
   * @template T - Type of the data payload
   * @param {T} data - The main response data payload
   * @param {string} [message] - Optional success message
   * @param {string} [requestId] - Optional request ID for tracing
   * @param {Record<string, unknown>} [meta] - Optional additional metadata
   * @returns {SuccessResponse<T>} Standardized success response
   *
   * @example
   * ```typescript
   * // Basic success response
   * return CertusResponseBuilder.success({ id: 1, name: 'John' });
   *
   * // Success response with message and metadata
   * return CertusResponseBuilder.success(
   *   userData,
   *   'User profile retrieved',
   *   'req_123456',
   *   { cache: { hit: true, ttl: 300 } }
   * );
   *
   * // Success response for array data
   * return CertusResponseBuilder.success(users, `${users.length} users found`);
   * ```
   */
  static success<T = unknown>(
    data: T,
    message?: string,
    requestId?: string,
    meta?: Record<string, unknown>
  ): SuccessResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: this.generateTimestamp(),
      requestId,
      meta,
    };
  }

  /**
   * Creates a standardized error response from any error object.
   *
   * Automatically handles both CertusAdiValtError instances and generic Error objects,
   * providing appropriate error code, message, and status code mapping.
   *
   * @param {CertusAdiValtError | Error} error - The error to convert to response format
   * @param {string} [requestId] - Optional request ID for tracing
   * @returns {ErrorResponse} Standardized error response
   *
   * @example
   * ```typescript
   * // From CertusAdiValtError
   * try {
   *   await authenticateUser(credentials);
   * } catch (error) {
   *   if (error instanceof CertusAdiValtError) {
   *     return CertusResponseBuilder.error(error, requestId);
   *   }
   *   // Handle generic errors
   *   return CertusResponseBuilder.error(error, requestId);
   * }
   *
   * // From generic Error
   * try {
   *   JSON.parse(invalidJson);
   * } catch (error) {
   *   return CertusResponseBuilder.error(error, 'req_123456');
   * }
   * ```
   */
  static error(error: CertusAdiValtError | Error, requestId?: string): ErrorResponse {
    const isCertusError = error instanceof CertusAdiValtError;

    return {
      success: false,
      error: {
        code: isCertusError ? error.code : 'UNKNOWN_ERROR',
        message: error.message,
        details: isCertusError ? undefined : 'An unexpected error occurred',
        statusCode: isCertusError ? error.statusCode : 500,
        timestamp: this.generateTimestamp(),
        context: isCertusError ? error.context : undefined,
        requestId,
      },
    };
  }

  /**
   * Creates a paginated response for list endpoints with pagination metadata.
   *
   * @template T - Type of items in the data array
   * @param {T[]} data - Array of paginated items
   * @param {PaginationParams} pagination - Pagination metadata
   * @param {string} [requestId] - Optional request ID for tracing
   * @param {Record<string, unknown>} [meta] - Optional additional metadata
   * @returns {PaginatedResponse<T>} Standardized paginated response
   *
   * @example
   * ```typescript
   * // Basic paginated response
   * const pagination = {
   *   page: 1,
   *   limit: 20,
   *   total: 150,
   *   totalPages: 8,
   *   hasNext: true,
   *   hasPrev: false
   * };
   * return CertusResponseBuilder.paginated(users, pagination, requestId);
   *
   * // Paginated response with additional metadata
   * return CertusResponseBuilder.paginated(
   *   products,
   *   pagination,
   *   requestId,
   *   {
   *     filters: { category: 'electronics' },
   *     sort: { field: 'price', order: 'asc' }
   *   }
   * );
   * ```
   */
  static paginated<T = unknown>(
    data: T[],
    pagination: PaginationParams,
    requestId?: string,
    meta?: Record<string, unknown>
  ): PaginatedResponse<T> {
    return {
      success: true,
      data,
      pagination,
      timestamp: this.generateTimestamp(),
      requestId,
      meta,
    };
  }

  /**
   * Creates an empty success response for operations that don't return data.
   *
   * Typically used for DELETE operations or other actions where no data payload
   * is returned, but a success confirmation is needed.
   *
   * @param {string} [message] - Optional success message
   * @param {string} [requestId] - Optional request ID for tracing
   * @returns {EmptyResponse} Standardized empty success response
   *
   * @example
   * ```typescript
   * // Basic empty response
   * return CertusResponseBuilder.empty();
   *
   * // Empty response with custom message
   * return CertusResponseBuilder.empty('Operation completed successfully', 'req_123456');
   *
   * // For DELETE endpoints
   * await userRepository.delete(userId);
   * return CertusResponseBuilder.empty('User deleted successfully', requestId);
   * ```
   */
  static empty(message?: string, requestId?: string): EmptyResponse {
    return {
      success: true,
      message,
      timestamp: this.generateTimestamp(),
      requestId,
    };
  }

  /**
   * Creates a success response specifically for resource creation (HTTP 201 equivalent).
   *
   * Convenience method for POST endpoints that create new resources.
   *
   * @template T - Type of the created resource data
   * @param {T} data - The created resource data
   * @param {string} [message='Resource created successfully'] - Success message
   * @param {string} [requestId] - Optional request ID for tracing
   * @returns {SuccessResponse<T>} Standardized creation success response
   *
   * @example
   * ```typescript
   * // Create user response
   * const newUser = await userRepository.create(userData);
   * return CertusResponseBuilder.created(newUser, 'User created successfully', requestId);
   *
   * // Create with custom message
   * return CertusResponseBuilder.created(
   *   product,
   *   'Product added to catalog',
   *   requestId
   * );
   * ```
   */
  static created<T = unknown>(
    data: T,
    message: string = 'Resource created successfully',
    requestId?: string
  ): SuccessResponse<T> {
    return this.success(data, message, requestId);
  }

  /**
   * Creates a success response specifically for resource updates (HTTP 200/204 equivalent).
   *
   * Convenience method for PUT/PATCH endpoints that update existing resources.
   *
   * @template T - Type of the updated resource data
   * @param {T} data - The updated resource data
   * @param {string} [message='Resource updated successfully'] - Success message
   * @param {string} [requestId] - Optional request ID for tracing
   * @returns {SuccessResponse<T>} Standardized update success response
   *
   * @example
   * ```typescript
   * // Update user response
   * const updatedUser = await userRepository.update(userId, updateData);
   * return CertusResponseBuilder.updated(updatedUser, 'User profile updated', requestId);
   *
   * // Partial update response
   * return CertusResponseBuilder.updated(
   *   partialUser,
   *   'User preferences updated',
   *   requestId
   * );
   * ```
   */
  static updated<T = unknown>(
    data: T,
    message: string = 'Resource updated successfully',
    requestId?: string
  ): SuccessResponse<T> {
    return this.success(data, message, requestId);
  }

  /**
   * Creates an empty success response specifically for resource deletion.
   *
   * Convenience method for DELETE endpoints that remove resources.
   *
   * @param {string} [message='Resource deleted successfully'] - Success message
   * @param {string} [requestId] - Optional request ID for tracing
   * @returns {EmptyResponse} Standardized deletion success response
   *
   * @example
   * ```typescript
   * // Delete user response
   * await userRepository.delete(userId);
   * return CertusResponseBuilder.deleted('User account deleted', requestId);
   *
   * // Delete with custom message
   * return CertusResponseBuilder.deleted(
   *   'Product removed from inventory',
   *   requestId
   * );
   * ```
   */
  static deleted(
    message: string = 'Resource deleted successfully',
    requestId?: string
  ): EmptyResponse {
    return this.empty(message, requestId);
  }
}
