import { ErrorCodes, HttpStatus } from '../../constants';
import { CertusErrorOptions } from '../../types';
import {
  CertusAdiValtError,
  CertusAuthenticationError,
  CertusClientError,
  CertusNotFoundError,
  CertusServerError,
  CertusValidationError,
} from '../errors';
import { isCertusError, isClientError, isServerError } from '../guards';

/**
 * Creates a generic CertusAdiValtError with full customization options.
 *
 * This factory function provides a flexible way to create CertusAdiValtError instances
 * with complete control over all error properties. Useful for creating custom error
 * types not covered by the specific error classes.
 *
 * @param {string} message - Human-readable error description
 * @param {CertusErrorOptions} options - Error configuration options
 * @returns {CertusAdiValtError} New CertusAdiValtError instance
 *
 * @example
 * ```typescript
 * // Create a custom business error
 * const error = createCertusError(
 *   'Inventory allocation failed',
 *   {
 *     code: 'INVENTORY_ALLOCATION_FAILED',
 *     statusCode: 409,
 *     context: { productId: 'prod_123', requestedQty: 10, availableQty: 5 },
 *     originalError: allocationError
 *   }
 * );
 *
 * // Create error with minimal options
 * const error = createCertusError('Operation failed', {
 *   code: ErrorCodes.GEN_BAD_REQUEST,
 *   statusCode: HttpStatus.BAD_REQUEST
 * });
 * ```
 */
export function createCertusError(
  message: string,
  options: CertusErrorOptions
): CertusAdiValtError {
  return new CertusAdiValtError(
    message,
    options.code,
    options.statusCode,
    options.context,
    options.originalError
  );
}

/**
 * Creates a validation error for input or data validation failures.
 *
 * Convenience factory for creating CertusValidationError instances with
 * consistent error code (VAL_INVALID_INPUT) and status code (422 Unprocessable Entity).
 *
 * @param {string} [message='Validation failed'] - Human-readable error description
 * @param {Record<string, unknown>} [context] - Additional context about validation failures
 * @returns {CertusValidationError} New CertusValidationError instance
 *
 * @example
 * ```typescript
 * // Basic validation error
 * throw createValidationError('Email format is invalid');
 *
 * // Validation error with detailed context
 * throw createValidationError(
 *   'User profile validation failed',
 *   {
 *     validationErrors: [
 *       { field: 'age', issue: 'Must be at least 18', value: 16 },
 *       { field: 'email', issue: 'Already registered', value: 'user@example.com' }
 *     ],
 *     totalErrors: 2
 *   }
 * );
 *
 * // In schema validation
 * const result = userSchema.validate(data);
 * if (result.error) {
 *   throw createValidationError('Schema validation failed', {
 *     schemaErrors: result.error.details,
 *     receivedData: data
 *   });
 * }
 * ```
 */
export function createValidationError(
  message: string = 'Validation failed',
  context?: Record<string, unknown>
): CertusValidationError {
  return new CertusValidationError(message, context);
}

/**
 * Creates a not found error for missing resources or entities.
 *
 * Convenience factory for creating CertusNotFoundError instances with
 * consistent error code (GEN_NOT_FOUND) and status code (404 Not Found).
 *
 * @param {string} [message='Resource not found'] - Human-readable error description
 * @param {Record<string, unknown>} [context] - Additional context about the missing resource
 * @returns {CertusNotFoundError} New CertusNotFoundError instance
 *
 * @example
 * ```typescript
 * // Basic not found error
 * throw createNotFoundError('User not found');
 *
 * // Not found error with resource details
 * throw createNotFoundError(
 *   `Order ${orderId} not found`,
 *   {
 *     resourceType: 'Order',
 *     resourceId: orderId,
 *     searchedBy: 'id',
 *     availableResources: ['users', 'products', 'categories']
 *   }
 * );
 *
 * // In repository pattern
 * const user = await userRepository.findById(userId);
 * if (!user) {
 *   throw createNotFoundError(`User with ID ${userId} not found`, {
 *     repository: 'UserRepository',
 *     method: 'findById',
 *     criteria: { id: userId }
 *   });
 * }
 * ```
 */
export function createNotFoundError(
  message: string = 'Resource not found',
  context?: Record<string, unknown>
): CertusNotFoundError {
  return new CertusNotFoundError(message, context);
}

