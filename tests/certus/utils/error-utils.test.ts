import { describe, it, expect } from 'vitest';
import {
  createAuthenticationError,
  wrapError,
  toServerError,
  assertClientError,
} from '../../../src/certus/utils';
import { CertusAdiValtError, CertusClientError, CertusServerError } from '../../../src/certus';
import { ErrorCodes, HttpStatus } from '../../../src/constants';

describe('Error Utilities', () => {
  describe('createAuthenticationError', () => {
    it('should create authentication error with default message', () => {
      const error = createAuthenticationError();

      expect(error).toBeInstanceOf(CertusAdiValtError);
      expect(error.message).toBe('Authentication failed');
      expect(error.code).toBe(ErrorCodes.AUTH_INVALID_CREDENTIALS);
      expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should create authentication error with custom message and context', () => {
      const context = { provider: 'google', reason: 'token_expired' };
      const error = createAuthenticationError('Google auth failed', context);

      expect(error.message).toBe('Google auth failed');
      expect(error.context).toEqual(context);
    });
  });

  describe('wrapError - Edge Cases', () => {
    it('should use original error message when no custom message provided', () => {
      const originalError = new Error('Original error message');
      const wrapped = wrapError(originalError);

      expect(wrapped.message).toBe('Original error message');
    });

    it('should handle null and undefined errors', () => {
      const wrappedNull = wrapError(null);
      const wrappedUndefined = wrapError(undefined);

      expect(wrappedNull.message).toBe('An error occurred');
      expect(wrappedUndefined.message).toBe('An error occurred');
    });

    it('should handle non-Error objects with custom message', () => {
      const nonError = { custom: 'error object' };
      const wrapped = wrapError(nonError, 'Custom wrapper message');

      expect(wrapped.message).toBe('Custom wrapper message');
      expect(wrapped.originalError).toBeUndefined();
    });
  });

  describe('toServerError', () => {
    it('should return server error unchanged', () => {
      const serverError = new CertusServerError('Server error');
      const result = toServerError(serverError);

      expect(result).toBe(serverError);
    });

    it('should convert non-server Certus error to server error', () => {
      const clientError = new CertusClientError('Client error');
      const result = toServerError(clientError);

      expect(result).toBeInstanceOf(CertusAdiValtError);
      expect(result.message).toBe('Client error');
    });

    it('should convert non-Certus error to server error', () => {
      const regularError = new Error('Regular error');
      const result = toServerError(regularError);

      expect(result).toBeInstanceOf(CertusAdiValtError);
      expect(result.message).toBe('Regular error');
      expect(result.context.originalError).toBe(regularError);
    });

    it('should handle non-Error objects', () => {
      const nonError = 'String error';
      const result = toServerError(nonError);

      expect(result).toBeInstanceOf(CertusAdiValtError);
      expect(result.message).toBe('Server error occurred');
      expect(result.context.originalError).toBe(nonError);
    });
  });

  describe('assertClientError - Edge Cases', () => {
    it('should throw with custom message for non-client errors', () => {
      const serverError = new CertusServerError('Server error');

      expect(() => assertClientError(serverError, 'Expected a client error')).toThrow(
        'Expected a client error'
      );
    });
  });
});