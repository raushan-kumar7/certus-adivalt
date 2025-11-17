import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoggingMiddleware } from '../../../src/valt/middleware/logging-middleware';
import { ValtLogger } from '../../../src/valt/logger/valt-logger';
import type { Request, Response, NextFunction } from 'express';
import { LogLevel } from '../../../src/types';

describe('LoggingMiddleware', () => {
  let middleware: LoggingMiddleware;
  let mockLogger: ValtLogger;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockLogger = new ValtLogger({
      level: LogLevel.INFO,
      service: 'test-service',
      environment: 'test',
    });

    vi.spyOn(mockLogger, 'info').mockImplementation(() => {});
    vi.spyOn(mockLogger, 'warn').mockImplementation(() => {});

    middleware = new LoggingMiddleware(mockLogger);

    mockRequest = {
      method: 'GET',
      path: '/test',
      headers: { 'x-request-id': 'test-request-id' },
      ip: '127.0.0.1',
      query: { page: '1' },
      params: { id: '123' },
      get: vi.fn((header: string) => (header === 'User-Agent' ? 'Test-Agent' : undefined)) as any,
    };

    mockResponse = {
      on: vi.fn((event, callback) => {
        if (event === 'finish') {
          // Store the callback to simulate response finish
          (mockResponse as any).finishCallback = callback;
        }
      }) as any,
      statusCode: 200,
      statusMessage: 'OK',
      get: vi.fn((header: string) => (header === 'Content-Length' ? '1024' : undefined)) as any,
    };

    nextFunction = vi.fn();

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should log incoming requests', () => {
    const handler = middleware.requestLogger();

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockLogger.info).toHaveBeenCalledWith('Incoming request', {
      method: 'GET',
      path: '/test',
      requestId: 'test-request-id',
      ip: '127.0.0.1',
      userAgent: 'Test-Agent',
      query: { page: '1' },
      params: { id: '123' },
    });

    expect(nextFunction).toHaveBeenCalled();
  });

  it('should log successful responses', () => {
    const handler = middleware.requestLogger();

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    // Simulate response finish
    const finishCallback = (mockResponse as any).finishCallback;
    finishCallback();

    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('Request completed: 200 OK'),
      expect.objectContaining({
        method: 'GET',
        path: '/test',
        requestId: 'test-request-id',
        statusCode: 200,
        duration: expect.any(Number),
        contentLength: '1024',
        userAgent: 'Test-Agent',
      })
    );
  });

  it('should log warning for error responses', () => {
    mockResponse.statusCode = 404;
    mockResponse.statusMessage = 'Not Found';

    const handler = middleware.requestLogger();

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    // Simulate response finish
    const finishCallback = (mockResponse as any).finishCallback;
    finishCallback();

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Request completed: 404 Not Found'),
      expect.objectContaining({
        statusCode: 404,
      })
    );
  });

  it('should calculate request duration', () => {
    const handler = middleware.requestLogger();

    const startTime = Date.now();
    vi.setSystemTime(startTime);

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    vi.setSystemTime(startTime + 150);

    // Simulate response finish
    const finishCallback = (mockResponse as any).finishCallback;
    finishCallback();

    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('in 150ms'),
      expect.objectContaining({
        duration: 150,
      })
    );
  });

  it('should handle requests without request ID', () => {
    mockRequest.headers = {};

    const handler = middleware.requestLogger();
    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockLogger.info).toHaveBeenCalledWith(
      'Incoming request',
      expect.objectContaining({
        requestId: undefined,
      })
    );
  });
});
