import { ErrorCodes, HttpStatus } from '@/constants';
import { CertusAdiValtError } from './base';

export class CertusClientError extends CertusAdiValtError {
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

export class CertusValidationError extends CertusClientError {
  constructor(message: string = 'Validation failed', context?: Record<string, unknown>) {
    super(message, ErrorCodes.VAL_INVALID_INPUT, HttpStatus.UNPROCESSABLE_ENTITY, context);
    this.name = 'CertusValidationError';
  }
}

export class CertusNotFoundError extends CertusClientError {
  constructor(message: string = 'Resource not found', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.GEN_NOT_FOUND, HttpStatus.NOT_FOUND, context);
    this.name = 'CertusNotFoundError';
  }
}

export class CertusUnauthorizedError extends CertusClientError {
  constructor(message: string = 'Unauthorized access', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.AUTH_UNAUTHORIZED, HttpStatus.UNAUTHORIZED, context);
    this.name = 'CertusUnauthorizedError';
  }
}

export class CertusForbiddenError extends CertusClientError {
  constructor(message: string = 'Access forbidden', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS, HttpStatus.FORBIDDEN, context);
    this.name = 'CertusForbiddenError';
  }
}