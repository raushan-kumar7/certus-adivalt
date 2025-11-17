import { describe, it, expect } from 'vitest';
import * as ResponsesModule from '../../src/responses';

describe('Responses Module Exports', () => {
  it('should export ResponseBuilder', () => {
    expect(ResponsesModule.CertusResponseBuilder).toBeDefined();
    expect(typeof ResponsesModule.CertusResponseBuilder.success).toBe('function');
    expect(typeof ResponsesModule.CertusResponseBuilder.error).toBe('function');
    expect(typeof ResponsesModule.CertusResponseBuilder.paginated).toBe('function');
  });

  it('should export ResponseFormatter', () => {
    expect(ResponsesModule.ResponseFormatter).toBeDefined();
    expect(typeof ResponsesModule.ResponseFormatter.formatSuccess).toBe('function');
    expect(typeof ResponsesModule.ResponseFormatter.formatError).toBe('function');
    expect(typeof ResponsesModule.ResponseFormatter.formatPaginated).toBe('function');
  });

  it('should export response guards', () => {
    expect(ResponsesModule.isSuccessResponse).toBeDefined();
    expect(ResponsesModule.isErrorResponse).toBeDefined();
    expect(ResponsesModule.isPaginatedResponse).toBeDefined();
    expect(ResponsesModule.isEmptyResponse).toBeDefined();

    expect(typeof ResponsesModule.isSuccessResponse).toBe('function');
    expect(typeof ResponsesModule.isErrorResponse).toBe('function');
    expect(typeof ResponsesModule.isPaginatedResponse).toBe('function');
    expect(typeof ResponsesModule.isEmptyResponse).toBe('function');
  });

  it('should have all exports properly defined', () => {
    const exports = Object.keys(ResponsesModule);

    expect(exports).toContain('CertusResponseBuilder');
    expect(exports).toContain('ResponseFormatter');
    expect(exports).toContain('isSuccessResponse');
    expect(exports).toContain('isErrorResponse');
    expect(exports).toContain('isPaginatedResponse');
    expect(exports).toContain('isEmptyResponse');
  });

  it('should allow importing individual modules', async () => {
    const { CertusResponseBuilder } = await import('../../src/responses/builder');
    const { ResponseFormatter } = await import('../../src/responses/formatter');
    const { isSuccessResponse } = await import('../../src/responses/guards');

    expect(CertusResponseBuilder).toBeDefined();
    expect(ResponseFormatter).toBeDefined();
    expect(isSuccessResponse).toBeDefined();
  });

  it('should maintain consistent API across imports', () => {
    const { CertusResponseBuilder: MainBuilder } = ResponsesModule;

    // Test that the main export has the same methods as expected
    expect(typeof MainBuilder.success).toBe('function');
    expect(typeof MainBuilder.error).toBe('function');
    expect(typeof MainBuilder.paginated).toBe('function');
    expect(typeof MainBuilder.empty).toBe('function');

    // Test that we can use the builder from main export
    const response = MainBuilder.success({ test: true });
    expect(response.success).toBe(true);
    expect(response.data).toEqual({ test: true });
  });
});
