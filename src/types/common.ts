// export type Environment = 'development' | 'stagging' | 'production' | 'test';

// export enum LogLevel {
//   ERROR = 0,
//   WARN = 1,
//   INFO = 2,
//   DEBUG = 3,
//   TRACE = 4,
// }

// export interface BaseContext {
//   timestamp: Date;
//   requestId?: string;
//   userId?: string;
//   sessionId?: string;
//   [key: string]: unknown;
// }

// export interface PaginationParams {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
//   hasNext: boolean;
//   hasPrev: boolean;
// }

// export interface CertusAdiValtConfig {
//   errors: {
//     includeStack: boolean;
//     logErrors: boolean;
//     exposeDetails: boolean;
//     formatError?: (error: Error) => Record<string, any>;
//   };
//   logger: {
//     level: LogLevel;
//     service: string;
//     environment: Environment;
//     redactFields: string[];
//     prettyPrint: boolean;
//     timestampFormat: string;
//     version?: string;
//   };
//   responses: {
//     includeTimestamp: boolean;
//     includeRequestId: boolean;
//     successMessage?: string;
//     pagination: {
//       defaultPage: number;
//       defaultLimit: number;
//       maxLimit: number;
//     };
//   };
//   middleware: {
//     enableErrorHandler: boolean;
//     enableLogging: boolean;
//     enableSecurity: boolean;
//     skipPaths: string[];
//   };
// }

/**
 * Represents the current runtime environment of the application.
 *
 * - `development` → Local development
 * - `stagging` → Pre-production/testing
 * - `production` → Live production
 * - `test` → Automated test environment
 */
export type Environment = 'development' | 'stagging' | 'production' | 'test';

/**
 * Logging severity levels used across the system.
 */
export enum LogLevel {
  /** Critical failures or crashes */
  ERROR = 0,

  /** Recoverable issues, bad input, unexpected flows */
  WARN = 1,

  /** High-level application events */
  INFO = 2,

  /** Low-level debug events */
  DEBUG = 3,

  /** Extremely detailed tracing information */
  TRACE = 4,
}

/**
 * Base context shared across logger, errors, responses.
 * Extend this to attach additional metadata to logs and errors.
 */
export interface BaseContext {
  /** Timestamp when the event occurred */
  timestamp: Date;

  /** Unique ID for tracking a request across services */
  requestId?: string;

  /** ID of the authenticated user (if any) */
  userId?: string;

  /** Session identifier (if any) */
  sessionId?: string;

  /** Additional context fields */
  [key: string]: unknown;
}

/**
 * Pagination details used in paginated responses.
 */
export interface PaginationParams {
  /** Current page number */
  page: number;

  /** Number of items per page */
  limit: number;

  /** Total number of records */
  total: number;

  /** Total number of pages */
  totalPages: number;

  /** Whether the next page exists */
  hasNext: boolean;

  /** Whether the previous page exists */
  hasPrev: boolean;
}

/**
 * Main configuration object for the CertusAdiValt package.
 * Controls error formatting, logging behavior, and API responses.
 */
export interface CertusAdiValtConfig {
  errors: {
    /** Include stack traces in error output */
    includeStack: boolean;

    /** Log errors internally */
    logErrors: boolean;

    /** Expose error details to client (disable in production) */
    exposeDetails: boolean;

    /**
     * Custom function to format errors.
     * Overrides the default error formatter.
     */
    formatError?: (error: Error) => Record<string, any>;
  };

  logger: {
    /** Minimum logging level */
    level: LogLevel;

    /** Name of the running service/app */
    service: string;

    /** Environment name */
    environment: Environment;

    /** Fields to hide from logs (ex: passwords, tokens) */
    redactFields: string[];

    /** Beautify logs instead of JSON */
    prettyPrint: boolean;

    /** Timestamp formatting pattern */
    timestampFormat: string;

    /** Application version */
    version?: string;
  };

  responses: {
    /** Whether to include timestamp in every response */
    includeTimestamp: boolean;

    /** Whether to include requestId */
    includeRequestId: boolean;

    /** Default success message */
    successMessage?: string;

    /** Pagination configuration */
    pagination: {
      /** Default page number */
      defaultPage: number;

      /** Default page size */
      defaultLimit: number;

      /** Maximum allowed limit */
      maxLimit: number;
    };
  };

  middleware: {
    /** Enable built-in error handler middleware */
    enableErrorHandler: boolean;

    /** Enable logging middleware */
    enableLogging: boolean;

    /** Enable security middleware */
    enableSecurity: boolean;

    /** Skip middleware for these paths */
    skipPaths: string[];
  };
}