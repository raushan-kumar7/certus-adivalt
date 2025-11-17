import { describe, it, expect } from 'vitest';
import { DataRedactor } from '../../../src/valt/security/data-redaction';

describe('DataRedactor', () => {
  describe('redact', () => {
    it('should redact sensitive fields from object', () => {
      const data = {
        username: 'john_doe',
        password: 'secret123',
        token: 'jwt-token',
        email: 'john@example.com',
        safeField: 'visible',
      };

      const result = DataRedactor.redact(data);

      expect(result).toEqual({
        username: 'john_doe',
        password: '[REDACTED]',
        token: '[REDACTED]',
        email: '[REDACTED]',
        safeField: 'visible',
      });
    });

    it('should redact nested sensitive fields', () => {
      const data = {
        user: {
          name: 'John Doe',
          password: 'secret123',
          profile: {
            email: 'john@example.com',
            phone: '123-456-7890',
          },
        },
        config: {
          apiKey: 'secret-key',
          safeConfig: 'visible',
        },
      };

      const result = DataRedactor.redact(data);

      expect(result).toEqual({
        user: {
          name: 'John Doe',
          password: '[REDACTED]',
          profile: {
            email: '[REDACTED]',
            phone: '[REDACTED]',
          },
        },
        config: {
          apiKey: '[REDACTED]',
          safeConfig: 'visible',
        },
      });
    });

    it('should redact arrays of objects', () => {
      const data = [
        {
          username: 'user1',
          password: 'pass1',
          email: 'user1@example.com',
        },
        {
          username: 'user2',
          password: 'pass2',
          email: 'user2@example.com',
        },
      ];

      const result = DataRedactor.redact(data);

      expect(result).toEqual([
        {
          username: 'user1',
          password: '[REDACTED]',
          email: '[REDACTED]',
        },
        {
          username: 'user2',
          password: '[REDACTED]',
          email: '[REDACTED]',
        },
      ]);
    });

    it('should handle custom sensitive fields', () => {
      const data = {
        username: 'john_doe',
        customSecret: 'very-secret',
        safeField: 'visible',
      };

      const result = DataRedactor.redact(data, ['customSecret']);

      expect(result).toEqual({
        username: 'john_doe',
        customSecret: '[REDACTED]',
        safeField: 'visible',
      });
    });

    it('should handle case-insensitive field matching', () => {
      const data = {
        Password: 'secret1',
        PASSWORD: 'secret2',
        passWord: 'secret3',
        safeField: 'visible',
      };

      const result = DataRedactor.redact(data);

      expect(result).toEqual({
        Password: '[REDACTED]',
        PASSWORD: '[REDACTED]',
        passWord: '[REDACTED]',
        safeField: 'visible',
      });
    });

    it('should return primitive values unchanged', () => {
      expect(DataRedactor.redact('test string')).toBe('test string');
      expect(DataRedactor.redact(123)).toBe(123);
      expect(DataRedactor.redact(null)).toBe(null);
      expect(DataRedactor.redact(undefined)).toBe(undefined);
    });

    it('should handle empty objects and arrays', () => {
      expect(DataRedactor.redact({})).toEqual({});
      expect(DataRedactor.redact([])).toEqual([]);
    });
  });

  describe('redactHeaders', () => {
    it('should redact sensitive headers', () => {
      const headers = {
        'content-type': 'application/json',
        authorization: 'Bearer token123',
        cookie: 'session=abc123',
        'x-api-key': 'secret-api-key',
        'x-auth-token': 'auth-token-123',
        'user-agent': 'Test-Agent',
        accept: 'application/json',
      };

      const result = DataRedactor.redactHeaders(headers);

      expect(result).toEqual({
        'content-type': 'application/json',
        authorization: '[REDACTED]',
        cookie: '[REDACTED]',
        'x-api-key': '[REDACTED]',
        'x-auth-token': '[REDACTED]',
        'user-agent': 'Test-Agent',
        accept: 'application/json',
      });
    });

    it('should handle undefined header values', () => {
      const headers = {
        authorization: undefined,
        'content-type': 'application/json',
        cookie: 'session=abc123',
      };

      const result = DataRedactor.redactHeaders(headers);

      expect(result).toEqual({
        authorization: '[REDACTED]',
        'content-type': 'application/json',
        cookie: '[REDACTED]',
      });
    });

    it('should handle array header values', () => {
      const headers = {
        authorization: ['Bearer token1', 'Bearer token2'],
        cookie: ['session=abc', 'user=123'],
        accept: ['application/json', 'text/html'],
      };

      const result = DataRedactor.redactHeaders(headers);

      expect(result).toEqual({
        authorization: '[REDACTED]',
        cookie: '[REDACTED]',
        accept: ['application/json', 'text/html'],
      });
    });

    it('should handle empty headers object', () => {
      const result = DataRedactor.redactHeaders({});

      expect(result).toEqual({});
    });
  });
});
