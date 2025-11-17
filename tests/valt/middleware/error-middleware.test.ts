import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorMiddleware } from '../../../src/valt/middleware/error-middleware';
import { ValtLogger } from '../../../src/valt/logger/valt-logger';
import type { Request, Response, NextFunction } from 'express';
import { LogLevel } from '../../../src/types';

// Mock dependencies
vi.mock('../../../src/responses', () => ({
  ResponseFormatter: {
    formatError: vi.fn((error, options) => ({
      success: false,
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message: error.message,
        statusCode: error.statusCode || 500,
        timestamp: '2023-01-01T00:00:00.000Z',
        requestId: options?.requestId,
      },
    })),
  },
  isErrorResponse: vi.fn((response) => !response.success),
}));

vi.mock('../../../src/certus', () => ({
  CertusAdiValtError: class extends Error {
    constructor(message: string, code: string, statusCode: number, context?: any) {
      super(message);
      this.code = code;
      this.statusCode = statusCode;
      this.context = context;
    }
    code: string;
    statusCode: number;
    context?: any;
  },
}));

vi.mock('../../../src/constants', () => ({
  HttpStatus: {
    INTERNAL_SERVER_ERROR: 500,
    NOT_FOUND: 404,
  },
}));

describe('ErrorMiddleware', () => {
  let middleware: ErrorMiddleware;
  let mockLogger: ValtLogger;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockLogger = new ValtLogger({
      level: LogLevel.ERROR,
      service: 'test-service',
      environment: 'test',
    });

    vi.spyOn(mockLogger, 'error').mockImplementation(() => {});

    middleware = new ErrorMiddleware(mockLogger);

    mockRequest = {
      method: 'GET',
      path: '/test',
      headers: { 'x-request-id': 'test-request-id' },
      ip: '127.0.0.1',
      get: vi.fn((header: string) => (header === 'User-Agent' ? 'Test-Agent' : undefined)) as any,
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    nextFunction = vi.fn();
  });

  it('should handle errors and log them', () => {
    const error = new Error('Test error');

    const handler = middleware.handle();
    handler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Request processing error',
      {
        method: 'GET',
        path: '/test',
        requestId: 'test-request-id',
        ip: '127.0.0.1',
        userAgent: 'Test-Agent',
      },
      error
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should handle 404 errors', () => {
    const handler = middleware.notFound();

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should handle errors with custom status code', () => {
    const error = new Error('Custom error');
    (error as any).statusCode = 400;

    const handler = middleware.handle();
    handler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });

  it('should handle errors without request ID', () => {
    mockRequest.headers = {};

    const error = new Error('Test error');
    const handler = middleware.handle();

    handler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Request processing error',
      expect.objectContaining({
        requestId: undefined,
      }),
      error
    );
  });
});
