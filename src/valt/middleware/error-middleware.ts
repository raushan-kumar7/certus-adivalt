import { Request, Response, NextFunction } from 'express';
import { ValtLogger } from '../logger';
import { isErrorResponse, ResponseFormatter } from '../../responses';
import { CertusAdiValtError } from '../../certus';
import { HttpStatus } from '../../constants';

/**
 * Express middleware for comprehensive error handling and 404 route management.
 *
 * Provides centralized error handling for Express applications with structured logging,
 * consistent error response formatting, and proper 404 handling. Integrates seamlessly
 * with the ValtLogger for error tracking and CorrelationMiddleware for request tracing.
 *
 * @class ErrorMiddleware
 *
 * @example
 * ```typescript
 * // Application setup with error middleware
 * const logger = new ValtLogger({ /* config *\/ });
 * const errorMiddleware = new ErrorMiddleware(logger);
 *
 * const app = express();
 *
 * // Apply middleware in correct order
 * app.use(express.json());
 * app.use(correlationMiddleware.generateRequestId());
 *
 * // Your routes here
 * app.use('/api', apiRoutes);
 *
 * // 404 handler for unmatched routes (should be after all routes)
 * app.use(errorMiddleware.notFound());
 *
 * // Global error handler (should be last middleware)
 * app.use(errorMiddleware.handle());
 * ```
 */
export class ErrorMiddleware {
  private logger: ValtLogger;

  /**
   * Creates a new ErrorMiddleware instance with the specified logger.
   *
   * @param {ValtLogger} logger - Logger instance for structured error logging
   *
   * @example
   * ```typescript
   * // Production setup
   * const productionLogger = new ValtLogger({
   *   level: LogLevel.ERROR,
   *   service: 'api-server',
   *   environment: 'production'
   * });
   *
   * const errorMiddleware = new ErrorMiddleware(productionLogger);
   *
   * // Development setup
   * const devLogger = new ValtLogger({
   *   level: LogLevel.DEBUG,
   *   service: 'api-server',
   *   environment: 'development',
   *   prettyPrint: true
   * });
   *
   * const devErrorMiddleware = new ErrorMiddleware(devLogger);
   * ```
   */
  constructor(logger: ValtLogger) {
    this.logger = logger;
  }

  /**
   * Global error handler middleware for Express applications.
   *
   * Catches all errors thrown in the application, logs them with comprehensive context,
   * and returns formatted error responses. Integrates with request ID correlation for
   * distributed tracing and provides environment-appropriate error details.
   *
   * @returns {function} Express error handling middleware
   *
   * @example
   * ```typescript
   * // Error handling in action:
   *
   * // 1. Database error
   * app.get('/users/:id', async (req, res) => {
   *   const user = await db.users.find(req.params.id); // Throws if not found
   *   res.json(user);
   * });
   *
   * // If user not found, error is caught by handle() middleware:
   * // - Logs: { message: "Request processing error", method: "GET", path: "/users/123", ... }
   * // - Returns: { error: { message: "User not found", code: "DB_NOT_FOUND", statusCode: 404 } }
   *
   * // 2. Validation error
   * app.post('/users', (req, res) => {
   *   if (!req.body.email) {
   *     throw new CertusAdiValtError('Email is required', 'VALIDATION_ERROR', 400);
   *   }
   * });
   * ```
   */
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

  /**
   * 404 Not Found handler middleware for unmatched routes.
   *
   * Catches all requests to undefined routes and returns consistent 404 error responses.
   * Creates structured CertusAdiValtError instances with route context for proper
   * error formatting and logging.
   *
   * @returns {function} Express middleware for 404 handling
   *
   * @example
   * ```typescript
   * // 404 handling examples:
   *
   * // Request to undefined route: GET /api/nonexistent
   * // Returns: {
   * //   error: {
   * //     message: "Route GET /api/nonexistent not found",
   * //     code: "CLI_NOT_FOUND",
   * //     statusCode: 404,
   * //     details: { method: "GET", path: "/api/nonexistent" }
   * //   }
   * // }
   *
   * // Proper middleware order:
   * app.use('/api', apiRoutes);        // Your API routes
   * app.use('/docs', docsRoutes);      // Documentation routes
   * app.use(errorMiddleware.notFound()); // 404 for everything else
   * app.use(errorMiddleware.handle());   // Error handler last
   * ```
   */
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
