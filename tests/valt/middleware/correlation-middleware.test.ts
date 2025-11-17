import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CorrelationMiddleware } from '../../../src/valt/middleware/correlation-middleware';
import type { Request, Response, NextFunction } from 'express';

describe('CorrelationMiddleware', () => {
  let middleware: CorrelationMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    middleware = new CorrelationMiddleware();
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      setHeader: vi.fn(),
    };
    nextFunction = vi.fn();
  });

  it('should generate request ID when not present in headers', () => {
    const handler = middleware.generateRequestId();

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.headers!['x-request-id']).toBeDefined();
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'x-request-id',
      mockRequest.headers!['x-request-id']
    );
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should use existing request ID from headers', () => {
    const existingRequestId = 'existing-request-id';
    mockRequest.headers = { 'x-request-id': existingRequestId };

    const handler = middleware.generateRequestId();

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.headers!['x-request-id']).toBe(existingRequestId);
    expect(mockResponse.setHeader).toHaveBeenCalledWith('x-request-id', existingRequestId);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should generate valid UUID format', () => {
    const handler = middleware.generateRequestId();

    handler(mockRequest as Request, mockResponse as Response, nextFunction);

    const requestId = mockRequest.headers!['x-request-id'] as string;
    expect(requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });
});
