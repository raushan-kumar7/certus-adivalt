import { CertusAdiValtError } from '../errors';

/**
 * Type guard to check if an unknown value is a CertusAdiValtError instance.
 *
 * This function provides runtime type checking to safely determine if an error
 * object is an instance of the CertusAdiValtError class or its subclasses.
 *
 * @param {unknown} error - The value to check, typically from a catch block
 * @returns {error is CertusAdiValtError} True if the value is a CertusAdiValtError instance
 *
 * @example
 * ```typescript
 * try {
 *   await someOperation();
 * } catch (error) {
 *   if (isCertusError(error)) {
 *     // TypeScript now knows error is CertusAdiValtError
 *     console.log(error.code); // Safe access to CertusAdiValtError properties
 *     console.log(error.statusCode);
 *   } else {
 *     // Handle non-Certus errors
 *     console.error('Unknown error type:', error);
 *   }
 * }
 *
 * // In error middleware
 * if (isCertusError(err)) {
 *   return res.status(err.statusCode).json(err.toJSON());
 * }
 * ```
 */
export function isCertusError(error: unknown): error is CertusAdiValtError {
  return error instanceof CertusAdiValtError;
}

/**
 * Checks if an error is a client error (4xx status code range).
 *
 * Client errors indicate that the request contains bad syntax or cannot be fulfilled
 * due to client-side issues. These errors are typically the client's responsibility to fix.
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is a CertusAdiValtError with 4xx status code
 *
 * @example
 * ```typescript
 * try {
 *   await apiCall();
 * } catch (error) {
 *   if (isClientError(error)) {
 *     // Handle client-side issues (validation, authentication, etc.)
 *     showUserErrorMessage(error.message);
 *   } else {
 *     // Handle server errors differently
 *     showGenericErrorMessage();
 *   }
 * }
 *
 * // In API error handling
 * if (isClientError(error)) {
 *   logger.warn('Client error:', error.toLog());
 * } else {
 *   logger.error('Server error:', error.toLog());
 * }
 * ```
 */
export function isClientError(error: unknown): boolean {
  return isCertusError(error) && error.statusCode >= 400 && error.statusCode < 500;
}

/**
 * Checks if an error is a server error (5xx status code range).
 *
 * Server errors indicate that the server failed to fulfill a valid request.
 * These errors are typically the server's responsibility and may require administrative action.
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is a CertusAdiValtError with 5xx status code
 *
 * @example
 * ```typescript
 * try {
 *   await processUserRequest();
 * } catch (error) {
 *   if (isServerError(error)) {
 *     // Alert operations team for server issues
 *     sendAlertToOpsTeam(error);
 *     return createServerErrorResponse();
 *   }
 *   // Handle client errors normally
 *   return createClientErrorResponse(error);
 * }
 *
 * // In monitoring systems
 * if (isServerError(error)) {
 *   metrics.increment('server_errors');
 *   if (error.statusCode === 503) {
 *     metrics.increment('service_unavailable_errors');
 *   }
 * }
 * ```
 */
export function isServerError(error: unknown): boolean {
  return isCertusError(error) && error.statusCode >= 500;
}

/**
 * Checks if an error is an authentication-related error.
 *
 * Authentication errors typically involve issues with user identity verification,
 * such as invalid credentials, expired tokens, or missing authentication.
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is a CertusAdiValtError with AUTH_ prefix error code
 *
 * @example
 * ```typescript
 * // In authentication middleware
 * try {
 *   await authenticateUser(request);
 * } catch (error) {
 *   if (isAuthenticationError(error)) {
 *     // Clear invalid session and prompt re-authentication
 *     clearUserSession();
 *     return redirectToLogin();
 *   }
 *   throw error; // Re-throw non-authentication errors
 * }
 *
 * // In client-side error handling
 * if (isAuthenticationError(error)) {
 *   // Show login modal or redirect to authentication flow
 *   showAuthenticationModal();
 * } else {
 *   // Show generic error message for other error types
 *   showErrorNotification(error.message);
 * }
 * ```
 */
export function isAuthenticationError(error: unknown): boolean {
  return isCertusError(error) && error.code.startsWith('AUTH_');
}

/**
 * Checks if an error is a validation-related error.
 *
 * Validation errors occur when input data fails to meet required criteria,
 * such as schema validation, business rules, or input format requirements.
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is a CertusAdiValtError with VAL_ prefix error code
 *
 * @example
 * ```typescript
 * // In form submission handling
 * try {
 *   await submitFormData(formData);
 * } catch (error) {
 *   if (isValidationError(error)) {
 *     // Extract validation details and show field-specific errors
 *     const fieldErrors = extractValidationErrors(error);
 *     highlightInvalidFields(fieldErrors);
 *     return;
 *   }
 *   // Handle non-validation errors
 *   showGenericError();
 * }
 *
 * // In API input validation
 * if (isValidationError(error)) {
 *   // Return detailed validation errors to help clients fix their requests
 *   return response.status(422).json({
 *     error: 'Validation failed',
 *     details: error.context.validationErrors
 *   });
 * }
 * ```
 */
export function isValidationError(error: unknown): boolean {
  return isCertusError(error) && error.code.startsWith('VAL_');
}

/**
 * Checks if an error is a database-related error.
 *
 * Database errors involve issues with data persistence operations,
 * such as connection failures, query errors, constraint violations, or timeouts.
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is a CertusAdiValtError with DB_ prefix error code
 *
 * @example
 * ```typescript
 * // In data access layer
 * try {
 *   await userRepository.save(user);
 * } catch (error) {
 *   if (isDatabaseError(error)) {
 *     // Implement database-specific recovery strategies
 *     if (error.code === 'DB_CONNECTION_ERROR') {
 *       await reconnectToDatabase();
 *       return retryOperation();
 *     }
 *     // Log database errors for DBA review
 *     logger.error('Database operation failed:', error.toLog());
 *   }
 *   throw error;
 * }
 *
 * // In health checks
 * if (isDatabaseError(error)) {
 *   healthStatus.database = 'unhealthy';
 *   triggerDatabaseFailover();
 * }
 * ```
 */
export function isDatabaseError(error: unknown): boolean {
  return isCertusError(error) && error.code.startsWith('DB_');
}

/**
 * Checks if an error is specifically an external service error.
 *
 * External service errors occur when dependencies on third-party services fail,
 * such as API outages, network issues, or invalid responses from external systems.
 *
 * @param {unknown} error - The error to check
 * @returns {boolean} True if the error is a CertusAdiValtError with SRV_EXTERNAL_SERVICE error code
 *
 * @example
 * ```typescript
 * // In payment processing
 * try {
 *   await paymentGateway.charge(amount, paymentMethod);
 * } catch (error) {
 *   if (isExternalServiceError(error)) {
 *     // Implement circuit breaker or fallback payment method
 *     if (circuitBreaker.isOpen('payment_gateway')) {
 *       return useBackupPaymentProvider();
 *     }
 *     // Log external service failures for monitoring
 *     monitoring.logExternalServiceFailure('payment_gateway', error);
 *   }
 *   throw error;
 * }
 *
 * // In dependency health monitoring
 * if (isExternalServiceError(error)) {
 *   dependencyHealth.setStatus('external_api', 'degraded');
 *   alertIfCriticalDependency(error);
 * }
 * ```
 */
export function isExternalServiceError(error: unknown): boolean {
  return isCertusError(error) && error.code === 'SRV_EXTERNAL_SERVICE';
}
