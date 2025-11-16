import { BaseContext } from './common';

export interface ErrorContext extends BaseContext {
  code: string;
  statusCode: number;
  details?: string;
  stack?: string;
  originalError?: unknown;
  [key: string]: unknown;
}

export interface CertusErrorOptions {
  code: string;
  statusCode: number;
  context?: Record<string, unknown>;
  originalError?: Error;
  includeStack?: boolean;
}
