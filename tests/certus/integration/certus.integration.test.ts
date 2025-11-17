import { describe, it, expect } from 'vitest';
import {
  CertusAdiValtError,
  isCertusError,
  isClientError,
  isServerError,
  wrapError,
  toClientError,
} from '../../../src/certus';
import { ErrorCodes, HttpStatus } from '../../../src/constants';

describe('Error Flow Integration', () => {
  describe('Error Creation and Transformation', () => {
    it('should handle complete error flow', () => {
      // 1. Create a raw error
      const rawError = new Error('Database connection failed');

      // 2. Wrap it as a Certus error
      const wrappedError = wrapError(
        rawError,
        'Service unavailable',
        ErrorCodes.SRV_EXTERNAL_SERVICE
      );

      // 3. Verify it's a Certus error
      expect(isCertusError(wrappedError)).toBe(true);
      expect(isServerError(wrappedError)).toBe(true);

      // 4. Transform to client error for API response
      const clientError = toClientError(wrappedError);

      expect(isClientError(clientError)).toBe(true);
      expect(clientError.message).toBe('Service unavailable');
    });

    it('should maintain error chain through transformations', () => {
      const originalError = new Error('Original low-level error');
      const certusError = new CertusAdiValtError(
        'High-level error',
        ErrorCodes.DB_CONNECTION_ERROR,
        HttpStatus.SERVICE_UNAVAILABLE,
        { database: 'primary' },
        originalError
      );

      // Verify the chain is preserved
      expect(certusError.originalError).toBe(originalError);
      expect(certusError.toJSON().originalError?.message).toBe('Original low-level error');
    });
  });

  describe('Error Serialization for Different Contexts', () => {
    it('should provide different serialization for API vs Logging', () => {
      const error = new CertusAdiValtError('Test error', 'TEST_CODE', 400, {
        sensitive: 'data',
        public: 'info',
      });

      const apiJson = error.toJSON();
      const logEntry = error.toLog();

      // API response should have structured error info
      expect(apiJson).toMatchObject({
        name: 'CertusAdiValtError',
        message: 'Test error',
        code: 'TEST_CODE',
        statusCode: 400,
        context: { sensitive: 'data', public: 'info' },
      });

      // Log entry should have similar structure but might be processed differently
      expect(logEntry).toMatchObject({
        error: {
          name: 'CertusAdiValtError',
          message: 'Test error',
          code: 'TEST_CODE',
          statusCode: 400,
        },
        context: { sensitive: 'data', public: 'info' },
      });
    });
  });
});