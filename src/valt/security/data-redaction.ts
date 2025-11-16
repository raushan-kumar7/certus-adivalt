export class DataRedactor {
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
