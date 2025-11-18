// import { ResponseFormatter } from '@/responses';
// import { Request, Response, NextFunction } from 'express';

// export class ResponseMiddleware {
//   successHandler() {
//     return (req: Request, res: Response, next: NextFunction) => {
//       // Store original json method
//       const originalJson = res.json;

//       // Override json method to format responses
//       res.json = function (data: any) {
//         const requestId = req.headers['x-request-id'] as string;

//         // If it's already a formatted response, use it as is
//         if (data && typeof data === 'object' && 'success' in data) {
//           return originalJson.call(this, data);
//         }

//         // Format success response
//         const formattedResponse = ResponseFormatter.formatSuccess(data, {
//           requestId,
//           message: res.statusCode === 201 ? 'Resource created successfully' : undefined,
//         });

//         return originalJson.call(this, formattedResponse);
//       };

//       next();
//     };
//   }
// }


import { ResponseFormatter } from '@/responses';
import { Request, Response, NextFunction } from 'express';

/**
 * Express middleware for standardizing success response formatting across the API.
 * 
 * Provides consistent success response formatting by intercepting and transforming
 * JSON responses. Ensures all successful API responses follow a standardized structure
 * with proper metadata, request correlation, and optional success messages.
 * 
 * @class ResponseMiddleware
 * 
 * @example
 * ```typescript
 * // Application setup with response middleware
 * const responseMiddleware = new ResponseMiddleware();
 * 
 * const app = express();
 * 
 * // Apply middleware after routes but before error handlers
 * app.use(responseMiddleware.successHandler());
 * 
 * // Example route responses:
 * 
 * // GET /api/users returns array of users
 * // Original: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 * // Formatted: { 
 * //   success: true, 
 * //   data: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
 * //   timestamp: '2023-10-05T12:00:00.000Z',
 * //   requestId: 'req_123'
 * // }
 * 
 * // POST /api/users returns created user with 201 status
 * // Formatted: {
 * //   success: true,
 * //   data: { id: 3, name: 'New User' },
 * //   message: 'Resource created successfully',
 * //   timestamp: '2023-10-05T12:00:00.000Z', 
 * //   requestId: 'req_123'
 * // }
 * ```
 */
export class ResponseMiddleware {
  /**
   * Success response formatting middleware for Express applications.
   * 
   * Intercepts all JSON responses and applies consistent formatting to successful
   * responses. Preserves existing formatted responses, adds request correlation IDs,
   * and provides appropriate success messages for common status codes like 201 Created.
   * 
   * @returns {function} Express middleware function
   * 
   * @example
   * ```typescript
   * // Route handlers work normally - formatting is automatic
   * 
   * app.get('/api/users', (req: Request, res: Response) => {
   *   const users = userService.getAll();
   *   res.json(users); // Automatically formatted
   * });
   * 
   * app.post('/api/users', (req: Request, res: Response) => {
   *   const newUser = userService.create(req.body);
   *   res.status(201).json(newUser); // Gets "Resource created successfully" message
   * });
   * 
   * app.get('/api/users/:id', (req: Request, res: Response) => {
   *   const user = userService.getById(req.params.id);
   *   res.json(user); // Single object formatted consistently
   * });
   * 
   * // Already formatted responses are preserved
   * app.get('/api/custom', (req: Request, res: Response) => {
   *   const customResponse = {
   *     success: true,
   *     data: { custom: 'data' },
   *     customField: 'preserved'
   *   };
   *   res.json(customResponse); // Left unchanged due to existing 'success' field
   * });
   * ```
   */
  successHandler() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Store original json method
      const originalJson = res.json;

      // Override json method to format responses
      res.json = function (data: any) {
        const requestId = req.headers['x-request-id'] as string;

        // If it's already a formatted response, use it as is
        if (data && typeof data === 'object' && 'success' in data) {
          return originalJson.call(this, data);
        }

        // Format success response
        const formattedResponse = ResponseFormatter.formatSuccess(data, {
          requestId,
          message: res.statusCode === 201 ? 'Resource created successfully' : undefined,
        });

        return originalJson.call(this, formattedResponse);
      };

      next();
    };
  }
}