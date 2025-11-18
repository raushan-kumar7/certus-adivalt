// import { BaseContext } from './common';

// export interface ErrorContext extends BaseContext {
//   code: string;
//   statusCode: number;
//   details?: string;
//   stack?: string;
//   originalError?: unknown;
//   [key: string]: unknown;
// }

// export interface CertusErrorOptions {
//   code: string;
//   statusCode: number;
//   context?: Record<string, unknown>;
//   originalError?: Error;
//   includeStack?: boolean;
// }

import { BaseContext } from './common';

/**
 * Additional metadata provided when an error occurs.
 * Extends BaseContext to add error-specific information.
 */
export interface ErrorContext extends BaseContext {
  /** Unique error code */
  code: string;

  /** HTTP status code */
  statusCode: number;

  /** Human-readable details */
  details?: string;

  /** Stack trace (included based on config) */
  stack?: string;

  /** The original thrown error */
  originalError?: unknown;

  /** Additional custom fields */
  [key: string]: unknown;
}

/**
 * Options used when creating a new CertusError instance.
 */
export interface CertusErrorOptions {
  /** Unique error code */
  code: string;

  /** HTTP status code */
  statusCode: number;

  /** Extra contextual metadata */
  context?: Record<string, unknown>;

  /** Original thrown error (if wrapping one) */
  originalError?: Error;

  /** Force include/exclude stack trace */
  includeStack?: boolean;
}