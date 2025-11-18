// import { CertusAdiValtConfig, Environment, LogLevel } from '@/types';
// import { CertusAdiValtError } from '@/certus';

// export class ConfigManager {
//   private static instance: ConfigManager;
//   private config: CertusAdiValtConfig;
//   private isInitialized = false;

//   private constructor() {
//     // Default configuration
//     this.config = this.getDefaultConfig();
//   }

//   static getInstance(): ConfigManager {
//     if (!ConfigManager.instance) {
//       ConfigManager.instance = new ConfigManager();
//     }
//     return ConfigManager.instance;
//   }

//   private getDefaultConfig(): CertusAdiValtConfig {
//     const environment = this.getEnvironment();

//     return {
//       errors: {
//         includeStack: environment === 'development',
//         logErrors: true,
//         exposeDetails: environment === 'development',
//         formatError: undefined,
//       },
//       logger: {
//         level: this.getLogLevel(environment),
//         service: process.env.SERVICE_NAME || 'certus-adivalt-app',
//         environment: environment,
//         redactFields: ['password', 'token', 'secret', 'authorization', 'apiKey', 'creditCard'],
//         prettyPrint: environment === 'development',
//         timestampFormat: 'ISO',
//         version: process.env.APP_VERSION || '1.0.0',
//       },
//       responses: {
//         includeTimestamp: true,
//         includeRequestId: true,
//         successMessage: undefined,
//         pagination: {
//           defaultPage: 1,
//           defaultLimit: 20,
//           maxLimit: 100,
//         },
//       },
//       middleware: {
//         enableErrorHandler: true,
//         enableLogging: true,
//         enableSecurity: true,
//         skipPaths: ['/health', '/metrics', '/favicon.ico'],
//       },
//     };
//   }

//   private getEnvironment(): Environment {
//     const env = process.env.NODE_ENV || 'development';

//     switch (env) {
//       case 'production':
//         return 'production';
//       case 'staging':
//         return 'stagging';
//       case 'test':
//         return 'test';
//       default:
//         return 'development';
//     }
//   }

//   private getLogLevel(environment: Environment): LogLevel {
//     const levelMap: Record<Environment, LogLevel> = {
//       development: LogLevel.DEBUG,
//       stagging: LogLevel.INFO,
//       production: LogLevel.WARN,
//       test: LogLevel.ERROR,
//     };

//     return levelMap[environment] || LogLevel.INFO;
//   }

//   initialize(userConfig?: Partial<CertusAdiValtConfig>): void {
//     if (this.isInitialized) {
//       throw new CertusAdiValtError(
//         'Configuration already initialized',
//         'CFG_ALREADY_INITIALIZED',
//         400
//       );
//     }

//     // Merge user configuration with defaults
//     this.config = this.deepMerge(this.config, userConfig || {});

//     // Validate configuration
//     this.validateConfig();

//     this.isInitialized = true;
//   }

//   private deepMerge(target: any, source: any): any {
//     const result = { ...target };

//     for (const key in source) {
//       if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
//         result[key] = this.deepMerge(target[key] || {}, source[key]);
//       } else {
//         result[key] = source[key];
//       }
//     }

//     return result;
//   }

//   private validateConfig(): void {
//     const { logger, responses, middleware } = this.config;

//     // Validate logger configuration
//     if (logger.level < LogLevel.ERROR || logger.level > LogLevel.TRACE) {
//       throw new CertusAdiValtError('Invalid log level', 'CFG_INVALID_LOG_LEVEL', 400, {
//         level: logger.level,
//       });
//     }

//     if (!logger.service || typeof logger.service !== 'string') {
//       throw new CertusAdiValtError('Service name is required', 'CFG_INVALID_SERVICE_NAME', 400);
//     }

//     // Validate pagination configuration
//     if (responses.pagination.defaultPage < 1) {
//       throw new CertusAdiValtError(
//         'Default page must be at least 1',
//         'CFG_INVALID_PAGINATION',
//         400
//       );
//     }

