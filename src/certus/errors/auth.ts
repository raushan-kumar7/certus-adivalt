import { ErrorCodes, HttpStatus } from '@/constants';
import { CertusClientError } from './client';

export class CertusAuthenticationError extends CertusClientError {
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

export class CertusInvalidCredentialsError extends CertusAuthenticationError {
  constructor(message: string = 'Invalid credentials', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.AUTH_INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED, context);
    this.name = 'CertusInvalidCredentialsError';
  }
}

export class CertusTokenExpiredError extends CertusAuthenticationError {
  constructor(message: string = 'Token has expired', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.AUTH_TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED, context);
    this.name = 'CertusTokenExpiredError';
  }
}

export class CertusInsufficientPermissionsError extends CertusClientError {
  constructor(message: string = 'Insufficient permissions', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS, HttpStatus.FORBIDDEN, context);
    this.name = 'CertusInsufficientPermissionsError';
  }
}

export class CertusSessionRevokedError extends CertusAuthenticationError {
  constructor(message: string = 'Session has been revoked', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.AUTH_SESSION_REVOKED, HttpStatus.UNAUTHORIZED, context);
    this.name = 'CertusSessionRevokedError';
  }
}