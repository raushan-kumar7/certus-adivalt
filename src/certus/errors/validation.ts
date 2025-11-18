// import { ErrorCodes, HttpStatus } from '@/constants';
// import { CertusClientError } from './client';

// export class CertusInputValidationError extends CertusClientError {
//   constructor(message: string = 'Input validation failed', context: Record<string, unknown> = {}) {
//     super(message, ErrorCodes.VAL_INVALID_INPUT, HttpStatus.BAD_REQUEST, context);
//     this.name = 'CertusInputValidationError';
//   }
// }

// export class CertusSchemaValidationError extends CertusClientError {
//   constructor(message: string = 'Schema validation failed', context: Record<string, unknown> = {}) {
//     super(message, ErrorCodes.VAL_SCHEMA_ERROR, HttpStatus.UNPROCESSABLE_ENTITY, context);
//     this.name = 'CertusSchemaValidationError';
//   }
// }

// export class CertusBusinessRuleError extends CertusClientError {
//   constructor(message: string = 'Business rule violation', context: Record<string, unknown> = {}) {
//     super(message, ErrorCodes.VAL_BUSINESS_RULE, HttpStatus.CONFLICT, context);
//     this.name = 'CertusBusinessRuleError';
//   }
// }

import { ErrorCodes, HttpStatus } from '@/constants';
import { CertusClientError } from './client';

/**
 * Error thrown when input data fails basic validation rules.
 * 
 * Represents failures in input validation such as required field checks, format validation,
 * type checking, or basic data integrity rules. Returns HTTP 400 Bad Request status code
 * to indicate the client should modify the request before retrying.
 * 
 * @example
 * ```typescript
 * // Validate required fields
 * if (!input.email || !input.password) {
 *   throw new CertusInputValidationError(
 *     'Email and password are required',
 *     { missingFields: ['email', 'password'], received: Object.keys(input) }
 *   );
 * }
 * 
 * // Validate input format
 * if (input.age && (input.age < 0 || input.age > 150)) {
 *   throw new CertusInputValidationError('Age must be between 0 and 150')
 *     .withContext({ field: 'age', value: input.age, validRange: [0, 150] });
 * }
 * 
 * // Multiple validation failures
 * const errors = validateUserInput(input);
 * if (errors.length > 0) {
 *   throw new CertusInputValidationError('Multiple input validation errors')
 *     .withContext({ validationErrors: errors });
 * }
 * ```
 */
