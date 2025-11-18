import { ErrorCodes } from './error-codes';

/**
 * User-friendly error messages mapped to error codes for consistent user communication.
 *
 * Provides human-readable, user-friendly messages for each error code that can be
 * safely displayed to end-users. Messages are designed to be clear, actionable,
 * and avoid exposing sensitive technical details.
 *
 * @namespace ErrorMessages
 *
 * @example
 * ```typescript
 * // Get user-friendly error message
 * const error = new CertusAuthenticationError(
 *   ErrorMessages[ErrorCodes.AUTH_INVALID_CREDENTIALS],
 *   ErrorCodes.AUTH_INVALID_CREDENTIALS,
 *   HttpStatus.UNAUTHORIZED
 * );
 *
 * // Display error to user
 * function showErrorMessage(error: CertusAdiValtError) {
 *   const userMessage = ErrorMessages[error.code] || ErrorMessages[ErrorCodes.GEN_UNKNOWN_ERROR];
 *   displayNotification(userMessage, 'error');
 * }
 *
 * // Internationalization ready
 * function getLocalizedErrorMessage(code: ErrorCodeType, locale: string): string {
 *   const defaultMessage = ErrorMessages[code];
 *   return i18n.t(`errors.${code}`, { defaultValue: defaultMessage, locale });
 * }
 * ```
 */
