import { ResponseFormatter } from '@/responses';
import { Request, Response, NextFunction } from 'express';

export class ResponseMiddleware {
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