export class CertusInputValidationError extends CertusClientError {
  /**
   * Creates a new CertusInputValidationError instance.
   * 
   * @param {string} [message='Input validation failed'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about validation failures
   * 
   * @example
   * ```typescript
   * // Basic input validation error
   * throw new CertusInputValidationError();
   * 
   * // Detailed input validation with multiple issues
   * throw new CertusInputValidationError(
   *   'User registration data invalid',
   *   {
   *     validationResults: [
   *       { field: 'email', issue: 'Invalid format', value: 'invalid-email' },
   *       { field: 'password', issue: 'Too short', value: '***', minLength: 8 },
   *       { field: 'birthDate', issue: 'Future date', value: '2030-01-01' }
   *     ],
   *     totalErrors: 3,
   *     suggestion: 'Review the API documentation for field requirements'
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Input validation failed', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.VAL_INVALID_INPUT, HttpStatus.BAD_REQUEST, context);
    this.name = 'CertusInputValidationError';
  }
}

/**
 * Error thrown when data fails schema validation against a defined schema.
 * 
 * Represents failures in structural validation using JSON Schema, Zod, Yup, or other
 * schema validation libraries. Returns HTTP 422 Unprocessable Entity status code to
 * indicate the request syntax is correct but semantic validation failed.
 * 
 * @example
 * ```typescript
 * // JSON Schema validation
 * const validation = jsonSchema.validate(input);
 * if (!validation.valid) {
 *   throw new CertusSchemaValidationError(
 *     'Data does not match expected schema',
 *     { 
 *       schema: 'user-registration',
 *       errors: validation.errors,
 *       received: input 
 *     }
 *   );
 * }
 * 
 * // Zod schema validation
 * const result = userSchema.safeParse(input);
 * if (!result.success) {
 *   throw new CertusSchemaValidationError('Schema validation failed')
 *     .withContext({ 
 *       schema: 'userSchema', 
 *       zodErrors: result.error.format(),
 *       issues: result.error.issues 
 *     });
 * }
 * 
 * // API request body validation
 * const validation = await validateRequestBody(schema, request.body);
 * if (!validation.isValid) {
 *   throw new CertusSchemaValidationError('Request body validation failed', {
 *     schemaName: 'CreateUserRequest',
 *     validationErrors: validation.errors,
 *     path: request.path
 *   });
 * }
 * ```
 */
export class CertusSchemaValidationError extends CertusClientError {
  /**
   * Creates a new CertusSchemaValidationError instance.
   * 
   * @param {string} [message='Schema validation failed'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about schema validation failures
   * 
   * @example
   * ```typescript
   * // Basic schema validation error
   * throw new CertusSchemaValidationError();
   * 
   * // Detailed schema validation failure
   * throw new CertusSchemaValidationError(
   *   'API request validation failed',
   *   {
   *     schema: 'OrderCreationSchema',
   *     validationLibrary: 'Joi',
   *     errors: [
   *       {
   *         path: ['items', 0, 'quantity'],
   *         message: '"quantity" must be greater than 0',
   *         type: 'number.min',
   *         value: -1
   *       },
   *       {
   *         path: ['shippingAddress', 'country'],
   *         message: '"country" must be one of [US, CA, EU]',
   *         type: 'any.only',
   *         value: 'XX'
   *       }
   *     ],
   *     documentation: 'https://api.example.com/schemas/order-creation'
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Schema validation failed', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.VAL_SCHEMA_ERROR, HttpStatus.UNPROCESSABLE_ENTITY, context);
    this.name = 'CertusSchemaValidationError';
  }
}

/**
 * Error thrown when business rules or domain logic constraints are violated.
 * 
 * Represents failures in business logic validation that go beyond simple data validation.
 * These errors enforce domain-specific rules and constraints. Returns HTTP 409 Conflict
 * status code to indicate the request conflicts with business rules or current state.
 * 
 * @example
 * ```typescript
 * // Business rule: Cannot withdraw more than account balance
 * if (withdrawalAmount > accountBalance) {
 *   throw new CertusBusinessRuleError(
 *     'Insufficient funds for withdrawal',
 *     { 
 *       accountBalance, 
 *       withdrawalAmount, 
 *       deficit: withdrawalAmount - accountBalance,
 *       rule: 'withdrawal_amount_lt_balance'
 *     }
 *   );
 * }
 * 
 * // Business rule: Cannot cancel shipped order
 * if (order.status === 'shipped') {
 *   throw new CertusBusinessRuleError('Cannot cancel shipped order')
 *     .withContext({ 
 *       orderId: order.id, 
 *       currentStatus: order.status,
 *       allowedStatuses: ['pending', 'confirmed'],
 *       businessRule: 'cancel_only_before_shipping'
 *     });
 * }
 * 
 * // Domain constraint: Unique business identifier
 * if (await isBusinessIdentifierTaken(companyTaxId)) {
 *   throw new CertusBusinessRuleError('Company tax ID already registered')
 *     .withContext({
 *       taxId: companyTaxId,
 *       existingCompany: await findCompanyByTaxId(companyTaxId),
 *       rule: 'unique_tax_identifier'
 *     });
 * }
 * ```
 */
export class CertusBusinessRuleError extends CertusClientError {
  /**
   * Creates a new CertusBusinessRuleError instance.
   * 
   * @param {string} [message='Business rule violation'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about business rule violations
   * 
   * @example
   * ```typescript
   * // Basic business rule error
   * throw new CertusBusinessRuleError();
   * 
   * // Complex business rule violation
   * throw new CertusBusinessRuleError(
   *   'Promotion usage limit exceeded',
   *   {
   *     promotionCode: 'SUMMER25',
   *     usageLimit: 5,
   *     currentUsage: 5,
   *     userId: 'user_123',
   *     businessRules: [
   *       'max_uses_per_customer',
   *       'promotion_active_period'
   *     ],
   *     validFrom: '2024-06-01',
   *     validTo: '2024-08-31',
   *     suggestion: 'Use a different promotion code or wait for reset'
   *   }
   * );
   * ```
   */
  constructor(message: string = 'Business rule violation', context: Record<string, unknown> = {}) {
    super(message, ErrorCodes.VAL_BUSINESS_RULE, HttpStatus.CONFLICT, context);
    this.name = 'CertusBusinessRuleError';
  }
}