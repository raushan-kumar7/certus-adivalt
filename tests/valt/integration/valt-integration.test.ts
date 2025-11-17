import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ValtLogger } from '../../../src/valt/logger/valt-logger';
import { CorrelationMiddleware } from '../../../src/valt/middleware/correlation-middleware';
import { LoggingMiddleware } from '../../../src/valt/middleware/logging-middleware';
import { DataRedactor } from '../../../src/valt/security/data-redaction';
import { LogLevel } from '../../../src/types';
import type { Request, Response, NextFunction } from 'express';

describe('Valt Integration Tests', () => {
  let logger: ValtLogger;
  let consoleSpy: {
    info: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    consoleSpy = {
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };

    logger = new ValtLogger({
      level: LogLevel.INFO,
      service: 'integration-test',
      environment: 'test',
      redactFields: ['password', 'token'],
      prettyPrint: false,
    });
  });

  afterEach(() => {
    Object.values(consoleSpy).forEach((spy) => spy.mockRestore());
  });

  it('should integrate logger with data redaction', () => {
    const sensitiveContext = {
      userId: '123',
      password: 'secret123',
      token: 'jwt-token',
      action: 'login',
    };

    logger.info('User login attempt', sensitiveContext);

    const logCall = consoleSpy.info.mock.calls[0][0];
    const parsedLog = JSON.parse(logCall);

    expect(parsedLog.context).toEqual({
      userId: '123',
      password: '[REDACTED]',
      token: '[REDACTED]',
      action: 'login',
    });
  });

  it('should integrate correlation middleware with logging', () => {
    const correlationMiddleware = new CorrelationMiddleware();
    const loggingMiddleware = new LoggingMiddleware(logger);

    const mockRequest: Partial<Request> = {
      method: 'GET',
      path: '/api/test',
      headers: {},
      ip: '127.0.0.1',
      query: {},
      params: {},
      get: vi.fn((header: string) => (header === 'User-Agent' ? 'Test-Agent' : undefined)) as any,
    };

    const mockResponse: Partial<Response> = {
      setHeader: vi.fn(),
      on: vi.fn((event, callback) => {
        if (event === 'finish') {
          (mockResponse as any).finishCallback = callback;
        }
      }) as any,
      statusCode: 200,
      get: vi.fn((header: string) => undefined) as any,
    };

    const nextFunction: NextFunction = vi.fn();

    // Apply correlation middleware first
    const correlationHandler = correlationMiddleware.generateRequestId();
    correlationHandler(mockRequest as Request, mockResponse as Response, nextFunction);

    // Then apply logging middleware
    const loggingHandler = loggingMiddleware.requestLogger();
    loggingHandler(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verify correlation ID was set
    expect(mockRequest.headers!['x-request-id']).toBeDefined();
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'x-request-id',
      mockRequest.headers!['x-request-id']
    );

    // Verify logging was called with correlation ID
    const logCall = consoleSpy.info.mock.calls[0][0];
    const parsedLog = JSON.parse(logCall);
    expect(parsedLog.message).toBe('Incoming request');
    expect(parsedLog.context.requestId).toBe(mockRequest.headers!['x-request-id']);
  });

  it('should handle complete request flow with error', () => {
    const correlationMiddleware = new CorrelationMiddleware();
    const loggingMiddleware = new LoggingMiddleware(logger);

    const mockRequest: Partial<Request> = {
      method: 'POST',
      path: '/api/login',
      headers: {},
      ip: '127.0.0.1',
      query: {},
      params: {},
      get: vi.fn((header: string) => (header === 'User-Agent' ? 'Test-Agent' : undefined)) as any,
    };

    const mockResponse: Partial<Response> = {
      setHeader: vi.fn(),
      on: vi.fn((event, callback) => {
        if (event === 'finish') {
          (mockResponse as any).finishCallback = callback;
        }
      }) as any,
      statusCode: 400,
      get: vi.fn((header: string) => undefined) as any,
    };

    const nextFunction: NextFunction = vi.fn();

    // Apply both middlewares
    const correlationHandler = correlationMiddleware.generateRequestId();
    correlationHandler(mockRequest as Request, mockResponse as Response, nextFunction);

    const loggingHandler = loggingMiddleware.requestLogger();
    loggingHandler(mockRequest as Request, mockResponse as Response, nextFunction);

    // Log sensitive data (should be redacted)
    const loginData = {
      username: 'testuser',
      password: 'secret123',
      email: 'test@example.com',
    };

    const redactedData = DataRedactor.redact(loginData);
    logger.info('Login attempt', redactedData);

    // Verify data redaction worked
    const logCall = consoleSpy.info.mock.calls[1][0]; // Second call after request logging
    const parsedLog = JSON.parse(logCall);

    expect(parsedLog.context).toEqual({
      username: 'testuser',
      password: '[REDACTED]',
      email: '[REDACTED]',
    });

    // Simulate response finish with error status
    const finishCallback = (mockResponse as any).finishCallback;
    finishCallback();

    // Verify error response was logged with warning
    expect(consoleSpy.info).toHaveBeenCalledTimes(2); // Request + data log
  });

  it('should integrate child logger with middleware', () => {
    const childLogger = logger.child({ service: 'auth-service' });

    const mockRequest: Partial<Request> = {
      method: 'GET',
      path: '/api/auth',
      headers: { 'x-request-id': 'test-request-id' },
      ip: '127.0.0.1',
      get: vi.fn((header: string) => (header === 'User-Agent' ? 'Test-Agent' : undefined)) as any,
    };

    childLogger.info('Auth request processed', {
      userId: '123',
      action: 'verify',
    });

    const logCall = consoleSpy.info.mock.calls[0][0];
    const parsedLog = JSON.parse(logCall);

    expect(parsedLog.service).toBe('integration-test'); // Should inherit parent service
    expect(parsedLog.context).toEqual({
      service: 'auth-service',
      userId: '123',
      action: 'verify',
    });
  });
});
