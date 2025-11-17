import { describe, it, expect, beforeEach } from 'vitest';
import { PrettyFormat } from '../../../../src/valt/logger/formats/pretty-format';
import { LogLevel } from '../../../../src/types';
import type { LoggerConfig, LogEntry } from '../../../../src/types';

describe('PrettyFormat', () => {
  let config: Required<LoggerConfig>;
  let prettyFormat: PrettyFormat;

  beforeEach(() => {
    config = {
      level: LogLevel.INFO,
      service: 'test-service',
      environment: 'development',
      version: '1.0.0',
      redactFields: [],
      prettyPrint: true,
      timestampFormat: 'ISO',
    };
    prettyFormat = new PrettyFormat(config);
  });

  it('should format basic log entry with colors', () => {
    const entry: LogEntry = {
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      level: LogLevel.INFO,
      message: 'Test message',
      service: 'test-service',
      environment: 'development',
      version: '1.0.0',
    };

    const result = prettyFormat.format(entry);

    expect(result).toContain('[2023-01-01T00:00:00.000Z]');
    expect(result).toContain('INFO');
    expect(result).toContain('test-service: Test message');
    expect(result).toContain('\x1b[36m'); // Cyan color for INFO
  });

  it('should include context in formatted output', () => {
    const entry: LogEntry = {
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      level: LogLevel.INFO,
      message: 'Test message',
      service: 'test-service',
      environment: 'development',
      version: '1.0.0',
      context: { userId: '123', action: 'login' },
    };

    const result = prettyFormat.format(entry);

    expect(result).toContain('Context:');
    expect(result).toContain('"userId": "123"');
    expect(result).toContain('"action": "login"');
  });

  it('should include error details in development environment', () => {
    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at test.js:1:1';

    const entry: LogEntry = {
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      level: LogLevel.ERROR,
      message: 'Test message',
      service: 'test-service',
      environment: 'development',
      version: '1.0.0',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    };

    const result = prettyFormat.format(entry);

    expect(result).toContain('Error: Error: Test error');
    expect(result).toContain('Stack: Error: Test error');
    expect(result).toContain('\x1b[31m'); // Red color for ERROR
  });

  it('should not include stack trace in production environment', () => {
    const productionConfig = { ...config, environment: 'production' as const };
    const productionFormat = new PrettyFormat(productionConfig);

    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at test.js:1:1';

    const entry: LogEntry = {
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      level: LogLevel.ERROR,
      message: 'Test message',
      service: 'test-service',
      environment: 'production',
      version: '1.0.0',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    };

    const result = productionFormat.format(entry);

    expect(result).toContain('Error: Error: Test error');
    expect(result).not.toContain('Stack: Error: Test error');
  });

  it('should include duration in formatted output', () => {
    const entry: LogEntry = {
      timestamp: new Date('2023-01-01T00:00:00.000Z'),
      level: LogLevel.INFO,
      message: 'Test message',
      service: 'test-service',
      environment: 'development',
      version: '1.0.0',
      duration: 150,
    };

    const result = prettyFormat.format(entry);

    expect(result).toContain('Duration: 150ms');
  });

  it('should use correct colors for different log levels', () => {
    const levels = [
      { level: LogLevel.ERROR, color: '\x1b[31m' },
      { level: LogLevel.WARN, color: '\x1b[33m' },
      { level: LogLevel.INFO, color: '\x1b[36m' },
      { level: LogLevel.DEBUG, color: '\x1b[35m' },
      { level: LogLevel.TRACE, color: '\x1b[90m' },
    ];

    levels.forEach(({ level, color }) => {
      const entry: LogEntry = {
        timestamp: new Date('2023-01-01T00:00:00.000Z'),
        level,
        message: 'Test message',
        service: 'test-service',
        environment: 'development',
        version: '1.0.0',
      };

      const result = prettyFormat.format(entry);
      expect(result).toContain(color);
    });
  });
});
