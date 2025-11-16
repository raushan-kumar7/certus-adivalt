import { LogEntry, LogLevel, LoggerConfig } from '@/types';
import { JsonFormat, PrettyFormat } from './formats';

export class ValtLogger {
  private config: Required<LoggerConfig>;
  private jsonFormat: JsonFormat;
  private prettyFormat: PrettyFormat;

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

  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level;
  }

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

  private writeLog(entry: LogEntry): void {
    const formattedLog = this.config.prettyPrint
      ? this.prettyFormat.format(entry)
      : this.jsonFormat.format(entry);

    const consoleMethod = this.getConsoleMethod(entry.level);
    consoleMethod(formattedLog);
  }

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
  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.writeLog(entry);
  }

  warn(message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const entry = this.createLogEntry(LogLevel.WARN, message, context, error);
    this.writeLog(entry);
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.writeLog(entry);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.writeLog(entry);
  }

  trace(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.TRACE)) return;
    const entry = this.createLogEntry(LogLevel.TRACE, message, context);
    this.writeLog(entry);
  }

  // Method for timing operations
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

  // Child logger creation
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
