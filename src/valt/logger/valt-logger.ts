import { LogEntry, LogLevel, LoggerConfig } from '@/types';
import { JsonFormat, PrettyFormat } from './formats';

/**
 * Main logger class for the CertusAdiValt system with structured logging capabilities.
 *
 * Provides a comprehensive logging solution with multiple log levels, formatting options,
 * sensitive data redaction, performance timing, and child logger support. Supports both
 * JSON and pretty-printed formats for different environments.
 *
 * @class ValtLogger
 *
 * @example
 * ```typescript
 * // Create logger instance
 * const logger = new ValtLogger({
 *   level: LogLevel.INFO,
 *   service: 'user-service',
 *   environment: 'production',
 *   version: '1.0.0',
 *   redactFields: ['password', 'token'],
 *   prettyPrint: false
 * });
 *
 * // Basic logging
 * logger.info('User logged in', { userId: '123', method: 'oauth' });
 * logger.error('Database connection failed', { host: 'db.example.com' }, error);
 *
 * // Performance timing
 * const result = logger.time('database-query', () => {
 *   return database.query('SELECT * FROM users');
 * });
 *
 * // Child logger with shared context
 * const requestLogger = logger.child({ requestId: 'req_123', userId: 'user_456' });
 * requestLogger.info('Processing request');
 * ```
 */
export class ValtLogger {
  private config: Required<LoggerConfig>;
  private jsonFormat: JsonFormat;
  private prettyFormat: PrettyFormat;

  /**
   * Creates a new ValtLogger instance with the specified configuration.
   *
   * @param {LoggerConfig} config - Logger configuration options
   *
   * @example
   * ```typescript
   * // Production configuration
   * const prodLogger = new ValtLogger({
   *   level: LogLevel.INFO,
   *   service: 'api-gateway',
   *   environment: 'production',
   *   version: '2.1.0',
   *   redactFields: ['password', 'authorization', 'apiKey'],
   *   prettyPrint: false
   * });
   *
   * // Development configuration
   * const devLogger = new ValtLogger({
   *   level: LogLevel.DEBUG,
   *   service: 'api-gateway',
   *   environment: 'development',
   *   prettyPrint: true
   * });
   * ```
   */
  constructor(config: LoggerConfig) {
    this.config = {
      level: config.level,
      service: config.service,
      environment: config.environment,
      version: config.version || '1.0.0',
      redactFields: config.redactFields || [],
      prettyPrint: config.prettyPrint || false,
      timestampFormat: config.timestampFormat || 'ISO',
    };

    this.jsonFormat = new JsonFormat(this.config);
    this.prettyFormat = new PrettyFormat(this.config);
  }

  /**
   * Checks if a log level should be logged based on configured minimum level.
   *
   * @private
   * @param {LogLevel} level - The log level to check
   * @returns {boolean} True if the level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level;
  }

  /**
   * Creates a structured log entry with proper formatting and redaction.
   *
   * @private
   * @param {LogLevel} level - The log level
   * @param {string} message - The log message
   * @param {Record<string, unknown>} [context] - Optional context data
   * @param {Error} [error] - Optional error object
   * @returns {LogEntry} Structured log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    const baseContext: any = {
      timestamp: new Date(),
      ...context,
    };

    const logEntry: LogEntry = {
      ...baseContext,
      level,
      message,
      service: this.config.service,
      environment: this.config.environment,
      version: this.config.version,
      context: this.redactSensitiveData(context || {}),
    };

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: this.config.environment === 'development' ? error.stack : undefined,
        ...((error as any).code && { code: (error as any).code }),
        ...((error as any).statusCode && { statusCode: (error as any).statusCode }),
      };
    }

    return logEntry;
  }

  /**
   * Redacts sensitive data from context objects based on configuration.
   *
   * @private
   * @param {Record<string, unknown>} data - The data to redact
   * @returns {Record<string, unknown>} Redacted data
   */
  private redactSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
    if (!this.config.redactFields.length) return data;

