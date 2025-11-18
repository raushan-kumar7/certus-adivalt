// import { ErrorCodes, HttpStatus } from '@/constants';
// import { CertusAdiValtError } from './base';

// export class CertusServerError extends CertusAdiValtError {
//   constructor(
//     message: string,
//     code: string = ErrorCodes.SRV_INTERNAL_ERROR,
//     statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
//     context: Record<string, unknown> = {}
//   ) {
//     super(message, code, statusCode, context);
//     this.name = 'CertusServerError';
//   }
// }

// export class CertusInternalServerError extends CertusServerError {
//   constructor(message: string = 'Internal server error', context: Record<string, unknown> = {}) {
//     super(message, ErrorCodes.SRV_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, context);
//     this.name = 'CertusInternalServerError';
//   }
// }

// export class CertusExternalServiceError extends CertusServerError {
//   constructor(message: string = 'External service error', context: Record<string, unknown> = {}) {
//     super(message, ErrorCodes.SRV_EXTERNAL_SERVICE, HttpStatus.BAD_GATEWAY, context);
//     this.name = 'CertusExternalServiceError';
//   }
// }

// export class CertusConfigurationError extends CertusServerError {
//   constructor(message: string = 'Configuration error', context: Record<string, unknown> = {}) {
//     super(message, ErrorCodes.SRV_CONFIGURATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, context);
//     this.name = 'CertusConfigurationError';
//   }
// }

import { ErrorCodes, HttpStatus } from '@/constants';
import { CertusAdiValtError } from './base';

/**
 * Base server error class for all server-side (5xx) errors.
 * 
 * Represents errors that are the server's responsibility, such as internal processing failures,
 * external service dependencies, or configuration issues. Extends CertusAdiValtError to provide
 * consistent error handling for all server-side error scenarios that clients cannot fix.
 * 
 * @example
 * ```typescript
 * // Custom server error for business logic failures
 * throw new CertusServerError(
 *   'Failed to process payment workflow',
 *   ErrorCodes.SRV_PROCESSING_ERROR,
 *   HttpStatus.INTERNAL_SERVER_ERROR,
 *   { workflow: 'payment_processing', step: 'fraud_check' }
 * );
 * 
 * // Wrap unexpected errors in server error
 * try {
 *   complexBusinessOperation();
 * } catch (error) {
 *   throw new CertusServerError(
 *     'Unexpected error during operation',
 *     ErrorCodes.SRV_UNEXPECTED_ERROR,
 *     HttpStatus.INTERNAL_SERVER_ERROR,
 *     { operation: 'complex_business_operation', originalError: error }
 *   );
 * }
 */
export class CertusServerError extends CertusAdiValtError {
  /**
   * Creates a new CertusServerError instance.
   * 
   * @param {string} message - Human-readable error description
   * @param {string} [code=ErrorCodes.SRV_INTERNAL_ERROR] - Machine-readable error code for server failures
   * @param {number} [statusCode=HttpStatus.INTERNAL_SERVER_ERROR] - HTTP status code (5xx range)
   * @param {Record<string, unknown>} [context={}] - Additional context about the server error
   * 
   * @example
   * ```typescript
   * // Basic server error with default code and status
   * throw new CertusServerError('Unexpected server failure');
   * 
   * // Specific server error with detailed context
   * throw new CertusServerError(
   *   'Data processing pipeline failed',
   *   ErrorCodes.SRV_PROCESSING_ERROR,
   *   HttpStatus.INTERNAL_SERVER_ERROR,
   *   {
   *     pipeline: 'data_enrichment',
   *     stage: 'normalization',
   *     recordsProcessed: 1500,
   *     failedAt: 'data_validation',
   *     retryAttempt: 2
   *   }
   * );
   * ```
   */
  constructor(
    message: string,
    code: string = ErrorCodes.SRV_INTERNAL_ERROR,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    context: Record<string, unknown> = {}
  ) {
    super(message, code, statusCode, context);
    this.name = 'CertusServerError';
  }
}

/**
 * Error thrown for generic internal server errors when no more specific error applies.
 * 
 * Represents unexpected failures in the application logic, unhandled exceptions, or
 * scenarios where the root cause cannot be determined. Returns HTTP 500 Internal Server Error.
 * This should be used as a fallback when no other specific server error class fits.
 * 
 * @example
 * ```typescript
 * // Catch-all for unexpected errors
 * try {
 *   await businessCriticalOperation();
 * } catch (error) {
 *   if (error instanceof CertusAdiValtError) {
 *     throw error; // Re-throw known errors
 *   }
 *   // Wrap unknown errors
 *   throw new CertusInternalServerError(
 *     'An unexpected error occurred',
 *     { operation: 'business_critical_operation', originalError: error.message }
 *   );
 * }
 * 
 * // Fallback error handler
 * if (result === undefined && !isExpectedScenario) {
 *   throw new CertusInternalServerError('Unexpected undefined result')
 *     .withContext({ function: 'calculateBusinessMetrics', input: processedData });
 * }
 * ```
 */
