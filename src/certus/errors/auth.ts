// import { ErrorCodes, HttpStatus } from '@/constants';
// import { CertusClientError } from './client';

// export class CertusAuthenticationError extends CertusClientError {
//   constructor(
//     message: string = 'Authentication failed',
//     code: string = ErrorCodes.AUTH_INVALID_CREDENTIALS,
//     statusCode: number = HttpStatus.UNAUTHORIZED,
//     context: Record<string, unknown> = {}
//   ) {
//     super(message, code, statusCode, context);
//     this.name = 'CertusAuthenticationError';
//   }
// }

// export class CertusInvalidCredentialsError extends CertusAuthenticationError {
//   constructor(message: string = 'Invalid credentials', context: Record<string, unknown> = {}) {
//     super(message, ErrorCodes.AUTH_INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED, context);
//     this.name = 'CertusInvalidCredentialsError';
//   }
// }

// export class CertusTokenExpiredError extends CertusAuthenticationError {
//   constructor(message: string = 'Token has expired', context: Record<string, unknown> = {}) {
//     super(message, ErrorCodes.AUTH_TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED, context);
//     this.name = 'CertusTokenExpiredError';
//   }
// }

// export class CertusInsufficientPermissionsError extends CertusClientError {
//   constructor(message: string = 'Insufficient permissions', context: Record<string, unknown> = {}) {
//     super(message, ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS, HttpStatus.FORBIDDEN, context);
//     this.name = 'CertusInsufficientPermissionsError';
//   }
// }

// export class CertusSessionRevokedError extends CertusAuthenticationError {
//   constructor(message: string = 'Session has been revoked', context: Record<string, unknown> = {}) {
//     super(message, ErrorCodes.AUTH_SESSION_REVOKED, HttpStatus.UNAUTHORIZED, context);
//     this.name = 'CertusSessionRevokedError';
//   }
// }

import { ErrorCodes, HttpStatus } from '@/constants';
import { CertusClientError } from './client';

/**
 * Base authentication error class for all authentication-related failures.
 * 
 * Extends CertusClientError to provide specialized error handling for authentication scenarios.
 * Represents generic authentication failures that don't fit more specific error categories.
 * 
 * @example
 * ```typescript
 * // Throw when authentication mechanism fails
 * throw new CertusAuthenticationError('Authentication provider unavailable');
 * 
 * // With additional context
 * throw new CertusAuthenticationError(
 *   'Multi-factor authentication required',
 *   ErrorCodes.AUTH_MFA_REQUIRED,
 *   HttpStatus.UNAUTHORIZED,
 *   { mfaType: 'totp' }
 * );
 * ```
 */
export class CertusAuthenticationError extends CertusClientError {
  /**
   * Creates a new CertusAuthenticationError instance.
   * 
   * @param {string} [message='Authentication failed'] - Human-readable error description
   * @param {string} [code=ErrorCodes.AUTH_INVALID_CREDENTIALS] - Machine-readable error code
   * @param {number} [statusCode=HttpStatus.UNAUTHORIZED] - HTTP status code (401 Unauthorized)
   * @param {Record<string, unknown>} [context={}] - Additional authentication context
   * 
   * @example
   * ```typescript
   * // Default authentication error
   * throw new CertusAuthenticationError();
   * 
   * // Custom authentication error
   * throw new CertusAuthenticationError(
   *   'Biometric authentication failed',
   *   ErrorCodes.AUTH_BIOMETRIC_FAILED,
   *   HttpStatus.UNAUTHORIZED,
   *   { device: 'fingerprint_scanner', attempts: 3 }
   * );
   * ```
   */
  constructor(
    message: string = 'Authentication failed',
    code: string = ErrorCodes.AUTH_INVALID_CREDENTIALS,
    statusCode: number = HttpStatus.UNAUTHORIZED,
    context: Record<string, unknown> = {}
  ) {
    super(message, code, statusCode, context);
    this.name = 'CertusAuthenticationError';
  }
}

/**
 * Error thrown when user credentials (username/password) are invalid or incorrect.
 * 
 * Used for cases where the provided credentials don't match any user account
 * or fail validation checks (e.g., password complexity requirements).
 * 
 * @example
 * ```typescript
 * // Validate user credentials
 * if (!await validateCredentials(username, password)) {
 *   throw new CertusInvalidCredentialsError(
 *     'Username or password is incorrect',
 *     { username, attemptCount: 3 }
 *   );
 * }
 * 
 * // With builder pattern
 * throw new CertusInvalidCredentialsError()
 *   .withContext({ ip: '192.168.1.1', userAgent: 'Mozilla/5.0' });
 * ```
 */