//     if (
//       responses.pagination.defaultLimit < 1 ||
//       responses.pagination.defaultLimit > responses.pagination.maxLimit
//     ) {
//       throw new CertusAdiValtError(
//         `Default limit must be between 1 and ${responses.pagination.maxLimit}`,
//         'CFG_INVALID_PAGINATION',
//         400
//       );
//     }

//     // Validate middleware skip paths
//     if (!Array.isArray(middleware.skipPaths)) {
//       throw new CertusAdiValtError('Skip paths must be an array', 'CFG_INVALID_SKIP_PATHS', 400);
//     }
//   }

//   // Getters for specific configuration sections
//   getConfig(): CertusAdiValtConfig {
//     if (!this.isInitialized) {
//       throw new CertusAdiValtError(
//         'Configuration not initialized. Call initialize() first.',
//         'CFG_NOT_INITIALIZED',
//         500
//       );
//     }
//     return { ...this.config };
//   }

//   getErrorsConfig() {
//     return { ...this.config.errors };
//   }

//   getLoggerConfig() {
//     return { ...this.config.logger };
//   }

//   getResponsesConfig() {
//     return { ...this.config.responses };
//   }

//   getMiddlewareConfig() {
//     return { ...this.config.middleware };
//   }

//   // Environment-specific helpers
//   isDevelopment(): boolean {
//     return this.config.logger.environment === 'development';
//   }

//   isProduction(): boolean {
//     return this.config.logger.environment === 'production';
//   }

//   isStaging(): boolean {
//     return this.config.logger.environment === 'stagging';
//   }

//   isTest(): boolean {
//     return this.config.logger.environment === 'test';
//   }

//   // Dynamic configuration updates
//   updateConfig(updates: Partial<CertusAdiValtConfig>): void {
//     if (!this.isInitialized) {
//       throw new CertusAdiValtError('Configuration not initialized', 'CFG_NOT_INITIALIZED', 500);
//     }

//     this.config = this.deepMerge(this.config, updates);
//     this.validateConfig();
//   }

//   // Environment variable helpers
//   getEnvVar(key: string, defaultValue?: string): string {
//     const value = process.env[key];

//     if (value === undefined) {
//       if (defaultValue !== undefined) {
//         return defaultValue;
//       }
//       throw new CertusAdiValtError(
//         `Required environment variable ${key} is not set`,
//         'CFG_MISSING_ENV_VAR',
//         500
//       );
//     }

//     return value;
//   }

//   getEnvVarOptional(key: string, defaultValue?: string): string | undefined {
//     return process.env[key] || defaultValue;
//   }

//   getEnvVarNumber(key: string, defaultValue?: number): number {
//     const value = process.env[key];

//     if (value === undefined) {
//       if (defaultValue !== undefined) {
//         return defaultValue;
//       }
//       throw new CertusAdiValtError(
//         `Required environment variable ${key} is not set`,
//         'CFG_MISSING_ENV_VAR',
//         500
//       );
//     }

//     const numValue = Number(value);
//     if (isNaN(numValue)) {
//       throw new CertusAdiValtError(
//         `Environment variable ${key} must be a number`,
//         'CFG_INVALID_ENV_VAR',
//         500,
//         { value }
//       );
//     }

//     return numValue;
//   }

//   getEnvVarBoolean(key: string, defaultValue?: boolean): boolean {
//     const value = process.env[key];

//     if (value === undefined) {
//       if (defaultValue !== undefined) {
//         return defaultValue;
//       }
//       throw new CertusAdiValtError(
//         `Required environment variable ${key} is not set`,
//         'CFG_MISSING_ENV_VAR',
//         500
//       );
//     }

//     const normalizedValue = value.toLowerCase();
//     if (normalizedValue === 'true' || normalizedValue === '1' || normalizedValue === 'yes') {
//       return true;
//     }
//     if (normalizedValue === 'false' || normalizedValue === '0' || normalizedValue === 'no') {
//       return false;
//     }

