// import { ErrorCodes, HttpStatus } from '@/constants';
// import { ErrorContext } from '@/types';

// export class CertusAdiValtError extends Error {
//   public readonly code: string;
//   public readonly statusCode: number;
//   public readonly timestamp: Date;
//   public readonly context: Record<string, unknown>;
//   public readonly originalError?: Error;

//   constructor(
//     message: string,
//     code: string = ErrorCodes.SRV_INTERNAL_ERROR,
//     statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
//     context: Record<string, unknown> = {},
//     originalError?: Error
//   ) {
//     super(message);
//     this.name = 'CertusAdiValtError';
//     this.code = code;
//     this.statusCode = statusCode;
//     this.timestamp = new Date();
//     this.context = context;
//     this.originalError = originalError;

//     if (Error.captureStackTrace) {
//       Error.captureStackTrace(this, CertusAdiValtError);
//     }

//     Object.setPrototypeOf(this, CertusAdiValtError.prototype);
//   }

//   public toJSON(): ErrorContext {
//     return {
//       name: this.name,
//       message: this.message,
//       code: this.code,
//       statusCode: this.statusCode,
//       timestamp: this.timestamp,
//       context: this.context,
//       stack: this.stack,
//       originalError: this.originalError
//         ? {
//             name: this.originalError.name,
//             message: this.originalError.message,
//             stack: this.originalError.stack,
//           }
//         : undefined,
//     };
//   }

//   public toLog(): Record<string, unknown> {
//     return {
//       error: {
//         name: this.name,
//         message: this.message,
//         code: this.code,
//         statusCode: this.statusCode,
//         stack: this.stack,
//       },
//       context: this.context,
//       timestamp: this.timestamp.toISOString(),
//       originalError: this.originalError
//         ? {
//             name: this.originalError.name,
//             message: this.originalError.message,
//           }
//         : undefined,
//     };
//   }

//   // Builder pattern methods that return new instances
//   public withContext(context: Record<string, unknown>): this {
//     return this.clone({ context: { ...this.context, ...context } });
//   }

//   public withCode(code: string): this {
//     return this.clone({ code });
//   }

//   public withStatusCode(statusCode: number): this {
//     return this.clone({ statusCode });
//   }

//   public withMessage(message: string): this {
//     return this.clone({ message });
//   }

//   // Protected clone method for subclasses
//   protected clone(
//     overrides: Partial<{
//       message: string;
//       code: string;
//       statusCode: number;
//       context: Record<string, unknown>;
//       originalError?: Error;
//     }>
//   ): this {
//     const Constructor = this.constructor as new (
//       message: string,
//       code: string,
//       statusCode: number,
//       context: Record<string, unknown>,
//       originalError?: Error
//     ) => this;

//     const newError = new Constructor(
//       overrides.message ?? this.message,
//       overrides.code ?? this.code,
//       overrides.statusCode ?? this.statusCode,
//       overrides.context ?? { ...this.context },
//       overrides.originalError ?? this.originalError
//     );

//     // Preserve stack trace
//     newError.stack = this.stack;
//     return newError;
//   }
// }

import { ErrorCodes, HttpStatus } from '@/constants';
import { ErrorContext } from '@/types';

/**
 * Custom error class for the CertusAdiValt system with enhanced error handling capabilities.
 * 
 * Extends the native Error class to include structured error information, HTTP status codes,
 * contextual metadata, and chainable builder methods for error customization.
 * 
 * @example
 * ```typescript
 * // Basic error creation
 * throw new CertusAdiValtError('User not found', 'USER_NOT_FOUND', 404);
 * 
 * // Error with context and original error
 * try {
 *   await someOperation();
 * } catch (error) {
 *   throw new CertusAdiValtError(
 *     'Operation failed',
 *     'OP_FAILED',
 *     500,
 *     { userId: 123, operation: 'update' },
 *     error
 *   );
 * }
 * 
 * // Using builder pattern
 * throw new CertusAdiValtError('Initial error')
 *   .withCode('VALIDATION_ERROR')
 *   .withStatusCode(400)
 *   .withContext({ field: 'email', value: 'invalid' });
 * ```
 */
export class CertusAdiValtError extends Error {
  /**
   * Machine-readable error code for programmatic error handling.
   * @type {string}
   */
  public readonly code: string;

  /**
   * HTTP status code associated with the error.
   * @type {number}
   */
  public readonly statusCode: number;

  /**
   * Timestamp when the error was created.
   * @type {Date}
   */
  public readonly timestamp: Date;

  /**
   * Additional contextual information about the error.
   * @type {Record<string, unknown>}
   */
  public readonly context: Record<string, unknown>;

  /**
   * Original error that caused this error, if any.
   * @type {Error | undefined}
   */
  public readonly originalError?: Error;

