import { describe, it, expect } from 'vitest';
import {
  CertusDatabaseError,
  CertusUniqueConstraintError,
  CertusConnectionError,
  CertusTimeoutError,
} from '../../../src/certus';
import { ErrorCodes, HttpStatus } from '../../../src/constants';

describe('Database Errors', () => {
  describe('CertusDatabaseError', () => {
    it('should create database error with default values', () => {
      const error = new CertusDatabaseError();

      expect(error.name).toBe('CertusDatabaseError');
      expect(error.message).toBe('Database error occurred');
      expect(error.code).toBe(ErrorCodes.DB_QUERY_ERROR);
      expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should create database error with custom values', () => {
      const context = { query: 'SELECT * FROM users', database: 'primary' };
      const error = new CertusDatabaseError(
        'Custom database error',
        ErrorCodes.DB_CONNECTION_ERROR,
        HttpStatus.SERVICE_UNAVAILABLE,
        context
      );

      expect(error.message).toBe('Custom database error');
      expect(error.code).toBe(ErrorCodes.DB_CONNECTION_ERROR);
      expect(error.statusCode).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(error.context).toEqual(context);
    });
  });

  describe('CertusUniqueConstraintError', () => {
    it('should create unique constraint error', () => {
      const context = { table: 'users', field: 'email', value: 'test@example.com' };
      const error = new CertusUniqueConstraintError('Email already exists', context);

      expect(error.name).toBe('CertusUniqueConstraintError');
      expect(error.message).toBe('Email already exists');
      expect(error.code).toBe(ErrorCodes.DB_UNIQUE_CONSTRAINT);
      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(error.context).toEqual(context);
    });

    it('should create unique constraint error with default message', () => {
      const error = new CertusUniqueConstraintError();

      expect(error.message).toBe('Unique constraint violation');
    });
  });

  describe('CertusConnectionError', () => {
    it('should create connection error', () => {
      const context = { host: 'localhost', port: 5432 };
      const error = new CertusConnectionError('Cannot connect to database', context);

      expect(error.name).toBe('CertusConnectionError');
      expect(error.message).toBe('Cannot connect to database');
      expect(error.code).toBe(ErrorCodes.DB_CONNECTION_ERROR);
      expect(error.statusCode).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(error.context).toEqual(context);
    });

    it('should create connection error with default message', () => {
      const error = new CertusConnectionError();

      expect(error.message).toBe('Database connection error');
    });
  });

  describe('CertusTimeoutError', () => {
    it('should create timeout error', () => {
      const context = { operation: 'query', timeout: 5000 };
      const error = new CertusTimeoutError('Query timed out', context);

      expect(error.name).toBe('CertusTimeoutError');
      expect(error.message).toBe('Query timed out');
      expect(error.code).toBe(ErrorCodes.DB_TIMEOUT_ERROR);
      expect(error.statusCode).toBe(HttpStatus.GATEWAY_TIMEOUT);
      expect(error.context).toEqual(context);
    });

    it('should create timeout error with default message', () => {
      const error = new CertusTimeoutError();

      expect(error.message).toBe('Database operation timed out');
    });
  });
});