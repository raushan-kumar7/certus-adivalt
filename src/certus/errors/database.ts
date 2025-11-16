import { ErrorCodes, HttpStatus } from '@/constants';
import { CertusServerError } from './server';

export class CertusDatabaseError extends CertusServerError {
  constructor(
    message: string = 'Database error occurred',
    code: string = ErrorCodes.DB_QUERY_ERROR,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    context: Record<string, unknown> = {}
  ) {
    super(message, code, statusCode, context);
    this.name = 'CertusDatabaseError';
  }
}

export class CertusUniqueConstraintError extends CertusDatabaseError {
  constructor(
    message: string = 'Unique constraint violation',
    context: Record<string, unknown> = {}
  ) {
    super(message, ErrorCodes.DB_UNIQUE_CONSTRAINT, HttpStatus.CONFLICT, context);
    this.name = 'CertusUniqueConstraintError';
  }
}

export class CertusConnectionError extends CertusDatabaseError {
  constructor(
    message: string = 'Database connection error',
    context: Record<string, unknown> = {}
  ) {
    super(message, ErrorCodes.DB_CONNECTION_ERROR, HttpStatus.SERVICE_UNAVAILABLE, context);
    this.name = 'CertusConnectionError';
  }
}

export class CertusTimeoutError extends CertusDatabaseError {
  constructor(
    message: string = 'Database operation timed out',
    context: Record<string, unknown> = {}
  ) {
    super(message, ErrorCodes.DB_TIMEOUT_ERROR, HttpStatus.GATEWAY_TIMEOUT, context);
    this.name = 'CertusTimeoutError';
  }
}