/**
 * Creates an authentication error for credential or token failures.
 *
 * Convenience factory for creating CertusAuthenticationError instances with
 * consistent error code (AUTH_INVALID_CREDENTIALS) and status code (401 Unauthorized).
 *
 * @param {string} [message='Authentication failed'] - Human-readable error description
 * @param {Record<string, unknown>} [context] - Additional context about authentication failure
 * @returns {CertusAuthenticationError} New CertusAuthenticationError instance
 *
 * @example
 * ```typescript
 * // Basic authentication error
 * throw createAuthenticationError('Invalid credentials');
 *
 * // Authentication error with security context
 * throw createAuthenticationError(
 *   'Token validation failed',
 *   {
 *     tokenType: 'access_token',
 *     reason: 'signature_invalid',
 *     issuedAt: '2024-01-01T00:00:00Z',
 *     clientIp: '192.168.1.100'
 *   }
 * );
 *
 * // In authentication middleware
 * if (!isValidToken(authToken)) {
 *   throw createAuthenticationError('Invalid or expired token', {
 *     token: maskSensitiveData(authToken),
 *     validationMethod: 'jwt_verify'
 *   });
 * }
 * ```
 */
export function createAuthenticationError(
  message: string = 'Authentication failed',
  context?: Record<string, unknown>
): CertusAuthenticationError {
  return new CertusAuthenticationError(
    message,
    ErrorCodes.AUTH_INVALID_CREDENTIALS,
    HttpStatus.UNAUTHORIZED,
    context
  );
}

// Error transformation utilities

/**
 * Wraps an unknown error into a CertusAdiValtError, preserving original error information.
 *
 * This utility safely converts any error (including non-Error objects) into a
 * CertusAdiValtError instance. If the input is already a CertusAdiValtError,
 * it returns the original error unchanged.
 *
 * @param {unknown} error - The error to wrap (can be any type)
 * @param {string} [message] - Optional custom error message (uses original message if not provided)
 * @param {string} [code=ErrorCodes.SRV_INTERNAL_ERROR] - Error code for the wrapped error
 * @returns {CertusAdiValtError} CertusAdiValtError instance (original if already a Certus error)
 *
 * @example
 * ```typescript
 * // Wrap a generic Error
 * try {
 *   JSON.parse(invalidJson);
 * } catch (error) {
 *   throw wrapError(error, 'Failed to parse JSON data');
 * }
 *
 * // Wrap non-Error objects
 * const result = someOperation();
 * if (result instanceof Error) {
 *   throw wrapError(result);
 * } else if (!result.success) {
 *   throw wrapError(new Error('Operation failed'), 'Custom error message');
 * }
 *
 * // In async operations with unknown errors
 * try {
 *   await externalService.call();
 * } catch (error) {
 *   // Converts any error to CertusAdiValtError for consistent handling
 *   const wrappedError = wrapError(error, 'External service call failed', 'SRV_EXTERNAL_ERROR');
 *   logger.error(wrappedError.toLog());
 *   throw wrappedError;
 * }
 * ```
 */
export function wrapError(
  error: unknown,
  message?: string,
  code: string = ErrorCodes.SRV_INTERNAL_ERROR
): CertusAdiValtError {
  if (isCertusError(error)) {
    return error;
  }

  const errorMessage = message || (error instanceof Error ? error.message : 'An error occurred');

  return new CertusAdiValtError(
    errorMessage,
    code,
    HttpStatus.INTERNAL_SERVER_ERROR,
    {},
    error instanceof Error ? error : undefined
  );
}

/**
 * Converts an unknown error to a client error (4xx status code).
 *
 * This utility ensures that any error is converted to a CertusClientError instance.
 * If the input is already a client error, it returns the original error unchanged.
 * Useful for ensuring client-facing errors have appropriate status codes.
 *
 * @param {unknown} error - The error to convert
 * @returns {CertusClientError} CertusClientError instance
 *
 * @example
 * ```typescript
 * // In API route handling
 * try {
 *   await processUserRequest(request.body);
 * } catch (error) {
 *   // Ensure all errors returned to client are client errors
 *   const clientError = toClientError(error);
 *   return res.status(clientError.statusCode).json(clientError.toJSON());
 * }
 *
 * // In form validation
 * const validationResult = validateFormData(formData);
 * if (!validationResult.valid) {
 *   throw toClientError(validationResult.error);
 * }
 *
 * // Convert third-party library errors to client errors
 * try {
 *   await emailService.send(email);
 * } catch (error) {
 *   // Convert service-specific errors to generic client errors
 *   throw toClientError(error).withContext({ service: 'email', template: 'welcome' });
 * }
 * ```
 */
export function toClientError(error: unknown): CertusClientError {
  if (isCertusError(error) && isClientError(error)) {
    return error as CertusClientError;
  }

  return new CertusClientError(
    error instanceof Error ? error.message : 'Client error occurred',
    ErrorCodes.GEN_BAD_REQUEST,
    HttpStatus.BAD_REQUEST,
    { originalError: error }
  );
}

