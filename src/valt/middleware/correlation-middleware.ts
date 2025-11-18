// import { Request, Response, NextFunction } from 'express';
// import { randomUUID } from 'crypto';

// export class CorrelationMiddleware {
//   generateRequestId() {
//     return (req: Request, res: Response, next: NextFunction) => {
//       const existingRequestId = req.headers['x-request-id'];
//       const requestId = existingRequestId || randomUUID();

//       // Set request ID in request and response
//       req.headers['x-request-id'] = requestId;
//       res.setHeader('x-request-id', requestId);

//       next();
//     };
//   }
// }

import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Express middleware for generating and managing correlation IDs across distributed systems.
 * 
 * Provides request tracing capabilities by generating unique correlation IDs (request IDs)
 * that can be used to track requests as they flow through multiple services. Supports both
 * generating new IDs and propagating existing IDs from incoming headers.
 * 
 * @class CorrelationMiddleware
 * 
 * @example
 * ```typescript
 * // Basic usage
 * const correlationMiddleware = new CorrelationMiddleware();
 * app.use(correlationMiddleware.generateRequestId());
 * 
 * // With existing request ID from headers
 * // If client sends 'x-request-id' header, it will be reused
 * // Otherwise, a new UUID will be generated
 * 
 * // The middleware automatically:
 * // - Reads existing 'x-request-id' header from incoming request
 * // - Generates new UUID if no header exists
 * // - Sets the request ID in both request and response headers
 * // - Makes the request ID available throughout the request lifecycle
 * ```
 * 
 * @example
 * ```typescript
 * // Accessing request ID in route handlers
 * app.get('/api/users', (req: Request, res: Response) => {
 *   const requestId = req.headers['x-request-id'];
 *   logger.info('Processing user request', { requestId });
 *   // Logs: { message: "Processing user request", requestId: "abc-123-xyz" }
 * });
 * 
 * // Response headers will include:
 * // x-request-id: abc-123-xyz
 * ```
 */
export class CorrelationMiddleware {
  /**
   * Generates Express middleware for request ID correlation.
   * 
   * Creates middleware that ensures every request has a unique correlation ID,
   * either by reusing an existing 'x-request-id' header from the client or
   * generating a new UUIDv4. The ID is propagated through both request and
   * response headers for distributed tracing.
   * 
   * @returns {function} Express middleware function
   * 
   * @example
   * ```typescript
   * // Application setup
   * const app = express();
   * const correlation = new CorrelationMiddleware();
   * 
   * // Apply middleware globally
   * app.use(correlation.generateRequestId());
   * 
   * // Or apply to specific routes
   * app.use('/api/*', correlation.generateRequestId());
   * 
   * // The middleware will:
   * // 1. Check for existing 'x-request-id' in request headers
   * // 2. Use existing ID if present, generate new UUID if not
   * // 3. Set the ID in request headers for downstream use
   * // 4. Set the ID in response headers for client propagation
   * ```
   */
  generateRequestId() {
    return (req: Request, res: Response, next: NextFunction) => {
      const existingRequestId = req.headers['x-request-id'];
      const requestId = existingRequestId || randomUUID();

      // Set request ID in request and response
      req.headers['x-request-id'] = requestId;
      res.setHeader('x-request-id', requestId);

      next();
    };
  }
}