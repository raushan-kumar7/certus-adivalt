import { describe, it, expect } from 'vitest';
import {
  isSuccessResponse,
  isErrorResponse,
  isPaginatedResponse,
  isEmptyResponse,
} from '../../../src/responses/guards';
import {
  SuccessResponse,
  ErrorResponse,
  PaginatedResponse,
  EmptyResponse,
  ApiResponse,
} from '../../../src/types';

describe('Response Guards', () => {
  const mockTimestamp = '2023-01-01T00:00:00.000Z';

  describe('isSuccessResponse', () => {
    it('should return true for SuccessResponse with data', () => {
      const response: SuccessResponse = {
        success: true,
        data: { id: 1, name: 'Test' },
        timestamp: mockTimestamp,
      };

      expect(isSuccessResponse(response)).toBe(true);
    });

    it('should return false for ErrorResponse', () => {
      const response: ErrorResponse = {
        success: false,
        error: {
          code: 'ERROR',
          message: 'Error message',
          statusCode: 400,
          timestamp: mockTimestamp,
        },
      };

      expect(isSuccessResponse(response)).toBe(false);
    });

    it('should return true for PaginatedResponse (since it has data)', () => {
      const response: PaginatedResponse = {
        success: true,
        data: [{ id: 1 }],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        timestamp: mockTimestamp,
      };

      expect(isSuccessResponse(response)).toBe(true);
    });

    it('should return false for EmptyResponse', () => {
      const response: EmptyResponse = {
        success: true,
        timestamp: mockTimestamp,
      };

      expect(isSuccessResponse(response)).toBe(false);
    });

    it('should narrow the type when used in TypeScript', () => {
      const responses: ApiResponse[] = [
        {
          success: true,
          data: { id: 1 },
          timestamp: mockTimestamp,
        },
        {
          success: false,
          error: {
            code: 'ERROR',
            message: 'Error',
            statusCode: 400,
            timestamp: mockTimestamp,
          },
        },
      ];

      const successResponses = responses.filter(isSuccessResponse);
      
      expect(successResponses.length).toBe(1);
      expect(successResponses[0].data).toEqual({ id: 1 });
    });
  });

  describe('isErrorResponse', () => {
    it('should return true for ErrorResponse', () => {
      const response: ErrorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          statusCode: 422,
          timestamp: mockTimestamp,
          details: 'Email is required',
        },
      };

      expect(isErrorResponse(response)).toBe(true);
    });

    it('should return false for SuccessResponse', () => {
      const response: SuccessResponse = {
        success: true,
        data: { id: 1 },
        timestamp: mockTimestamp,
      };

      expect(isErrorResponse(response)).toBe(false);
    });

    it('should return false for PaginatedResponse', () => {
      const response: PaginatedResponse = {
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
        timestamp: mockTimestamp,
      };

      expect(isErrorResponse(response)).toBe(false);
    });

    it('should return false for EmptyResponse', () => {
      const response: EmptyResponse = {
        success: true,
        timestamp: mockTimestamp,
      };

      expect(isErrorResponse(response)).toBe(false);
    });
  });

  describe('isPaginatedResponse', () => {
    it('should return true for PaginatedResponse', () => {
      const response: PaginatedResponse = {
        success: true,
        data: [{ id: 1 }, { id: 2 }],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        timestamp: mockTimestamp,
      };

      expect(isPaginatedResponse(response)).toBe(true);
    });

    it('should return false for SuccessResponse without pagination', () => {
      const response: SuccessResponse = {
        success: true,
        data: { id: 1 },
        timestamp: mockTimestamp,
      };

      expect(isPaginatedResponse(response)).toBe(false);
    });

    it('should return false for ErrorResponse', () => {
      const response: ErrorResponse = {
        success: false,
        error: {
          code: 'ERROR',
          message: 'Error',
          statusCode: 500,
          timestamp: mockTimestamp,
        },
      };

      expect(isPaginatedResponse(response)).toBe(false);
    });

    it('should return false for EmptyResponse', () => {
      const response: EmptyResponse = {
        success: true,
        timestamp: mockTimestamp,
      };

      expect(isPaginatedResponse(response)).toBe(false);
    });

    it('should narrow the type for paginated data access', () => {
      const responses: ApiResponse[] = [
        {
          success: true,
          data: [{ id: 1 }],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
          timestamp: mockTimestamp,
        },
        {
          success: true,
          data: { single: true },
          timestamp: mockTimestamp,
        },
      ];

      const paginatedResponses = responses.filter(isPaginatedResponse);
      
      expect(paginatedResponses.length).toBe(1);
      expect(paginatedResponses[0].pagination.total).toBe(1);
    });
  });

  describe('isEmptyResponse', () => {
    it('should return true for EmptyResponse without data or pagination', () => {
      const response: EmptyResponse = {
        success: true,
        timestamp: mockTimestamp,
      };

      expect(isEmptyResponse(response)).toBe(true);
    });

    it('should return true for EmptyResponse with message', () => {
      const response: EmptyResponse = {
        success: true,
        message: 'Operation completed',
        timestamp: mockTimestamp,
      };

      expect(isEmptyResponse(response)).toBe(true);
    });

    it('should return false for SuccessResponse with data', () => {
      const response: SuccessResponse = {
        success: true,
        data: { id: 1 },
        timestamp: mockTimestamp,
      };

      expect(isEmptyResponse(response)).toBe(false);
    });

    it('should return false for PaginatedResponse', () => {
      const response: PaginatedResponse = {
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
        timestamp: mockTimestamp,
      };

      expect(isEmptyResponse(response)).toBe(false);
    });

    it('should return false for ErrorResponse', () => {
      const response: ErrorResponse = {
        success: false,
        error: {
          code: 'ERROR',
          message: 'Error',
          statusCode: 400,
          timestamp: mockTimestamp,
        },
      };

      expect(isEmptyResponse(response)).toBe(false);
    });

    it('should handle complex type narrowing scenarios', () => {
      const responses: ApiResponse[] = [
        { success: true, timestamp: mockTimestamp }, // EmptyResponse
        { success: true, data: { id: 1 }, timestamp: mockTimestamp }, // SuccessResponse
        { 
          success: true, 
          data: [{ id: 1 }], 
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
          timestamp: mockTimestamp 
        }, // PaginatedResponse (also SuccessResponse)
        { 
          success: false, 
          error: { code: 'ERROR', message: 'Error', statusCode: 400, timestamp: mockTimestamp }
        }, // ErrorResponse
        { success: true, message: 'Another empty', timestamp: mockTimestamp }, // EmptyResponse
      ];

      const emptyResponses = responses.filter(isEmptyResponse);
      const successResponses = responses.filter(isSuccessResponse);
      const paginatedResponses = responses.filter(isPaginatedResponse);
      const errorResponses = responses.filter(isErrorResponse);

      expect(emptyResponses.length).toBe(2);
      expect(successResponses.length).toBe(2); // Both SuccessResponse and PaginatedResponse are success responses
      expect(paginatedResponses.length).toBe(1);
      expect(errorResponses.length).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle responses with additional properties', () => {
      const responseWithExtra = {
        success: true,
        data: { id: 1 },
        timestamp: mockTimestamp,
        extraField: 'should not affect guard',
      } as any;

      expect(isSuccessResponse(responseWithExtra)).toBe(true);
    });

    it('should handle malformed responses gracefully', () => {
      const malformedResponse = {
        success: true,
        // missing data and timestamp
      } as any;

      expect(isSuccessResponse(malformedResponse)).toBe(false);
      expect(isEmptyResponse(malformedResponse)).toBe(true);
    });
  });
});