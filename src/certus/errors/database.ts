// import { ErrorCodes, HttpStatus } from '@/constants';
// import { CertusServerError } from './server';

// export class CertusDatabaseError extends CertusServerError {
//   constructor(
//     message: string = 'Database error occurred',
//     code: string = ErrorCodes.DB_QUERY_ERROR,
//     statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
//     context: Record<string, unknown> = {}
//   ) {
//     super(message, code, statusCode, context);
//     this.name = 'CertusDatabaseError';
//   }
// }

// export class CertusUniqueConstraintError extends CertusDatabaseError {
//   constructor(
//     message: string = 'Unique constraint violation',
//     context: Record<string, unknown> = {}
//   ) {
//     super(message, ErrorCodes.DB_UNIQUE_CONSTRAINT, HttpStatus.CONFLICT, context);
//     this.name = 'CertusUniqueConstraintError';
//   }
// }

// export class CertusConnectionError extends CertusDatabaseError {
//   constructor(
//     message: string = 'Database connection error',
//     context: Record<string, unknown> = {}
//   ) {
//     super(message, ErrorCodes.DB_CONNECTION_ERROR, HttpStatus.SERVICE_UNAVAILABLE, context);
//     this.name = 'CertusConnectionError';
//   }
// }

// export class CertusTimeoutError extends CertusDatabaseError {
//   constructor(
//     message: string = 'Database operation timed out',
//     context: Record<string, unknown> = {}
//   ) {
//     super(message, ErrorCodes.DB_TIMEOUT_ERROR, HttpStatus.GATEWAY_TIMEOUT, context);
//     this.name = 'CertusTimeoutError';
//   }
// }

import { ErrorCodes, HttpStatus } from '@/constants';
import { CertusServerError } from './server';

/**
 * Base database error class for all database-related failures.
 * 
 * Represents errors that occur during database operations such as query execution,
 * connection issues, or constraint violations. Extends CertusServerError to provide
 * specialized handling for database-specific error scenarios.
 * 
 * @example
 * ```typescript
 * // Catch and wrap database errors
 * try {
 *   await database.query('INSERT INTO users ...');
 * } catch (error) {
 *   throw new CertusDatabaseError(
 *     'Failed to create user record',
 *     ErrorCodes.DB_QUERY_ERROR,
 *     HttpStatus.INTERNAL_SERVER_ERROR,
 *     { table: 'users', operation: 'insert', originalError: error }
 *   );
 * }
 * 
 * // Custom database error
 * throw new CertusDatabaseError('Database migration failed')
 *   .withContext({ migration: 'v2_add_indexes', step: 'creating_indexes' });
 * ```
 */
export class CertusDatabaseError extends CertusServerError {
  /**
   * Creates a new CertusDatabaseError instance.
   * 
   * @param {string} [message='Database error occurred'] - Human-readable error description
   * @param {string} [code=ErrorCodes.DB_QUERY_ERROR] - Machine-readable error code for database failures
   * @param {number} [statusCode=HttpStatus.INTERNAL_SERVER_ERROR] - HTTP status code (5xx range)
   * @param {Record<string, unknown>} [context={}] - Additional context about the database error
   * 
   * @example
   * ```typescript
   * // Default database error
   * throw new CertusDatabaseError();
   * 
   * // Specific database error with context
   * throw new CertusDatabaseError(
   *   'Failed to execute complex join query',
   *   ErrorCodes.DB_QUERY_ERROR,
   *   HttpStatus.INTERNAL_SERVER_ERROR,
   *   {
   *     query: 'SELECT * FROM users JOIN orders ...',
   *     tables: ['users', 'orders', 'products'],
   *     database: 'production_db',
   *     executionTime: '2.5s'
   *   }
   * );
   * ```
   */
  constructor(
    message: string = 'Database error occurred',
    code: string = ErrorCodes.DB_QUERY_ERROR,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    context: Record<string, unknown> = {}
  ) {
    super(message, code, statusCode, context);
    this.name = 'CertusDatabaseError';
  }
}

/**
 * Error thrown when a database unique constraint violation occurs.
 * 
 * Represents cases where an insert or update operation would violate a unique
 * constraint (e.g., duplicate email, duplicate username). Returns HTTP 409 Conflict
 * status code to indicate the request conflicts with current state.
 * 
 * @example
 * ```typescript
 * // Handle unique email constraint
 * try {
 *   await userRepository.create({ email: 'user@example.com' });
 * } catch (error) {
 *   if (error.code === '23505') { // PostgreSQL unique violation
 *     throw new CertusUniqueConstraintError(
 *       'Email address already registered',
 *       { field: 'email', value: 'user@example.com', constraint: 'users_email_key' }
 *     );
 *   }
 * }
 * 
 * // Check for duplicate usernames
 * if (await usernameExists(username)) {
 *   throw new CertusUniqueConstraintError('Username already taken')
 *     .withContext({ field: 'username', value: username, suggestion: `${username}123` });
 * }
 * ```
 */
