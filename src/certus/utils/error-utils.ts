import { ErrorCodes, HttpStatus } from '@/constants';
import { CertusErrorOptions } from '@/types';
import {
  CertusAdiValtError,
  CertusAuthenticationError,
  CertusClientError,
  CertusNotFoundError,
  CertusServerError,
  CertusValidationError,
} from '../errors';
import { isCertusError, isClientError, isServerError } from '../guards';

export function createCertusError(
  message: string,
  options: CertusErrorOptions
): CertusAdiValtError {
  return new CertusAdiValtError(
    message,
    options.code,
    options.statusCode,
    options.context,
    options.originalError
  );
}

export function createValidationError(
  message: string = 'Validation failed',
  context?: Record<string, unknown>
): CertusValidationError {
  return new CertusValidationError(message, context);
}

export function createNotFoundError(
  message: string = 'Resource not found',
  context?: Record<string, unknown>
): CertusNotFoundError {
  return new CertusNotFoundError(message, context);
}

export function createAuthenticationError(
  message: string = 'Authentication failed',
  context?: Record<string, unknown>
): CertusAuthenticationError {
  return new CertusAuthenticationError(
    message,
    ErrorCodes.AUTH_INVALID_CREDENTIALS,
    HttpStatus.UNAUTHORIZED,
    context
  );
}

// Error transformation utilities
export function wrapError(
  error: unknown,
  message?: string,
  code: string = ErrorCodes.SRV_INTERNAL_ERROR
): CertusAdiValtError {
  if (isCertusError(error)) {
    return error;
  }

  const errorMessage = message || (error instanceof Error ? error.message : 'An error occurred');

  return new CertusAdiValtError(
    errorMessage,
    code,
    HttpStatus.INTERNAL_SERVER_ERROR,
    {},
    error instanceof Error ? error : undefined
  );
}

export function toClientError(error: unknown): CertusClientError {
  if (isCertusError(error) && isClientError(error)) {
    return error as CertusClientError;
  }

  return new CertusClientError(
    error instanceof Error ? error.message : 'Client error occurred',
    ErrorCodes.GEN_BAD_REQUEST,
    HttpStatus.BAD_REQUEST,
    { originalError: error }
  );
}

export function toServerError(error: unknown): CertusServerError {
  if (isCertusError(error) && isServerError(error)) {
    return error as CertusServerError;
  }

  return new CertusServerError(
    error instanceof Error ? error.message : 'Server error occurred',
    ErrorCodes.SRV_INTERNAL_ERROR,
    HttpStatus.INTERNAL_SERVER_ERROR,
    { originalError: error }
  );
}

// Error assertion utilities
export function assertCertusError(
  error: unknown,
  message?: string
): asserts error is CertusAdiValtError {
  if (!isCertusError(error)) {
    throw new CertusServerError(
      message || 'Expected CertusAdiValtError instance',
      ErrorCodes.SRV_INTERNAL_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { actualError: error }
    );
  }
}

export function assertClientError(
  error: unknown,
  message?: string
): asserts error is CertusClientError {
  assertCertusError(error, message);
  if (!isClientError(error)) {
    throw new CertusServerError(
      message || 'Expected client error',
      ErrorCodes.SRV_INTERNAL_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
      { actualError: error }
    );
  }
}