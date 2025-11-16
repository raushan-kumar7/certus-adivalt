import { ErrorCodes, HttpStatus } from '@/constants';
import { ErrorContext } from '@/types';

export abstract class CertusAdiValtError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly timestamp: Date;
  public readonly context: Record<string, unknown>;
  public readonly originalError?: Error;

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
  public withContext(context: Record<string, unknown>): this {
    return this.clone({ context: { ...this.context, ...context } });
  }

  public withCode(code: string): this {
    return this.clone({ code });
  }

  public withStatusCode(statusCode: number): this {
    return this.clone({ statusCode });
  }

  public withMessage(message: string): this {
    return this.clone({ message });
  }

  // Protected clone method for subclasses
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