export class CertusUniqueConstraintError extends CertusDatabaseError {
  /**
   * Creates a new CertusUniqueConstraintError instance.
   * 
   * @param {string} [message='Unique constraint violation'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the constraint violation
   * 
   * @example
   * ```typescript
   * // Basic unique constraint error
   * throw new CertusUniqueConstraintError();
   * 
   * // Detailed constraint violation
   * throw new CertusUniqueConstraintError(
   *   'Product SKU must be unique',
   *   {
   *     table: 'products',
   *     constraint: 'products_sku_unique',
   *     conflictingField: 'sku',
   *     conflictingValue: 'PROD-12345',
   *     existingRecordId: 'prod_abc123',
   *     suggestion: 'Use a different SKU or update existing product'
   *   }
   * );
   * ```
   */
  constructor(
    message: string = 'Unique constraint violation',
    context: Record<string, unknown> = {}
  ) {
    super(message, ErrorCodes.DB_UNIQUE_CONSTRAINT, HttpStatus.CONFLICT, context);
    this.name = 'CertusUniqueConstraintError';
  }
}

/**
 * Error thrown when database connection issues occur.
 * 
 * Represents failures in establishing or maintaining database connections,
 * including connection timeouts, authentication failures, or database unavailability.
 * Returns HTTP 503 Service Unavailable status code.
 * 
 * @example
 * ```typescript
 * // Database connection health check
 * if (!await database.isConnected()) {
 *   throw new CertusConnectionError(
 *     'Unable to connect to database',
 *     {
 *       host: config.database.host,
 *       port: config.database.port,
 *       database: config.database.name,
 *       retryCount: 3
 *     }
 *   );
 * }
 * 
 * // Connection pool exhaustion
 * if (connectionPool.isFull()) {
 *   throw new CertusConnectionError('Database connection pool exhausted')
 *     .withContext({ maxConnections: 100, activeConnections: 100, waitQueue: 15 });
 * }
 * ```
 */
export class CertusConnectionError extends CertusDatabaseError {
  /**
   * Creates a new CertusConnectionError instance.
   * 
   * @param {string} [message='Database connection error'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the connection failure
   * 
   * @example
   * ```typescript
   * // Basic connection error
   * throw new CertusConnectionError();
   * 
   * // Detailed connection failure
   * throw new CertusConnectionError(
   *   'Database authentication failed',
   *   {
   *     databaseType: 'PostgreSQL',
   *     host: 'db-cluster.example.com',
   *     port: 5432,
   *     database: 'app_production',
   *     username: 'app_user',
   *     errorCode: '28P01', // PostgreSQL invalid password
   *     suggestion: 'Check database credentials and network connectivity'
   *   }
   * );
   * ```
   */
  constructor(
    message: string = 'Database connection error',
    context: Record<string, unknown> = {}
  ) {
    super(message, ErrorCodes.DB_CONNECTION_ERROR, HttpStatus.SERVICE_UNAVAILABLE, context);
    this.name = 'CertusConnectionError';
  }
}

/**
 * Error thrown when database operations exceed their time limits.
 * 
 * Represents cases where queries, transactions, or other database operations
 * take longer than the configured timeout period. Returns HTTP 504 Gateway Timeout
 * status code to indicate the operation didn't complete in time.
 * 
 * @example
 * ```typescript
 * // Query with timeout
 * try {
 *   const result = await database.query({
 *     text: 'SELECT * FROM large_table WHERE ...',
 *     timeout: 5000 // 5 seconds
 *   });
 * } catch (error) {
 *   if (error.code === '57014') { // PostgreSQL query canceled
 *     throw new CertusTimeoutError(
 *       'Database query exceeded time limit',
 *       { query: 'complex_aggregation', timeoutMs: 5000, table: 'large_table' }
 *     );
 *   }
 * }
 * 
 * // Long-running transaction timeout
 * if (transaction.elapsedTime > MAX_TRANSACTION_TIME) {
 *   throw new CertusTimeoutError('Transaction timeout exceeded')
 *     .withContext({ transactionId: transaction.id, maxDuration: '30s', elapsed: '45s' });
 * }
 * ```
 */
export class CertusTimeoutError extends CertusDatabaseError {
  /**
   * Creates a new CertusTimeoutError instance.
   * 
   * @param {string} [message='Database operation timed out'] - Human-readable error description
   * @param {Record<string, unknown>} [context={}] - Additional context about the timeout
   * 
   * @example
   * ```typescript
   * // Basic timeout error
   * throw new CertusTimeoutError();
   * 
   * // Detailed timeout information
   * throw new CertusTimeoutError(
   *   'Complex analytics query timed out',
   *   {
   *     operation: 'analytics_aggregation',
   *     timeoutLimit: '30 seconds',
   *     actualDuration: '35 seconds',
   *     queryComplexity: 'high',
   *     tablesInvolved: ['events', 'users', 'products'],
   *     rowCount: '1.5M rows',
   *     suggestion: 'Optimize query, add indexes, or use pagination'
   *   }
   * );
   * ```
   */
  constructor(
    message: string = 'Database operation timed out',
    context: Record<string, unknown> = {}
  ) {
    super(message, ErrorCodes.DB_TIMEOUT_ERROR, HttpStatus.GATEWAY_TIMEOUT, context);
    this.name = 'CertusTimeoutError';
  }
}