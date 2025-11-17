import { describe, it, expect, beforeEach } from 'vitest';
import { JsonFormat } from '../../../../src/valt/logger/formats/json-format';
import { LogLevel } from '../../../../src/types';
import type { LoggerConfig, LogEntry } from '../../../../src/types';

describe('JsonFormat', () => {
  let config: Required<LoggerConfig>;
  let jsonFormat: JsonFormat;

  beforeEach(() => {
    config = {
      level: LogLevel.INFO,
      service: 'test-service',
      environment: 'test',
      version: '1.0.0',
      redactFields: [],
      prettyPrint: false,
      timestampFormat: 'ISO',
    };
    jsonFormat = new JsonFormat(config);
  });

  it('should format basic log entry correctly', () => {
    const entry: LogEntry = {
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      level: LogLevel.INFO,
      message: 'Test message',
      service: 'test-service',
      environment: 'test',
      version: '1.0.0',
    };

    const result = jsonFormat.format(entry);
    const parsed = JSON.parse(result);

    expect(parsed).toMatchObject({
      timestamp: '2023-01-01T00:00:00.000Z',
      level: 'INFO',
      service: 'test-service',
      environment: 'test',
      version: '1.0.0',
      message: 'Test message',
    });
  });

  it('should include context in formatted output', () => {
    const entry: LogEntry = {
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      level: LogLevel.INFO,
      message: 'Test message',
      service: 'test-service',
      environment: 'test',
      version: '1.0.0',
      context: { userId: '123', action: 'login' },
    };

    const result = jsonFormat.format(entry);
    const parsed = JSON.parse(result);

    expect(parsed.context).toEqual({ userId: '123', action: 'login' });
  });

  it('should include error details in formatted output', () => {
    const error = new Error('Test error');
    const entry: LogEntry = {
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      level: LogLevel.ERROR,
      message: 'Test message',
      service: 'test-service',
      environment: 'test',
      version: '1.0.0',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    };

    const result = jsonFormat.format(entry);
    const parsed = JSON.parse(result);

    expect(parsed.error).toEqual({
      name: 'Error',
      message: 'Test error',
      stack: expect.any(String),
    });
  });

  it('should include additional fields in formatted output', () => {
    const entry: LogEntry = {
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      level: LogLevel.INFO,
      message: 'Test message',
      service: 'test-service',
      environment: 'test',
      version: '1.0.0',
      requestId: 'req-123',
      userId: 'user-123',
      sessionId: 'session-123',
      duration: 150,
    };

    const result = jsonFormat.format(entry);
    const parsed = JSON.parse(result);

    expect(parsed).toMatchObject({
      requestId: 'req-123',
      userId: 'user-123',
      sessionId: 'session-123',
      duration: 150,
    });
  });

  it('should format timestamp according to config', () => {
    const timestamp = new Date('2023-01-01T00:00:00.000Z');

    const isoConfig = { ...config, timestampFormat: 'ISO' as const };
    const isoFormat = new JsonFormat(isoConfig);
    const isoResult = isoFormat.format({ ...baseEntry(), timestamp });
    expect(JSON.parse(isoResult).timestamp).toBe('2023-01-01T00:00:00.000Z');

    const utcConfig = { ...config, timestampFormat: 'UTC' as const };
    const utcFormat = new JsonFormat(utcConfig);
    const utcResult = utcFormat.format({ ...baseEntry(), timestamp });
    expect(JSON.parse(utcResult).timestamp).toBe(timestamp.toUTCString());
  });

  function baseEntry(): Omit<LogEntry, 'timestamp'> {
    return {
      level: LogLevel.INFO,
      message: 'Test message',
      service: 'test-service',
      environment: 'test',
      version: '1.0.0',
    };
  }
});