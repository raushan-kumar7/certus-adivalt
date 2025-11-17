import { describe, it, expect } from 'vitest';
import {
  CertusServerError,
  CertusInternalServerError,
  CertusExternalServiceError,
  CertusConfigurationError,
} from '../../../src/certus';
import { ErrorCodes, HttpStatus } from '../../../src/constants';

describe('Server Errors', () => {
  describe('CertusServerError', () => {
    it('should create server error with default values', () => {
      const error = new CertusServerError('Server error');

      expect(error.name).toBe('CertusServerError');
      expect(error.message).toBe('Server error');
      expect(error.code).toBe(ErrorCodes.SRV_INTERNAL_ERROR);
      expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should create server error with custom values', () => {
      const context = { service: 'payment', endpoint: '/process' };
      const error = new CertusServerError(
        'Custom server error',
        ErrorCodes.SRV_EXTERNAL_SERVICE,
        HttpStatus.BAD_GATEWAY,
        context
      );

      expect(error.message).toBe('Custom server error');
      expect(error.code).toBe(ErrorCodes.SRV_EXTERNAL_SERVICE);
      expect(error.statusCode).toBe(HttpStatus.BAD_GATEWAY);
      expect(error.context).toEqual(context);
    });
  });

  describe('CertusInternalServerError', () => {
    it('should create internal server error with default values', () => {
      const error = new CertusInternalServerError();

      expect(error.name).toBe('CertusInternalServerError');
      expect(error.message).toBe('Internal server error');
      expect(error.code).toBe(ErrorCodes.SRV_INTERNAL_ERROR);
      expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should create internal server error with custom message and context', () => {
      const context = { component: 'auth-service' };
      const error = new CertusInternalServerError('Auth service failed', context);

      expect(error.message).toBe('Auth service failed');
      expect(error.context).toEqual(context);
    });
  });

  describe('CertusExternalServiceError', () => {
    it('should create external service error', () => {
      const context = { externalService: 'stripe', responseCode: 500 };
      const error = new CertusExternalServiceError('Payment service unavailable', context);

      expect(error.name).toBe('CertusExternalServiceError');
      expect(error.message).toBe('Payment service unavailable');
      expect(error.code).toBe(ErrorCodes.SRV_EXTERNAL_SERVICE);
      expect(error.statusCode).toBe(HttpStatus.BAD_GATEWAY);
      expect(error.context).toEqual(context);
    });

    it('should create external service error with default message', () => {
      const error = new CertusExternalServiceError();

      expect(error.message).toBe('External service error');
    });
  });

  describe('CertusConfigurationError', () => {
    it('should create configuration error', () => {
      const context = { configKey: 'DATABASE_URL', issue: 'missing' };
      const error = new CertusConfigurationError('Database configuration missing', context);

      expect(error.name).toBe('CertusConfigurationError');
      expect(error.message).toBe('Database configuration missing');
      expect(error.code).toBe(ErrorCodes.SRV_CONFIGURATION_ERROR);
      expect(error.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error.context).toEqual(context);
    });

    it('should create configuration error with default message', () => {
      const error = new CertusConfigurationError();

      expect(error.message).toBe('Configuration error');
    });
  });
});