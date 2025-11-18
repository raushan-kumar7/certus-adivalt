import { ErrorCodes, HttpStatus } from '@/constants';
import { CertusAdiValtError } from './base';

/**
 * Base client error class for all client-side (4xx) errors.
 *
 * Represents errors that are the client's responsibility, such as invalid requests,
 * authentication issues, or missing resources. Extends CertusAdiValtError to provide
 * consistent error handling for all client-facing error scenarios.
 *
 * @example
 * ```typescript
 * // Custom client error
 * throw new CertusClientError('Invalid request parameters', 'CUSTOM_CLIENT_ERROR', 400);
 *
 * // With context for better debugging
 * throw new CertusClientError(
 *   'Request timeout',
 *   ErrorCodes.GEN_REQUEST_TIMEOUT,
 *   HttpStatus.REQUEST_TIMEOUT,
 *   { timeoutMs: 5000, endpoint: '/api/data' }
 * );
 * ```
 */
export class CertusClientError extends CertusAdiValtError {
  /**
   * Creates a new CertusClientError instance.
   *
   * @param {string} message - Human-readable error description
   * @param {string} [code=ErrorCodes.GEN_VALIDATION_ERROR] - Machine-readable error code
   * @param {number} [statusCode=HttpStatus.BAD_REQUEST] - HTTP status code (4xx range)
   * @param {Record<string, unknown>} [context={}] - Additional context about the client error
   *
   * @example
   * ```typescript
   * // Basic client error with default code and status
   * throw new CertusClientError('Invalid input provided');
   *
   * // Custom client error with specific code and status
   * throw new CertusClientError(
   *   'Payment required',
   *   ErrorCodes.GEN_PAYMENT_REQUIRED,
   *   HttpStatus.PAYMENT_REQUIRED,
   *   { plan: 'premium', feature: 'advanced_analytics' }
   * );
   * ```
   */
  constructor(
    message: string,
    code: string = ErrorCodes.GEN_VALIDATION_ERROR,
    statusCode: number = HttpStatus.BAD_REQUEST,
    context: Record<string, unknown> = {}
  ) {
    super(message, code, statusCode, context);
    this.name = 'CertusClientError';
  }
}

/**
 * Error thrown when input data fails validation rules.
 *
 * Represents schema validation failures, data type mismatches, or business rule violations.
 * Typically returns HTTP 422 Unprocessable Entity to indicate semantically invalid data.
 *
 * @example
 * ```typescript
 * // Validate user input
 * const validation = validateUserInput(data);
 * if (!validation.isValid) {
 *   throw new CertusValidationError(
 *     'User data validation failed',
 *     { errors: validation.errors, field: 'email' }
 *   );
 * }
 *
 * // In API request validation
 * if (!isValidEmail(request.body.email)) {
 *   throw new CertusValidationError('Invalid email format')
 *     .withContext({ value: request.body.email, pattern: 'email-regex' });
 * }
 * ```
 */
