import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CertusResponseBuilder } from '../../../src/responses/builder';
import { CertusAdiValtError } from '../../../src/certus';

describe('CertusResponseBuilder', () => {
  const mockRequestId = 'test-request-123';
  const mockTimestamp = '2023-01-01T00:00:00.000Z';

  beforeEach(() => {
    // Mock Date for consistent timestamp testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date(mockTimestamp));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('success', () => {
    it('should create a success response with data', () => {
      const data = { id: 1, name: 'Test' };
      const result = CertusResponseBuilder.success(data);

      expect(result).toEqual({
        success: true,
        data,
        timestamp: mockTimestamp,
      });
    });

    it('should create a success response with message and requestId', () => {
      const data = { id: 1 };
      const message = 'Operation successful';
      const result = CertusResponseBuilder.success(data, message, mockRequestId);

      expect(result).toEqual({
        success: true,
        data,
        message,
        timestamp: mockTimestamp,
        requestId: mockRequestId,
      });
    });

    it('should create a success response with meta data', () => {
      const data = { id: 1 };
      const meta = { version: '1.0', source: 'test' };
      const result = CertusResponseBuilder.success(data, undefined, undefined, meta);

      expect(result).toEqual({
        success: true,
        data,
        timestamp: mockTimestamp,
        meta,
      });
    });
  });

  describe('error', () => {
    it('should create an error response from CertusAdiValtError', () => {
      const error = new CertusAdiValtError('Test error', 'TEST_ERROR', 400, { field: 'test' });

      const result = CertusResponseBuilder.error(error, mockRequestId);

      expect(result).toEqual({
        success: false,
        error: {
          code: 'TEST_ERROR',
          message: 'Test error',
          statusCode: 400,
          timestamp: mockTimestamp,
          context: { field: 'test' },
          requestId: mockRequestId,
        },
      });
    });

    it('should create an error response from generic Error', () => {
      const error = new Error('Generic error');
      const result = CertusResponseBuilder.error(error, mockRequestId);

      expect(result).toEqual({
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'Generic error',
          details: 'An unexpected error occurred',
          statusCode: 500,
          timestamp: mockTimestamp,
          requestId: mockRequestId,
        },
      });
    });
  });

  describe('paginated', () => {
    it('should create a paginated response', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const pagination = {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };

      const result = CertusResponseBuilder.paginated(data, pagination, mockRequestId);

      expect(result).toEqual({
        success: true,
        data,
        pagination,
        timestamp: mockTimestamp,
        requestId: mockRequestId,
      });
    });

    it('should create a paginated response with meta data', () => {
      const data = [{ id: 1 }];
      const pagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };
      const meta = { filtered: true };

      const result = CertusResponseBuilder.paginated(data, pagination, mockRequestId, meta);

      expect(result).toEqual({
        success: true,
        data,
        pagination,
        timestamp: mockTimestamp,
        requestId: mockRequestId,
        meta,
      });
    });
  });

  describe('empty', () => {
    it('should create an empty response', () => {
      const result = CertusResponseBuilder.empty();

      expect(result).toEqual({
        success: true,
        timestamp: mockTimestamp,
      });
    });

    it('should create an empty response with message and requestId', () => {
      const message = 'No content';
      const result = CertusResponseBuilder.empty(message, mockRequestId);

      expect(result).toEqual({
        success: true,
        message,
        timestamp: mockTimestamp,
        requestId: mockRequestId,
      });
    });
  });

  describe('convenience methods', () => {
    it('should create a created response', () => {
      const data = { id: 1, name: 'New Resource' };
      const result = CertusResponseBuilder.created(data, undefined, mockRequestId);

      expect(result).toEqual({
        success: true,
        data,
        message: 'Resource created successfully',
        timestamp: mockTimestamp,
        requestId: mockRequestId,
      });
    });

    it('should create an updated response', () => {
      const data = { id: 1, name: 'Updated Resource' };
      const result = CertusResponseBuilder.updated(data, undefined, mockRequestId);

      expect(result).toEqual({
        success: true,
        data,
        message: 'Resource updated successfully',
        timestamp: mockTimestamp,
        requestId: mockRequestId,
      });
    });

    it('should create a deleted response', () => {
      const result = CertusResponseBuilder.deleted(undefined, mockRequestId);

      expect(result).toEqual({
        success: true,
        message: 'Resource deleted successfully',
        timestamp: mockTimestamp,
        requestId: mockRequestId,
      });
    });

    it('should allow custom messages for convenience methods', () => {
      const createdResult = CertusResponseBuilder.created(
        { id: 1 },
        'Custom created message',
        mockRequestId
      );
      const updatedResult = CertusResponseBuilder.updated(
        { id: 1 },
        'Custom updated message',
        mockRequestId
      );
      const deletedResult = CertusResponseBuilder.deleted('Custom deleted message', mockRequestId);

      expect(createdResult.message).toBe('Custom created message');
      expect(updatedResult.message).toBe('Custom updated message');
      expect(deletedResult.message).toBe('Custom deleted message');
    });
  });

  describe('timestamp generation', () => {
    it('should generate ISO string timestamps', () => {
      const testDate = new Date('2023-12-01T12:00:00.000Z');
      vi.setSystemTime(testDate);

      const result = CertusResponseBuilder.success({});

      expect(result.timestamp).toBe(testDate.toISOString());
      expect(new Date(result.timestamp).getTime()).toBe(testDate.getTime());
    });
  });
});