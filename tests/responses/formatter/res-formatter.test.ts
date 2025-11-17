import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResponseFormatter } from '../../../src/responses/formatter';
import { CertusAdiValtError } from '../../../src/certus';

describe('ResponseFormatter', () => {
  const mockRequestId = 'test-request-123';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatSuccess', () => {
    it('should format success response with data only', () => {
      const data = { id: 1, name: 'Test' };
      const result = ResponseFormatter.formatSuccess(data);

      expect(result).toEqual({
        success: true,
        data,
        timestamp: expect.any(String),
      });
    });

    it('should format success response with all options', () => {
      const data = { id: 1 };
      const options = {
        message: 'Success message',
        requestId: mockRequestId,
        meta: { version: '1.0' },
      };

      const result = ResponseFormatter.formatSuccess(data, options);

      expect(result).toEqual({
        success: true,
        data,
        message: 'Success message',
        timestamp: expect.any(String),
        requestId: mockRequestId,
        meta: { version: '1.0' },
      });
    });

    it('should handle empty options object', () => {
      const data = { id: 1 };
      const result = ResponseFormatter.formatSuccess(data, {});

      expect(result).toEqual({
        success: true,
        data,
        timestamp: expect.any(String),
      });
    });
  });

  describe('formatError', () => {
    it('should format CertusAdiValtError with details', () => {
      const error = new CertusAdiValtError('Validation failed', 'VALIDATION_ERROR', 422, {
        field: 'email',
      });

      const result = ResponseFormatter.formatError(error, {
        requestId: mockRequestId,
        includeDetails: true,
      });

      expect(result).toEqual({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          statusCode: 422,
          timestamp: expect.any(String),
          context: { field: 'email' },
          requestId: mockRequestId,
        },
      });
    });

    it('should format generic Error with includeDetails false', () => {
      const error = new Error('Database connection failed');

      const result = ResponseFormatter.formatError(error, {
        requestId: mockRequestId,
        includeDetails: false,
      });

      expect(result.success).toBe(false);
      expect(result.error.code).toBe('SRV_INTERNAL_ERROR');
      expect(result.error.message).toBe('Internal server error');
      expect(result.error.statusCode).toBe(500);
      expect(result.error.timestamp).toBeDefined();
      expect(result.error.requestId).toBe(mockRequestId);
      // Note: context may be present in the actual implementation
    });

    it('should format generic Error with includeDetails true', () => {
      const error = new Error('Database connection failed');

      const result = ResponseFormatter.formatError(error, {
        requestId: mockRequestId,
        includeDetails: true,
      });

      expect(result.success).toBe(false);
      expect(result.error.code).toBe('SRV_INTERNAL_ERROR');
      expect(result.error.message).toBe('Database connection failed');
      expect(result.error.statusCode).toBe(500);
      expect(result.error.timestamp).toBeDefined();
      expect(result.error.requestId).toBe(mockRequestId);
      // Note: context may be present in the actual implementation
    });

    it('should format non-Error objects', () => {
      const error = 'String error';
      const result = ResponseFormatter.formatError(error, {
        requestId: mockRequestId,
      });

      expect(result.success).toBe(false);
      expect(result.error.code).toBe('SRV_INTERNAL_ERROR');
      expect(result.error.message).toBe('An unexpected error occurred');
      expect(result.error.statusCode).toBe(500);
      expect(result.error.timestamp).toBeDefined();
      expect(result.error.requestId).toBe(mockRequestId);
    });

    it('should handle null and undefined errors', () => {
      const result1 = ResponseFormatter.formatError(null, { requestId: mockRequestId });
      const result2 = ResponseFormatter.formatError(undefined, { requestId: mockRequestId });

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
      expect(result1.error.code).toBe('SRV_INTERNAL_ERROR');
      expect(result2.error.code).toBe('SRV_INTERNAL_ERROR');
    });

    it('should use default options when not provided', () => {
      const error = new Error('Test error');
      const result = ResponseFormatter.formatError(error);

      expect(result.success).toBe(false);
      expect(result.error.code).toBe('SRV_INTERNAL_ERROR');
      expect(result.error.message).toBe('Internal server error');
    });
  });

  describe('formatPaginated', () => {
    it('should format paginated response correctly', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const pagination = {
        page: 2,
        limit: 2,
        total: 10,
      };

      const result = ResponseFormatter.formatPaginated(data, pagination, {
        requestId: mockRequestId,
        meta: { search: 'test' },
      });

      expect(result).toEqual({
        success: true,
        data,
        pagination: {
          page: 2,
          limit: 2,
          total: 10,
          totalPages: 5,
          hasNext: true,
          hasPrev: true,
        },
        timestamp: expect.any(String),
        requestId: mockRequestId,
        meta: { search: 'test' },
      });
    });

    it('should calculate pagination fields correctly', () => {
      const testCases = [
        { page: 1, limit: 5, total: 10, expectedTotalPages: 2, hasNext: true, hasPrev: false },
        { page: 2, limit: 5, total: 10, expectedTotalPages: 2, hasNext: false, hasPrev: true },
        { page: 1, limit: 10, total: 5, expectedTotalPages: 1, hasNext: false, hasPrev: false },
        { page: 3, limit: 3, total: 10, expectedTotalPages: 4, hasNext: true, hasPrev: true },
      ];

      testCases.forEach(({ page, limit, total, expectedTotalPages, hasNext, hasPrev }) => {
        const result = ResponseFormatter.formatPaginated([], { page, limit, total });

        expect(result.pagination).toEqual({
          page,
          limit,
          total,
          totalPages: expectedTotalPages,
          hasNext,
          hasPrev,
        });
      });
    });

    it('should handle empty data array', () => {
      const data: any[] = [];
      const pagination = { page: 1, limit: 10, total: 0 };

      const result = ResponseFormatter.formatPaginated(data, pagination);

      expect(result).toEqual({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        timestamp: expect.any(String),
      });
    });

    it('should handle options without meta', () => {
      const data = [{ id: 1 }];
      const pagination = { page: 1, limit: 10, total: 1 };

      const result = ResponseFormatter.formatPaginated(data, pagination, {
        requestId: mockRequestId,
      });

      expect(result).toEqual({
        success: true,
        data,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        timestamp: expect.any(String),
        requestId: mockRequestId,
      });
    });
  });
});
