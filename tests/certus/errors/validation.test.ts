import { describe, it, expect } from 'vitest';
import {
  CertusInputValidationError,
  CertusSchemaValidationError,
  CertusBusinessRuleError,
} from '../../../src/certus';
import { ErrorCodes, HttpStatus } from '../../../src/constants';

describe('Validation Errors', () => {
  describe('CertusInputValidationError', () => {
    it('should create input validation error with default values', () => {
      const error = new CertusInputValidationError();

      expect(error.name).toBe('CertusInputValidationError');
      expect(error.message).toBe('Input validation failed');
      expect(error.code).toBe(ErrorCodes.VAL_INVALID_INPUT);
      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should create input validation error with custom message and context', () => {
      const context = { invalidFields: ['email', 'password'], rules: ['required', 'format'] };
      const error = new CertusInputValidationError('Invalid user input', context);

      expect(error.message).toBe('Invalid user input');
      expect(error.context).toEqual(context);
    });
  });

  describe('CertusSchemaValidationError', () => {
    it('should create schema validation error', () => {
      const context = { schema: 'UserSchema', errors: ['email must be valid'] };
      const error = new CertusSchemaValidationError('Schema validation failed', context);

      expect(error.name).toBe('CertusSchemaValidationError');
      expect(error.message).toBe('Schema validation failed');
      expect(error.code).toBe(ErrorCodes.VAL_SCHEMA_ERROR);
      expect(error.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(error.context).toEqual(context);
    });

    it('should create schema validation error with default message', () => {
      const error = new CertusSchemaValidationError();

      expect(error.message).toBe('Schema validation failed');
    });
  });

  describe('CertusBusinessRuleError', () => {
    it('should create business rule error', () => {
      const context = { rule: 'MINIMUM_AGE', value: 17, required: 18 };
      const error = new CertusBusinessRuleError('User must be at least 18 years old', context);

      expect(error.name).toBe('CertusBusinessRuleError');
      expect(error.message).toBe('User must be at least 18 years old');
      expect(error.code).toBe(ErrorCodes.VAL_BUSINESS_RULE);
      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(error.context).toEqual(context);
    });

    it('should create business rule error with default message', () => {
      const error = new CertusBusinessRuleError();

      expect(error.message).toBe('Business rule violation');
    });
  });
});