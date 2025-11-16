import { ErrorCodes } from './error-codes';

export const ErrorMessages = {
  // Authentication & Authorization Messages
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: 'Authentication token has expired',
  [ErrorCodes.AUTH_INVALID_TOKEN]: 'Invalid authentication token',
  [ErrorCodes.AUTH_TOKEN_REQUIRED]: 'Authentication token is required',
  [ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions to access this resource',
  [ErrorCodes.AUTH_SESSION_EXPIRED]: 'Session has expired',
  [ErrorCodes.AUTH_SESSION_REVOKED]: 'Session has been revoked',
  [ErrorCodes.AUTH_SESSION_NOT_FOUND]: 'Session not found',
  [ErrorCodes.AUTH_UNAUTHORIZED]: 'Unauthorized access',
  [ErrorCodes.AUTH_ACCOUNT_LOCKED]: 'Account has been locked due to multiple failed attempts',
  [ErrorCodes.AUTH_ACCOUNT_DISABLED]: 'Account has been disabled',
  [ErrorCodes.AUTH_ACCOUNT_PENDING]: 'Account is pending activation',
  [ErrorCodes.AUTH_PASSWORD_RESET_REQUIRED]: 'Password reset required',
  [ErrorCodes.AUTH_MFA_REQUIRED]: 'Multi-factor authentication required',
  [ErrorCodes.AUTH_MFA_INVALID]: 'Invalid multi-factor authentication code',
  [ErrorCodes.AUTH_OAUTH_ERROR]: 'OAuth authentication failed',
  [ErrorCodes.AUTH_PROVIDER_ERROR]: 'Authentication provider error',
  [ErrorCodes.AUTH_REFRESH_TOKEN_EXPIRED]: 'Refresh token has expired',
  [ErrorCodes.AUTH_REFRESH_TOKEN_INVALID]: 'Invalid refresh token',
  [ErrorCodes.AUTH_EMAIL_NOT_VERIFIED]: 'Email address not verified',
  [ErrorCodes.AUTH_PHONE_NOT_VERIFIED]: 'Phone number not verified',
  [ErrorCodes.AUTH_RATE_LIMIT_EXCEEDED]: 'Too many authentication attempts',

  // Validation Messages
  [ErrorCodes.VAL_INVALID_INPUT]: 'Invalid input provided',
  [ErrorCodes.VAL_SCHEMA_ERROR]: 'Data validation failed',
  [ErrorCodes.VAL_BUSINESS_RULE]: 'Business rule violation',
  [ErrorCodes.VAL_REQUIRED_FIELD]: 'This field is required',
  [ErrorCodes.VAL_INVALID_FORMAT]: 'Invalid format',
  [ErrorCodes.VAL_INVALID_EMAIL]: 'Invalid email address',
  [ErrorCodes.VAL_INVALID_PHONE]: 'Invalid phone number',
  [ErrorCodes.VAL_INVALID_DATE]: 'Invalid date format',
  [ErrorCodes.VAL_INVALID_URL]: 'Invalid URL format',
  [ErrorCodes.VAL_INVALID_UUID]: 'Invalid UUID format',
  [ErrorCodes.VAL_STRING_TOO_SHORT]: 'Text is too short',
  [ErrorCodes.VAL_STRING_TOO_LONG]: 'Text is too long',
  [ErrorCodes.VAL_NUMBER_TOO_SMALL]: 'Number is too small',
  [ErrorCodes.VAL_NUMBER_TOO_LARGE]: 'Number is too large',
  [ErrorCodes.VAL_ARRAY_TOO_SHORT]: 'Too few items',
  [ErrorCodes.VAL_ARRAY_TOO_LONG]: 'Too many items',
  [ErrorCodes.VAL_INVALID_CHOICE]: 'Invalid selection',
  [ErrorCodes.VAL_UNIQUE_CONSTRAINT]: 'Value must be unique',
  [ErrorCodes.VAL_FOREIGN_KEY_CONSTRAINT]: 'Referenced resource not found',

  // Database Messages
  [ErrorCodes.DB_CONNECTION_ERROR]: 'Database connection failed',
  [ErrorCodes.DB_UNIQUE_CONSTRAINT]: 'Duplicate entry found',
  [ErrorCodes.DB_FOREIGN_KEY_CONSTRAINT]: 'Referenced record not found',
  [ErrorCodes.DB_TIMEOUT_ERROR]: 'Database operation timed out',
  [ErrorCodes.DB_QUERY_ERROR]: 'Database query failed',
  [ErrorCodes.DB_TRANSACTION_ERROR]: 'Database transaction failed',
  [ErrorCodes.DB_RECORD_NOT_FOUND]: 'Record not found',
  [ErrorCodes.DB_DUPLICATE_ENTRY]: 'Duplicate entry not allowed',
  [ErrorCodes.DB_DEADLOCK_ERROR]: 'Database deadlock detected',
  [ErrorCodes.DB_CONNECTION_LIMIT]: 'Database connection limit reached',
  [ErrorCodes.DB_MIGRATION_ERROR]: 'Database migration failed',
  [ErrorCodes.DB_BACKUP_ERROR]: 'Database backup failed',

  // File & Storage Messages
  [ErrorCodes.FILE_UPLOAD_ERROR]: 'File upload failed',
  [ErrorCodes.FILE_DOWNLOAD_ERROR]: 'File download failed',
  [ErrorCodes.FILE_DELETE_ERROR]: 'File deletion failed',
  [ErrorCodes.FILE_NOT_FOUND]: 'File not found',
  [ErrorCodes.FILE_TOO_LARGE]: 'File size exceeds limit',
  [ErrorCodes.FILE_INVALID_TYPE]: 'File type not allowed',
  [ErrorCodes.FILE_INVALID_NAME]: 'Invalid file name',
  [ErrorCodes.FILE_STORAGE_LIMIT]: 'Storage limit exceeded',
  [ErrorCodes.FILE_CORRUPTED]: 'File is corrupted',
  [ErrorCodes.FILE_PERMISSION_DENIED]: 'File access denied',

  // Server & Infrastructure Messages
  [ErrorCodes.SRV_INTERNAL_ERROR]: 'Internal server error',
  [ErrorCodes.SRV_EXTERNAL_SERVICE]: 'External service unavailable',
  [ErrorCodes.SRV_CONFIGURATION_ERROR]: 'Server configuration error',
  [ErrorCodes.SRV_ENCRYPTION_ERROR]: 'Encryption failed',
  [ErrorCodes.SRV_DECRYPTION_ERROR]: 'Decryption failed',
  [ErrorCodes.SRV_RATE_LIMIT]: 'Rate limit exceeded',
  [ErrorCodes.SRV_MAINTENANCE_MODE]: 'Service under maintenance',
  [ErrorCodes.SRV_SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
  [ErrorCodes.SRV_MEMORY_LIMIT]: 'Memory limit exceeded',
  [ErrorCodes.SRV_CPU_LIMIT]: 'CPU limit exceeded',
  [ErrorCodes.SRV_DISK_SPACE]: 'Disk space insufficient',

  // Network & Communication Messages
  [ErrorCodes.NET_NETWORK_ERROR]: 'Network connection failed',
  [ErrorCodes.NET_CONNECTION_TIMEOUT]: 'Connection timeout',
  [ErrorCodes.NET_DNS_ERROR]: 'DNS resolution failed',
  [ErrorCodes.NET_SSL_ERROR]: 'SSL certificate error',
  [ErrorCodes.NET_PROXY_ERROR]: 'Proxy connection failed',
  [ErrorCodes.NET_FIREWALL_BLOCKED]: 'Connection blocked by firewall',

  // Payment & Billing Messages
  [ErrorCodes.PAY_PAYMENT_FAILED]: 'Payment processing failed',
  [ErrorCodes.PAY_INSUFFICIENT_FUNDS]: 'Insufficient funds',
  [ErrorCodes.PAY_CARD_DECLINED]: 'Card declined',
  [ErrorCodes.PAY_INVALID_CARD]: 'Invalid card details',
  [ErrorCodes.PAY_EXPIRED_CARD]: 'Card has expired',
  [ErrorCodes.PAY_PROCESSOR_ERROR]: 'Payment processor error',
  [ErrorCodes.PAY_REFUND_FAILED]: 'Refund failed',
  [ErrorCodes.PAY_SUBSCRIPTION_EXPIRED]: 'Subscription has expired',
  [ErrorCodes.PAY_INVOICE_NOT_FOUND]: 'Invoice not found',

  // Notification & Email Messages
  [ErrorCodes.NOTIF_EMAIL_FAILED]: 'Email sending failed',
  [ErrorCodes.NOTIF_SMS_FAILED]: 'SMS sending failed',
  [ErrorCodes.NOTIF_PUSH_FAILED]: 'Push notification failed',
  [ErrorCodes.NOTIF_TEMPLATE_NOT_FOUND]: 'Notification template not found',
  [ErrorCodes.NOTIF_RATE_LIMIT]: 'Notification rate limit exceeded',
  [ErrorCodes.NOTIF_PROVIDER_ERROR]: 'Notification service error',

  // Generic Messages
  [ErrorCodes.GEN_VALIDATION_ERROR]: 'Validation failed',
  [ErrorCodes.GEN_NOT_FOUND]: 'Resource not found',
  [ErrorCodes.GEN_TIMEOUT]: 'Operation timed out',
  [ErrorCodes.GEN_NETWORK_ERROR]: 'Network error occurred',
  [ErrorCodes.GEN_SERVICE_ERROR]: 'Service error occurred',
  [ErrorCodes.GEN_UNKNOWN_ERROR]: 'An unknown error occurred',
  [ErrorCodes.GEN_FORBIDDEN]: 'Access forbidden',
  [ErrorCodes.GEN_UNAUTHORIZED]: 'Unauthorized access',
  [ErrorCodes.GEN_BAD_REQUEST]: 'Bad request',
  [ErrorCodes.GEN_CONFLICT]: 'Resource conflict',
} as const;

// Success Messages
export const SuccessMessages = {
  OPERATION_SUCCESSFUL: 'Operation completed successfully',
  LOGIN_SUCCESSFUL: 'Login successful',
  LOGOUT_SUCCESSFUL: 'Logout successful',
  REGISTRATION_SUCCESSFUL: 'Registration successful',
  PASSWORD_RESET_SUCCESSFUL: 'Password reset successful',
  EMAIL_VERIFIED: 'Email verified successfully',
  PHONE_VERIFIED: 'Phone number verified successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  FILE_DELETED: 'File deleted successfully',
  PAYMENT_SUCCESSFUL: 'Payment processed successfully',
  REFUND_SUCCESSFUL: 'Refund processed successfully',
  SUBSCRIPTION_ACTIVATED: 'Subscription activated successfully',
  SUBSCRIPTION_CANCELLED: 'Subscription cancelled successfully',
  DATA_CREATED: 'Data created successfully',
  DATA_UPDATED: 'Data updated successfully',
  DATA_DELETED: 'Data deleted successfully',
  DATA_RETRIEVED: 'Data retrieved successfully',
} as const;

// Info Messages
export const InfoMessages = {
  ACCOUNT_PENDING_VERIFICATION: 'Please verify your account to continue',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset instructions sent to your email',
  EMAIL_VERIFICATION_SENT: 'Email verification link sent to your email',
  MFA_REQUIRED: 'Please complete multi-factor authentication',
  SESSION_EXPIRING_SOON: 'Your session will expire soon',
  MAINTENANCE_SCHEDULED: 'Scheduled maintenance in progress',
  RATE_LIMIT_WARNING: 'You are approaching the rate limit',
  STORAGE_LIMIT_WARNING: 'You are approaching your storage limit',
} as const;

export type ErrorMessageType = (typeof ErrorMessages)[keyof typeof ErrorMessages];
export type SuccessMessageType = (typeof SuccessMessages)[keyof typeof SuccessMessages];
export type InfoMessageType = (typeof InfoMessages)[keyof typeof InfoMessages];