    const redacted = { ...data };
    for (const field of this.config.redactFields) {
      if (field in redacted) {
        redacted[field] = '[REDACTED]';
      }
    }
    return redacted;
  }

  /**
   * Writes a log entry to the appropriate output stream with formatting.
   *
   * @private
   * @param {LogEntry} entry - The log entry to write
   */
  private writeLog(entry: LogEntry): void {
    const formattedLog = this.config.prettyPrint
      ? this.prettyFormat.format(entry)
      : this.jsonFormat.format(entry);

    const consoleMethod = this.getConsoleMethod(entry.level);
    consoleMethod(formattedLog);
  }

  /**
   * Gets the appropriate console method for a log level.
   *
   * @private
   * @param {LogLevel} level - The log level
   * @returns {(...args: any[]) => void} Console method function
   */
  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case LogLevel.ERROR:
        return console.error;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.DEBUG:
      case LogLevel.TRACE:
        return console.debug;
      default:
        return console.log;
    }
  }

  // Public API methods

  /**
   * Logs an error message with optional context and error object.
   *
   * @param {string} message - The error message
   * @param {Record<string, unknown>} [context] - Optional context data
   * @param {Error} [error] - Optional error object
   *
   * @example
   * ```typescript
   * try {
   *   await someOperation();
   * } catch (error) {
   *   logger.error('Operation failed', { operation: 'user-create' }, error);
   * }
   *
   * logger.error('Invalid configuration', { configKey: 'database.url' });
   * ```
   */
  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.writeLog(entry);
  }

  /**
   * Logs a warning message with optional context and error object.
   *
   * @param {string} message - The warning message
   * @param {Record<string, unknown>} [context] - Optional context data
   * @param {Error} [error] - Optional error object
   *
   * @example
   * ```typescript
   * logger.warn('Deprecated API called', { endpoint: '/v1/users', alternative: '/v2/users' });
   * logger.warn('High memory usage', { usage: '85%', threshold: '80%' });
   * ```
   */
  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const entry = this.createLogEntry(LogLevel.WARN, message, context, error);
    this.writeLog(entry);
  }

  /**
   * Logs an informational message with optional context.
   *
   * @param {string} message - The info message
   * @param {Record<string, unknown>} [context] - Optional context data
   *
   * @example
   * ```typescript
   * logger.info('User registered', { userId: '123', method: 'email' });
   * logger.info('Server started', { port: 3000, environment: 'production' });
   * ```
   */
  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.writeLog(entry);
  }

  /**
   * Logs a debug message with optional context.
   *
   * @param {string} message - The debug message
   * @param {Record<string, unknown>} [context] - Optional context data
   *
   * @example
   * ```typescript
   * logger.debug('Database query executed', { query: 'SELECT * FROM users', duration: 45 });
   * logger.debug('Cache hit', { key: 'user:123', ttl: 300 });
   * ```
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.writeLog(entry);
  }

  /**
   * Logs a trace message with optional context.
   *
   * @param {string} message - The trace message
   * @param {Record<string, unknown>} [context] - Optional context data
   *
   * @example
   * ```typescript
   * logger.trace('Function called', { args: ['param1', 'param2'], caller: 'userService' });
   * logger.trace('State updated', { previous: 'pending', current: 'completed' });
   * ```
   */
  trace(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.TRACE)) return;
    const entry = this.createLogEntry(LogLevel.TRACE, message, context);
    this.writeLog(entry);
  }

  /**
   * Times the execution of a function and logs the duration.
   *
   * @template T - The return type of the function
   * @param {string} operation - The operation name for logging
   * @param {() => T} fn - The function to time
   * @param {Record<string, unknown>} [context] - Optional context data
   * @returns {T} The result of the function
   *
   * @example
   * ```typescript
   * // Sync function
   * const result = logger.time('process-data', () => {
   *   return processLargeDataset(data);
   * }, { records: data.length });
   *
   * // Async function
   * const user = await logger.time('fetch-user', async () => {
   *   return await userRepository.findById(userId);
   * }, { userId });
   *
   * // With error handling
   * try {
   *   const result = logger.time('risky-operation', riskyFunction, { param: value });
   * } catch (error) {
   *   // Duration is logged even if operation fails
   * }
   * ```
   */
  time<T>(operation: string, fn: () => T, context?: Record<string, unknown>): T {
    const start = Date.now();
    try {
      const result = fn();
      if (result instanceof Promise) {
        return result.then((res) => {
          this.logDuration(operation, Date.now() - start, context);
          return res;
        }) as T;
      }
      this.logDuration(operation, Date.now() - start, context);
      return result;
    } catch (error) {
      this.logDuration(operation, Date.now() - start, { ...context, error });
      throw error;
    }
  }

  /**
   * Logs the duration of an operation.
   *
   * @private
   * @param {string} operation - The operation name
   * @param {number} duration - The duration in milliseconds
   * @param {Record<string, unknown>} [context] - Optional context data
   */
  private logDuration(
    operation: string,
    duration: number,
    context?: Record<string, unknown>
  ): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const level = duration > 1000 ? LogLevel.WARN : LogLevel.INFO;
    const message = `${operation} completed in ${duration}ms`;

    const entry = this.createLogEntry(level, message, {
      ...context,
      operation,
      duration,
      durationUnit: 'ms',
    });

    this.writeLog(entry);
  }

  /**
   * Creates a child logger with inherited context.
   *
   * @param {Record<string, unknown>} context - Context to include in all child logs
   * @returns {ValtLogger} Child logger instance
   *
   * @example
   * ```typescript
   * // Create child logger for request context
   * const requestLogger = logger.child({
   *   requestId: 'req_123',
   *   userId: 'user_456',
   *   sessionId: 'sess_789'
   * });
   *
   * requestLogger.info('Processing request'); // Includes request context
   * requestLogger.debug('Database query', { table: 'users' }); // Merges contexts
   *
   * // Create child logger for module context
   * const authLogger = logger.child({ module: 'authentication' });
   * authLogger.info('User authenticated', { method: 'jwt' });
   * ```
   */
  child(context: Record<string, unknown>): ValtLogger {
    const childConfig = {
      ...this.config,
      service: this.config.service,
    };

    const childLogger = new ValtLogger(childConfig);

    // Override createLogEntry to include parent context
    const originalCreateLogEntry = childLogger.createLogEntry.bind(childLogger);
    childLogger.createLogEntry = (
      level: LogLevel,
      message: string,
      childContext?: Record<string, unknown>,
      error?: Error
    ) => {
      const mergedContext = { ...context, ...childContext };
      return originalCreateLogEntry(level, message, mergedContext, error);
    };

    return childLogger;
  }
}
