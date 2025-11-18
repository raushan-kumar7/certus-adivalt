/**
 * Utility class for sensitive data redaction in logs and API responses.
 *
 * Provides comprehensive data sanitization capabilities to prevent accidental
 * exposure of sensitive information. Supports recursive object traversal,
 * customizable sensitive field patterns, and specialized header redaction
 * for HTTP requests and responses.
 *
 * @class DataRedactor
 *
 * @example
 * ```typescript
 * // Basic data redaction
 * const userData = {
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'secret123',
 *   token: 'jwt-token-here',
 *   profile: {
 *     phone: '+1234567890',
 *     ssn: '123-45-6789'
 *   }
 * };
 *
 * const redacted = DataRedactor.redact(userData);
 * // Result:
 * // {
 * //   name: 'John Doe',
 * //   email: '[REDACTED]',
 * //   password: '[REDACTED]',
 * //   token: '[REDACTED]',
 * //   profile: {
 * //     phone: '[REDACTED]',
 * //     ssn: '[REDACTED]'
 * //   }
 * // }
 *
 * // Header redaction
 * const headers = {
 *   'authorization': 'Bearer jwt-token',
 *   'content-type': 'application/json',
 *   'cookie': 'session=abc123',
 *   'x-api-key': 'secret-key'
 * };
 *
 * const safeHeaders = DataRedactor.redactHeaders(headers);
 * // Result:
 * // {
 * //   'authorization': '[REDACTED]',
 * //   'content-type': 'application/json',
 * //   'cookie': '[REDACTED]',
 * //   'x-api-key': '[REDACTED]'
 * // }
 * ```
 */
export class DataRedactor {
  /**
   * Default sensitive field patterns that will be automatically redacted.
   * Includes common authentication, personal, and financial data fields.
   */
  private static defaultSensitiveFields = [
    'password',
    'token',
    'secret',
    'authorization',
    'apiKey',
    'creditCard',
    'ssn',
    'phone',
    'email',
  ];

  /**
   * Recursively redacts sensitive data from objects, arrays, and nested structures.
   *
   * Traverses through all levels of data structure and replaces values of sensitive
   * fields with '[REDACTED]'. Supports partial field name matching (case-insensitive)
   * and custom field patterns in addition to default sensitive fields.
   *
   * @param {any} data - The data to redact (object, array, or primitive)
   * @param {string[]} [sensitiveFields=[]] - Additional custom sensitive field patterns
   * @returns {any} Redacted data with sensitive values replaced
   *
   * @example
   * ```typescript
   * // Redact with custom fields
   * const customFields = ['internalId', 'employeeCode'];
   * const redacted = DataRedactor.redact(data, customFields);
   *
   * // Array handling
   * const users = [
   *   { name: 'John', password: '123', email: 'john@test.com' },
   *   { name: 'Jane', password: '456', email: 'jane@test.com' }
   * ];
   *
   * const safeUsers = DataRedactor.redact(users);
   * // Result: [
   * //   { name: 'John', password: '[REDACTED]', email: '[REDACTED]' },
   * //   { name: 'Jane', password: '[REDACTED]', email: '[REDACTED]' }
   * // ]
   *
   * // Nested object handling
   * const complexData = {
   *   user: {
   *     credentials: {
   *       username: 'john',
   *       password: 'secret',
   *       apiToken: 'token123'
   *     },
   *     contact: {
   *       phone: '1234567890',
   *       email: 'john@example.com'
   *     }
   *   }
   * };
   *
   * const safeComplexData = DataRedactor.redact(complexData);
   * // All sensitive fields at all nesting levels are redacted
   * ```
   */
  static redact(data: any, sensitiveFields: string[] = []): any {
    const fields = [...this.defaultSensitiveFields, ...sensitiveFields];

    if (Array.isArray(data)) {
      return data.map((item) => this.redact(item, fields));
    }

    if (data && typeof data === 'object') {
      const redacted = { ...data };

      for (const key of Object.keys(redacted)) {
        const lowerKey = key.toLowerCase();

        // Check if this field should be redacted
        if (fields.some((field) => lowerKey.includes(field.toLowerCase()))) {
          redacted[key] = '[REDACTED]';
        } else if (typeof redacted[key] === 'object') {
          redacted[key] = this.redact(redacted[key], fields);
        }
      }

      return redacted;
    }

    return data;
  }

  /**
   * Redacts sensitive information from HTTP headers object.
   *
   * Specifically targets common authentication and session headers that may
   * contain tokens, API keys, or other sensitive authentication data.
   * Preserves non-sensitive headers while replacing sensitive ones with '[REDACTED]'.
   *
   * @param {Record<string, string | string[] | undefined>} headers - HTTP headers object
   * @returns {Record<string, string | string[]>} Headers with sensitive values redacted
   *
   * @example
   * ```typescript
   * // Express request header redaction for logging
   * app.use((req: Request, res: Response, next: NextFunction) => {
   *   const safeHeaders = DataRedactor.redactHeaders(req.headers);
   *   logger.info('Request received', { headers: safeHeaders });
   *   next();
   * });
   *
   * // Redacting fetch API headers
   * const response = await fetch(url, { headers });
   * const loggableHeaders = DataRedactor.redactHeaders(headers);
   * logger.debug('API request', { headers: loggableHeaders });
   *
   * // Header preservation example:
   * const headers = {
   *   'authorization': 'Bearer eyJhbGciOi...', // → '[REDACTED]'
   *   'content-type': 'application/json',      // → preserved
   *   'user-agent': 'Mozilla/5.0...',          // → preserved
   *   'x-api-key': 'sk_live_123456',           // → '[REDACTED]'
   *   'cookie': 'session=abc123'               // → '[REDACTED]'
   * };
   * ```
   */
  static redactHeaders(
    headers: Record<string, string | string[] | undefined>
  ): Record<string, string | string[]> {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];

    const redacted = { ...headers };

    for (const header of sensitiveHeaders) {
      if (header in redacted) {
        redacted[header] = '[REDACTED]';
      }
    }

    return redacted as Record<string, string | string[]>;
  }
}
