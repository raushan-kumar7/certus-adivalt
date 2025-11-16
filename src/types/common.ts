export type Environment = 'development' | 'stagging' | 'production' | 'test';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4,
}

export interface BaseContext {
  timestamp: Date;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  [key: string]: unknown;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CertusAdiValtConfig {
  errors: {
    includeStack: boolean;
    logErrors: boolean;
    exposeDetails: boolean;
    formatError?: (error: Error) => Record<string, any>;
  };
  logger: {
    level: LogLevel;
    service: string;
    environment: Environment;
    redactFields: string[];
    prettyPrint: boolean;
    timestampFormat: string;
    version?: string;
  };
  responses: {
    includeTimestamp: boolean;
    includeRequestId: boolean;
    successMessage?: string;
    pagination: {
      defaultPage: number;
      defaultLimit: number;
      maxLimit: number;
    };
  };
  middleware: {
    enableErrorHandler: boolean;
    enableLogging: boolean;
    enableSecurity: boolean;
    skipPaths: string[];
  };
}