  /**
   * Creates a new CertusAdiValtError instance.
   * 
   * @param {string} message - Human-readable error description
   * @param {string} [code=ErrorCodes.SRV_INTERNAL_ERROR] - Machine-readable error code
   * @param {number} [statusCode=HttpStatus.INTERNAL_SERVER_ERROR] - HTTP status code
   * @param {Record<string, unknown>} [context={}] - Additional error context
   * @param {Error} [originalError] - Original error that caused this error
   * 
   * @example
   * ```typescript
   * // Minimal error
   * new CertusAdiValtError('Something went wrong');
   * 
   * // Full error with all parameters
   * new CertusAdiValtError(
   *   'Database connection failed',
   *   'DB_CONNECTION_ERROR',
   *   503,
   *   { host: 'localhost', port: 5432 },
   *   originalError
   * );
   * ```
   */
  constructor(
    message: string,
    code: string = ErrorCodes.SRV_INTERNAL_ERROR,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    context: Record<string, unknown> = {},
    originalError?: Error
  ) {
    super(message);
    this.name = 'CertusAdiValtError';
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date();
    this.context = context;
    this.originalError = originalError;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CertusAdiValtError);
    }

    Object.setPrototypeOf(this, CertusAdiValtError.prototype);
  }

  /**
   * Converts the error to a structured JSON representation suitable for API responses.
   * 
   * @returns {ErrorContext} Structured error context object with all error details
   * 
   * @remarks
   * The returned object includes:
   * - Error name, message, code, and status code
   * - Timestamp of error creation
   * - Additional context metadata
   * - Stack trace (if available)
   * - Original error details (name, message, stack) if present
   * 
   * @example
   * ```typescript
   * const error = new CertusAdiValtError('Not found', 'NOT_FOUND', 404);
   * const json = error.toJSON();
   * // Returns:
   * // {
   * //   name: 'CertusAdiValtError',
   * //   message: 'Not found',
   * //   code: 'NOT_FOUND',
   * //   statusCode: 404,
   * //   timestamp: Date,
   * //   context: {},
   * //   stack: '...',
   * //   originalError: undefined
   * // }
   * ```
   */
  public toJSON(): ErrorContext {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack,
      originalError: this.originalError
        ? {
            name: this.originalError.name,
            message: this.originalError.message,
            stack: this.originalError.stack,
          }
        : undefined,
    };
  }

  /**
   * Converts the error to a log-friendly format with reduced verbosity.
   * 
   * @returns {Record<string, unknown>} Simplified error representation for logging
   * 
   * @remarks
   * Compared to toJSON(), this method:
   * - Uses ISO string for timestamp instead of Date object
   * - Provides simplified original error (name and message only)
   * - Structures output for better log aggregation and parsing
   * - Excludes full stack traces from original errors
   * 
   * @example
   * ```typescript
   * const error = new CertusAdiValtError('DB error', 'DB_ERROR', 500);
   * const logData = error.toLog();
   * console.error('Operation failed:', logData);
   * ```
   */
  public toLog(): Record<string, unknown> {
    return {
      error: {
        name: this.name,
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        stack: this.stack,
      },
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      originalError: this.originalError
        ? {
            name: this.originalError.name,
            message: this.originalError.message,
          }
        : undefined,
    };
  }

  // Builder pattern methods that return new instances

  /**
   * Creates a new error instance with additional context merged into existing context.
   * 
   * @param {Record<string, unknown>} context - Additional context to merge
   * @returns {this} New error instance with merged context
   * 
   * @example
   * ```typescript
   * const error = new CertusAdiValtError('Error')
   *   .withContext({ userId: 123 })
   *   .withContext({ operation: 'create' });
   * // error.context = { userId: 123, operation: 'create' }
   * ```
   */
  public withContext(context: Record<string, unknown>): this {
    return this.clone({ context: { ...this.context, ...context } });
  }

  /**
   * Creates a new error instance with the specified error code.
   * 
   * @param {string} code - New error code to use
   * @returns {this} New error instance with updated code
   * 
   * @example
   * ```typescript
   * const error = new CertusAdiValtError('Error')
   *   .withCode('VALIDATION_ERROR');
   * ```
   */
  public withCode(code: string): this {
    return this.clone({ code });
  }

  /**
   * Creates a new error instance with the specified HTTP status code.
   * 
   * @param {number} statusCode - New HTTP status code to use
   * @returns {this} New error instance with updated status code
   * 
   * @example
   * ```typescript
   * const error = new CertusAdiValtError('Error')
   *   .withStatusCode(400);
   * ```
   */
  public withStatusCode(statusCode: number): this {
    return this.clone({ statusCode });
  }

  /**
   * Creates a new error instance with the specified error message.
   * 
   * @param {string} message - New error message to use
   * @returns {this} New error instance with updated message
   * 
   * @example
   * ```typescript
   * const error = new CertusAdiValtError('Initial')
   *   .withMessage('More specific error message');
   * ```
   */
  public withMessage(message: string): this {
    return this.clone({ message });
  }

  /**
   * Protected method to clone the error instance with overridden properties.
   * Used internally by builder pattern methods to create modified error instances.
   * 
   * @protected
   * @param {Partial<{ message: string; code: string; statusCode: number; context: Record<string, unknown>; originalError?: Error; }>} overrides - Properties to override in the new instance
   * @returns {this} New error instance with applied overrides
   * 
   * @remarks
   * - Preserves the original stack trace for better debugging
   * - Creates a new instance rather than modifying the existing one
   * - Maintains the same constructor chain for subclass compatibility
   * 
   * @example
   * ```typescript
   * // In a subclass
   * protected clone(overrides: Partial<...>): this {
   *   const cloned = super.clone(overrides);
   *   // Add subclass-specific logic
   *   return cloned;
   * }
   * ```
   */
  protected clone(
    overrides: Partial<{
      message: string;
      code: string;
      statusCode: number;
      context: Record<string, unknown>;
      originalError?: Error;
    }>
  ): this {
    const Constructor = this.constructor as new (
      message: string,
      code: string,
      statusCode: number,
      context: Record<string, unknown>,
      originalError?: Error
    ) => this;

    const newError = new Constructor(
      overrides.message ?? this.message,
      overrides.code ?? this.code,
      overrides.statusCode ?? this.statusCode,
      overrides.context ?? { ...this.context },
      overrides.originalError ?? this.originalError
    );

    // Preserve stack trace
    newError.stack = this.stack;
    return newError;
  }
}