import { ApiResponse } from '@/types';
import { CertusResponseBuilder } from '../builder';
import { CertusAdiValtError } from '@/certus';

export class ResponseFormatter {
  static formatSuccess<T = unknown>(
    data: T,
    options: {
      message?: string;
      requestId?: string;
      meta?: Record<string, unknown>;
    } = {}
  ): ApiResponse<T> {
    return CertusResponseBuilder.success(data, options.message, options.requestId, options.meta);
  }

  static formatError(
    error: unknown,
    options: {
      requestId?: string;
      includeDetails?: boolean;
    } = {}
  ): ApiResponse {
    if (error instanceof CertusAdiValtError) {
      return CertusResponseBuilder.error(error, options.requestId);
    }

    if (error instanceof Error) {
      const certusError = new CertusAdiValtError(
        options.includeDetails ? error.message : 'Internal server error',
        'SRV_INTERNAL_ERROR',
        500,
        {},
        error
      );
      return CertusResponseBuilder.error(certusError, options.requestId);
    }

    const certusError = new CertusAdiValtError(
      'An unexpected error occurred',
      'SRV_INTERNAL_ERROR',
      500
    );
    return CertusResponseBuilder.error(certusError, options.requestId);
  }

  static formatPaginated<T = unknown>(
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
    },
    options: {
      requestId?: string;
      meta?: Record<string, unknown>;
    } = {}
  ): ApiResponse<T> {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const hasNext = pagination.page < totalPages;
    const hasPrev = pagination.page > 1;

    const paginationParams = {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages,
      hasNext,
      hasPrev,
    };

    return CertusResponseBuilder.paginated(data, paginationParams, options.requestId, options.meta);
  }
}
