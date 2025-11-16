import { CertusAdiValtConfig, Environment, LogLevel } from '@/types';
import { CertusAdiValtError } from '@/certus';

export class ConfigManager {
  private static instance: ConfigManager;
  private config: CertusAdiValtConfig;
  private isInitialized = false;

  private constructor() {
    // Default configuration
    this.config = this.getDefaultConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private getDefaultConfig(): CertusAdiValtConfig {
    const environment = this.getEnvironment();

    return {
      errors: {
        includeStack: environment === 'development',
        logErrors: true,
        exposeDetails: environment === 'development',
        formatError: undefined,
      },
      logger: {
        level: this.getLogLevel(environment),
        service: process.env.SERVICE_NAME || 'certus-adivalt-app',
        environment: environment,
        redactFields: ['password', 'token', 'secret', 'authorization', 'apiKey', 'creditCard'],
        prettyPrint: environment === 'development',
        timestampFormat: 'ISO',
        version: process.env.APP_VERSION || '1.0.0',
      },
      responses: {
        includeTimestamp: true,
        includeRequestId: true,
        successMessage: undefined,
        pagination: {
          defaultPage: 1,
          defaultLimit: 20,
          maxLimit: 100,
        },
      },
      middleware: {
        enableErrorHandler: true,
        enableLogging: true,
        enableSecurity: true,
        skipPaths: ['/health', '/metrics', '/favicon.ico'],
      },
    };
  }

  private getEnvironment(): Environment {
    const env = process.env.NODE_ENV || 'development';

    switch (env) {
      case 'production':
        return 'production';
      case 'staging':
        return 'stagging';
      case 'test':
        return 'test';
      default:
        return 'development';
    }
  }

  private getLogLevel(environment: Environment): LogLevel {
    const levelMap: Record<Environment, LogLevel> = {
      development: LogLevel.DEBUG,
      stagging: LogLevel.INFO,
      production: LogLevel.WARN,
      test: LogLevel.ERROR,
    };

    return levelMap[environment] || LogLevel.INFO;
  }

  initialize(userConfig?: Partial<CertusAdiValtConfig>): void {
    if (this.isInitialized) {
      throw new CertusAdiValtError(
        'Configuration already initialized',
        'CFG_ALREADY_INITIALIZED',
        400
      );
    }

    // Merge user configuration with defaults
    this.config = this.deepMerge(this.config, userConfig || {});

    // Validate configuration
    this.validateConfig();

    this.isInitialized = true;
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  private validateConfig(): void {
    const { logger, responses, middleware } = this.config;

    // Validate logger configuration
    if (logger.level < LogLevel.ERROR || logger.level > LogLevel.TRACE) {
      throw new CertusAdiValtError('Invalid log level', 'CFG_INVALID_LOG_LEVEL', 400, {
        level: logger.level,
      });
    }

    if (!logger.service || typeof logger.service !== 'string') {
      throw new CertusAdiValtError('Service name is required', 'CFG_INVALID_SERVICE_NAME', 400);
    }

    // Validate pagination configuration
    if (responses.pagination.defaultPage < 1) {
      throw new CertusAdiValtError(
        'Default page must be at least 1',
        'CFG_INVALID_PAGINATION',
        400
      );
    }

    if (
      responses.pagination.defaultLimit < 1 ||
      responses.pagination.defaultLimit > responses.pagination.maxLimit
    ) {
      throw new CertusAdiValtError(
        `Default limit must be between 1 and ${responses.pagination.maxLimit}`,
        'CFG_INVALID_PAGINATION',
        400
      );
    }

    // Validate middleware skip paths
    if (!Array.isArray(middleware.skipPaths)) {
      throw new CertusAdiValtError('Skip paths must be an array', 'CFG_INVALID_SKIP_PATHS', 400);
    }
  }

  // Getters for specific configuration sections
  getConfig(): CertusAdiValtConfig {
    if (!this.isInitialized) {
      throw new CertusAdiValtError(
        'Configuration not initialized. Call initialize() first.',
        'CFG_NOT_INITIALIZED',
        500
      );
    }
    return { ...this.config };
  }

  getErrorsConfig() {
    return { ...this.config.errors };
  }

  getLoggerConfig() {
    return { ...this.config.logger };
  }

  getResponsesConfig() {
    return { ...this.config.responses };
  }

  getMiddlewareConfig() {
    return { ...this.config.middleware };
  }

  // Environment-specific helpers
  isDevelopment(): boolean {
    return this.config.logger.environment === 'development';
  }

  isProduction(): boolean {
    return this.config.logger.environment === 'production';
  }

  isStaging(): boolean {
    return this.config.logger.environment === 'stagging';
  }

  isTest(): boolean {
    return this.config.logger.environment === 'test';
  }

  // Dynamic configuration updates
  updateConfig(updates: Partial<CertusAdiValtConfig>): void {
    if (!this.isInitialized) {
      throw new CertusAdiValtError('Configuration not initialized', 'CFG_NOT_INITIALIZED', 500);
    }

    this.config = this.deepMerge(this.config, updates);
    this.validateConfig();
  }

  // Environment variable helpers
  getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key];

    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new CertusAdiValtError(
        `Required environment variable ${key} is not set`,
        'CFG_MISSING_ENV_VAR',
        500
      );
    }

    return value;
  }

  getEnvVarOptional(key: string, defaultValue?: string): string | undefined {
    return process.env[key] || defaultValue;
  }

  getEnvVarNumber(key: string, defaultValue?: number): number {
    const value = process.env[key];

    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new CertusAdiValtError(
        `Required environment variable ${key} is not set`,
        'CFG_MISSING_ENV_VAR',
        500
      );
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      throw new CertusAdiValtError(
        `Environment variable ${key} must be a number`,
        'CFG_INVALID_ENV_VAR',
        500,
        { value }
      );
    }

    return numValue;
  }

  getEnvVarBoolean(key: string, defaultValue?: boolean): boolean {
    const value = process.env[key];

    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new CertusAdiValtError(
        `Required environment variable ${key} is not set`,
        'CFG_MISSING_ENV_VAR',
        500
      );
    }

    const normalizedValue = value.toLowerCase();
    if (normalizedValue === 'true' || normalizedValue === '1' || normalizedValue === 'yes') {
      return true;
    }
    if (normalizedValue === 'false' || normalizedValue === '0' || normalizedValue === 'no') {
      return false;
    }

    throw new CertusAdiValtError(
      `Environment variable ${key} must be a boolean`,
      'CFG_INVALID_ENV_VAR',
      500,
      { value }
    );
  }

  // Reset configuration (mainly for testing)
  reset(): void {
    this.config = this.getDefaultConfig();
    this.isInitialized = false;
  }
}
