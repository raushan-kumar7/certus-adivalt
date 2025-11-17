import { describe, it, expect } from 'vitest';
import { ValtLogger } from '../../src/valt/logger/valt-logger';
import { LogLevel } from '../../src/types';
import { JsonFormat } from '../../src/valt/logger/formats/json-format';
import { PrettyFormat } from '../../src/valt/logger/formats/pretty-format';
import { CorrelationMiddleware } from '../../src/valt/middleware/correlation-middleware';
import { LoggingMiddleware } from '../../src/valt/middleware/logging-middleware';
import { ResponseMiddleware } from '../../src/valt/middleware/response-middleware';
import { ErrorMiddleware } from '../../src/valt/middleware/error-middleware';
import { DataRedactor } from '../../src/valt/security/data-redaction';

describe('Valt Module Exports', () => {
  it('should export all main components', () => {
    expect(ValtLogger).toBeDefined();
    expect(LogLevel).toBeDefined();
  });

  it('should export logger formats', () => {
    expect(JsonFormat).toBeDefined();
    expect(PrettyFormat).toBeDefined();
  });

  it('should export middleware', () => {
    expect(CorrelationMiddleware).toBeDefined();
    expect(LoggingMiddleware).toBeDefined();
    expect(ResponseMiddleware).toBeDefined();
    expect(ErrorMiddleware).toBeDefined();
  });

  it('should export security components', () => {
    expect(DataRedactor).toBeDefined();
  });
});