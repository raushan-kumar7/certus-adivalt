// import { BaseContext, LogLevel } from './common';

// export interface LogEntry extends BaseContext {
//   level: LogLevel;
//   message: string;
//   service: string;
//   environment: string;
//   version: string;
//   context?: Record<string, unknown>;
//   error?: {
//     name: string;
//     message: string;
//     stack?: string;
//     code?: string;
//     statusCode?: number;
//   };
//   duration?: number;
// }

// export interface LoggerConfig {
//   level: LogLevel;
//   service: string;
//   environment: string;
//   version?: string;
//   redactFields?: string[];
//   prettyPrint?: boolean;
//   timestampFormat?: string;
// }

import { BaseContext, LogLevel } from './common';

/**
 * Represents a single log entry.
 * Contains metadata, contextual fields, and optional error info.
 */
export interface LogEntry extends BaseContext {
  /** Log severity level */
  level: LogLevel;

  /** Log message */
  message: string;

  /** Name of the service emitting the log */
  service: string;

  /** Runtime environment */
  environment: string;

  /** Application version */
  version: string;

  /** Additional structured log context */
  context?: Record<string, unknown>;

  /** Error details for error logs */
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
    statusCode?: number;
  };

  /** Duration of event in ms (useful for performance logs) */
  duration?: number;
}

/**
 * Logger configuration for initializing the logging system.
 */
export interface LoggerConfig {
  /** Minimum log level */
  level: LogLevel;

  /** Service/app name */
  service: string;

  /** Application environment */
  environment: string;

  /** Optional version string */
  version?: string;

  /** Sensitive fields to redact */
  redactFields?: string[];

  /** Enable pretty output */
  prettyPrint?: boolean;

  /** Timestamp formatting */
  timestampFormat?: string;
}