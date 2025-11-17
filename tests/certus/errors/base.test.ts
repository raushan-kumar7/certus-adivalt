import { describe, it, expect } from 'vitest';
import { CertusAdiValtError } from '../../../src/certus';
import { ErrorCodes, HttpStatus } from '../../../src/constants';

describe('CertusAdiValtError', () => {
  describe('Constructor', () => {
    it('should create error with default values', () => {
      const error = new CertusAdiValtError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.name).toBe('CertusAdiValtError');
      expect(error.code).toBe(ErrorCodes.SRV_INTERNAL_ERROR);
      expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.context).toEqual({});
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.stack).toBeDefined();
    });

    it('should create error with custom values', () => {
      const context = { userId: '123', action: 'test' };
      const originalError = new Error('Original error');

      const error = new CertusAdiValtError(
        'Custom error',
        ErrorCodes.GEN_VALIDATION_ERROR,
        HttpStatus.BAD_REQUEST,
        context,
        originalError
      );

      expect(error.message).toBe('Custom error');
      expect(error.code).toBe(ErrorCodes.GEN_VALIDATION_ERROR);
      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(error.context).toEqual(context);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('toJSON()', () => {
    it('should serialize error to JSON format', () => {
      const context = { userId: '123' };
      const error = new CertusAdiValtError('Test error', 'TEST_CODE', 400, context);

      const json = error.toJSON();

      expect(json).toMatchObject({
        name: 'CertusAdiValtError',
        message: 'Test error',
        code: 'TEST_CODE',
        statusCode: 400,
        context: { userId: '123' },
        timestamp: error.timestamp,
        stack: error.stack,
      });
    });

    it('should include original error in JSON when present', () => {
      const originalError = new Error('Original message');
      const error = new CertusAdiValtError('Test error', 'TEST_CODE', 400, {}, originalError);

      const json = error.toJSON();

      expect(json.originalError).toEqual({
        name: 'Error',
        message: 'Original message',
        stack: originalError.stack,
      });
    });
  });

  describe('toLog()', () => {
    it('should format error for logging', () => {
      const context = { userId: '123' };
      const error = new CertusAdiValtError('Test error', 'TEST_CODE', 400, context);

      const log = error.toLog();

      expect(log).toMatchObject({
        error: {
          name: 'CertusAdiValtError',
          message: 'Test error',
          code: 'TEST_CODE',
          statusCode: 400,
          stack: error.stack,
        },
        context: { userId: '123' },
        timestamp: error.timestamp.toISOString(),
      });
    });
  });

  describe('Builder Pattern Methods', () => {
    it('should clone error with new context using withContext()', () => {
      const originalError = new CertusAdiValtError('Original error');
      const newContext = { newField: 'value' };

      const clonedError = originalError.withContext(newContext);

      expect(clonedError).not.toBe(originalError);
      expect(clonedError.message).toBe('Original error');
      expect(clonedError.context).toEqual(newContext);
      expect(clonedError.stack).toBe(originalError.stack);
    });

    it('should merge context when using withContext()', () => {
      const originalError = new CertusAdiValtError('Error', 'CODE', 400, { field1: 'value1' });

      const clonedError = originalError.withContext({ field2: 'value2' });

      expect(clonedError.context).toEqual({
        field1: 'value1',
        field2: 'value2',
      });
    });

    it('should clone error with new code using withCode()', () => {
      const originalError = new CertusAdiValtError('Error', 'OLD_CODE', 400);

      const clonedError = originalError.withCode('NEW_CODE');

      expect(clonedError.code).toBe('NEW_CODE');
      expect(clonedError.message).toBe('Error');
      expect(clonedError.statusCode).toBe(400);
    });

    it('should clone error with new status code using withStatusCode()', () => {
      const originalError = new CertusAdiValtError('Error', 'CODE', 400);

      const clonedError = originalError.withStatusCode(500);

      expect(clonedError.statusCode).toBe(500);
      expect(clonedError.code).toBe('CODE');
    });

    it('should clone error with new message using withMessage()', () => {
      const originalError = new CertusAdiValtError('Old message', 'CODE', 400);

      const clonedError = originalError.withMessage('New message');

      expect(clonedError.message).toBe('New message');
      expect(clonedError.code).toBe('CODE');
      expect(clonedError.statusCode).toBe(400);
    });
  });

  describe('Inheritance', () => {
    it('should maintain prototype chain', () => {
      const error = new CertusAdiValtError('Test error');

      expect(error).toBeInstanceOf(CertusAdiValtError);
      expect(error).toBeInstanceOf(Error);
      expect(Object.getPrototypeOf(error)).toBe(CertusAdiValtError.prototype);
    });
  });

  describe('Error.captureStackTrace', () => {
    it('should capture stack trace when available', () => {
      const error = new CertusAdiValtError('Test error');

      // Stack trace should be available in Node.js environment
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
      expect(error.stack).toContain('CertusAdiValtError');
      expect(error.stack).toContain('Test error');
    });

    it('should handle environments without Error.captureStackTrace', () => {
      // Temporarily remove captureStackTrace to test fallback
      const originalCaptureStackTrace = Error.captureStackTrace;
      (Error as any).captureStackTrace = undefined;

      const error = new CertusAdiValtError('Test error without captureStackTrace');

      // Should still have a stack trace from Error constructor
      expect(error.stack).toBeDefined();

      // Restore original
      Error.captureStackTrace = originalCaptureStackTrace;
    });
  });

  describe('Prototype Chain', () => {
    it('should properly set prototype for instanceof checks', () => {
      const error = new CertusAdiValtError('Test error');

      expect(error).toBeInstanceOf(CertusAdiValtError);
      expect(error).toBeInstanceOf(Error);

      // Ensure prototype chain is correct
      expect(Object.getPrototypeOf(error)).toBe(CertusAdiValtError.prototype);
      expect(Object.getPrototypeOf(CertusAdiValtError.prototype)).toBe(Error.prototype);
    });
  });

  describe('toJSON with Original Error', () => {
    it('should handle original error without stack trace', () => {
      // Create a proper Error instance but remove the stack trace for testing
      const originalError = new Error('Simple error object');
      delete (originalError as any).stack; // Remove stack to test the scenario

      const error = new CertusAdiValtError('Wrapped error', 'TEST_CODE', 400, {}, originalError);

      const json = error.toJSON();

      expect(json.originalError).toEqual({
        name: 'Error',
        message: 'Simple error object',
        stack: undefined, // stack should be undefined since we deleted it
      });
    });
  });

  describe('Builder Pattern Edge Cases', () => {
    it('should handle empty context in withContext', () => {
      const originalError = new CertusAdiValtError('Error', 'CODE', 400, { existing: 'value' });

      const clonedError = originalError.withContext({});

      expect(clonedError.context).toEqual({ existing: 'value' });
    });

    it('should handle null/undefined in clone method', () => {
      const originalError = new CertusAdiValtError('Original', 'CODE', 400, { field: 'value' });

      // This tests the clone method's handling of partial overrides
      const clonedError = originalError.withMessage('New message');

      expect(clonedError.message).toBe('New message');
      expect(clonedError.code).toBe('CODE');
      expect(clonedError.statusCode).toBe(400);
      expect(clonedError.context).toEqual({ field: 'value' });
    });
  });
});