import { describe, it, expect } from 'vitest';
import {
  CertusAuthenticationError,
  CertusInvalidCredentialsError,
  CertusTokenExpiredError,
  CertusInsufficientPermissionsError,
  CertusSessionRevokedError,
} from '../../../src/certus';
import { ErrorCodes, HttpStatus } from '../../../src/constants';

describe('Authentication Errors', () => {
  describe('CertusAuthenticationError', () => {
    it('should create authentication error with correct defaults', () => {
      const error = new CertusAuthenticationError();

      expect(error.name).toBe('CertusAuthenticationError');
      expect(error.message).toBe('Authentication failed');
      expect(error.code).toBe(ErrorCodes.AUTH_INVALID_CREDENTIALS);
      expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('CertusInvalidCredentialsError', () => {
    it('should create invalid credentials error', () => {
      const context = { username: 'testuser' };
      const error = new CertusInvalidCredentialsError('Wrong password', context);

      expect(error.name).toBe('CertusInvalidCredentialsError');
      expect(error.message).toBe('Wrong password');
      expect(error.code).toBe(ErrorCodes.AUTH_INVALID_CREDENTIALS);
      expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.context).toEqual(context);
    });
  });

  describe('CertusTokenExpiredError', () => {
    it('should create token expired error', () => {
      const context = { tokenType: 'refresh' };
      const error = new CertusTokenExpiredError('Refresh token expired', context);

      expect(error.name).toBe('CertusTokenExpiredError');
      expect(error.message).toBe('Refresh token expired');
      expect(error.code).toBe(ErrorCodes.AUTH_TOKEN_EXPIRED);
      expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.context).toEqual(context);
    });
  });

  describe('CertusInsufficientPermissionsError', () => {
    it('should create insufficient permissions error', () => {
      const context = { required: 'admin', actual: 'user' };
      const error = new CertusInsufficientPermissionsError('Admin access required', context);

      expect(error.name).toBe('CertusInsufficientPermissionsError');
      expect(error.message).toBe('Admin access required');
      expect(error.code).toBe(ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS);
      expect(error.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(error.context).toEqual(context);
    });
  });

  describe('CertusSessionRevokedError', () => {
    it('should create session revoked error', () => {
      const context = { sessionId: 'sess_123', reason: 'logout' };
      const error = new CertusSessionRevokedError('Session terminated', context);

      expect(error.name).toBe('CertusSessionRevokedError');
      expect(error.message).toBe('Session terminated');
      expect(error.code).toBe(ErrorCodes.AUTH_SESSION_REVOKED);
      expect(error.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.context).toEqual(context);
    });
  });
});