import { LogEntry, LoggerConfig, LogLevel } from '@/types';

/**
 * JSON formatter for structured logging in the CertusAdiValt system.
 *
 * Transforms LogEntry objects into JSON strings with consistent formatting,
 * timestamp normalization, and configurable output structure. Ensures all
 * log entries follow a standardized JSON format for easy parsing and analysis
 * by log aggregation systems.
 *
 * @class JsonFormat
 *
 * @example
 * ```typescript
 * // Create formatter with configuration
 * const formatter = new JsonFormat({
 *   level: LogLevel.INFO,
 *   service: 'user-service',
 *   environment: 'production',
 *   version: '1.0.0',
 *   redactFields: ['password', 'token'],
 *   prettyPrint: false,
 *   timestampFormat: 'ISO'
 * });
 *
 * // Format log entry
 * const logEntry: LogEntry = {
 *   timestamp: new Date(),
 *   level: LogLevel.INFO,
 *   message: 'User login successful',
 *   service: 'user-service',
 *   environment: 'production',
 *   version: '1.0.0',
 *   requestId: 'req_123456',
 *   userId: 'user_789',
 *   context: { loginMethod: 'email', ip: '192.168.1.1' }
 * };
 *
 * const jsonOutput = formatter.format(logEntry);
 * // Output: {"timestamp":"2024-01-15T10:30:00.000Z","level":"INFO","service":"user-service",...}
 * ```
 */
export class JsonFormat {
  /**
   * Creates a new JSON formatter instance.
   *
   * @param {Required<LoggerConfig>} config - Required logger configuration
   *
   * @example
   * ```typescript
   * const config: Required<LoggerConfig> = {
   *   level: LogLevel.DEBUG,
   *   service: 'api-gateway',
   *   environment: 'development',
   *   version: '2.1.0',
   *   redactFields: ['authorization', 'cookie'],
   *   prettyPrint: true,
   *   timestampFormat: 'ISO'
   * };
   *
   * const formatter = new JsonFormat(config);
   * ```
   */
  constructor(private config: Required<LoggerConfig>) {}

  /**
   * Formats a LogEntry into a JSON string with consistent structure.
   *
   * Transforms the log entry into a structured JSON object with all optional
   * fields included only when they have values. Ensures consistent field ordering
   * and handles timestamp formatting according to configuration.
   *
   * @param {LogEntry} entry - The log entry to format
   * @returns {string} JSON string representation of the log entry
   *
   * @example
   * ```typescript
   * // Basic log entry
   * const basicEntry: LogEntry = {
   *   timestamp: new Date('2024-01-15T10:30:00.000Z'),
   *   level: LogLevel.INFO,
   *   message: 'Service started',
   *   service: 'auth-service',
   *   environment: 'production',
   *   version: '1.0.0'
   * };
   *
   * const json = formatter.format(basicEntry);
   * // Result:
   * // {
   * //   "timestamp": "2024-01-15T10:30:00.000Z",
   * //   "level": "INFO",
   * //   "service": "auth-service",
   * //   "environment": "production",
   * //   "version": "1.0.0",
   * //   "message": "Service started"
   * // }
   *
   * // Complex log entry with error and context
   * const errorEntry: LogEntry = {
   *   timestamp: new Date(),
   *   level: LogLevel.ERROR,
   *   message: 'Database connection failed',
   *   service: 'user-service',
   *   environment: 'staging',
   *   version: '1.2.0',
   *   requestId: 'req_abc123',
   *   userId: 'user_456',
   *   context: {
   *     database: 'users_db',
   *     host: 'db.example.com',
   *     port: 5432
   *   },
   *   error: {
   *     name: 'ConnectionError',
   *     message: 'Connection timeout',
   *     stack: 'Error: Connection timeout\n    at connect...'
   *   },
   *   duration: 150 // ms
   * };
   *
   * const errorJson = formatter.format(errorEntry);
   * ```
   */
  format(entry: LogEntry): string {
    const formattedEntry = {
      timestamp: this.formatTimestamp(entry.timestamp),
      level: LogLevel[entry.level],
      service: entry.service,
      environment: entry.environment,
      version: entry.version,
      message: entry.message,
      ...(entry.context && { context: entry.context }),
      ...(entry.error && { error: entry.error }),
      ...(entry.duration && { duration: entry.duration }),
      ...(entry.requestId && { requestId: entry.requestId }),
      ...(entry.userId && { userId: entry.userId }),
      ...(entry.sessionId && { sessionId: entry.sessionId }),
    };

    return JSON.stringify(formattedEntry);
  }

  /**
   * Formats a timestamp according to the configured timestamp format.
   *
   * @private
   * @param {Date} timestamp - The timestamp to format
   * @returns {string} Formatted timestamp string
   *
   * @example
   * ```typescript
   * // ISO format: "2024-01-15T10:30:00.000Z"
   * // UTC format: "Mon, 15 Jan 2024 10:30:00 GMT"
   * // LOCAL format: "1/15/2024, 10:30:00 AM"
   * ```
   */
  private formatTimestamp(timestamp: Date): string {
    switch (this.config.timestampFormat) {
      case 'ISO':
        return timestamp.toISOString();
      case 'UTC':
        return timestamp.toUTCString();
      case 'LOCAL':
        return timestamp.toLocaleString();
      default:
        return timestamp.toISOString();
    }
  }
}
