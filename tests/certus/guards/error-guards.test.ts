import { describe, it, expect } from 'vitest';
import {
  CertusAdiValtError,
  CertusClientError,
  CertusServerError,
  CertusAuthenticationError,
  CertusValidationError,
  CertusDatabaseError,
} from '../../../src/certus';
import {
  isCertusError,
  isClientError,
  isServerError,
  isAuthenticationError,
  isValidationError,
  isDatabaseError,
  isExternalServiceError,
} from '../../../src/certus/guards';
import { ErrorCodes, HttpStatus } from '../../../src/constants';

describe('Error Guards', () => {
  describe('isCertusError', () => {
    it('should return true for CertusAdiValtError instances', () => {
      const error = new CertusAdiValtError('Test error');
      expect(isCertusError(error)).toBe(true);
    });

    it('should return true for subclasses of CertusAdiValtError', () => {
      const clientError = new CertusClientError('Client error');
      const serverError = new CertusServerError('Server error');

      expect(isCertusError(clientError)).toBe(true);
      expect(isCertusError(serverError)).toBe(true);
    });

    it('should return false for non-Certus errors', () => {
      expect(isCertusError(new Error('Regular error'))).toBe(false);
      expect(isCertusError('string error')).toBe(false);
      expect(isCertusError(null)).toBe(false);
      expect(isCertusError(undefined)).toBe(false);
      expect(isCertusError({})).toBe(false);
    });
  });

  describe('isClientError', () => {
    it('should return true for 4xx status codes', () => {
      const clientError = new CertusClientError('Error', 'CODE', 400);
      const validationError = new CertusValidationError();
      const notFoundError = new CertusClientError('Error', 'CODE', 404);

      expect(isClientError(clientError)).toBe(true);
      expect(isClientError(validationError)).toBe(true);
      expect(isClientError(notFoundError)).toBe(true);
    });

    it('should return false for 5xx status codes', () => {
      const serverError = new CertusServerError('Error', 'CODE', 500);
      expect(isClientError(serverError)).toBe(false);
    });

    it('should return false for non-Certus errors', () => {
      expect(isClientError(new Error('Regular error'))).toBe(false);
    });
  });

  describe('isServerError', () => {
    it('should return true for 5xx status codes', () => {
      const serverError = new CertusServerError('Error', 'CODE', 500);
      const dbError = new CertusDatabaseError();

      expect(isServerError(serverError)).toBe(true);
      expect(isServerError(dbError)).toBe(true);
    });

    it('should return false for 4xx status codes', () => {
      const clientError = new CertusClientError('Error', 'CODE', 400);
      expect(isServerError(clientError)).toBe(false);
    });
  });

  describe('isAuthenticationError', () => {
    it('should return true for AUTH_ prefixed codes', () => {
      const authError = new CertusAuthenticationError();
      const tokenError = new CertusAuthenticationError('Error', ErrorCodes.AUTH_TOKEN_EXPIRED);

      expect(isAuthenticationError(authError)).toBe(true);
      expect(isAuthenticationError(tokenError)).toBe(true);
    });

    it('should return false for non-AUTH codes', () => {
      const validationError = new CertusValidationError();
      const dbError = new CertusDatabaseError();

      expect(isAuthenticationError(validationError)).toBe(false);
      expect(isAuthenticationError(dbError)).toBe(false);
    });
  });

  describe('isValidationError', () => {
    it('should return true for VAL_ prefixed codes', () => {
      const validationError = new CertusValidationError();
      const inputError = new CertusValidationError('Error', {});

      expect(isValidationError(validationError)).toBe(true);
      expect(isValidationError(inputError)).toBe(true);
    });
  });

  describe('isDatabaseError', () => {
    it('should return true for DB_ prefixed codes', () => {
      const dbError = new CertusDatabaseError();
      const connectionError = new CertusDatabaseError('Error', ErrorCodes.DB_CONNECTION_ERROR);

      expect(isDatabaseError(dbError)).toBe(true);
      expect(isDatabaseError(connectionError)).toBe(true);
    });
  });

  describe('isExternalServiceError', () => {
    it('should return true for SRV_EXTERNAL_SERVICE code', () => {
      const externalError = new CertusServerError('Error', ErrorCodes.SRV_EXTERNAL_SERVICE);
      expect(isExternalServiceError(externalError)).toBe(true);
    });

    it('should return false for other codes', () => {
      const internalError = new CertusServerError('Error', ErrorCodes.SRV_INTERNAL_ERROR);
      expect(isExternalServiceError(internalError)).toBe(false);
    });
  });
});