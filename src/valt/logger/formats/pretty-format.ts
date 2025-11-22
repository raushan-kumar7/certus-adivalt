import { LogEntry, LogLevel, LoggerConfig } from '../../../types';

/**
 * Pretty formatter for human-readable console logging in the CertusAdiValt system.
 *
 * Transforms LogEntry objects into colorful, formatted strings optimized for
 * human readability during development and debugging. Includes ANSI color codes
 * for different log levels and structured output for context and error information.
 *
 * @class PrettyFormat
 *
 * @example
 * ```typescript
 * // Create pretty formatter for development
 * const formatter = new PrettyFormat({
 *   level: LogLevel.DEBUG,
 *   service: 'user-service',
 *   environment: 'development',
 *   version: '1.0.0',
 *   redactFields: ['password', 'token'],
 *   prettyPrint: true,
 *   timestampFormat: 'LOCAL'
 * });
 *
 * // Format log entry with colors and structure
 * const logEntry: LogEntry = {
 *   timestamp: new Date(),
 *   level: LogLevel.INFO,
 *   message: 'User login successful',
 *   service: 'user-service',
 *   environment: 'development',
 *   version: '1.0.0',
 *   requestId: 'req_123456',
 *   userId: 'user_789',
 *   context: { loginMethod: 'email', ip: '192.168.1.1' }
 * };
 *
 * const prettyOutput = formatter.format(logEntry);
 * // Output (with colors):
 * // [1/15/2024, 10:30:00 AM] INFO  user-service: User login successful
 * ```
 */
export class PrettyFormat {
  /**
   * ANSI color codes mapped to log levels for terminal output.
   *
   * @private
   */
  private colors = {
    [LogLevel.ERROR]: '\x1b[31m', // Red for errors
    [LogLevel.WARN]: '\x1b[33m', // Yellow for warnings
    [LogLevel.INFO]: '\x1b[36m', // Cyan for info
    [LogLevel.DEBUG]: '\x1b[35m', // Magenta for debug
    [LogLevel.TRACE]: '\x1b[90m', // Gray for trace
  };

  /**
   * ANSI reset code to restore terminal default colors.
   *
   * @private
   */
  private reset = '\x1b[0m';

  /**
   * Creates a new pretty formatter instance.
   *
   * @param {Required<LoggerConfig>} config - Required logger configuration
   *
   * @example
   * ```typescript
   * const config: Required<LoggerConfig> = {
   *   level: LogLevel.DEBUG,
   *   service: 'api-service',
   *   environment: 'development',
   *   version: '2.1.0',
   *   redactFields: ['authorization', 'cookie'],
   *   prettyPrint: true,
   *   timestampFormat: 'LOCAL'
   * };
   *
   * const formatter = new PrettyFormat(config);
   * ```
   */
  constructor(private config: Required<LoggerConfig>) {}

  /**
   * Formats a LogEntry into a colorful, human-readable string.
   *
   * Creates a multi-line formatted output with colors, timestamps, and
   * structured presentation of context and error information. Optimized
   * for development and debugging in terminal environments.
   *
   * @param {LogEntry} entry - The log entry to format
   * @returns {string} Colorful, formatted string representation of the log entry
   *
   * @example
   * ```typescript
   * // Basic info log
   * const infoEntry: LogEntry = {
   *   timestamp: new Date('2024-01-15T10:30:00.000Z'),
   *   level: LogLevel.INFO,
   *   message: 'Service started successfully',
   *   service: 'auth-service',
   *   environment: 'development',
   *   version: '1.0.0'
   * };
   *
   * const output = formatter.format(infoEntry);
   * // Output (cyan color):
   * // [1/15/2024, 10:30:00 AM] INFO  auth-service: Service started successfully
   *
   * // Error log with context and stack trace
   * const errorEntry: LogEntry = {
   *   timestamp: new Date(),
   *   level: LogLevel.ERROR,
   *   message: 'Database connection failed',
   *   service: 'user-service',
   *   environment: 'development',
   *   version: '1.2.0',
   *   context: {
   *     database: 'users_db',
   *     host: 'db.example.com',
   *     port: 5432,
   *     timeout: 5000
   *   },
   *   error: {
   *     name: 'ConnectionError',
   *     message: 'Connection timeout after 5000ms',
   *     stack: 'Error: Connection timeout...\n    at Connection.connect...'
   *   },
   *   duration: 5234
   * };
   *
   * const errorOutput = formatter.format(errorEntry);
   * // Output (red color):
   * // [1/15/2024, 10:30:00 AM] ERROR user-service: Database connection failed
   * //   Context: {
   * //     "database": "users_db",
   * //     "host": "db.example.com",
   * //     "port": 5432,
   * //     "timeout": 5000
   * //   }
   * //   Error: ConnectionError: Connection timeout after 5000ms
   * //   Stack: Error: Connection timeout...
   * //     at Connection.connect...
   * //   Duration: 5234ms
   * ```
   */
  format(entry: LogEntry): string {
    const timestamp = this.formatTimestamp(entry.timestamp);
    const level = LogLevel[entry.level].padEnd(5);
    const color = this.colors[entry.level] || this.reset;

    let output = `${color}[${timestamp}] ${level} ${this.config.service}: ${entry.message}${this.reset}`;

    // Add context if present
    if (entry.context && Object.keys(entry.context).length > 0) {
      output += `\n${color}  Context: ${JSON.stringify(entry.context, null, 2)}${this.reset}`;
    }

    // Add error if present
    if (entry.error) {
      output += `\n${color}  Error: ${entry.error.name}: ${entry.error.message}`;
      if (entry.error.stack && this.config.environment === 'development') {
        output += `\n${color}  Stack: ${entry.error.stack}${this.reset}`;
      }
    }

    // Add duration if present
    if (entry.duration) {
      output += `\n${color}  Duration: ${entry.duration}ms${this.reset}`;
    }

    return output;
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