/**
 * Converts an unknown error to a server error (5xx status code).
 *
 * This utility ensures that any error is converted to a CertusServerError instance.
 * If the input is already a server error, it returns the original error unchanged.
 * Useful for ensuring server-side errors are properly categorized.
 *
 * @param {unknown} error - The error to convert
 * @returns {CertusServerError} CertusServerError instance
 *
 * @example
 * ```typescript
 * // In background job processing
 * try {
 *   await processBackgroundJob(jobData);
 * } catch (error) {
 *   // Ensure all background job errors are server errors
 *   const serverError = toServerError(error);
 *   logger.error('Background job failed:', serverError.toLog());
 *   metrics.increment('background_job_errors');
 *   throw serverError;
 * }
 *
 * // In database operations
 * try {
 *   await database.transaction(async (tx) => {
 *     await tx.insert(users).values(userData);
 *   });
 * } catch (error) {
 *   // Convert database errors to server errors
 *   throw toServerError(error).withContext({ operation: 'user_creation', transaction: true });
 * }
 *
 * // In health check endpoints
 * try {
 *   await checkSystemHealth();
 * } catch (error) {
 *   // Health check failures are server errors
 *   const healthError = toServerError(error);
 *   healthStatus.overall = 'unhealthy';
 *   throw healthError;
 * }
 * ```
 */
export function toServerError(error: unknown): CertusServerError {
  if (isCertusError(error) && isServerError(error)) {
    return error as CertusServerError;
  }

  return new CertusServerError(
    error instanceof Error ? error.message : 'Server error occurred',
    ErrorCodes.SRV_INTERNAL_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
    { originalError: error }
  );
}

// Error assertion utilities

/**
 * Asserts that an unknown value is a CertusAdiValtError instance.
 *
 * This assertion function throws an error if the input is not a CertusAdiValtError,
 * providing runtime type safety and ensuring error handling consistency.
 *
 * @param {unknown} error - The value to assert as CertusAdiValtError
 * @param {string} [message] - Custom error message for assertion failure
 * @throws {CertusServerError} Throws if the value is not a CertusAdiValtError
 *
 * @example
 * ```typescript
 * // In error processing functions
 * function processError(error: unknown) {
 *   assertCertusError(error, 'Expected a Certus error for processing');
 *
 *   // TypeScript now knows error is CertusAdiValtError
 *   console.log(error.code); // Safe access
 *   return error.toJSON();
 * }
 *
 * // In test assertions
 * it('should throw Certus error', async () => {
 *   await expect(asyncOperation()).rejects.toThrow();
 *   try {
 *     await asyncOperation();
 *   } catch (error) {
 *     assertCertusError(error);
 *     expect(error.code).toBe('VALIDATION_ERROR');
 *   }
 * });
 *
 * // In error transformation pipelines
 * const processedErrors = rawErrors.map(error => {
 *   assertCertusError(error);
 *   return error.withContext({ processedAt: new Date() });
 * });
 * ```
 */
export function assertCertusError(
  error: unknown,
  message?: string
): asserts error is CertusAdiValtError {
  if (!isCertusError(error)) {
    throw new CertusServerError(
      message || 'Expected CertusAdiValtError instance',
      ErrorCodes.SRV_INTERNAL_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { actualError: error }
    );
  }
}

/**
 * Asserts that an unknown value is a client error (4xx status code).
 *
 * This assertion function throws an error if the input is not a CertusClientError,
 * providing runtime validation for client error handling scenarios.
 *
 * @param {unknown} error - The value to assert as CertusClientError
 * @param {string} [message] - Custom error message for assertion failure
 * @throws {CertusServerError} Throws if the value is not a CertusClientError
 *
 * @example
 * ```typescript
 * // In API response formatting
 * function formatClientErrorResponse(error: unknown) {
 *   assertClientError(error, 'Expected client error for response formatting');
 *
 *   // TypeScript now knows error is CertusClientError
 *   return {
 *     status: error.statusCode,
 *     code: error.code,
 *     message: error.message
 *   };
 * }
 *
 * // In client-side error handling
 * function handleClientError(error: unknown) {
 *   assertClientError(error);
 *
 *   // Safe to use client error specific properties
 *   if (error.statusCode === 404) {
 *     showNotFoundMessage(error.message);
 *   } else if (error.statusCode === 422) {
 *     showValidationErrors(error.context);
 *   }
 * }
 *
 * // In middleware error filtering
 * const clientErrors = allErrors.filter(error => {
 *   try {
 *     assertClientError(error);
 *     return true;
 *   } catch {
 *     return false;
 *   }
 * });
 * ```
 */
export function assertClientError(
  error: unknown,
  message?: string
): asserts error is CertusClientError {
  assertCertusError(error, message);
  if (!isClientError(error)) {
    throw new CertusServerError(
      message || 'Expected client error',
      ErrorCodes.SRV_INTERNAL_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { actualError: error }
    );
  }
}
