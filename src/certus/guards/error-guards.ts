import { CertusAdiValtError } from '../errors';

export function isCertusError(error: unknown): error is CertusAdiValtError {
  return error instanceof CertusAdiValtError;
}

export function isClientError(error: unknown): boolean {
  return isCertusError(error) && error.statusCode >= 400 && error.statusCode < 500;
}

export function isServerError(error: unknown): boolean {
  return isCertusError(error) && error.statusCode >= 500;
}

export function isAuthenticationError(error: unknown): boolean {
  return isCertusError(error) && error.code.startsWith('AUTH_');
}

export function isValidationError(error: unknown): boolean {
  return isCertusError(error) && error.code.startsWith('VAL_');
}

export function isDatabaseError(error: unknown): boolean {
  return isCertusError(error) && error.code.startsWith('DB_');
}

export function isExternalServiceError(error: unknown): boolean {
  return isCertusError(error) && error.code === 'SRV_EXTERNAL_SERVICE';
}