export class CertusInternalServerError extends CertusServerError {
  /**
   * Creates a new CertusInternalServerError instance.
   * 
   * @param {string} [message='Internal server error'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the internal error
   * 
   * @example
   * ```typescript
   * // Basic internal server error
   * throw new CertusInternalServerError();
   * 
   * // Detailed internal error with debugging information
   * throw new CertusInternalServerError(
   *   'Critical business logic failure',
   *   {
   *     component: 'order_processing',
   *     method: 'calculateTax',
   *     input: { amount: 100, country: 'US' },
   *     stackTrace: '...',
   *     server: 'web-01',
   *     timestamp: new Date().toISOString(),
   *     incidentId: 'inc_123456'
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Internal server error', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.SRV_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, context);
    this.name = 'CertusInternalServerError';
  }
}

/**
 * Error thrown when external service dependencies fail or return errors.
 * 
 * Represents failures in third-party API calls, microservice dependencies, or
 * external resource access. Returns HTTP 502 Bad Gateway status code to indicate
 * the server received an invalid response from an upstream server.
 * 
 * @example
 * ```typescript
 * // External API call failure
 * try {
 *   const paymentResult = await paymentGateway.charge(amount, token);
 * } catch (error) {
 *   throw new CertusExternalServiceError(
 *     'Payment gateway unavailable',
 *     {
   *       service: 'stripe_payment_gateway',
   *       operation: 'charge',
   *       error: error.message,
   *       retryCount: 3,
   *       timeout: '30s'
   *     }
   *   );
   * }
   * 
   * // Microservice dependency failure
   * const userServiceResponse = await fetchUserService(userId);
   * if (userServiceResponse.status >= 500) {
   *   throw new CertusExternalServiceError('User service temporarily unavailable')
   *     .withContext({ service: 'user_service', status: userServiceResponse.status });
   * }
   * ```
   */
export class CertusExternalServiceError extends CertusServerError {
  /**
   * Creates a new CertusExternalServiceError instance.
   * 
   * @param {string} [message='External service error'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the external service failure
   * 
   * @example
   * ```typescript
   * // Basic external service error
   * throw new CertusExternalServiceError();
   * 
   * // Detailed external service failure
   * throw new CertusExternalServiceError(
   *   'Email service delivery failed',
   *   {
   *     externalService: 'sendgrid',
   *     endpoint: '/v3/mail/send',
   *     statusCode: 503,
   *     errorResponse: { errors: ['Service temporarily unavailable'] },
   *     requestId: 'sendgrid_req_123',
   *     retryAttempts: 2,
   *     suggestion: 'Check SendGrid status page or use fallback provider'
   *   }
   * );
   * ```
   */
  constructor(message: string = 'External service error', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.SRV_EXTERNAL_SERVICE, HttpStatus.BAD_GATEWAY, context);
    this.name = 'CertusExternalServiceError';
  }
}

/**
 * Error thrown when application configuration is invalid, missing, or misconfigured.
 * 
 * Represents failures due to incorrect environment variables, invalid configuration files,
 * or missing required settings. Returns HTTP 500 Internal Server Error since configuration
 * issues prevent the application from functioning properly.
 * 
 * @example
 * ```typescript
 * // Validate required configuration
 * if (!process.env.DATABASE_URL) {
 *   throw new CertusConfigurationError(
 *     'Database connection string is required',
 *     { missingVariable: 'DATABASE_URL', environment: process.env.NODE_ENV }
 *   );
 * }
 * 
 * // Validate configuration format
 * if (!isValidApiKeyFormat(config.paymentGateway.apiKey)) {
 *   throw new CertusConfigurationError('Invalid payment gateway API key format')
 *     .withContext({ 
 *       configSection: 'paymentGateway',
   *       field: 'apiKey',
   *       expectedFormat: 'sk_live_...',
   *       actualValue: config.paymentGateway.apiKey?.substring(0, 8) + '...'
   *     });
   * }
   * ```
   */
export class CertusConfigurationError extends CertusServerError {
  /**
   * Creates a new CertusConfigurationError instance.
   * 
   * @param {string} [message='Configuration error'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the configuration issue
   * 
   * @example
   * ```typescript
   * // Basic configuration error
   * throw new CertusConfigurationError();
   * 
   * // Detailed configuration validation failure
   * throw new CertusConfigurationError(
   *   'Invalid database configuration',
   *   {
   *     configFile: 'database.config.js',
   *     validationErrors: [
   *       { field: 'pool.max', issue: 'Must be a positive integer', value: -1 },
   *       { field: 'ssl', issue: 'Must be boolean or object', value: 'true' }
   *     ],
   *     environment: 'production',
   *     suggestion: 'Check environment variables and config file syntax'
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Configuration error', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.SRV_CONFIGURATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, context);
    this.name = 'CertusConfigurationError';
  }
}