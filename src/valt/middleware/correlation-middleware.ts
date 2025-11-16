import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export class CorrelationMiddleware {
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