export class CertusValidationError extends CertusClientError {
  /**
   * Creates a new CertusValidationError instance.
   *
   * @param {string} [message='Validation failed'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about validation failures
   *
   * @example
   * ```typescript
   * // Basic validation error
   * throw new CertusValidationError();
   *
   * // Detailed validation error with multiple issues
   * throw new CertusValidationError(
   *   'Multiple validation errors occurred',
   *   {
   *     validationErrors: [
   *       { field: 'email', message: 'Must be a valid email address' },
   *       { field: 'password', message: 'Must be at least 8 characters' }
   *     ],
   *     receivedData: { email: 'invalid', password: 'short' }
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Validation failed', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.VAL_INVALID_INPUT, HttpStatus.UNPROCESSABLE_ENTITY, context);
    this.name = 'CertusValidationError';
  }
}

/**
 * Error thrown when a requested resource cannot be found.
 *
 * Used for cases where the client requests a resource that doesn't exist or
 * the user doesn't have access to. Returns HTTP 404 Not Found status code.
 *
 * @example
 * ```typescript
 * // Lookup resource by ID
 * const user = await userRepository.findById(userId);
 * if (!user) {
 *   throw new CertusNotFoundError(
 *     `User with ID ${userId} not found`,
 *     { resource: 'User', id: userId, searchedBy: 'id' }
 *   );
 * }
 *
 * // In REST API endpoint
 * if (!await database.exists('products', productId)) {
 *   throw new CertusNotFoundError('Product not found')
 *     .withContext({ productId, catalog: 'electronics' });
 * }
 * ```
 */
export class CertusNotFoundError extends CertusClientError {
  /**
   * Creates a new CertusNotFoundError instance.
   *
   * @param {string} [message='Resource not found'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the missing resource
   *
   * @example
   * ```typescript
   * // Basic not found error
   * throw new CertusNotFoundError();
   *
   * // Specific resource not found
   * throw new CertusNotFoundError(
   *   'Order not found in system',
   *   {
   *     resourceType: 'Order',
   *     resourceId: 'ord_123456',
   *     searchedFields: ['id', 'reference'],
   *     availableResources: ['users', 'products', 'categories']
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Resource not found', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.GEN_NOT_FOUND, HttpStatus.NOT_FOUND, context);
    this.name = 'CertusNotFoundError';
  }
}

/**
 * Error thrown when authentication is required but not provided or invalid.
 *
 * Represents cases where the client needs to authenticate but hasn't provided
 * valid credentials. Returns HTTP 401 Unauthorized status code.
 *
 * @example
 * ```typescript
 * // Check authentication in middleware
 * if (!request.headers.authorization) {
 *   throw new CertusUnauthorizedError(
 *     'Authentication required to access this resource',
 *     { endpoint: request.path, method: request.method }
 *   );
 * }
 *
 * // Validate API key
 * if (!isValidApiKey(apiKey)) {
 *   throw new CertusUnauthorizedError('Invalid API key')
 *     .withContext({ keyType: 'public', format: 'bearer' });
 * }
 * ```
 */
export class CertusUnauthorizedError extends CertusClientError {
  /**
   * Creates a new CertusUnauthorizedError instance.
   *
   * @param {string} [message='Unauthorized access'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the authorization failure
   *
   * @example
   * ```typescript
   * // Basic unauthorized error
   * throw new CertusUnauthorizedError();
   *
   * // Specific unauthorized scenario
   * throw new CertusUnauthorizedError(
   *   'Bearer token missing or invalid',
   *   {
   *     authScheme: 'Bearer',
   *     providedHeader: request.headers.authorization,
   *     expectedFormat: 'Bearer <token>',
   *     documentation: 'https://api.example.com/docs/authentication'
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Unauthorized access', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.AUTH_UNAUTHORIZED, HttpStatus.UNAUTHORIZED, context);
    this.name = 'CertusUnauthorizedError';
  }
}

/**
 * Error thrown when the client is authenticated but lacks permission for the requested action.
 *
 * Represents authorization failures where the client has valid credentials but isn't
 * allowed to perform the specific operation. Returns HTTP 403 Forbidden status code.
 *
 * @example
 * ```typescript
 * // Check user role permissions
 * if (user.role !== 'admin' && requestedAction === 'delete_users') {
 *   throw new CertusForbiddenError(
 *     'Only administrators can delete users',
 *     { userRole: user.role, requiredRole: 'admin', action: 'delete_users' }
 *   );
 * }
 *
 * // Check resource ownership
 * if (resource.ownerId !== user.id && !user.isModerator) {
 *   throw new CertusForbiddenError('You can only modify your own resources')
 *     .withContext({ resourceOwner: resource.ownerId, currentUser: user.id });
 * }
 * ```
 */
export class CertusForbiddenError extends CertusClientError {
  /**
   * Creates a new CertusForbiddenError instance.
   *
   * @param {string} [message='Access forbidden'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the permission denial
   *
   * @example
   * ```typescript
   * // Basic forbidden error
   * throw new CertusForbiddenError();
   *
   * // Detailed permission denial
   * throw new CertusForbiddenError(
   *   'Insufficient subscription level for this feature',
   *   {
   *     userSubscription: 'basic',
   *     requiredSubscription: 'premium',
   *     feature: 'advanced_analytics',
   *     upgradeUrl: '/billing/upgrade'
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Access forbidden', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS, HttpStatus.FORBIDDEN, context);
    this.name = 'CertusForbiddenError';
  }
}
