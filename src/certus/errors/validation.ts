import { ErrorCodes, HttpStatus } from '@/constants';
import { CertusClientError } from './client';

export class CertusInputValidationError extends CertusClientError {
  constructor(message: string = 'Input validation failed', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.VAL_INVALID_INPUT, HttpStatus.BAD_REQUEST, context);
    this.name = 'CertusInputValidationError';
  }
}

export class CertusSchemaValidationError extends CertusClientError {
  constructor(message: string = 'Schema validation failed', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.VAL_SCHEMA_ERROR, HttpStatus.UNPROCESSABLE_ENTITY, context);
    this.name = 'CertusSchemaValidationError';
  }
}

export class CertusBusinessRuleError extends CertusClientError {
  constructor(message: string = 'Business rule violation', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.VAL_BUSINESS_RULE, HttpStatus.CONFLICT, context);
    this.name = 'CertusBusinessRuleError';
  }
}