import { Request, Response, NextFunction } from 'express';
import { ValtLogger } from '../logger';

export class LoggingMiddleware {
  private logger: ValtLogger;

  constructor(logger: ValtLogger) {
    this.logger = logger;
  }

  requestLogger() {
    return (req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      const requestId = req.headers['x-request-id'] as string;

      // Log request start
      this.logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        requestId,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        query: req.query,
        params: req.params,
      });

      // Capture response finish
      res.on('finish', () => {
        const duration = Date.now() - start;
        const context = {
          method: req.method,
          path: req.path,
          requestId,
          statusCode: res.statusCode,
          duration,
          contentLength: res.get('Content-Length'),
          userAgent: req.get('User-Agent'),
        };

        const level = res.statusCode >= 400 ? 'warn' : 'info';
        const message = `Request completed: ${res.statusCode} ${res.statusMessage} in ${duration}ms`;

        if (level === 'warn') {
          this.logger.warn(message, context);
        } else {
          this.logger.info(message, context);
        }
      });

      next();
    };
  }
}
