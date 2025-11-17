import { describe, it, expect } from 'vitest';
import {
  CertusClientError,
  CertusValidationError,
  CertusNotFoundError,
  CertusUnauthorizedError,
  CertusForbiddenError,
} from '../../../src/certus';
import { ErrorCodes, HttpStatus } from '../../../src/constants';

describe('Client Errors', () => {
  describe('CertusClientError', () => {
    it('should create client error with default values', () => {
      const error = new CertusClientError('Client error');

      expect(error.name).toBe('CertusClientError');
      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(error.code).toBe(ErrorCodes.GEN_VALIDATION_ERROR);
    });

    it('should create client error with custom values', () => {
      const context = { field: 'email' };
      const error = new CertusClientError(
        'Custom client error',
        'CUSTOM_CODE',
        HttpStatus.UNPROCESSABLE_ENTITY,
        context
      );

      expect(error.message).toBe('Custom client error');
      expect(error.code).toBe('CUSTOM_CODE');
      expect(error.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(error.context).toEqual(context);
    });
  });

  describe('CertusValidationError', () => {
    it('should create validation error with correct defaults', () => {
      const error = new CertusValidationError();

      expect(error.name).toBe('CertusValidationError');
      expect(error.message).toBe('Validation failed');
      expect(error.code).toBe(ErrorCodes.VAL_INVALID_INPUT);
      expect(error.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should create validation error with custom message and context', () => {
      const context = { invalidFields: ['email', 'password'] };
      const error = new CertusValidationError('Invalid input data', context);

      expect(error.message).toBe('Invalid input data');
      expect(error.context).toEqual(context);
    });
  });

  describe('CertusNotFoundError', () => {
    it('should create not found error with correct defaults', () => {
      const error = new CertusNotFoundError();

      expect(error.name).toBe('CertusNotFoundError');
      expect(error.message).toBe('Resource not found');
      expect(error.code).toBe(ErrorCodes.GEN_NOT_FOUND);
      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('should create not found error for specific resource', () => {
      const context = { resource: 'User', id: '123' };
      const error = new CertusNotFoundError('User not found', context);

      expect(error.message).toBe('User not found');
      expect(error.context).toEqual(context);
    });
  });

  describe('CertusUnauthorizedError', () => {
    it('should create unauthorized error with correct defaults', () => {
      const error = new CertusUnauthorizedError();

      expect(error.name).toBe('CertusUnauthorizedError');
      expect(error.message).toBe('Unauthorized access');
      expect(error.code).toBe(ErrorCodes.AUTH_UNAUTHORIZED);
      expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('CertusForbiddenError', () => {
    it('should create forbidden error with correct defaults', () => {
      const error = new CertusForbiddenError();

      expect(error.name).toBe('CertusForbiddenError');
      expect(error.message).toBe('Access forbidden');
      expect(error.code).toBe(ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS);
      expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
    });
  });
});