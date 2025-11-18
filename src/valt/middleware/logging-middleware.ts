import { Request, Response, NextFunction } from 'express';
import { ValtLogger } from '../logger';

/**
 * Express middleware for comprehensive request logging with performance monitoring.
 *
 * Provides detailed logging of incoming HTTP requests and responses, including
 * timing information, status codes, and contextual data. Integrates with the
 * ValtLogger for structured logging and CorrelationMiddleware for request tracing.
 *
 * @class LoggingMiddleware
 *
 * @example
 * ```typescript
 * // Application setup with logging middleware
 * const logger = new ValtLogger({ /* config *\/ });
 * const loggingMiddleware = new LoggingMiddleware(logger);
 *
 * const app = express();
 *
 * // Apply middleware in correct order
 * app.use(loggingMiddleware.requestLogger()); // Should be after correlation middleware
 * app.use(express.json());
 * // ... other middleware and routes
 *
 * // Example log output:
 * // Request start: { message: "Incoming request", method: "GET", path: "/api/users", ... }
 * // Request completion: { message: "Request completed: 200 OK in 45ms", statusCode: 200, duration: 45, ... }
 * ```
 */
export class LoggingMiddleware {
  private logger: ValtLogger;

  /**
   * Creates a new LoggingMiddleware instance with the specified logger.
   *
   * @param {ValtLogger} logger - Logger instance for structured request logging
   *
   * @example
   * ```typescript
   * // Production configuration
   * const prodLogger = new ValtLogger({
   *   level: LogLevel.INFO,
   *   service: 'api-gateway',
   *   environment: 'production',
   *   redactFields: ['password', 'authorization']
   * });
   *
   * const prodLogging = new LoggingMiddleware(prodLogger);
   *
   * // Development configuration
   * const devLogger = new ValtLogger({
   *   level: LogLevel.DEBUG,
   *   service: 'api-gateway',
   *   environment: 'development',
   *   prettyPrint: true
   * });
   *
   * const devLogging = new LoggingMiddleware(devLogger);
   * ```
   */
  constructor(logger: ValtLogger) {
    this.logger = logger;
  }

  /**
   * Request logging middleware for Express applications.
   *
   * Logs incoming requests with comprehensive context and tracks response completion
   * with timing information. Automatically categorizes logs as warnings for error
   * status codes (400+). Captures request details, response metrics, and performance
   * data for monitoring and debugging.
   *
   * @returns {function} Express middleware function
   *
   * @example
   * ```typescript
   * // Middleware application
   * app.use(loggingMiddleware.requestLogger());
   *
   * // Example log outputs:
   *
   * // Successful request (GET /api/users?page=1)
   * // Request: { message: "Incoming request", method: "GET", path: "/api/users", query: { page: "1" }, ... }
   * // Response: { message: "Request completed: 200 OK in 120ms", statusCode: 200, duration: 120, ... }
   *
   * // Error request (POST /api/login with invalid credentials)
   * // Request: { message: "Incoming request", method: "POST", path: "/api/login", ... }
   * // Response: { message: "Request completed: 401 Unauthorized in 45ms", statusCode: 401, duration: 45, ... }
   *
   * // Slow request (GET /api/reports)
   * // Response: { message: "Request completed: 200 OK in 2500ms", statusCode: 200, duration: 2500, ... }
   * ```
   */
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
