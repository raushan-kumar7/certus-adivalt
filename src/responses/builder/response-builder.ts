import { CertusAdiValtError } from '@/certus';
import {
  EmptyResponse,
  ErrorResponse,
  PaginatedResponse,
  PaginationParams,
  SuccessResponse,
} from '@/types';

export class CertusResponseBuilder {
  private static generateTimestamp(): string {
    return new Date().toISOString();
  }

  static success<T = unknown>(
    data: T,
    message?: string,
    requestId?: string,
    meta?: Record<string, unknown>
  ): SuccessResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: this.generateTimestamp(),
      requestId,
      meta,
    };
  }

  static error(error: CertusAdiValtError | Error, requestId?: string): ErrorResponse {
    const isCertusError = error instanceof CertusAdiValtError;

    return {
      success: false,
      error: {
        code: isCertusError ? error.code : 'UNKNOWN_ERROR',
        message: error.message,
        details: isCertusError ? undefined : 'An unexpected error occurred',
        statusCode: isCertusError ? error.statusCode : 500,
        timestamp: this.generateTimestamp(),
        context: isCertusError ? error.context : undefined,
        requestId,
      },
    };
  }

  static paginated<T = unknown>(
    data: T[],
    pagination: PaginationParams,
    requestId?: string,
    meta?: Record<string, unknown>
  ): PaginatedResponse<T> {
    return {
      success: true,
      data,
      pagination,
      timestamp: this.generateTimestamp(),
      requestId,
      meta,
    };
  }

  static empty(message?: string, requestId?: string): EmptyResponse {
    return {
      success: true,
      message,
      timestamp: this.generateTimestamp(),
      requestId,
    };
  }

  static created<T = unknown>(
    data: T,
    message: string = 'Resource created successfully',
    requestId?: string
  ): SuccessResponse<T> {
    return this.success(data, message, requestId);
  }

  static updated<T = unknown>(
    data: T,
    message: string = 'Resource updated successfully',
    requestId?: string
  ): SuccessResponse<T> {
    return this.success(data, message, requestId);
  }

  static deleted(
    message: string = 'Resource deleted successfully',
    requestId?: string
  ): EmptyResponse {
    return this.empty(message, requestId);
  }
}