export const ErrorMessages = {
  // Authentication & Authorization Messages

  /**
   * User-friendly message for invalid credentials
   */
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',

  /**
   * User-friendly message for expired authentication tokens
   */
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: 'Authentication token has expired',

  /**
   * User-friendly message for invalid authentication tokens
   */
  [ErrorCodes.AUTH_INVALID_TOKEN]: 'Invalid authentication token',

  /**
   * User-friendly message when authentication token is required but not provided
   */
  [ErrorCodes.AUTH_TOKEN_REQUIRED]: 'Authentication token is required',

  /**
   * User-friendly message for insufficient permissions
   */
  [ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions to access this resource',

  /**
   * User-friendly message for expired sessions
   */
  [ErrorCodes.AUTH_SESSION_EXPIRED]: 'Session has expired',

  /**
   * User-friendly message for revoked sessions
   */
  [ErrorCodes.AUTH_SESSION_REVOKED]: 'Session has been revoked',

  /**
   * User-friendly message when session is not found
   */
  [ErrorCodes.AUTH_SESSION_NOT_FOUND]: 'Session not found',

  /**
   * User-friendly message for unauthorized access attempts
   */
  [ErrorCodes.AUTH_UNAUTHORIZED]: 'Unauthorized access',

  /**
   * User-friendly message for locked accounts
   */
  [ErrorCodes.AUTH_ACCOUNT_LOCKED]: 'Account has been locked due to multiple failed attempts',

  /**
   * User-friendly message for disabled accounts
   */
  [ErrorCodes.AUTH_ACCOUNT_DISABLED]: 'Account has been disabled',

  /**
   * User-friendly message for pending account activation
   */
  [ErrorCodes.AUTH_ACCOUNT_PENDING]: 'Account is pending activation',

  /**
   * User-friendly message when password reset is required
   */
  [ErrorCodes.AUTH_PASSWORD_RESET_REQUIRED]: 'Password reset required',

  /**
   * User-friendly message when multi-factor authentication is required
   */
  [ErrorCodes.AUTH_MFA_REQUIRED]: 'Multi-factor authentication required',

  /**
   * User-friendly message for invalid MFA codes
   */
  [ErrorCodes.AUTH_MFA_INVALID]: 'Invalid multi-factor authentication code',

  /**
   * User-friendly message for OAuth authentication failures
   */
  [ErrorCodes.AUTH_OAUTH_ERROR]: 'OAuth authentication failed',

  /**
   * User-friendly message for authentication provider errors
   */
  [ErrorCodes.AUTH_PROVIDER_ERROR]: 'Authentication provider error',

  /**
   * User-friendly message for expired refresh tokens
   */
  [ErrorCodes.AUTH_REFRESH_TOKEN_EXPIRED]: 'Refresh token has expired',

  /**
   * User-friendly message for invalid refresh tokens
   */
  [ErrorCodes.AUTH_REFRESH_TOKEN_INVALID]: 'Invalid refresh token',

  /**
   * User-friendly message when email verification is required
   */
  [ErrorCodes.AUTH_EMAIL_NOT_VERIFIED]: 'Email address not verified',

  /**
   * User-friendly message when phone verification is required
   */
  [ErrorCodes.AUTH_PHONE_NOT_VERIFIED]: 'Phone number not verified',

  /**
   * User-friendly message for authentication rate limiting
   */
  [ErrorCodes.AUTH_RATE_LIMIT_EXCEEDED]: 'Too many authentication attempts',

  // Validation Messages

  /**
   * User-friendly message for general invalid input
   */
  [ErrorCodes.VAL_INVALID_INPUT]: 'Invalid input provided',

  /**
   * User-friendly message for schema validation failures
   */
  [ErrorCodes.VAL_SCHEMA_ERROR]: 'Data validation failed',

  /**
   * User-friendly message for business rule violations
   */
  [ErrorCodes.VAL_BUSINESS_RULE]: 'Business rule violation',

  /**
   * User-friendly message for required field validation
   */
  [ErrorCodes.VAL_REQUIRED_FIELD]: 'This field is required',

  /**
   * User-friendly message for invalid format
   */
  [ErrorCodes.VAL_INVALID_FORMAT]: 'Invalid format',

  /**
   * User-friendly message for invalid email addresses
   */
  [ErrorCodes.VAL_INVALID_EMAIL]: 'Invalid email address',

  /**
   * User-friendly message for invalid phone numbers
   */
  [ErrorCodes.VAL_INVALID_PHONE]: 'Invalid phone number',

  /**
   * User-friendly message for invalid date formats
   */
  [ErrorCodes.VAL_INVALID_DATE]: 'Invalid date format',

  /**
   * User-friendly message for invalid URL formats
   */
  [ErrorCodes.VAL_INVALID_URL]: 'Invalid URL format',

  /**
   * User-friendly message for invalid UUID formats
   */
  [ErrorCodes.VAL_INVALID_UUID]: 'Invalid UUID format',

  /**
   * User-friendly message for string length validation (too short)
   */
  [ErrorCodes.VAL_STRING_TOO_SHORT]: 'Text is too short',

  /**
   * User-friendly message for string length validation (too long)
   */
  [ErrorCodes.VAL_STRING_TOO_LONG]: 'Text is too long',

  /**
   * User-friendly message for number range validation (too small)
   */
  [ErrorCodes.VAL_NUMBER_TOO_SMALL]: 'Number is too small',

  /**
   * User-friendly message for number range validation (too large)
   */
  [ErrorCodes.VAL_NUMBER_TOO_LARGE]: 'Number is too large',

  /**
   * User-friendly message for array length validation (too few items)
   */
  [ErrorCodes.VAL_ARRAY_TOO_SHORT]: 'Too few items',

  /**
   * User-friendly message for array length validation (too many items)
   */
  [ErrorCodes.VAL_ARRAY_TOO_LONG]: 'Too many items',

  /**
   * User-friendly message for invalid choice selection
   */
  [ErrorCodes.VAL_INVALID_CHOICE]: 'Invalid selection',

  /**
   * User-friendly message for unique constraint violations
   */
  [ErrorCodes.VAL_UNIQUE_CONSTRAINT]: 'Value must be unique',

  /**
   * User-friendly message for foreign key constraint violations
   */
  [ErrorCodes.VAL_FOREIGN_KEY_CONSTRAINT]: 'Referenced resource not found',

  // Database Messages

  /**
   * User-friendly message for database connection failures
   */
  [ErrorCodes.DB_CONNECTION_ERROR]: 'Database connection failed',

  /**
   * User-friendly message for unique constraint violations
   */
  [ErrorCodes.DB_UNIQUE_CONSTRAINT]: 'Duplicate entry found',

  /**
   * User-friendly message for foreign key constraint violations
   */
  [ErrorCodes.DB_FOREIGN_KEY_CONSTRAINT]: 'Referenced record not found',

  /**
   * User-friendly message for database operation timeouts
   */
  [ErrorCodes.DB_TIMEOUT_ERROR]: 'Database operation timed out',

  /**
   * User-friendly message for database query failures
   */
  [ErrorCodes.DB_QUERY_ERROR]: 'Database query failed',

  /**
   * User-friendly message for database transaction failures
   */
  [ErrorCodes.DB_TRANSACTION_ERROR]: 'Database transaction failed',

  /**
   * User-friendly message when database records are not found
   */
  [ErrorCodes.DB_RECORD_NOT_FOUND]: 'Record not found',

  /**
   * User-friendly message for duplicate entry attempts
   */
  [ErrorCodes.DB_DUPLICATE_ENTRY]: 'Duplicate entry not allowed',

  /**
   * User-friendly message for database deadlocks
   */
  [ErrorCodes.DB_DEADLOCK_ERROR]: 'Database deadlock detected',

  /**
   * User-friendly message for database connection limits
   */
  [ErrorCodes.DB_CONNECTION_LIMIT]: 'Database connection limit reached',

  /**
   * User-friendly message for database migration failures
   */
  [ErrorCodes.DB_MIGRATION_ERROR]: 'Database migration failed',

  /**
   * User-friendly message for database backup failures
   */
  [ErrorCodes.DB_BACKUP_ERROR]: 'Database backup failed',

  // File & Storage Messages

  /**
   * User-friendly message for file upload failures
   */
  [ErrorCodes.FILE_UPLOAD_ERROR]: 'File upload failed',

  /**
   * User-friendly message for file download failures
   */
  [ErrorCodes.FILE_DOWNLOAD_ERROR]: 'File download failed',

  /**
   * User-friendly message for file deletion failures
   */
  [ErrorCodes.FILE_DELETE_ERROR]: 'File deletion failed',

  /**
   * User-friendly message when files are not found
   */
  [ErrorCodes.FILE_NOT_FOUND]: 'File not found',

  /**
   * User-friendly message for oversized files
   */
  [ErrorCodes.FILE_TOO_LARGE]: 'File size exceeds limit',

  /**
   * User-friendly message for invalid file types
   */
  [ErrorCodes.FILE_INVALID_TYPE]: 'File type not allowed',

  /**
   * User-friendly message for invalid file names
   */
  [ErrorCodes.FILE_INVALID_NAME]: 'Invalid file name',

  /**
   * User-friendly message for storage limit exceeded
   */
  [ErrorCodes.FILE_STORAGE_LIMIT]: 'Storage limit exceeded',

  /**
   * User-friendly message for corrupted files
   */
  [ErrorCodes.FILE_CORRUPTED]: 'File is corrupted',

  /**
   * User-friendly message for file permission issues
   */
  [ErrorCodes.FILE_PERMISSION_DENIED]: 'File access denied',

  // Server & Infrastructure Messages

  /**
   * User-friendly message for internal server errors
   */
  [ErrorCodes.SRV_INTERNAL_ERROR]: 'Internal server error',

  /**
   * User-friendly message for external service failures
   */
  [ErrorCodes.SRV_EXTERNAL_SERVICE]: 'External service unavailable',

  /**
   * User-friendly message for server configuration errors
   */
  [ErrorCodes.SRV_CONFIGURATION_ERROR]: 'Server configuration error',

  /**
   * User-friendly message for encryption failures
   */
  [ErrorCodes.SRV_ENCRYPTION_ERROR]: 'Encryption failed',

  /**
   * User-friendly message for decryption failures
   */
  [ErrorCodes.SRV_DECRYPTION_ERROR]: 'Decryption failed',

  /**
   * User-friendly message for rate limiting
   */
  [ErrorCodes.SRV_RATE_LIMIT]: 'Rate limit exceeded',

  /**
   * User-friendly message for maintenance mode
   */
  [ErrorCodes.SRV_MAINTENANCE_MODE]: 'Service under maintenance',

  /**
   * User-friendly message for service unavailability
   */
  [ErrorCodes.SRV_SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',

  /**
   * User-friendly message for memory limit exceeded
   */
  [ErrorCodes.SRV_MEMORY_LIMIT]: 'Memory limit exceeded',

  /**
   * User-friendly message for CPU limit exceeded
   */
  [ErrorCodes.SRV_CPU_LIMIT]: 'CPU limit exceeded',

  /**
   * User-friendly message for insufficient disk space
   */
  [ErrorCodes.SRV_DISK_SPACE]: 'Disk space insufficient',

  // Network & Communication Messages

  /**
   * User-friendly message for network connection failures
   */
  [ErrorCodes.NET_NETWORK_ERROR]: 'Network connection failed',

  /**
   * User-friendly message for connection timeouts
   */
  [ErrorCodes.NET_CONNECTION_TIMEOUT]: 'Connection timeout',

  /**
   * User-friendly message for DNS resolution failures
   */
  [ErrorCodes.NET_DNS_ERROR]: 'DNS resolution failed',

  /**
   * User-friendly message for SSL certificate errors
   */
  [ErrorCodes.NET_SSL_ERROR]: 'SSL certificate error',

  /**
   * User-friendly message for proxy connection failures
   */
  [ErrorCodes.NET_PROXY_ERROR]: 'Proxy connection failed',

  /**
   * User-friendly message for firewall blocks
   */
  [ErrorCodes.NET_FIREWALL_BLOCKED]: 'Connection blocked by firewall',

  // Payment & Billing Messages

  /**
   * User-friendly message for payment processing failures
   */
  [ErrorCodes.PAY_PAYMENT_FAILED]: 'Payment processing failed',

  /**
   * User-friendly message for insufficient funds
   */
  [ErrorCodes.PAY_INSUFFICIENT_FUNDS]: 'Insufficient funds',

  /**
   * User-friendly message for declined cards
   */
  [ErrorCodes.PAY_CARD_DECLINED]: 'Card declined',

  /**
   * User-friendly message for invalid card details
   */
  [ErrorCodes.PAY_INVALID_CARD]: 'Invalid card details',

  /**
   * User-friendly message for expired cards
   */
  [ErrorCodes.PAY_EXPIRED_CARD]: 'Card has expired',

  /**
   * User-friendly message for payment processor errors
   */
  [ErrorCodes.PAY_PROCESSOR_ERROR]: 'Payment processor error',

  /**
   * User-friendly message for refund failures
   */
  [ErrorCodes.PAY_REFUND_FAILED]: 'Refund failed',

  /**
   * User-friendly message for expired subscriptions
   */
  [ErrorCodes.PAY_SUBSCRIPTION_EXPIRED]: 'Subscription has expired',

  /**
   * User-friendly message when invoices are not found
   */
  [ErrorCodes.PAY_INVOICE_NOT_FOUND]: 'Invoice not found',

  // Notification & Email Messages

  /**
   * User-friendly message for email delivery failures
   */
  [ErrorCodes.NOTIF_EMAIL_FAILED]: 'Email sending failed',

  /**
   * User-friendly message for SMS delivery failures
   */
  [ErrorCodes.NOTIF_SMS_FAILED]: 'SMS sending failed',

  /**
   * User-friendly message for push notification failures
   */
  [ErrorCodes.NOTIF_PUSH_FAILED]: 'Push notification failed',

  /**
   * User-friendly message when notification templates are not found
   */
  [ErrorCodes.NOTIF_TEMPLATE_NOT_FOUND]: 'Notification template not found',

  /**
   * User-friendly message for notification rate limiting
   */
  [ErrorCodes.NOTIF_RATE_LIMIT]: 'Notification rate limit exceeded',

  /**
   * User-friendly message for notification provider errors
   */
  [ErrorCodes.NOTIF_PROVIDER_ERROR]: 'Notification service error',

  // Generic Messages

  /**
   * User-friendly message for general validation failures
   */
  [ErrorCodes.GEN_VALIDATION_ERROR]: 'Validation failed',

  /**
   * User-friendly message when resources are not found
   */
  [ErrorCodes.GEN_NOT_FOUND]: 'Resource not found',

  /**
   * User-friendly message for operation timeouts
   */
  [ErrorCodes.GEN_TIMEOUT]: 'Operation timed out',

  /**
   * User-friendly message for network errors
   */
  [ErrorCodes.GEN_NETWORK_ERROR]: 'Network error occurred',

  /**
   * User-friendly message for service errors
   */
  [ErrorCodes.GEN_SERVICE_ERROR]: 'Service error occurred',

  /**
   * User-friendly message for unknown errors
   */
  [ErrorCodes.GEN_UNKNOWN_ERROR]: 'An unknown error occurred',

  /**
   * User-friendly message for forbidden access
   */
  [ErrorCodes.GEN_FORBIDDEN]: 'Access forbidden',

  /**
   * User-friendly message for unauthorized access
   */
  [ErrorCodes.GEN_UNAUTHORIZED]: 'Unauthorized access',

  /**
   * User-friendly message for bad requests
   */
  [ErrorCodes.GEN_BAD_REQUEST]: 'Bad request',

  /**
   * User-friendly message for resource conflicts
   */
  [ErrorCodes.GEN_CONFLICT]: 'Resource conflict',
} as const;

/**
 * Success messages for positive user feedback and confirmation.
 *
 * Provides consistent, user-friendly success messages for various operations
 * that can be displayed to end-users to confirm successful actions.
 *
 * @namespace SuccessMessages
 *
 * @example
 * ```typescript
 * // Display success message to user
 * function showSuccessMessage(type: keyof typeof SuccessMessages) {
 *   displayNotification(SuccessMessages[type], 'success');
 * }
 *
 * // API success response
 * return response.status(HttpStatus.OK).json({
 *   success: true,
 *   message: SuccessMessages.OPERATION_SUCCESSFUL,
 *   data: result
 * });
 * ```
 */
export const SuccessMessages = {
  /**
   * Generic success message for completed operations
   */
  OPERATION_SUCCESSFUL: 'Operation completed successfully',

  /**
   * Success message for user login
   */
  LOGIN_SUCCESSFUL: 'Login successful',

  /**
   * Success message for user logout
   */
  LOGOUT_SUCCESSFUL: 'Logout successful',

  /**
   * Success message for user registration
   */
  REGISTRATION_SUCCESSFUL: 'Registration successful',

  /**
   * Success message for password reset
   */
  PASSWORD_RESET_SUCCESSFUL: 'Password reset successful',

  /**
   * Success message for email verification
   */
  EMAIL_VERIFIED: 'Email verified successfully',

  /**
   * Success message for phone number verification
   */
  PHONE_VERIFIED: 'Phone number verified successfully',

  /**
   * Success message for profile updates
   */
  PROFILE_UPDATED: 'Profile updated successfully',

  /**
   * Success message for password changes
   */
  PASSWORD_CHANGED: 'Password changed successfully',

  /**
   * Success message for file uploads
   */
  FILE_UPLOADED: 'File uploaded successfully',

  /**
   * Success message for file deletions
   */
  FILE_DELETED: 'File deleted successfully',

  /**
   * Success message for payment processing
   */
  PAYMENT_SUCCESSFUL: 'Payment processed successfully',

  /**
   * Success message for refund processing
   */
  REFUND_SUCCESSFUL: 'Refund processed successfully',

  /**
   * Success message for subscription activation
   */
  SUBSCRIPTION_ACTIVATED: 'Subscription activated successfully',

  /**
   * Success message for subscription cancellation
   */
  SUBSCRIPTION_CANCELLED: 'Subscription cancelled successfully',

  /**
   * Success message for data creation
   */
  DATA_CREATED: 'Data created successfully',

  /**
   * Success message for data updates
   */
  DATA_UPDATED: 'Data updated successfully',

  /**
   * Success message for data deletion
   */
  DATA_DELETED: 'Data deleted successfully',

  /**
   * Success message for data retrieval
   */
  DATA_RETRIEVED: 'Data retrieved successfully',
} as const;

/**
 * Informational messages for user guidance and status updates.
 *
 * Provides helpful, informative messages that guide users through processes
 * or inform them about system status without indicating errors or successes.
 *
 * @namespace InfoMessages
 *
 * @example
 * ```typescript
 * // Display informational message to user
 * function showInfoMessage(type: keyof typeof InfoMessages) {
 *   displayNotification(InfoMessages[type], 'info');
 * }
 *
 * // Show maintenance notice
 * if (isMaintenanceMode) {
 *   showInfoMessage('MAINTENANCE_SCHEDULED');
 * }
 * ```
 */
export const InfoMessages = {
  /**
   * Informational message for pending account verification
   */
  ACCOUNT_PENDING_VERIFICATION: 'Please verify your account to continue',

  /**
   * Informational message when password reset email is sent
   */
  PASSWORD_RESET_EMAIL_SENT: 'Password reset instructions sent to your email',

  /**
   * Informational message when email verification is sent
   */
  EMAIL_VERIFICATION_SENT: 'Email verification link sent to your email',

  /**
   * Informational message when multi-factor authentication is required
   */
  MFA_REQUIRED: 'Please complete multi-factor authentication',

  /**
   * Informational message for session expiration warnings
   */
  SESSION_EXPIRING_SOON: 'Your session will expire soon',

  /**
   * Informational message for scheduled maintenance
   */
  MAINTENANCE_SCHEDULED: 'Scheduled maintenance in progress',

  /**
   * Informational message for rate limit warnings
   */
  RATE_LIMIT_WARNING: 'You are approaching the rate limit',

  /**
   * Informational message for storage limit warnings
   */
  STORAGE_LIMIT_WARNING: 'You are approaching your storage limit',
} as const;

/**
 * Union type of all possible error messages in the system.
 *
 * Enables type-safe usage of error messages throughout the application.
 */
export type ErrorMessageType = (typeof ErrorMessages)[keyof typeof ErrorMessages];

/**
 * Union type of all possible success messages in the system.
 *
 * Enables type-safe usage of success messages throughout the application.
 */
export type SuccessMessageType = (typeof SuccessMessages)[keyof typeof SuccessMessages];

/**
 * Union type of all possible informational messages in the system.
 *
 * Enables type-safe usage of informational messages throughout the application.
 */
export type InfoMessageType = (typeof InfoMessages)[keyof typeof InfoMessages];
