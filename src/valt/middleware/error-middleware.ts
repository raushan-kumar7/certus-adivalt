import { Request, Response, NextFunction } from 'express';
import { ValtLogger } from '../logger';
import { isErrorResponse, ResponseFormatter } from '@/responses';
import { CertusAdiValtError } from '@/certus';
import { HttpStatus } from '@/constants';

export class ErrorMiddleware {
  private logger: ValtLogger;

  constructor(logger: ValtLogger) {
    this.logger = logger;
  }

  handle() {
    return (error: Error, req: Request, res: Response, next: NextFunction) => {
      const requestId = req.headers['x-request-id'] as string;

      // Log the error
      this.logger.error(
        'Request processing error',
        {
          method: req.method,
          path: req.path,
          requestId,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        },
        error
      );

      // Format and send error response
      const response = ResponseFormatter.formatError(error, {
        requestId,
        includeDetails: process.env.NODE_ENV === 'development',
      });

      if (isErrorResponse(response)) {
        res.status(response.error.statusCode).json(response);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
      }
    };
  }

  // 404 handler middleware
  notFound() {
    return (req: Request, res: Response, next: NextFunction) => {
      const requestId = req.headers['x-request-id'] as string;

      const error = new CertusAdiValtError(
        `Route ${req.method} ${req.path} not found`,
        'CLI_NOT_FOUND',
        404,
        { method: req.method, path: req.path }
      );

      const response = ResponseFormatter.formatError(error, { requestId });
      res.status(404).json(response);
    };
  }
}
