import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResponseMiddleware } from '../../../src/valt/middleware/response-middleware';
import type { Request, Response, NextFunction } from 'express';

// Mock the responses module first
vi.mock('../../../src/responses', () => {
  const mockResponseFormatter = {
    formatSuccess: vi.fn((data, options) => ({
      success: true,
      data,
      timestamp: '2023-01-01T00:00:00.000Z',
      requestId: options?.requestId,
      message: options?.message,
    })),
  };

  return {
    ResponseFormatter: mockResponseFormatter,
  };
});

// Import after mocking
import { ResponseFormatter } from '../../../src/responses';

describe('ResponseMiddleware', () => {
  let middleware: ResponseMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    middleware = new ResponseMiddleware();

    mockRequest = {
      headers: { 'x-request-id': 'test-request-id' },
    };

    mockResponse = {
      statusCode: 200,
      json: vi.fn(),
    };

    nextFunction = vi.fn();

    // Clear mock calls before each test
    vi.mocked(ResponseFormatter.formatSuccess).mockClear();
  });

  it('should format success responses', () => {
    const handler = middleware.successHandler();
    const originalJson = vi.fn();
    mockResponse.json = originalJson;

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    // Simulate calling res.json with data
    const data = { id: 1, name: 'Test' };
    (mockResponse.json as any).call(mockResponse, data);

    expect(ResponseFormatter.formatSuccess).toHaveBeenCalledWith(data, {
      requestId: 'test-request-id',
      message: undefined,
    });

    expect(originalJson).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data,
      })
    );
  });

  it('should include creation message for 201 status', () => {
    const handler = middleware.successHandler();
    const originalJson = vi.fn();
    mockResponse.json = originalJson;
    mockResponse.statusCode = 201;

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    const data = { id: 1, name: 'Test' };
    (mockResponse.json as any).call(mockResponse, data);

    expect(ResponseFormatter.formatSuccess).toHaveBeenCalledWith(data, {
      requestId: 'test-request-id',
      message: 'Resource created successfully',
    });
  });

  it('should not format already formatted responses', () => {
    const handler = middleware.successHandler();
    const originalJson = vi.fn();
    mockResponse.json = originalJson;

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    // Simulate calling res.json with already formatted response
    const formattedResponse = { success: true, data: { id: 1 }, timestamp: '2023-01-01' };
    (mockResponse.json as any).call(mockResponse, formattedResponse);

    expect(originalJson).toHaveBeenCalledWith(formattedResponse);
  });

  it('should handle requests without request ID', () => {
    mockRequest.headers = {};

    const handler = middleware.successHandler();
    const originalJson = vi.fn();
    mockResponse.json = originalJson;

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    const data = { id: 1, name: 'Test' };
    (mockResponse.json as any).call(mockResponse, data);

    expect(ResponseFormatter.formatSuccess).toHaveBeenCalledWith(data, {
      requestId: undefined,
      message: undefined,
    });
  });

  it('should call next function', () => {
    const handler = middleware.successHandler();
    mockResponse.json = vi.fn();

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });
});