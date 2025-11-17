import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CertusResponseBuilder } from '../../../src/responses/builder';
import { ResponseFormatter } from '../../../src/responses/formatter';
import {
  isSuccessResponse,
  isErrorResponse,
  isPaginatedResponse,
  isEmptyResponse,
} from '../../../src/responses/guards';
import { CertusAdiValtError } from '../../../src/certus';
import { ApiResponse } from '../../../src/types';

describe('Response Module Integration', () => {
  const mockRequestId = 'integration-test-123';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Builder + Formatter Integration', () => {
    it('should build and format success responses consistently', () => {
      const data = { user: { id: 1, name: 'John' } };

      const builtResponse = CertusResponseBuilder.success(data, 'User retrieved', mockRequestId);
      const formattedResponse = ResponseFormatter.formatSuccess(data, {
        message: 'User retrieved',
        requestId: mockRequestId,
      });

      expect(builtResponse).toEqual(formattedResponse);
    });

    it('should build and format error responses consistently', () => {
      const error = new CertusAdiValtError('Not found', 'NOT_FOUND', 404);

      const builtResponse = CertusResponseBuilder.error(error, mockRequestId);
      const formattedResponse = ResponseFormatter.formatError(error, {
        requestId: mockRequestId,
      });

      expect(builtResponse).toEqual(formattedResponse);
    });

    it('should build and format paginated responses consistently', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const pagination = { page: 1, limit: 10, total: 2 };

      const builtResponse = CertusResponseBuilder.paginated(
        data,
        {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        mockRequestId
      );

      const formattedResponse = ResponseFormatter.formatPaginated(data, pagination, {
        requestId: mockRequestId,
      });

      expect(builtResponse).toEqual(formattedResponse);
    });
  });

  describe('Builder + Guards Integration', () => {
    it('should correctly identify builder-created success responses', () => {
      const response = CertusResponseBuilder.success({ data: 'test' });

      expect(isSuccessResponse(response)).toBe(true);
      expect(isErrorResponse(response)).toBe(false);
      expect(isPaginatedResponse(response)).toBe(false);
      expect(isEmptyResponse(response)).toBe(false);
    });

    it('should correctly identify builder-created error responses', () => {
      const error = new Error('Test error');
      const response = CertusResponseBuilder.error(error);

      expect(isSuccessResponse(response)).toBe(false);
      expect(isErrorResponse(response)).toBe(true);
      expect(isPaginatedResponse(response)).toBe(false);
      expect(isEmptyResponse(response)).toBe(false);
    });

    it('should correctly identify builder-created paginated responses', () => {
      const response = CertusResponseBuilder.paginated([{ item: 1 }], {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });

      // Paginated responses ARE identified as success responses (since they have data)
      expect(isSuccessResponse(response)).toBe(true);
      expect(isErrorResponse(response)).toBe(false);
      expect(isPaginatedResponse(response)).toBe(true);
      expect(isEmptyResponse(response)).toBe(false);
    });

    it('should correctly identify builder-created empty responses', () => {
      const response = CertusResponseBuilder.empty('No content');

      expect(isSuccessResponse(response)).toBe(false);
      expect(isErrorResponse(response)).toBe(false);
      expect(isPaginatedResponse(response)).toBe(false);
      expect(isEmptyResponse(response)).toBe(true);
    });
  });

  describe('Formatter + Guards Integration', () => {
    it('should correctly identify formatted success responses', () => {
      const response = ResponseFormatter.formatSuccess({ data: 'test' });

      expect(isSuccessResponse(response)).toBe(true);
      expect(isErrorResponse(response)).toBe(false);
      expect(isPaginatedResponse(response)).toBe(false);
      expect(isEmptyResponse(response)).toBe(false);
    });

    it('should correctly identify formatted error responses from CertusError', () => {
      const error = new CertusAdiValtError('Auth failed', 'AUTH_ERROR', 401);
      const response = ResponseFormatter.formatError(error);

      expect(isSuccessResponse(response)).toBe(false);
      expect(isErrorResponse(response)).toBe(true);
      expect(isPaginatedResponse(response)).toBe(false);
      expect(isEmptyResponse(response)).toBe(false);
    });

    it('should correctly identify formatted error responses from generic Error', () => {
      const error = new Error('Database error');
      const response = ResponseFormatter.formatError(error);

      expect(isSuccessResponse(response)).toBe(false);
      expect(isErrorResponse(response)).toBe(true);
      expect(isPaginatedResponse(response)).toBe(false);
      expect(isEmptyResponse(response)).toBe(false);
    });

    it('should correctly identify formatted paginated responses', () => {
      const response = ResponseFormatter.formatPaginated([{ id: 1 }], {
        page: 1,
        limit: 10,
        total: 1,
      });

      // Paginated responses ARE identified as success responses (since they have data)
      expect(isSuccessResponse(response)).toBe(true);
      expect(isErrorResponse(response)).toBe(false);
      expect(isPaginatedResponse(response)).toBe(true);
      expect(isEmptyResponse(response)).toBe(false);
    });
  });

  describe('End-to-End Workflow', () => {
    it('should handle complete success workflow', () => {
      const operationData = { id: 1, status: 'completed' };

      const response = CertusResponseBuilder.success(
        operationData,
        'Operation completed successfully',
        mockRequestId
      );

      expect(response.success).toBe(true);
      expect(response.data).toEqual(operationData);
      expect(response.message).toBe('Operation completed successfully');
      expect(response.requestId).toBe(mockRequestId);

      expect(isSuccessResponse(response)).toBe(true);
      expect(isErrorResponse(response)).toBe(false);

      if (isSuccessResponse(response)) {
        expect(response.data.id).toBe(1);
      }
    });

    it('should handle complete error workflow', () => {
      const originalError = new Error('Database connection failed');
      const certusError = new CertusAdiValtError(
        'Service unavailable',
        'SERVICE_UNAVAILABLE',
        503,
        { retryAfter: 300 },
        originalError
      );

      const response = ResponseFormatter.formatError(certusError, {
        requestId: mockRequestId,
        includeDetails: true,
      });

      expect(response.success).toBe(false);
      expect(response.error.code).toBe('SERVICE_UNAVAILABLE');
      expect(response.error.statusCode).toBe(503);
      expect(response.error.context).toEqual({ retryAfter: 300 });

      expect(isErrorResponse(response)).toBe(true);
      expect(isSuccessResponse(response)).toBe(false);

      if (isErrorResponse(response)) {
        expect(response.error.message).toBe('Service unavailable');
      }
    });

    it('should handle complete pagination workflow', () => {
      const items = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
      const paginationInfo = { page: 2, limit: 3, total: 10 };

      const response = ResponseFormatter.formatPaginated(items, paginationInfo, {
        requestId: mockRequestId,
        meta: { searchQuery: 'test' },
      });

      expect(response.success).toBe(true);
      expect(response.data).toEqual(items);
      expect(response.pagination.page).toBe(2);
      expect(response.pagination.limit).toBe(3);
      expect(response.pagination.total).toBe(10);
      expect(response.pagination.totalPages).toBe(4);
      expect(response.pagination.hasNext).toBe(true);
      expect(response.pagination.hasPrev).toBe(true);
      expect(response.meta).toEqual({ searchQuery: 'test' });

      // Paginated responses ARE identified as success responses (since they have data)
      expect(isPaginatedResponse(response)).toBe(true);
      expect(isSuccessResponse(response)).toBe(true);

      if (isPaginatedResponse(response)) {
        expect(response.data.length).toBe(5);
        expect(response.pagination.hasNext).toBe(true);
      }
    });

    it('should handle type-safe response processing', () => {
      const responses: ApiResponse[] = [
        CertusResponseBuilder.success({ user: 'john' }, 'User found', mockRequestId),
        CertusResponseBuilder.error(new Error('Not found'), mockRequestId),
        CertusResponseBuilder.paginated(
          [{ id: 1 }, { id: 2 }],
          { page: 1, limit: 10, total: 2, totalPages: 1, hasNext: false, hasPrev: false },
          mockRequestId
        ),
        CertusResponseBuilder.empty('Resource deleted', mockRequestId),
      ];

      const successResponses = responses.filter(isSuccessResponse);
      const errorResponses = responses.filter(isErrorResponse);
      const paginatedResponses = responses.filter(isPaginatedResponse);
      const emptyResponses = responses.filter(isEmptyResponse);

      // Both SuccessResponse and PaginatedResponse are identified as success responses
      expect(successResponses.length).toBe(2);
      expect(errorResponses.length).toBe(1);
      expect(paginatedResponses.length).toBe(1);
      expect(emptyResponses.length).toBe(1);

      if (successResponses[0] && isSuccessResponse(successResponses[0])) {
        expect(successResponses[0].data.user).toBe('john');
      }

      if (errorResponses[0] && isErrorResponse(errorResponses[0])) {
        expect(errorResponses[0].error.code).toBe('UNKNOWN_ERROR');
      }

      if (paginatedResponses[0] && isPaginatedResponse(paginatedResponses[0])) {
        expect(paginatedResponses[0].data.length).toBe(2);
      }

      if (emptyResponses[0] && isEmptyResponse(emptyResponses[0])) {
        expect(emptyResponses[0].message).toBe('Resource deleted');
      }
    });
  });

  describe('Error Handling Integration', () => {
    it('should properly handle nested errors in formatter', () => {
      const nestedError = new CertusAdiValtError('Outer error', 'OUTER_ERROR', 400, {
        original: new Error('Inner error'),
      });

      const response = ResponseFormatter.formatError(nestedError, {
        requestId: mockRequestId,
      });

      expect(isErrorResponse(response)).toBe(true);
      if (isErrorResponse(response)) {
        expect(response.error.code).toBe('OUTER_ERROR');
        expect(response.error.context).toEqual({ original: new Error('Inner error') });
      }
    });

    it('should handle edge cases in pagination calculations', () => {
      const testCases = [
        { total: 0, limit: 10, expectedPages: 0 },
        { total: 1, limit: 1, expectedPages: 1 },
        { total: 10, limit: 3, expectedPages: 4 },
        { total: 100, limit: 25, expectedPages: 4 },
      ];

      testCases.forEach(({ total, limit, expectedPages }) => {
        const response = ResponseFormatter.formatPaginated(
          [],
          { page: 1, limit, total },
          { requestId: mockRequestId }
        );

        if (isPaginatedResponse(response)) {
          expect(response.pagination.totalPages).toBe(expectedPages);
        }
      });
    });
  });
});