export class CertusInvalidCredentialsError extends CertusAuthenticationError {
  /**
   * Creates a new CertusInvalidCredentialsError instance.
   * 
   * @param {string} [message='Invalid credentials'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the credential failure
   * 
   * @example
   * ```typescript
   * // Basic invalid credentials
   * throw new CertusInvalidCredentialsError();
   * 
   * // With custom message and context
   * throw new CertusInvalidCredentialsError(
   *   'The password you entered is incorrect',
   *   { 
   *     userId: 'user_123',
   *     lockoutRemaining: 15, // minutes
   *     failedAttempts: 2 
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Invalid credentials', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.AUTH_INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED, context);
    this.name = 'CertusInvalidCredentialsError';
  }
}

/**
 * Error thrown when an authentication token (JWT, access token, etc.) has expired.
 * 
 * Indicates that the token was valid but is no longer acceptable due to expiration.
 * Clients should typically request a new token using refresh token mechanisms.
 * 
 * @example
 * ```typescript
 * // Check token expiration
 * if (token.expiresAt < Date.now()) {
 *   throw new CertusTokenExpiredError(
 *     'Your session has expired. Please log in again.',
 *     { tokenId: token.id, expiredAt: token.expiresAt }
 *   );
 * }
 * 
 * // In token validation middleware
 * try {
 *   verifyToken(accessToken);
 * } catch (error) {
 *   if (error.name === 'TokenExpiredError') {
 *     throw new CertusTokenExpiredError()
 *       .withContext({ tokenType: 'access_token' });
 *   }
 * }
 * ```
 */
export class CertusTokenExpiredError extends CertusAuthenticationError {
  /**
   * Creates a new CertusTokenExpiredError instance.
   * 
   * @param {string} [message='Token has expired'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the token expiration
   * 
   * @example
   * ```typescript
   * // Default token expired error
   * throw new CertusTokenExpiredError();
   * 
   * // With detailed context
   * throw new CertusTokenExpiredError(
   *   'Refresh token has expired',
   *   {
   *     tokenType: 'refresh_token',
   *     issuedAt: '2023-01-01T00:00:00Z',
   *     expiredAt: '2023-01-31T23:59:59Z',
   *     currentTime: '2023-02-01T10:30:00Z'
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Token has expired', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.AUTH_TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED, context);
    this.name = 'CertusTokenExpiredError';
  }
}

/**
 * Error thrown when a user lacks sufficient permissions to perform an action.
 * 
 * Represents authorization failures where the user is authenticated but doesn't have
 * the required permissions, roles, or access levels for the requested operation.
 * Returns HTTP 403 Forbidden status code.
 * 
 * @example
 * ```typescript
 * // Check user permissions
 * if (!user.hasPermission('delete_users')) {
 *   throw new CertusInsufficientPermissionsError(
 *     'You do not have permission to delete users',
 *     { 
 *       requiredPermission: 'delete_users',
 *       userPermissions: user.permissions,
 *       resource: 'users'
 *     }
   *   );
 * }
 * 
 * // Role-based access control
 * if (user.role !== 'admin') {
 *   throw new CertusInsufficientPermissionsError(
 *     'Admin role required to access this resource'
 *   );
 * }
 * ```
 */
export class CertusInsufficientPermissionsError extends CertusClientError {
  /**
   * Creates a new CertusInsufficientPermissionsError instance.
   * 
   * @param {string} [message='Insufficient permissions'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the permission failure
   * 
   * @example
   * ```typescript
   * // Basic insufficient permissions
   * throw new CertusInsufficientPermissionsError();
   * 
   * // With detailed permission context
   * throw new CertusInsufficientPermissionsError(
   *   'Cannot access billing information',
   *   {
   *     userId: 'user_123',
   *     action: 'read',
   *     resource: 'billing',
   *     requiredRole: 'account_owner',
   *     userRole: 'team_member'
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Insufficient permissions', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS, HttpStatus.FORBIDDEN, context);
    this.name = 'CertusInsufficientPermissionsError';
  }
}

/**
 * Error thrown when a user's session has been explicitly revoked or invalidated.
 * 
 * Indicates that the session was previously valid but has been manually terminated
 * by the user, administrator, or system (e.g., due to security concerns, logout from other device).
 * 
 * @example
 * ```typescript
 * // Check session status
 * const session = await getSession(sessionId);
 * if (session.revoked) {
 *   throw new CertusSessionRevokedError(
 *     'This session was terminated by the user',
 *     { 
 *       sessionId,
 *       revokedAt: session.revokedAt,
 *       revokedBy: session.revokedBy 
 *     }
 *   );
 * }
 * 
 * // In authentication middleware
 * if (await isSessionRevoked(token.sessionId)) {
 *   throw new CertusSessionRevokedError()
 *     .withContext({ reason: 'user_logged_out' });
 * }
 * ```
 */
export class CertusSessionRevokedError extends CertusAuthenticationError {
  /**
   * Creates a new CertusSessionRevokedError instance.
   * 
   * @param {string} [message='Session has been revoked'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the session revocation
   * 
   * @example
   * ```typescript
   * // Default session revoked error
   * throw new CertusSessionRevokedError();
   * 
   * // With revocation details
   * throw new CertusSessionRevokedError(
   *   'Your account was logged out from another device',
   *   {
   *     sessionId: 'sess_abc123',
   *     revokedAt: '2023-01-15T14:30:00Z',
   *     revokedBy: 'user_action',
   *     device: 'Mobile App - iPhone'
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Session has been revoked', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.AUTH_SESSION_REVOKED, HttpStatus.UNAUTHORIZED, context);
    this.name = 'CertusSessionRevokedError';
  }
}