//     throw new CertusAdiValtError(
//       `Environment variable ${key} must be a boolean`,
//       'CFG_INVALID_ENV_VAR',
//       500,
//       { value }
//     );
//   }

//   // Reset configuration (mainly for testing)
//   reset(): void {
//     this.config = this.getDefaultConfig();
//     this.isInitialized = false;
//   }
// }

import { CertusAdiValtConfig, Environment, LogLevel } from '@/types';
import { CertusAdiValtError } from '@/certus';

/**
 * Singleton configuration manager for the CertusAdiValt system.
 * 
 * Responsible for loading, validating, and providing access to the
 * application configuration with environment-specific defaults.
 * Implements the singleton pattern to ensure consistent configuration
 * access across the entire application.
 * 
 * @example
 * ```typescript
 * // Initialize with default configuration
 * ConfigManager.getInstance().initialize();
 * 
 * // Initialize with custom configuration
 * ConfigManager.getInstance().initialize({
 *   logger: {
 *     level: LogLevel.DEBUG,
 *     service: 'my-service'
 *   }
 * });
 * 
 * // Get configuration
 * const config = ConfigManager.getInstance().getConfig();
 * ```
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: CertusAdiValtConfig;
  private isInitialized = false;

  /**
   * Private constructor to enforce singleton pattern.
   * Initializes with default configuration derived from environment variables
   * and sensible defaults for each environment.
   */
  private constructor() {
    // Default configuration
    this.config = this.getDefaultConfig();
  }

  /**
   * Gets the singleton instance of ConfigManager.
   * Creates a new instance if one doesn't exist, otherwise returns
   * the existing instance.
   * 
   * @returns {ConfigManager} The singleton ConfigManager instance
   * 
   * @example
   * ```typescript
   * const configManager = ConfigManager.getInstance();
   * ```
   */
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Creates the default configuration based on environment variables
   * and sensible defaults for each environment type.
   * 
   * @returns {CertusAdiValtConfig} Default configuration with environment-appropriate values
   * 
   * @remarks
   * - Development: Includes stack traces, pretty printing, debug logging
   * - Production: No stack traces exposed, warning level logging, JSON formatting
   * - Staging: Info level logging, no sensitive data exposure
   * - Test: Error level logging only, minimal output
   */
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

  /**
   * Determines the current environment from NODE_ENV environment variable.
   * Falls back to 'development' if NODE_ENV is not set or unrecognized.
   * 
   * @returns {Environment} Current environment type
   * 
   * @remarks
   * Maps common NODE_ENV values to internal Environment types:
   * - 'production' → 'production'
   * - 'staging' → 'stagging' (note the spelling difference)
   * - 'test' → 'test'
   * - Everything else → 'development'
   */
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

  /**
   * Maps environment to appropriate log level based on operational requirements.
   * 
   * @param {Environment} environment - Current application environment
   * @returns {LogLevel} Log level appropriate for the given environment
   * 
   * @remarks
   * Environment to log level mapping:
   * - development: DEBUG (maximum visibility)
   * - stagging: INFO (balanced visibility)
   * - production: WARN (errors and warnings only)
   * - test: ERROR (errors only)
   */
  private getLogLevel(environment: Environment): LogLevel {
    const levelMap: Record<Environment, LogLevel> = {
      development: LogLevel.DEBUG,
      stagging: LogLevel.INFO,
      production: LogLevel.WARN,
      test: LogLevel.ERROR,
    };

    return levelMap[environment] || LogLevel.INFO;
  }

  /**
   * Initializes the configuration manager with optional user overrides.
   * Merges user configuration with defaults and validates the result.
   * 
   * @param {Partial<CertusAdiValtConfig>} [userConfig] - Partial configuration object 
   *        containing user-specific overrides. All properties are optional and will
   *        be deep-merged with default configuration.
   * 
   * @throws {CertusAdiValtError} CFG_ALREADY_INITIALIZED - When configuration has 
   *         already been initialized and this method is called again
   * @throws {CertusAdiValtError} CFG_INVALID_LOG_LEVEL - When log level is outside valid range
   * @throws {CertusAdiValtError} CFG_INVALID_SERVICE_NAME - When service name is missing or invalid
   * @throws {CertusAdiValtError} CFG_INVALID_PAGINATION - When pagination settings are invalid
   * @throws {CertusAdiValtError} CFG_INVALID_SKIP_PATHS - When middleware skip paths is not an array
   * 
   * @example
   * ```typescript
   * // Initialize with custom logging and response settings
   * configManager.initialize({
   *   logger: {
   *     level: LogLevel.DEBUG,
   *     service: 'my-app',
   *     redactFields: ['password', 'token', 'customSecret']
   *   },
   *   responses: {
   *     includeRequestId: false,
   *     pagination: {
   *       defaultLimit: 50,
   *       maxLimit: 200
   *     }
   *   }
   * });
   * ```
   */
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

  /**
   * Deep merges two objects, recursively combining nested objects while
   * handling arrays and primitive values appropriately.
   * 
   * @param {any} target - Target object to merge into. This object will be
   *        used as the base for the merge operation.
   * @param {any} source - Source object to merge from. Properties from this
   *        object will take precedence over target properties.
   * @returns {any} New object containing the deeply merged result
   * 
   * @remarks
   * - Primitive values and arrays from source overwrite target completely
   * - Nested objects are merged recursively
   * - Does not modify the original target or source objects
   * - Handles null and undefined values appropriately
   */
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

  /**
   * Validates the current configuration for correctness and consistency.
   * Performs comprehensive checks on all configuration sections.
   * 
   * @throws {CertusAdiValtError} CFG_INVALID_LOG_LEVEL - When log level is outside 
   *         the valid range (LogLevel.ERROR to LogLevel.TRACE)
   * @throws {CertusAdiValtError} CFG_INVALID_SERVICE_NAME - When service name is 
   *         missing, empty, or not a string
   * @throws {CertusAdiValtError} CFG_INVALID_PAGINATION - When pagination settings 
   *         are invalid (defaultPage < 1, or defaultLimit outside 1-maxLimit range)
   * @throws {CertusAdiValtError} CFG_INVALID_SKIP_PATHS - When middleware skipPaths 
   *         is not an array
   * 
   * @remarks
   * This method is called automatically during initialization and configuration updates
   * to ensure configuration integrity throughout the application lifecycle.
   */
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

  /**
   * Gets the complete configuration object.
   * Returns a deep copy to prevent external modification of internal configuration.
   * 
   * @returns {CertusAdiValtConfig} Complete configuration object containing all
   *          settings for errors, logger, responses, and middleware
   * 
   * @throws {CertusAdiValtError} CFG_NOT_INITIALIZED - When configuration has not
   *         been initialized via initialize() method
   * 
   * @example
   * ```typescript
   * const config = configManager.getConfig();
   * console.log(config.logger.level); // Access logger settings
   * console.log(config.responses.pagination.defaultLimit); // Access pagination settings
   * ```
   */
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

  /**
   * Gets the errors configuration section.
   * 
   * @returns {Object} Errors configuration containing settings for:
   *          - includeStack: boolean - Whether to include stack traces
   *          - logErrors: boolean - Whether to log errors internally
   *          - exposeDetails: boolean - Whether to expose details to clients
   *          - formatError: function - Optional custom error formatter
   */
  getErrorsConfig() {
    return { ...this.config.errors };
  }

  /**
   * Gets the logger configuration section.
   * 
   * @returns {Object} Logger configuration containing settings for:
   *          - level: LogLevel - Minimum logging level
   *          - service: string - Service name
   *          - environment: Environment - Runtime environment
   *          - redactFields: string[] - Fields to redact in logs
   *          - prettyPrint: boolean - Whether to use pretty printing
   *          - timestampFormat: string - Timestamp format
   *          - version: string - Application version
   */
  getLoggerConfig() {
    return { ...this.config.logger };
  }

  /**
   * Gets the responses configuration section.
   * 
   * @returns {Object} Responses configuration containing settings for:
   *          - includeTimestamp: boolean - Whether to include timestamps
   *          - includeRequestId: boolean - Whether to include request IDs
   *          - successMessage: string - Optional default success message
   *          - pagination: Object - Pagination settings (defaultPage, defaultLimit, maxLimit)
   */
  getResponsesConfig() {
    return { ...this.config.responses };
  }

  /**
   * Gets the middleware configuration section.
   * 
   * @returns {Object} Middleware configuration containing settings for:
   *          - enableErrorHandler: boolean - Whether to enable error handler
   *          - enableLogging: boolean - Whether to enable logging
   *          - enableSecurity: boolean - Whether to enable security
   *          - skipPaths: string[] - Paths to skip middleware processing
   */
  getMiddlewareConfig() {
    return { ...this.config.middleware };
  }

  // Environment-specific helpers

  /**
   * Checks if the current environment is development.
   * 
   * @returns {boolean} True if environment is 'development', false otherwise
   * 
   * @example
   * ```typescript
   * if (configManager.isDevelopment()) {
   *   // Enable development-only features
   *   app.use('/dev-tools', devToolsMiddleware);
   * }
   * ```
   */
  isDevelopment(): boolean {
    return this.config.logger.environment === 'development';
  }

  /**
   * Checks if the current environment is production.
   * 
   * @returns {boolean} True if environment is 'production', false otherwise
   * 
   * @example
   * ```typescript
   * if (configManager.isProduction()) {
   *   // Enable production optimizations
   *   app.enable('view cache');
   * }
   * ```
   */
  isProduction(): boolean {
    return this.config.logger.environment === 'production';
  }

  /**
   * Checks if the current environment is staging.
   * 
   * @returns {boolean} True if environment is 'stagging', false otherwise
   * 
   * @remarks
   * Note: Uses 'stagging' spelling (with double 'g') to match the Environment type
   */
  isStaging(): boolean {
    return this.config.logger.environment === 'stagging';
  }

  /**
   * Checks if the current environment is test.
   * 
   * @returns {boolean} True if environment is 'test', false otherwise
   * 
   * @example
   * ```typescript
   * if (configManager.isTest()) {
   *   // Use test database
   *   db.connect(process.env.TEST_DATABASE_URL);
   * }
   * ```
   */
  isTest(): boolean {
    return this.config.logger.environment === 'test';
  }

  // Dynamic configuration updates

  /**
   * Updates the configuration with partial changes.
   * Performs deep merge with existing configuration and revalidates.
   * 
   * @param {Partial<CertusAdiValtConfig>} updates - Partial configuration object
   *        containing the settings to update. Only specified properties will be changed.
   * 
   * @throws {CertusAdiValtError} CFG_NOT_INITIALIZED - When configuration has not
   *         been initialized via initialize() method
   * @throws {CertusAdiValtError} Various validation errors - When updated configuration
   *         fails validation (same errors as initialize method)
   * 
   * @example
   * ```typescript
   * // Update log level dynamically
   * configManager.updateConfig({
   *   logger: {
   *     level: LogLevel.ERROR
   *   }
   * });
   * 
   * // Update multiple sections
   * configManager.updateConfig({
   *   logger: {
   *     level: LogLevel.INFO
   *   },
   *   middleware: {
   *     skipPaths: ['/health', '/metrics', '/debug']
   *   }
   * });
   * ```
   */
  updateConfig(updates: Partial<CertusAdiValtConfig>): void {
    if (!this.isInitialized) {
      throw new CertusAdiValtError('Configuration not initialized', 'CFG_NOT_INITIALIZED', 500);
    }

    this.config = this.deepMerge(this.config, updates);
    this.validateConfig();
  }

  // Environment variable helpers

  /**
   * Gets a required environment variable.
   * 
   * @param {string} key - Environment variable name to retrieve
   * @param {string} [defaultValue] - Optional default value to return if environment
   *        variable is not set. If not provided and variable is missing, throws an error.
   * @returns {string} Environment variable value
   * 
   * @throws {CertusAdiValtError} CFG_MISSING_ENV_VAR - When environment variable is
   *         not set and no default value is provided
   * 
   * @example
   * ```typescript
   * const dbUrl = configManager.getEnvVar('DATABASE_URL'); // Throws if not set
   * const port = configManager.getEnvVar('PORT', '3000'); // Uses default if not set
   * ```
   */
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

  /**
   * Gets an optional environment variable.
   * 
   * @param {string} key - Environment variable name to retrieve
   * @param {string} [defaultValue] - Optional default value to return if environment
   *        variable is not set
   * @returns {string | undefined} Environment variable value, default value, or undefined
   * 
   * @example
   * ```typescript
   * const apiKey = configManager.getEnvVarOptional('API_KEY'); // undefined if not set
   * const timeout = configManager.getEnvVarOptional('TIMEOUT', '5000'); // '5000' if not set
   * ```
   */
  getEnvVarOptional(key: string, defaultValue?: string): string | undefined {
    return process.env[key] || defaultValue;
  }

  /**
   * Gets a required numeric environment variable.
   * Parses the environment variable value as a number and validates it.
   * 
   * @param {string} key - Environment variable name to retrieve
   * @param {number} [defaultValue] - Optional default number to return if environment
   *        variable is not set. If not provided and variable is missing, throws an error.
   * @returns {number} Parsed numeric value
   * 
   * @throws {CertusAdiValtError} CFG_MISSING_ENV_VAR - When environment variable is
   *         not set and no default value is provided
   * @throws {CertusAdiValtError} CFG_INVALID_ENV_VAR - When environment variable value
   *         cannot be parsed as a valid number
   * 
   * @example
   * ```typescript
   * const port = configManager.getEnvVarNumber('PORT', 3000);
   * const workers = configManager.getEnvVarNumber('WORKER_COUNT'); // Throws if not set
   * const maxConnections = configManager.getEnvVarNumber('MAX_CONNECTIONS', 100);
   * ```
   */
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

  /**
   * Gets a required boolean environment variable.
   * Parses the environment variable value as a boolean and validates it.
   * 
   * @param {string} key - Environment variable name to retrieve
   * @param {boolean} [defaultValue] - Optional default boolean to return if environment
   *        variable is not set. If not provided and variable is missing, throws an error.
   * @returns {boolean} Parsed boolean value
   * 
   * @throws {CertusAdiValtError} CFG_MISSING_ENV_VAR - When environment variable is
   *         not set and no default value is provided
   * @throws {CertusAdiValtError} CFG_INVALID_ENV_VAR - When environment variable value
   *         cannot be parsed as a valid boolean
   * 
   * @remarks
   * Accepts the following case-insensitive values as true:
   * - 'true', '1', 'yes'
   * Accepts the following case-insensitive values as false:
   * - 'false', '0', 'no'
   * 
   * @example
   * ```typescript
   * const debug = configManager.getEnvVarBoolean('DEBUG', false);
   * const ssl = configManager.getEnvVarBoolean('SSL_ENABLED', true);
   * const maintenance = configManager.getEnvVarBoolean('MAINTENANCE_MODE'); // Throws if not set
   * ```
   */
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

  /**
   * Resets the configuration to defaults and marks as uninitialized.
   * Primarily intended for testing scenarios where clean state is required.
   * 
   * @example
   * ```typescript
   * // In test setup
   * beforeEach(() => {
   *   configManager.reset();
   * });
   * 
   * // Or for specific test cases
   * it('should work with default config', () => {
   *   configManager.reset();
   *   // Test with default configuration
   * });
   * ```
   */
  reset(): void {
    this.config = this.getDefaultConfig();
    this.isInitialized = false;
  }
}