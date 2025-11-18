/**
 * Comprehensive error code constants for the CertusAdiValt system.
 *
 * Organized by domain/category with consistent naming conventions.
 * Each error code represents a specific error scenario that can occur
 * throughout the application, enabling consistent error handling and monitoring.
 *
 * @namespace ErrorCodes
 *
 * @example
 * ```typescript
 * // Using error codes in error creation
 * throw new CertusAuthenticationError(
 *   'Invalid credentials',
 *   ErrorCodes.AUTH_INVALID_CREDENTIALS,
 *   HttpStatus.UNAUTHORIZED
 * );
 *
 * // Error code type checking
 * function handleError(code: ErrorCodeType) {
 *   if (code.startsWith('AUTH_')) {
 *     // Handle authentication errors
 *   } else if (code.startsWith('VAL_')) {
 *     // Handle validation errors
 *   }
 * }
 * ```
 */
export const ErrorCodes = {
  // Authentication & Authorization (AUTH_*)

  /**
   * Invalid username, password, or credentials provided
   */
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',

  /**
   * Authentication token has expired and is no longer valid
   */
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',

  /**
   * Authentication token is malformed or cannot be verified
   */
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',

  /**
   * Authentication token is required but not provided
   */
  AUTH_TOKEN_REQUIRED: 'AUTH_TOKEN_REQUIRED',

  /**
   * User lacks required permissions for the requested operation
   */
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_INSUFFICIENT_PERMISSIONS',

  /**
   * User session has expired due to inactivity
   */
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',

  /**
   * User session has been manually revoked or terminated
   */
  AUTH_SESSION_REVOKED: 'AUTH_SESSION_REVOKED',

  /**
   * Referenced session cannot be found in the system
   */
  AUTH_SESSION_NOT_FOUND: 'AUTH_SESSION_NOT_FOUND',

  /**
   * Generic unauthorized access attempt
   */
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',

  /**
   * Account temporarily locked due to security policies
   */
  AUTH_ACCOUNT_LOCKED: 'AUTH_ACCOUNT_LOCKED',

  /**
   * Account has been permanently disabled
   */
  AUTH_ACCOUNT_DISABLED: 'AUTH_ACCOUNT_DISABLED',

  /**
   * Account awaiting activation or approval
   */
  AUTH_ACCOUNT_PENDING: 'AUTH_ACCOUNT_PENDING',

  /**
   * Password reset required before accessing the system
   */
  AUTH_PASSWORD_RESET_REQUIRED: 'AUTH_PASSWORD_RESET_REQUIRED',

  /**
   * Multi-factor authentication required for this operation
   */
  AUTH_MFA_REQUIRED: 'AUTH_MFA_REQUIRED',

  /**
   * Invalid or expired multi-factor authentication code
   */
  AUTH_MFA_INVALID: 'AUTH_MFA_INVALID',

  /**
   * OAuth authentication flow failed
   */
  AUTH_OAUTH_ERROR: 'AUTH_OAUTH_ERROR',

  /**
   * Authentication provider encountered an error
   */
  AUTH_PROVIDER_ERROR: 'AUTH_PROVIDER_ERROR',

  /**
   * Refresh token has expired and cannot be used
   */
  AUTH_REFRESH_TOKEN_EXPIRED: 'AUTH_REFRESH_TOKEN_EXPIRED',

  /**
   * Refresh token is invalid or has been revoked
   */
  AUTH_REFRESH_TOKEN_INVALID: 'AUTH_REFRESH_TOKEN_INVALID',

  /**
   * Email address verification required
   */
  AUTH_EMAIL_NOT_VERIFIED: 'AUTH_EMAIL_NOT_VERIFIED',

  /**
   * Phone number verification required
   */
  AUTH_PHONE_NOT_VERIFIED: 'AUTH_PHONE_NOT_VERIFIED',

  /**
   * Too many authentication attempts from this source
   */
  AUTH_RATE_LIMIT_EXCEEDED: 'AUTH_RATE_LIMIT_EXCEEDED',

  // Validation (VAL_*)

  /**
   * General input validation failure
   */
  VAL_INVALID_INPUT: 'VAL_INVALID_INPUT',

  /**
   * Data does not conform to expected schema
   */
  VAL_SCHEMA_ERROR: 'VAL_SCHEMA_ERROR',

  /**
   * Business rule or domain constraint violation
   */
  VAL_BUSINESS_RULE: 'VAL_BUSINESS_RULE',

  /**
   * Required field is missing or empty
   */
  VAL_REQUIRED_FIELD: 'VAL_REQUIRED_FIELD',

  /**
   * Data format does not match expected pattern
   */
  VAL_INVALID_FORMAT: 'VAL_INVALID_FORMAT',

  /**
   * Email address format is invalid
   */
  VAL_INVALID_EMAIL: 'VAL_INVALID_EMAIL',

  /**
   * Phone number format is invalid
   */
  VAL_INVALID_PHONE: 'VAL_INVALID_PHONE',

  /**
   * Date format or value is invalid
   */
  VAL_INVALID_DATE: 'VAL_INVALID_DATE',

  /**
   * URL format is invalid
   */
  VAL_INVALID_URL: 'VAL_INVALID_URL',

  /**
   * UUID format is invalid
   */
  VAL_INVALID_UUID: 'VAL_INVALID_UUID',

  /**
   * String value is shorter than minimum allowed length
   */
  VAL_STRING_TOO_SHORT: 'VAL_STRING_TOO_SHORT',

  /**
   * String value exceeds maximum allowed length
   */
  VAL_STRING_TOO_LONG: 'VAL_STRING_TOO_LONG',

  /**
   * Numeric value is below minimum allowed value
   */
  VAL_NUMBER_TOO_SMALL: 'VAL_NUMBER_TOO_SMALL',

  /**
   * Numeric value exceeds maximum allowed value
   */
  VAL_NUMBER_TOO_LARGE: 'VAL_NUMBER_TOO_LARGE',

  /**
   * Array has fewer items than minimum required
   */
  VAL_ARRAY_TOO_SHORT: 'VAL_ARRAY_TOO_SHORT',

  /**
   * Array has more items than maximum allowed
   */
  VAL_ARRAY_TOO_LONG: 'VAL_ARRAY_TOO_LONG',

  /**
   * Value is not among the allowed choices
   */
  VAL_INVALID_CHOICE: 'VAL_INVALID_CHOICE',

  /**
   * Value violates unique constraint
   */
  VAL_UNIQUE_CONSTRAINT: 'VAL_UNIQUE_CONSTRAINT',

  /**
   * Value violates foreign key constraint
   */
  VAL_FOREIGN_KEY_CONSTRAINT: 'VAL_FOREIGN_KEY_CONSTRAINT',

  // Database (DB_*)

  /**
   * Cannot establish connection to database
   */
  DB_CONNECTION_ERROR: 'DB_CONNECTION_ERROR',

  /**
   * Database unique constraint violation
   */
  DB_UNIQUE_CONSTRAINT: 'DB_UNIQUE_CONSTRAINT',

  /**
   * Database foreign key constraint violation
   */
  DB_FOREIGN_KEY_CONSTRAINT: 'DB_FOREIGN_KEY_CONSTRAINT',

  /**
   * Database operation timed out
   */
  DB_TIMEOUT_ERROR: 'DB_TIMEOUT_ERROR',

  /**
   * Database query execution failed
   */
  DB_QUERY_ERROR: 'DB_QUERY_ERROR',

  /**
   * Database transaction failed
   */
  DB_TRANSACTION_ERROR: 'DB_TRANSACTION_ERROR',

  /**
   * Requested record not found in database
   */
  DB_RECORD_NOT_FOUND: 'DB_RECORD_NOT_FOUND',

  /**
   * Attempt to create duplicate database entry
   */
  DB_DUPLICATE_ENTRY: 'DB_DUPLICATE_ENTRY',

  /**
   * Database deadlock detected
   */
  DB_DEADLOCK_ERROR: 'DB_DEADLOCK_ERROR',

  /**
   * Database connection limit reached
   */
  DB_CONNECTION_LIMIT: 'DB_CONNECTION_LIMIT',

  /**
   * Database migration script failed
   */
  DB_MIGRATION_ERROR: 'DB_MIGRATION_ERROR',

  /**
   * Database backup operation failed
   */
  DB_BACKUP_ERROR: 'DB_BACKUP_ERROR',

  // File & Storage (FILE_*)

  /**
   * File upload operation failed
   */
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',

  /**
   * File download operation failed
   */
  FILE_DOWNLOAD_ERROR: 'FILE_DOWNLOAD_ERROR',

  /**
   * File deletion operation failed
   */
  FILE_DELETE_ERROR: 'FILE_DELETE_ERROR',

  /**
   * Requested file not found in storage
   */
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',

  /**
   * File size exceeds allowed limit
   */
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',

  /**
   * File type is not allowed
   */
  FILE_INVALID_TYPE: 'FILE_INVALID_TYPE',

  /**
   * File name contains invalid characters or format
   */
  FILE_INVALID_NAME: 'FILE_INVALID_NAME',

  /**
   * Storage quota or limit exceeded
   */
  FILE_STORAGE_LIMIT: 'FILE_STORAGE_LIMIT',

  /**
   * File is corrupted or cannot be read
   */
  FILE_CORRUPTED: 'FILE_CORRUPTED',

  /**
   * Insufficient permissions to access the file
   */
  FILE_PERMISSION_DENIED: 'FILE_PERMISSION_DENIED',

  // Server & Infrastructure (SRV_*)

  /**
   * Generic internal server error
   */
  SRV_INTERNAL_ERROR: 'SRV_INTERNAL_ERROR',

  /**
   * External service or API call failed
   */
  SRV_EXTERNAL_SERVICE: 'SRV_EXTERNAL_SERVICE',

  /**
   * Server configuration error or misconfiguration
   */
  SRV_CONFIGURATION_ERROR: 'SRV_CONFIGURATION_ERROR',

  /**
   * Data encryption operation failed
   */
  SRV_ENCRYPTION_ERROR: 'SRV_ENCRYPTION_ERROR',

  /**
   * Data decryption operation failed
   */
  SRV_DECRYPTION_ERROR: 'SRV_DECRYPTION_ERROR',

  /**
   * Rate limit exceeded for server operation
   */
  SRV_RATE_LIMIT: 'SRV_RATE_LIMIT',

  /**
   * Server is in maintenance mode
   */
  SRV_MAINTENANCE_MODE: 'SRV_MAINTENANCE_MODE',

  /**
   * Server service temporarily unavailable
   */
  SRV_SERVICE_UNAVAILABLE: 'SRV_SERVICE_UNAVAILABLE',

  /**
   * Server memory limit exceeded
   */
  SRV_MEMORY_LIMIT: 'SRV_MEMORY_LIMIT',

  /**
   * Server CPU limit exceeded
   */
  SRV_CPU_LIMIT: 'SRV_CPU_LIMIT',

  /**
   * Server disk space limit exceeded
   */
  SRV_DISK_SPACE: 'SRV_DISK_SPACE',

  // Network & Communication (NET_*)

  /**
   * Generic network communication error
   */
  NET_NETWORK_ERROR: 'NET_NETWORK_ERROR',

  /**
   * Network connection timeout
   */
  NET_CONNECTION_TIMEOUT: 'NET_CONNECTION_TIMEOUT',

  /**
   * DNS resolution failed
   */
  NET_DNS_ERROR: 'NET_DNS_ERROR',

  /**
   * SSL/TLS handshake or certificate error
   */
  NET_SSL_ERROR: 'NET_SSL_ERROR',

  /**
   * Proxy server connection or configuration error
   */
  NET_PROXY_ERROR: 'NET_PROXY_ERROR',

  /**
   * Request blocked by firewall or security policy
   */
  NET_FIREWALL_BLOCKED: 'NET_FIREWALL_BLOCKED',

  // Payment & Billing (PAY_*)

  /**
   * Payment processing failed
   */
  PAY_PAYMENT_FAILED: 'PAY_PAYMENT_FAILED',

  /**
   * Insufficient funds for payment
   */
  PAY_INSUFFICIENT_FUNDS: 'PAY_INSUFFICIENT_FUNDS',

  /**
   * Card was declined by issuer
   */
  PAY_CARD_DECLINED: 'PAY_CARD_DECLINED',

  /**
   * Invalid card details provided
   */
  PAY_INVALID_CARD: 'PAY_INVALID_CARD',

  /**
   * Card has expired
   */
  PAY_EXPIRED_CARD: 'PAY_EXPIRED_CARD',

  /**
   * Payment processor encountered an error
   */
  PAY_PROCESSOR_ERROR: 'PAY_PROCESSOR_ERROR',

  /**
   * Refund operation failed
   */
  PAY_REFUND_FAILED: 'PAY_REFUND_FAILED',

  /**
   * Subscription has expired
   */
  PAY_SUBSCRIPTION_EXPIRED: 'PAY_SUBSCRIPTION_EXPIRED',

  /**
   * Requested invoice not found
   */
  PAY_INVOICE_NOT_FOUND: 'PAY_INVOICE_NOT_FOUND',

  // Notification & Email (NOTIF_*)

  /**
   * Email delivery failed
   */
  NOTIF_EMAIL_FAILED: 'NOTIF_EMAIL_FAILED',

  /**
   * SMS delivery failed
   */
  NOTIF_SMS_FAILED: 'NOTIF_SMS_FAILED',

  /**
   * Push notification delivery failed
   */
  NOTIF_PUSH_FAILED: 'NOTIF_PUSH_FAILED',

  /**
   * Notification template not found
   */
  NOTIF_TEMPLATE_NOT_FOUND: 'NOTIF_TEMPLATE_NOT_FOUND',

  /**
   * Notification rate limit exceeded
   */
  NOTIF_RATE_LIMIT: 'NOTIF_RATE_LIMIT',

  /**
   * Notification provider error
   */
  NOTIF_PROVIDER_ERROR: 'NOTIF_PROVIDER_ERROR',

  // Generic (GEN_*)

  /**
   * Generic validation error
   */
  GEN_VALIDATION_ERROR: 'GEN_VALIDATION_ERROR',

  /**
   * Generic resource not found error
   */
  GEN_NOT_FOUND: 'GEN_NOT_FOUND',

  /**
   * Generic timeout error
   */
  GEN_TIMEOUT: 'GEN_TIMEOUT',

  /**
   * Generic network error
   */
  GEN_NETWORK_ERROR: 'GEN_NETWORK_ERROR',

  /**
   * Generic service error
   */
  GEN_SERVICE_ERROR: 'GEN_SERVICE_ERROR',

  /**
   * Unknown or unclassified error
   */
  GEN_UNKNOWN_ERROR: 'GEN_UNKNOWN_ERROR',

  /**
   * Generic forbidden access error
   */
  GEN_FORBIDDEN: 'GEN_FORBIDDEN',

  /**
   * Generic unauthorized access error
   */
  GEN_UNAUTHORIZED: 'GEN_UNAUTHORIZED',

  /**
   * Generic bad request error
   */
  GEN_BAD_REQUEST: 'GEN_BAD_REQUEST',

  /**
   * Generic conflict error
   */
  GEN_CONFLICT: 'GEN_CONFLICT',
} as const;

/**
 * Union type of all possible error codes in the system.
 *
 * Enables type-safe usage of error codes throughout the application
 * and provides autocomplete support in IDEs.
 *
 * @example
 * ```typescript
 * function handleError(code: ErrorCodeType) {
 *   switch (code) {
 *     case ErrorCodes.AUTH_INVALID_CREDENTIALS:
 *       // Handle invalid credentials
 *       break;
 *     case ErrorCodes.VAL_INVALID_EMAIL:
 *       // Handle invalid email
 *       break;
 *     default:
 *       // Handle other error codes
 *   }
 * }
 *
 * // Type-safe error code assignment
 * const errorCode: ErrorCodeType = ErrorCodes.DB_CONNECTION_ERROR;
 * ```
 */
export type ErrorCodeType = (typeof ErrorCodes)[keyof typeof ErrorCodes];
