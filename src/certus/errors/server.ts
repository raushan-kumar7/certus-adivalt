import { ErrorCodes, HttpStatus } from '@/constants';
import { CertusAdiValtError } from './base';

export class CertusServerError extends CertusAdiValtError {
  constructor(
    message: string,
    code: string = ErrorCodes.SRV_INTERNAL_ERROR,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    context: Record<string, unknown> = {}
  ) {
    super(message, code, statusCode, context);
    this.name = 'CertusServerError';
  }
}

export class CertusInternalServerError extends CertusServerError {
  constructor(message: string = 'Internal server error', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.SRV_INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, context);
    this.name = 'CertusInternalServerError';
  }
}

export class CertusExternalServiceError extends CertusServerError {
  constructor(message: string = 'External service error', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.SRV_EXTERNAL_SERVICE, HttpStatus.BAD_GATEWAY, context);
    this.name = 'CertusExternalServiceError';
  }
}

export class CertusConfigurationError extends CertusServerError {
  constructor(message: string = 'Configuration error', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.SRV_CONFIGURATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, context);
    this.name = 'CertusConfigurationError';
  }
}
