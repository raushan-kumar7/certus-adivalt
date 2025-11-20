# CertusAdiValt

<div align="center">

![CertusAdiValt Banner](https://via.placeholder.com/1200x300/667eea/ffffff?text=CertusAdiValt)

**The Certain Shield for Your Applications**

> *Where Certainty Meets Elegance in Modern Application Development*

[![npm version](https://img.shields.io/npm/v/certus-adivalt.svg?style=flat-square&color=667eea)](https://www.npmjs.com/package/certus-adivalt)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/certus-adivalt?style=flat-square&label=gzipped)](https://bundlephobia.com/package/certus-adivalt)
[![Downloads](https://img.shields.io/npm/dm/certus-adivalt.svg?style=flat-square&color=success)](https://www.npmjs.com/package/certus-adivalt)
[![Build Status](https://img.shields.io/github/actions/workflow/status/raushan-kumar7/certus-adivalt/ci.yml?style=flat-square)](https://github.com/raushan-kumar7/certus-adivalt/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
</div>

## Introduction

CertusAdiValt is a comprehensive TypeScript library designed to provide robust, type-safe utilities for modern application development. It offers a complete suite of tools for error handling, logging, configuration management, and API response standardization, helping developers build reliable and maintainable applications with confidence.

### Key Features
- 🛡️ **Comprehensive Error Handling** - Hierarchical error system with type-safe error classes
- 📝 **Structured Logging** - Multiple formatters with sensitive data redaction
- ⚙️ **Configuration Management** - Environment-aware configuration with validation
- 🔄 **Standardized Responses** - Consistent API response formatting
- 🔧 **Utility Functions** - Common development utilities and helpers
- 🛠️ **Express Middleware** - Ready-to-use middleware for web applications
- 📦 **TypeScript First** - Full TypeScript support with extensive type definitions

### Installation

```bash
npm install certus-adivalt
```

### Quick Start

```typescript
import { 
  ConfigManager, 
  ValtLogger, 
  CertusResponseBuilder,
  CorrelationMiddleware,
  ErrorMiddleware,
  LogLevel 
} from 'certus-adivalt';

// Initialize configuration
const configManager = ConfigManager.getInstance();
configManager.initialize({
  logger: {
    level: LogLevel.INFO,
    service: 'my-app',
    environment: 'development'
  }
});

// Create logger instance
const logger = new ValtLogger(configManager.getLoggerConfig());

// Use in your application
logger.info('Application started successfully');

// Create standardized API responses
const successResponse = CertusResponseBuilder.success(
  { id: 1, name: 'Example' },
  'Data retrieved successfully'
);
```

## Architecture Overview

CertusAdiValt follows a modular architecture with clear separation of concerns:

```
certus-adivalt/
├── adi/          # Configuration and utilities
├── certus/       # Error handling system
├── responses/    # API response management
├── valt/         # Logging and middleware
├── types/        # Type definitions
└── constants/    # Constants and messages
```

### Module Dependencies

- **ADI Module**: Foundation layer for configuration and utilities
- **Certus Module**: Depends on ADI for configuration
- **Responses Module**: Depends on Certus for error handling
- **Valt Module**: Depends on all other modules for comprehensive functionality


## Table of Contents

- [Types](#types)
  - [Core Configuration Types](#core-configuration-types)
  - [Error Handling Types](#error-handling-types)
  - [Logging Types](#logging-types)
  - [Response Types](#response-types)
- [Constants](#constants)
  - [Error Codes](#error-codes)
  - [HTTP Status Codes](#http-status-codes)
  - [User Messages](#user-messages)
  - [Type Aliases](#type-aliases)
- [ADI Module](#adi-module)
  - [ConfigManager Class](#configmanager-class)
  - [CommonUtils Class](#commonutils-class)
- [Certus Module](#certus-module)
  - [Base Error Classes](#base-error-classes)
  - [Client Error Classes](#client-error-classes)
  - [Authentication Error Classes](#authentication-error-classes)
  - [Server Error Classes](#server-error-classes)
  - [Database Error Classes](#database-error-classes)
  - [Validation Error Classes](#validation-error-classes)
  - [Type Guard Functions](#type-guard-functions)
  - [Factory Functions](#factory-functions)
  - [Utility Functions](#utility-functions)
  - [Assertion Functions](#assertion-functions)
- [Responses Module](#responses-module)
  - [Response Builder](#response-builder)
  - [Response Formatter](#response-formatter)
  - [Type Guard Functions](#response-type-guard-functions)
- [Valt Module](#valt-module)
  - [Log Formatters](#log-formatters)
  - [Logger Class](#logger-class)
  - [Middleware Classes](#middleware-classes)
  - [Utility Classes](#utility-classes)
- [Usage Examples](#usage-examples)
  - [Complete Application Setup](#complete-application-setup)
  - [API Controller Example](#api-controller-example)
  - [Error Handling Examples](#error-handling-examples)
  - [Logging Examples](#logging-examples)

## Types

### Core Configuration Types

| Name | Description | Value/Structure |
|------|-------------|-----------------|
| `Environment` | Runtime environment of the application | `'development' \| 'stagging' \| 'production' \| 'test'` |
| `LogLevel` | Logging severity levels | `ERROR = 0`, `WARN = 1`, `INFO = 2`, `DEBUG = 3`, `TRACE = 4` |
| `BaseContext` | Base context shared across logger, errors, responses | `{ timestamp: Date; requestId?: string; userId?: string; sessionId?: string; [key: string]: unknown; }` |
| `PaginationParams` | Pagination details for paginated responses | `{ page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean; }` |
| `CertusAdiValtConfig` | Main configuration object | Complex object with `errors`, `logger`, `responses`, and `middleware` sections |

### Error Handling Types

| Name | Description | Value/Structure |
|------|-------------|-----------------|
| `ErrorContext` | Additional metadata for errors | Extends `BaseContext` with error-specific fields like `code`, `statusCode`, `details`, etc. |
| `CertusErrorOptions` | Options for creating CertusError instances | `{ code: string; statusCode: number; context?: Record<string, unknown>; originalError?: Error; includeStack?: boolean; }` |

### Logging Types

| Name | Description | Value/Structure |
|------|-------------|-----------------|
| `LogEntry` | Represents a single log entry | Extends `BaseContext` with log-specific fields like `level`, `message`, `service`, `error`, etc. |
| `LoggerConfig` | Logger configuration for initialization | `{ level: LogLevel; service: string; environment: string; version?: string; redactFields?: string[]; prettyPrint?: boolean; timestampFormat?: string; }` |

### Response Types

| Name | Description | Value/Structure |
|------|-------------|-----------------|
| `SuccessResponse<T>` | Success response wrapper for API results | `{ success: true; data: T; message?: string; timestamp: string; requestId?: string; meta?: Record<string, unknown>; }` |
| `ErrorResponse` | Standard structure for error API responses | `{ success: false; error: { code: string; message: string; details?: string; statusCode: number; timestamp: string; context?: Record<string, unknown>; requestId?: string; }; }` |
| `PaginatedResponse<T>` | Paginated list response | `{ success: true; data: T[]; pagination: PaginationParams; timestamp: string; requestId?: string; meta?: Record<string, unknown>; }` |
| `EmptyResponse` | Response for operations with no data return | `{ success: true; message?: string; timestamp: string; requestId?: string; }` |
| `ApiResponse<T>` | Union of all possible API response shapes | `SuccessResponse<T> \| ErrorResponse \| PaginatedResponse<T> \| EmptyResponse` |

## Constants

### Error Codes

| Category | Name | Description | Value |
|----------|------|-------------|-------|
| **Authentication** | `AUTH_INVALID_CREDENTIALS` | Invalid username, password, or credentials | `'AUTH_INVALID_CREDENTIALS'` |
| | `AUTH_TOKEN_EXPIRED` | Authentication token has expired | `'AUTH_TOKEN_EXPIRED'` |
| | `AUTH_INSUFFICIENT_PERMISSIONS` | User lacks required permissions | `'AUTH_INSUFFICIENT_PERMISSIONS'` |
| **Validation** | `VAL_INVALID_INPUT` | General input validation failure | `'VAL_INVALID_INPUT'` |
| | `VAL_REQUIRED_FIELD` | Required field is missing or empty | `'VAL_REQUIRED_FIELD'` |
| | `VAL_INVALID_EMAIL` | Email address format is invalid | `'VAL_INVALID_EMAIL'` |
| **Database** | `DB_CONNECTION_ERROR` | Cannot establish connection to database | `'DB_CONNECTION_ERROR'` |
| | `DB_RECORD_NOT_FOUND` | Requested record not found in database | `'DB_RECORD_NOT_FOUND'` |
| | `DB_UNIQUE_CONSTRAINT` | Database unique constraint violation | `'DB_UNIQUE_CONSTRAINT'` |
| **File & Storage** | `FILE_UPLOAD_ERROR` | File upload operation failed | `'FILE_UPLOAD_ERROR'` |
| | `FILE_NOT_FOUND` | Requested file not found in storage | `'FILE_NOT_FOUND'` |
| | `FILE_TOO_LARGE` | File size exceeds allowed limit | `'FILE_TOO_LARGE'` |
| **Server** | `SRV_INTERNAL_ERROR` | Generic internal server error | `'SRV_INTERNAL_ERROR'` |
| | `SRV_EXTERNAL_SERVICE` | External service or API call failed | `'SRV_EXTERNAL_SERVICE'` |
| | `SRV_RATE_LIMIT` | Rate limit exceeded for server operation | `'SRV_RATE_LIMIT'` |
| **Generic** | `GEN_NOT_FOUND` | Generic resource not found error | `'GEN_NOT_FOUND'` |
| | `GEN_BAD_REQUEST` | Generic bad request error | `'GEN_BAD_REQUEST'` |
| | `GEN_UNKNOWN_ERROR` | Unknown or unclassified error | `'GEN_UNKNOWN_ERROR'` |

### HTTP Status Codes

| Category | Name | Description | Value |
|----------|------|-------------|-------|
| **Success (2xx)** | `OK` | The request has succeeded | `200` |
| | `CREATED` | New resource created successfully | `201` |
| | `NO_CONTENT` | Success but no content to return | `204` |
| **Client Errors (4xx)** | `BAD_REQUEST` | Server cannot process due to client error | `400` |
| | `UNAUTHORIZED` | Authentication credentials missing/invalid | `401` |
| | `FORBIDDEN` | Server understood but refuses to authorize | `403` |
| | `NOT_FOUND` | Requested resource not found | `404` |
| | `TOO_MANY_REQUESTS` | Rate limiting applied | `429` |
| **Server Errors (5xx)** | `INTERNAL_SERVER_ERROR` | Unexpected server condition | `500` |
| | `SERVICE_UNAVAILABLE` | Server temporarily unable to handle request | `503` |
| | `GATEWAY_TIMEOUT` | Upstream server didn't respond in time | `504` |

### User Messages

#### Error Messages

| Category | Name | User-Friendly Message |
|----------|------|----------------------|
| **Authentication** | `AUTH_INVALID_CREDENTIALS` | "Invalid email or password" |
| | `AUTH_TOKEN_EXPIRED` | "Authentication token has expired" |
| | `AUTH_INSUFFICIENT_PERMISSIONS` | "Insufficient permissions to access this resource" |
| **Validation** | `VAL_INVALID_INPUT` | "Invalid input provided" |
| | `VAL_REQUIRED_FIELD` | "This field is required" |
| | `VAL_INVALID_EMAIL` | "Invalid email address" |
| **Database** | `DB_CONNECTION_ERROR` | "Database connection failed" |
| | `DB_RECORD_NOT_FOUND` | "Record not found" |
| **File** | `FILE_UPLOAD_ERROR` | "File upload failed" |
| | `FILE_TOO_LARGE` | "File size exceeds limit" |

#### Success Messages

| Name | Message |
|------|---------|
| `OPERATION_SUCCESSFUL` | "Operation completed successfully" |
| `LOGIN_SUCCESSFUL` | "Login successful" |
| `REGISTRATION_SUCCESSFUL` | "Registration successful" |
| `FILE_UPLOADED` | "File uploaded successfully" |
| `DATA_CREATED` | "Data created successfully" |

#### Informational Messages

| Name | Message |
|------|---------|
| `ACCOUNT_PENDING_VERIFICATION` | "Please verify your account to continue" |
| `PASSWORD_RESET_EMAIL_SENT` | "Password reset instructions sent to your email" |
| `MAINTENANCE_SCHEDULED` | "Scheduled maintenance in progress" |

### Type Aliases

| Name | Description | Value |
|------|-------------|-------|
| `ErrorCodeType` | Union of all possible error codes | `(typeof ErrorCodes)[keyof typeof ErrorCodes]` |
| `HttpStatusType` | Union of all possible HTTP status codes | `(typeof HttpStatus)[keyof typeof HttpStatus]` |
| `ErrorMessageType` | Union of all possible error messages | `(typeof ErrorMessages)[keyof typeof ErrorMessages]` |
| `SuccessMessageType` | Union of all possible success messages | `(typeof SuccessMessages)[keyof typeof SuccessMessages]` |
| `InfoMessageType` | Union of all possible informational messages | `(typeof InfoMessages)[keyof typeof InfoMessages]` |

## Usage Examples

### Type Usage
```typescript
import { Environment, LogLevel, BaseContext } from 'certus-adi-valt';

const env: Environment = 'development';
const level: LogLevel = LogLevel.INFO;
const context: BaseContext = {
  timestamp: new Date(),
  requestId: 'req-123',
  userId: 'user-456'
};
```

### Constant Usage
```typescript
import { ErrorCodes, HttpStatus, ErrorMessages } from 'certus-adi-valt';

// Error handling
if (authFailed) {
  throw new Error(ErrorMessages[ErrorCodes.AUTH_INVALID_CREDENTIALS]);
}

// HTTP responses
return response.status(HttpStatus.CREATED).json({
  success: true,
  message: 'User created successfully'
});
```

# Adi

## ConfigManager Class

### Class Overview

**Description**: Singleton configuration manager for the CertusAdiValt system. Responsible for loading, validating, and providing access to the application configuration with environment-specific defaults.

**Pattern**: Implements singleton pattern to ensure consistent configuration access.

### Static Methods

#### `getInstance()`

**Description**: Gets the singleton instance of ConfigManager. Creates a new instance if one doesn't exist, otherwise returns the existing instance.

**Returns**: `ConfigManager` - The singleton ConfigManager instance

**Example**:
```typescript
const configManager = ConfigManager.getInstance();
```

### Instance Methods

#### `initialize(userConfig?)`

**Description**: Initializes the configuration manager with optional user overrides. Merges user configuration with defaults and validates the result.

**Parameters**:
- `userConfig`: `Partial<CertusAdiValtConfig>` (optional) - Partial configuration object containing user-specific overrides

**Throws**:
- `CertusAdiValtError` - CFG_ALREADY_INITIALIZED when configuration already initialized
- `CertusAdiValtError` - Various validation errors for invalid configuration

**Example**:
```typescript
configManager.initialize({
  logger: {
    level: LogLevel.DEBUG,
    service: 'my-app'
  }
});
```

#### `getConfig()`

**Description**: Gets the complete configuration object. Returns a deep copy to prevent external modification.

**Returns**: `CertusAdiValtConfig` - Complete configuration object

**Throws**:
- `CertusAdiValtError` - CFG_NOT_INITIALIZED when configuration not initialized

**Example**:
```typescript
const config = configManager.getConfig();
console.log(config.logger.level);
```

#### `getErrorsConfig()`

**Description**: Gets the errors configuration section.

**Returns**: `Object` - Errors configuration containing settings for includeStack, logErrors, exposeDetails, formatError

**Example**:
```typescript
const errorsConfig = configManager.getErrorsConfig();
```

#### `getLoggerConfig()`

**Description**: Gets the logger configuration section.

**Returns**: `Object` - Logger configuration containing settings for level, service, environment, redactFields, prettyPrint, timestampFormat, version

**Example**:
```typescript
const loggerConfig = configManager.getLoggerConfig();
```

#### `getResponsesConfig()`

**Description**: Gets the responses configuration section.

**Returns**: `Object` - Responses configuration containing settings for includeTimestamp, includeRequestId, successMessage, pagination

**Example**:
```typescript
const responsesConfig = configManager.getResponsesConfig();
```

#### `getMiddlewareConfig()`

**Description**: Gets the middleware configuration section.

**Returns**: `Object` - Middleware configuration containing settings for enableErrorHandler, enableLogging, enableSecurity, skipPaths

**Example**:
```typescript
const middlewareConfig = configManager.getMiddlewareConfig();
```

#### `isDevelopment()`

**Description**: Checks if the current environment is development.

**Returns**: `boolean` - True if environment is 'development', false otherwise

**Example**:
```typescript
if (configManager.isDevelopment()) {
  // Enable development-only features
}
```

#### `isProduction()`

**Description**: Checks if the current environment is production.

**Returns**: `boolean` - True if environment is 'production', false otherwise

**Example**:
```typescript
if (configManager.isProduction()) {
  // Enable production optimizations
}
```

#### `isStaging()`

**Description**: Checks if the current environment is staging.

**Returns**: `boolean` - True if environment is 'stagging', false otherwise

**Example**:
```typescript
if (configManager.isStaging()) {
  // Use staging-specific settings
}
```

#### `isTest()`

**Description**: Checks if the current environment is test.

**Returns**: `boolean` - True if environment is 'test', false otherwise

**Example**:
```typescript
if (configManager.isTest()) {
  // Use test database
}
```

#### `updateConfig(updates)`

**Description**: Updates the configuration with partial changes. Performs deep merge and revalidates.

**Parameters**:
- `updates`: `Partial<CertusAdiValtConfig>` - Partial configuration object containing settings to update

**Throws**:
- `CertusAdiValtError` - CFG_NOT_INITIALIZED when configuration not initialized
- `CertusAdiValtError` - Various validation errors for invalid configuration

**Example**:
```typescript
configManager.updateConfig({
  logger: { level: LogLevel.ERROR }
});
```

#### `getEnvVar(key, defaultValue?)`

**Description**: Gets a required environment variable.

**Parameters**:
- `key`: `string` - Environment variable name
- `defaultValue`: `string` (optional) - Default value if environment variable not set

**Returns**: `string` - Environment variable value

**Throws**:
- `CertusAdiValtError` - CFG_MISSING_ENV_VAR when environment variable not set and no default provided

**Example**:
```typescript
const dbUrl = configManager.getEnvVar('DATABASE_URL');
const port = configManager.getEnvVar('PORT', '3000');
```

#### `getEnvVarOptional(key, defaultValue?)`

**Description**: Gets an optional environment variable.

**Parameters**:
- `key`: `string` - Environment variable name
- `defaultValue`: `string` (optional) - Default value if environment variable not set

**Returns**: `string | undefined` - Environment variable value, default value, or undefined

**Example**:
```typescript
const apiKey = configManager.getEnvVarOptional('API_KEY');
const timeout = configManager.getEnvVarOptional('TIMEOUT', '5000');
```

#### `getEnvVarNumber(key, defaultValue?)`

**Description**: Gets a required numeric environment variable.

**Parameters**:
- `key`: `string` - Environment variable name
- `defaultValue`: `number` (optional) - Default number if environment variable not set

**Returns**: `number` - Parsed numeric value

**Throws**:
- `CertusAdiValtError` - CFG_MISSING_ENV_VAR when environment variable not set and no default provided
- `CertusAdiValtError` - CFG_INVALID_ENV_VAR when value cannot be parsed as number

**Example**:
```typescript
const port = configManager.getEnvVarNumber('PORT', 3000);
const workers = configManager.getEnvVarNumber('WORKER_COUNT');
```

#### `getEnvVarBoolean(key, defaultValue?)`

**Description**: Gets a required boolean environment variable.

**Parameters**:
- `key`: `string` - Environment variable name
- `defaultValue`: `boolean` (optional) - Default boolean if environment variable not set

**Returns**: `boolean` - Parsed boolean value

**Throws**:
- `CertusAdiValtError` - CFG_MISSING_ENV_VAR when environment variable not set and no default provided
- `CertusAdiValtError` - CFG_INVALID_ENV_VAR when value cannot be parsed as boolean

**Example**:
```typescript
const debug = configManager.getEnvVarBoolean('DEBUG', false);
const ssl = configManager.getEnvVarBoolean('SSL_ENABLED', true);
```

#### `reset()`

**Description**: Resets the configuration to defaults and marks as uninitialized. Primarily for testing.

**Example**:
```typescript
configManager.reset();
```

## CommonUtils Class

### Class Overview

**Description**: A collection of common utility functions used throughout the CertusAdiValt system. Provides helper methods for cloning, validation, string manipulation, and async operations.

**Pattern**: All methods are static and can be used without instantiating the class.

### Static Methods

#### `deepClone(obj)`

**Description**: Deep clone an object, handling dates, arrays, and nested objects.

**Parameters**:
- `obj`: `T` - The object to deep clone

**Returns**: `T` - A deep clone of the original object

**Example**:
```typescript
const original = { a: 1, b: { c: 2 } };
const cloned = CommonUtils.deepClone(original);
```

#### `isEmpty(value)`

**Description**: Check if a value is empty. Handles null, undefined, empty strings, arrays, and objects.

**Parameters**:
- `value`: `any` - The value to check for emptiness

**Returns**: `boolean` - True if value is considered empty, false otherwise

**Example**:
```typescript
CommonUtils.isEmpty(null); // true
CommonUtils.isEmpty('hello'); // false
CommonUtils.isEmpty([]); // true
CommonUtils.isEmpty([1, 2]); // false
```

#### `generateRandomString(length?)`

**Description**: Generate a cryptographically insecure random string of specified length.

**Parameters**:
- `length`: `number` (optional) - Length of random string (default: 16)

**Returns**: `string` - Random string of specified length

**Throws**:
- `Error` - If length is not a positive integer

**Example**:
```typescript
const random = CommonUtils.generateRandomString(32);
```

#### `sleep(ms)`

**Description**: Sleep for specified milliseconds. Returns a promise that resolves after the delay.

**Parameters**:
- `ms`: `number` - Number of milliseconds to sleep

**Returns**: `Promise<void>` - Promise that resolves after specified milliseconds

**Example**:
```typescript
await CommonUtils.sleep(1000);
console.log('1 second later');
```

#### `retry(fn, options?)`

**Description**: Retry an async function with exponential backoff and configurable retry logic.

**Parameters**:
- `fn`: `() => Promise<T>` - Async function to retry
- `options`: `Object` (optional) - Retry configuration
  - `maxAttempts`: `number` (default: 3) - Maximum retry attempts
  - `delayMs`: `number` (default: 1000) - Initial delay between attempts
  - `backoffMultiplier`: `number` (default: 2) - Multiplier for delay after each attempt
  - `shouldRetry`: `(error: Error) => boolean` (default: () => true) - Function to determine if error should be retried

**Returns**: `Promise<T>` - Promise resolving with result of successful function call

**Throws**:
- `CertusAdiValtError` - UTL_RETRY_EXHAUSTED when all retry attempts exhausted
- `Error` - The original error if shouldRetry returns false

**Example**:
```typescript
const result = await CommonUtils.retry(
  () => apiCall(),
  { maxAttempts: 5, delayMs: 500 }
);
```

#### `debounce(func, wait, immediate?)`

**Description**: Debounce function execution. Delays function execution until after wait milliseconds have elapsed since last invocation.

**Parameters**:
- `func`: `T` - The function to debounce
- `wait`: `number` - Number of milliseconds to delay
- `immediate`: `boolean` (optional) - If true, trigger function on leading edge (default: false)

**Returns**: `(...args: Parameters<T>) => void` - Debounced function

**Example**:
```typescript
const debouncedSearch = CommonUtils.debounce(
  (query: string) => performSearch(query), 
  300
);
```

#### `throttle(func, limit)`

**Description**: Throttle function execution. Ensures function is only called at most once per specified limit.

**Parameters**:
- `func`: `T` - The function to throttle
- `limit`: `number` - Number of milliseconds between allowed executions

**Returns**: `(...args: Parameters<T>) => void` - Throttled function

**Example**:
```typescript
const throttledScroll = CommonUtils.throttle(
  () => updateScrollPosition(), 
  100
);
```

#### `safeJsonParse(jsonString, defaultValue?)`

**Description**: Parse JSON safely with default value fallback.

**Parameters**:
- `jsonString`: `string` - JSON string to parse
- `defaultValue`: `T` (optional) - Default value if parsing fails

**Returns**: `T | undefined` - Parsed JSON object or defaultValue if parsing fails

**Example**:
```typescript
const obj = CommonUtils.safeJsonParse('{"a": 1}');
const fallback = CommonUtils.safeJsonParse('invalid', { fallback: true });
```

#### `safeJsonStringify(obj, defaultValue?)`

**Description**: Stringify JSON safely with error handling and default value fallback.

**Parameters**:
- `obj`: `any` - Object to stringify
- `defaultValue`: `string` (optional) - Default JSON string if stringification fails (default: '{}')

**Returns**: `string` - JSON string representation of the object

**Example**:
```typescript
const json = CommonUtils.safeJsonStringify({ a: 1 });
const fallback = CommonUtils.safeJsonStringify(circularObj, '{"error": true}');
```

#### `isValidEmail(email)`

**Description**: Validate email format using basic regex pattern.

**Parameters**:
- `email`: `string` - Email address to validate

**Returns**: `boolean` - True if email format is valid, false otherwise

**Example**:
```typescript
CommonUtils.isValidEmail('user@example.com'); // true
CommonUtils.isValidEmail('invalid-email'); // false
```

#### `isValidUrl(url)`

**Description**: Validate URL format using the URL constructor.

**Parameters**:
- `url`: `string` - URL string to validate

**Returns**: `boolean` - True if URL format is valid, false otherwise

**Example**:
```typescript
CommonUtils.isValidUrl('https://example.com'); // true
CommonUtils.isValidUrl('not-a-url'); // false
```

#### `formatBytes(bytes, decimals?)`

**Description**: Format bytes to human readable string with appropriate unit.

**Parameters**:
- `bytes`: `number` - Number of bytes to format
- `decimals`: `number` (optional) - Number of decimal places (default: 2)

**Returns**: `string` - Formatted string with appropriate unit

**Throws**:
- `Error` - If bytes is negative

**Example**:
```typescript
CommonUtils.formatBytes(1048576); // "1 MB"
CommonUtils.formatBytes(1234567, 0); // "1 MB"
```

#### `generateId(prefix?)`

**Description**: Generate a unique ID combining timestamp and random characters.

**Parameters**:
- `prefix`: `string` (optional) - Optional prefix for generated ID (default: '')

**Returns**: `string` - Unique ID string

**Example**:
```typescript
CommonUtils.generateId(); // "kf91pzabc123"
CommonUtils.generateId('user_'); // "user_kf91pzabc123"
```

#### `maskSensitiveData(str, visibleChars?)`

**Description**: Mask sensitive data in strings, showing only specified number of characters at ends.

**Parameters**:
- `str`: `string` - String containing sensitive data to mask
- `visibleChars`: `number` (optional) - Number of characters to keep visible at start and end (default: 4)

**Returns**: `string` - Masked string with middle characters replaced by asterisks

**Example**:
```typescript
CommonUtils.maskSensitiveData('1234567890123456'); // "1234************3456"
CommonUtils.maskSensitiveData('secret-token', 2); // "se********en"
```

#### `isNodeEnvironment()`

**Description**: Check if code is running in a Node.js environment.

**Returns**: `boolean` - True if running in Node.js, false otherwise

**Example**:
```typescript
if (CommonUtils.isNodeEnvironment()) {
  // Use Node.js specific APIs
}
```

#### `isBrowserEnvironment()`

**Description**: Check if code is running in a browser environment.

**Returns**: `boolean` - True if running in browser, false otherwise

**Example**:
```typescript
if (CommonUtils.isBrowserEnvironment()) {
  // Use browser specific APIs
}
```

## Usage Examples

### Configuration Management
```typescript
// Initialize configuration
const configManager = ConfigManager.getInstance();
configManager.initialize({
  logger: {
    level: LogLevel.DEBUG,
    service: 'my-service'
  }
});

// Use configuration
if (configManager.isDevelopment()) {
  console.log('Running in development mode');
}

// Update configuration dynamically
configManager.updateConfig({
  logger: { level: LogLevel.INFO }
});
```

### Common Utilities
```typescript
// Deep cloning
const original = { data: { nested: 'value' } };
const cloned = CommonUtils.deepClone(original);

// Retry with exponential backoff
const result = await CommonUtils.retry(
  () => fetchDataFromAPI(),
  { maxAttempts: 3, delayMs: 1000 }
);

// Debounce user input
const debouncedSearch = CommonUtils.debounce(
  (query) => searchAPI(query),
  300
);

// Safe JSON operations
const data = CommonUtils.safeJsonParse(jsonString, {});
const json = CommonUtils.safeJsonStringify(data);
```

# Certus 

## Base Error Classes

### `CertusAdiValtError` Class

**Description**: Custom error class for the CertusAdiValt system with enhanced error handling capabilities. Extends native Error class to include structured error information, HTTP status codes, contextual metadata, and chainable builder methods.

#### Constructor

**Parameters**:
- `message`: `string` - Human-readable error description
- `code`: `string` (optional) - Machine-readable error code (default: ErrorCodes.SRV_INTERNAL_ERROR)
- `statusCode`: `number` (optional) - HTTP status code (default: HttpStatus.INTERNAL_SERVER_ERROR)
- `context`: `Record<string, unknown>` (optional) - Additional error context (default: {})
- `originalError`: `Error` (optional) - Original error that caused this error

**Example**:
```typescript
throw new CertusAdiValtError('User not found', 'USER_NOT_FOUND', 404);
```

#### Methods

##### `toJSON()`

**Description**: Converts the error to a structured JSON representation suitable for API responses.

**Returns**: `ErrorContext` - Structured error context object with all error details

**Example**:
```typescript
const error = new CertusAdiValtError('Not found', 'NOT_FOUND', 404);
const json = error.toJSON();
```

##### `toLog()`

**Description**: Converts the error to a log-friendly format with reduced verbosity.

**Returns**: `Record<string, unknown>` - Simplified error representation for logging

**Example**:
```typescript
const error = new CertusAdiValtError('DB error', 'DB_ERROR', 500);
const logData = error.toLog();
console.error('Operation failed:', logData);
```

##### `withContext(context)`

**Description**: Creates a new error instance with additional context merged into existing context.

**Parameters**:
- `context`: `Record<string, unknown>` - Additional context to merge

**Returns**: `this` - New error instance with merged context

**Example**:
```typescript
const error = new CertusAdiValtError('Error')
  .withContext({ userId: 123 })
  .withContext({ operation: 'create' });
```

##### `withCode(code)`

**Description**: Creates a new error instance with the specified error code.

**Parameters**:
- `code`: `string` - New error code to use

**Returns**: `this` - New error instance with updated code

**Example**:
```typescript
const error = new CertusAdiValtError('Error').withCode('VALIDATION_ERROR');
```

##### `withStatusCode(statusCode)`

**Description**: Creates a new error instance with the specified HTTP status code.

**Parameters**:
- `statusCode`: `number` - New HTTP status code to use

**Returns**: `this` - New error instance with updated status code

**Example**:
```typescript
const error = new CertusAdiValtError('Error').withStatusCode(400);
```

##### `withMessage(message)`

**Description**: Creates a new error instance with the specified error message.

**Parameters**:
- `message`: `string` - New error message to use

**Returns**: `this` - New error instance with updated message

**Example**:
```typescript
const error = new CertusAdiValtError('Initial').withMessage('More specific error message');
```

## Client Error Classes (4xx)

### `CertusClientError` Class

**Description**: Base client error class for all client-side (4xx) errors. Represents errors that are the client's responsibility.

**Constructor Parameters**:
- `message`: `string` - Human-readable error description
- `code`: `string` (optional) - Machine-readable error code (default: ErrorCodes.GEN_VALIDATION_ERROR)
- `statusCode`: `number` (optional) - HTTP status code (default: HttpStatus.BAD_REQUEST)
- `context`: `Record<string, unknown>` (optional) - Additional context about the client error

**Example**:
```typescript
throw new CertusClientError('Invalid request parameters', 'CUSTOM_CLIENT_ERROR', 400);
```

### `CertusValidationError` Class

**Description**: Error thrown when input data fails validation rules. Returns HTTP 422 Unprocessable Entity.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Validation failed')
- `context`: `Record<string, unknown>` (optional) - Additional context about validation failures

**Example**:
```typescript
throw new CertusValidationError('User data validation failed', { errors: validation.errors });
```

### `CertusNotFoundError` Class

**Description**: Error thrown when a requested resource cannot be found. Returns HTTP 404 Not Found.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Resource not found')
- `context`: `Record<string, unknown>` (optional) - Additional context about the missing resource

**Example**:
```typescript
throw new CertusNotFoundError(`User with ID ${userId} not found`, { resource: 'User', id: userId });
```

### `CertusUnauthorizedError` Class

**Description**: Error thrown when authentication is required but not provided or invalid. Returns HTTP 401 Unauthorized.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Unauthorized access')
- `context`: `Record<string, unknown>` (optional) - Additional context about the authorization failure

**Example**:
```typescript
throw new CertusUnauthorizedError('Authentication required to access this resource');
```

### `CertusForbiddenError` Class

**Description**: Error thrown when the client is authenticated but lacks permission for the requested action. Returns HTTP 403 Forbidden.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Access forbidden')
- `context`: `Record<string, unknown>` (optional) - Additional context about the permission denial

**Example**:
```typescript
throw new CertusForbiddenError('Only administrators can delete users', { userRole: user.role });
```

## Authentication Error Classes

### `CertusAuthenticationError` Class

**Description**: Base authentication error class for all authentication-related failures.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Authentication failed')
- `code`: `string` (optional) - Machine-readable error code (default: ErrorCodes.AUTH_INVALID_CREDENTIALS)
- `statusCode`: `number` (optional) - HTTP status code (default: HttpStatus.UNAUTHORIZED)
- `context`: `Record<string, unknown>` (optional) - Additional authentication context

**Example**:
```typescript
throw new CertusAuthenticationError('Multi-factor authentication required', ErrorCodes.AUTH_MFA_REQUIRED);
```

### `CertusInvalidCredentialsError` Class

**Description**: Error thrown when user credentials (username/password) are invalid or incorrect.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Invalid credentials')
- `context`: `Record<string, unknown>` (optional) - Additional context about the credential failure

**Example**:
```typescript
throw new CertusInvalidCredentialsError('Username or password is incorrect', { username, attemptCount: 3 });
```

### `CertusTokenExpiredError` Class

**Description**: Error thrown when an authentication token (JWT, access token, etc.) has expired.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Token has expired')
- `context`: `Record<string, unknown>` (optional) - Additional context about the token expiration

**Example**:
```typescript
throw new CertusTokenExpiredError('Your session has expired. Please log in again.', { tokenId: token.id });
```

### `CertusInsufficientPermissionsError` Class

**Description**: Error thrown when a user lacks sufficient permissions to perform an action. Returns HTTP 403 Forbidden.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Insufficient permissions')
- `context`: `Record<string, unknown>` (optional) - Additional context about the permission failure

**Example**:
```typescript
throw new CertusInsufficientPermissionsError('You do not have permission to delete users', { requiredPermission: 'delete_users' });
```

### `CertusSessionRevokedError` Class

**Description**: Error thrown when a user's session has been explicitly revoked or invalidated.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Session has been revoked')
- `context`: `Record<string, unknown>` (optional) - Additional context about the session revocation

**Example**:
```typescript
throw new CertusSessionRevokedError('This session was terminated by the user', { sessionId, revokedAt: session.revokedAt });
```

## Server Error Classes (5xx)

### `CertusServerError` Class

**Description**: Base server error class for all server-side (5xx) errors. Represents errors that are the server's responsibility.

**Constructor Parameters**:
- `message`: `string` - Human-readable error description
- `code`: `string` (optional) - Machine-readable error code (default: ErrorCodes.SRV_INTERNAL_ERROR)
- `statusCode`: `number` (optional) - HTTP status code (default: HttpStatus.INTERNAL_SERVER_ERROR)
- `context`: `Record<string, unknown>` (optional) - Additional context about the server error

**Example**:
```typescript
throw new CertusServerError('Failed to process payment workflow', ErrorCodes.SRV_PROCESSING_ERROR, 500);
```

### `CertusInternalServerError` Class

**Description**: Error thrown for generic internal server errors when no more specific error applies. Returns HTTP 500 Internal Server Error.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Internal server error')
- `context`: `Record<string, unknown>` (optional) - Additional context about the internal error

**Example**:
```typescript
throw new CertusInternalServerError('An unexpected error occurred', { operation: 'business_critical_operation' });
```

### `CertusExternalServiceError` Class

**Description**: Error thrown when external service dependencies fail or return errors. Returns HTTP 502 Bad Gateway.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'External service error')
- `context`: `Record<string, unknown>` (optional) - Additional context about the external service failure

**Example**:
```typescript
throw new CertusExternalServiceError('Payment gateway unavailable', { service: 'stripe_payment_gateway', operation: 'charge' });
```

### `CertusConfigurationError` Class

**Description**: Error thrown when application configuration is invalid, missing, or misconfigured. Returns HTTP 500 Internal Server Error.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Configuration error')
- `context`: `Record<string, unknown>` (optional) - Additional context about the configuration issue

**Example**:
```typescript
throw new CertusConfigurationError('Database connection string is required', { missingVariable: 'DATABASE_URL' });
```

## Database Error Classes

### `CertusDatabaseError` Class

**Description**: Base database error class for all database-related failures.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Database error occurred')
- `code`: `string` (optional) - Machine-readable error code (default: ErrorCodes.DB_QUERY_ERROR)
- `statusCode`: `number` (optional) - HTTP status code (default: HttpStatus.INTERNAL_SERVER_ERROR)
- `context`: `Record<string, unknown>` (optional) - Additional context about the database error

**Example**:
```typescript
throw new CertusDatabaseError('Failed to create user record', ErrorCodes.DB_QUERY_ERROR, 500, { table: 'users' });
```

### `CertusUniqueConstraintError` Class

**Description**: Error thrown when a database unique constraint violation occurs. Returns HTTP 409 Conflict.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Unique constraint violation')
- `context`: `Record<string, unknown>` (optional) - Additional context about the constraint violation

**Example**:
```typescript
throw new CertusUniqueConstraintError('Email address already registered', { field: 'email', value: 'user@example.com' });
```

### `CertusConnectionError` Class

**Description**: Error thrown when database connection issues occur. Returns HTTP 503 Service Unavailable.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Database connection error')
- `context`: `Record<string, unknown>` (optional) - Additional context about the connection failure

**Example**:
```typescript
throw new CertusConnectionError('Unable to connect to database', { host: config.database.host, port: config.database.port });
```

### `CertusTimeoutError` Class

**Description**: Error thrown when database operations exceed their time limits. Returns HTTP 504 Gateway Timeout.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Database operation timed out')
- `context`: `Record<string, unknown>` (optional) - Additional context about the timeout

**Example**:
```typescript
throw new CertusTimeoutError('Database query exceeded time limit', { query: 'complex_aggregation', timeoutMs: 5000 });
```

## Validation Error Classes

### `CertusInputValidationError` Class

**Description**: Error thrown when input data fails basic validation rules. Returns HTTP 400 Bad Request.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Input validation failed')
- `context`: `Record<string, unknown>` (optional) - Additional context about validation failures

**Example**:
```typescript
throw new CertusInputValidationError('Email and password are required', { missingFields: ['email', 'password'] });
```

### `CertusSchemaValidationError` Class

**Description**: Error thrown when data fails schema validation against a defined schema. Returns HTTP 422 Unprocessable Entity.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Schema validation failed')
- `context`: `Record<string, unknown>` (optional) - Additional context about schema validation failures

**Example**:
```typescript
throw new CertusSchemaValidationError('Data does not match expected schema', { schema: 'user-registration', errors: validation.errors });
```

### `CertusBusinessRuleError` Class

**Description**: Error thrown when business rules or domain logic constraints are violated. Returns HTTP 409 Conflict.

**Constructor Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Business rule violation')
- `context`: `Record<string, unknown>` (optional) - Additional context about business rule violations

**Example**:
```typescript
throw new CertusBusinessRuleError('Insufficient funds for withdrawal', { accountBalance, withdrawalAmount, deficit: withdrawalAmount - accountBalance });
```

## Type Guard Functions

### `isCertusError(error)`

**Description**: Type guard to check if an unknown value is a CertusAdiValtError instance.

**Parameters**:
- `error`: `unknown` - The value to check

**Returns**: `error is CertusAdiValtError` - True if the value is a CertusAdiValtError instance

**Example**:
```typescript
try {
  await someOperation();
} catch (error) {
  if (isCertusError(error)) {
    console.log(error.code); // Safe access to CertusAdiValtError properties
  }
}
```

### `isClientError(error)`

**Description**: Checks if an error is a client error (4xx status code range).

**Parameters**:
- `error`: `unknown` - The error to check

**Returns**: `boolean` - True if the error is a CertusAdiValtError with 4xx status code

**Example**:
```typescript
if (isClientError(error)) {
  showUserErrorMessage(error.message);
} else {
  showGenericErrorMessage();
}
```

### `isServerError(error)`

**Description**: Checks if an error is a server error (5xx status code range).

**Parameters**:
- `error`: `unknown` - The error to check

**Returns**: `boolean` - True if the error is a CertusAdiValtError with 5xx status code

**Example**:
```typescript
if (isServerError(error)) {
  sendAlertToOpsTeam(error);
  return createServerErrorResponse();
}
```

### `isAuthenticationError(error)`

**Description**: Checks if an error is an authentication-related error.

**Parameters**:
- `error`: `unknown` - The error to check

**Returns**: `boolean` - True if the error is a CertusAdiValtError with AUTH_ prefix error code

**Example**:
```typescript
if (isAuthenticationError(error)) {
  clearUserSession();
  return redirectToLogin();
}
```

### `isValidationError(error)`

**Description**: Checks if an error is a validation-related error.

**Parameters**:
- `error`: `unknown` - The error to check

**Returns**: `boolean` - True if the error is a CertusAdiValtError with VAL_ prefix error code

**Example**:
```typescript
if (isValidationError(error)) {
  const fieldErrors = extractValidationErrors(error);
  highlightInvalidFields(fieldErrors);
}
```

### `isDatabaseError(error)`

**Description**: Checks if an error is a database-related error.

**Parameters**:
- `error`: `unknown` - The error to check

**Returns**: `boolean` - True if the error is a CertusAdiValtError with DB_ prefix error code

**Example**:
```typescript
if (isDatabaseError(error)) {
  if (error.code === 'DB_CONNECTION_ERROR') {
    await reconnectToDatabase();
    return retryOperation();
  }
}
```

### `isExternalServiceError(error)`

**Description**: Checks if an error is specifically an external service error.

**Parameters**:
- `error`: `unknown` - The error to check

**Returns**: `boolean` - True if the error is a CertusAdiValtError with SRV_EXTERNAL_SERVICE error code

**Example**:
```typescript
if (isExternalServiceError(error)) {
  monitoring.logExternalServiceFailure('payment_gateway', error);
}
```

## Factory Functions

### `createCertusError(message, options)`

**Description**: Creates a generic CertusAdiValtError with full customization options.

**Parameters**:
- `message`: `string` - Human-readable error description
- `options`: `CertusErrorOptions` - Error configuration options

**Returns**: `CertusAdiValtError` - New CertusAdiValtError instance

**Example**:
```typescript
const error = createCertusError('Inventory allocation failed', {
  code: 'INVENTORY_ALLOCATION_FAILED',
  statusCode: 409,
  context: { productId: 'prod_123', requestedQty: 10, availableQty: 5 }
});
```

### `createValidationError(message, context)`

**Description**: Creates a validation error for input or data validation failures.

**Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Validation failed')
- `context`: `Record<string, unknown>` (optional) - Additional context about validation failures

**Returns**: `CertusValidationError` - New CertusValidationError instance

**Example**:
```typescript
throw createValidationError('Email format is invalid');
```

### `createNotFoundError(message, context)`

**Description**: Creates a not found error for missing resources or entities.

**Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Resource not found')
- `context`: `Record<string, unknown>` (optional) - Additional context about the missing resource

**Returns**: `CertusNotFoundError` - New CertusNotFoundError instance

**Example**:
```typescript
throw createNotFoundError('User not found');
```

### `createAuthenticationError(message, context)`

**Description**: Creates an authentication error for credential or token failures.

**Parameters**:
- `message`: `string` (optional) - Human-readable error description (default: 'Authentication failed')
- `context`: `Record<string, unknown>` (optional) - Additional context about authentication failure

**Returns**: `CertusAuthenticationError` - New CertusAuthenticationError instance

**Example**:
```typescript
throw createAuthenticationError('Invalid credentials');
```

## Utility Functions

### `wrapError(error, message, code)`

**Description**: Wraps an unknown error into a CertusAdiValtError, preserving original error information.

**Parameters**:
- `error`: `unknown` - The error to wrap (can be any type)
- `message`: `string` (optional) - Optional custom error message (uses original message if not provided)
- `code`: `string` (optional) - Error code for the wrapped error (default: ErrorCodes.SRV_INTERNAL_ERROR)

**Returns**: `CertusAdiValtError` - CertusAdiValtError instance (original if already a Certus error)

**Example**:
```typescript
try {
  JSON.parse(invalidJson);
} catch (error) {
  throw wrapError(error, 'Failed to parse JSON data');
}
```

### `toClientError(error)`

**Description**: Converts an unknown error to a client error (4xx status code).

**Parameters**:
- `error`: `unknown` - The error to convert

**Returns**: `CertusClientError` - CertusClientError instance

**Example**:
```typescript
const clientError = toClientError(error);
return res.status(clientError.statusCode).json(clientError.toJSON());
```

### `toServerError(error)`

**Description**: Converts an unknown error to a server error (5xx status code).

**Parameters**:
- `error`: `unknown` - The error to convert

**Returns**: `CertusServerError` - CertusServerError instance

**Example**:
```typescript
const serverError = toServerError(error);
logger.error('Background job failed:', serverError.toLog());
```

## Assertion Functions

### `assertCertusError(error, message)`

**Description**: Asserts that an unknown value is a CertusAdiValtError instance.

**Parameters**:
- `error`: `unknown` - The value to assert as CertusAdiValtError
- `message`: `string` (optional) - Custom error message for assertion failure

**Throws**: `CertusServerError` - Throws if the value is not a CertusAdiValtError

**Example**:
```typescript
function processError(error: unknown) {
  assertCertusError(error, 'Expected a Certus error for processing');
  console.log(error.code); // Safe access
}
```

### `assertClientError(error, message)`

**Description**: Asserts that an unknown value is a client error (4xx status code).

**Parameters**:
- `error`: `unknown` - The value to assert as CertusClientError
- `message`: `string` (optional) - Custom error message for assertion failure

**Throws**: `CertusServerError` - Throws if the value is not a CertusClientError

**Example**:
```typescript
function formatClientErrorResponse(error: unknown) {
  assertClientError(error, 'Expected client error for response formatting');
  return {
    status: error.statusCode,
    code: error.code,
    message: error.message
  };
}
```

## Usage Examples

### Basic Error Creation
```typescript
// Simple error
throw new CertusAdiValtError('User not found', 'USER_NOT_FOUND', 404);

// With builder pattern
throw new CertusAdiValtError('Initial error')
  .withCode('VALIDATION_ERROR')
  .withStatusCode(400)
  .withContext({ field: 'email', value: 'invalid' });
```

### Error Handling
```typescript
try {
  await someOperation();
} catch (error) {
  if (isCertusError(error)) {
    // Handle known Certus errors
    if (isClientError(error)) {
      logger.warn('Client error:', error.toLog());
    } else if (isServerError(error)) {
      logger.error('Server error:', error.toLog());
      sendAlertToOpsTeam(error);
    }
  } else {
    // Wrap unknown errors
    throw wrapError(error, 'Unexpected error occurred');
  }
}
```

### API Error Responses
```typescript
app.use((error, req, res, next) => {
  if (isCertusError(error)) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.toJSON()
    });
  }
  
  // Convert unknown errors to server errors
  const serverError = toServerError(error);
  return res.status(serverError.statusCode).json({
    success: false,
    error: serverError.toJSON()
  });
});
```

# Responses
# CertusAdiValt - Response System Documentation

## Overview

Comprehensive response handling system with builders, formatters, and type guards for creating and handling standardized API responses in the CertusAdiValt system.

## Response Builder

### `CertusResponseBuilder` Class

**Description**: Response builder utility for creating standardized API responses in the CertusAdiValt system. Provides factory methods for creating consistent, well-structured API responses following the CertusAdiValt response format standards.

#### Static Methods

##### `generateTimestamp()`

**Description**: Generates an ISO 8601 timestamp for response standardization.

**Returns**: `string` - ISO 8601 formatted timestamp

**Example**:
```typescript
const timestamp = CertusResponseBuilder.generateTimestamp();
// Returns: "2024-01-15T10:30:00.000Z"
```

##### `success(data, message?, requestId?, meta?)`

**Description**: Creates a standard success response with data payload.

**Type Parameters**:
- `T` - Type of the data payload

**Parameters**:
- `data`: `T` - The main response data payload
- `message`: `string` (optional) - Optional success message
- `requestId`: `string` (optional) - Optional request ID for tracing
- `meta`: `Record<string, unknown>` (optional) - Optional additional metadata

**Returns**: `SuccessResponse<T>` - Standardized success response

**Example**:
```typescript
// Basic success response
return CertusResponseBuilder.success({ id: 1, name: 'John' });

// Success response with message and metadata
return CertusResponseBuilder.success(
  userData,
  'User profile retrieved',
  'req_123456',
  { cache: { hit: true, ttl: 300 } }
);
```

##### `error(error, requestId?)`

**Description**: Creates a standardized error response from any error object.

**Parameters**:
- `error`: `CertusAdiValtError | Error` - The error to convert to response format
- `requestId`: `string` (optional) - Optional request ID for tracing

**Returns**: `ErrorResponse` - Standardized error response

**Example**:
```typescript
// From CertusAdiValtError
try {
  await authenticateUser(credentials);
} catch (error) {
  if (error instanceof CertusAdiValtError) {
    return CertusResponseBuilder.error(error, requestId);
  }
  return CertusResponseBuilder.error(error, requestId);
}

// From generic Error
try {
  JSON.parse(invalidJson);
} catch (error) {
  return CertusResponseBuilder.error(error, 'req_123456');
}
```

##### `paginated(data, pagination, requestId?, meta?)`

**Description**: Creates a paginated response for list endpoints with pagination metadata.

**Type Parameters**:
- `T` - Type of items in the data array

**Parameters**:
- `data`: `T[]` - Array of paginated items
- `pagination`: `PaginationParams` - Pagination metadata
- `requestId`: `string` (optional) - Optional request ID for tracing
- `meta`: `Record<string, unknown>` (optional) - Optional additional metadata

**Returns**: `PaginatedResponse<T>` - Standardized paginated response

**Example**:
```typescript
const pagination = {
  page: 1,
  limit: 20,
  total: 150,
  totalPages: 8,
  hasNext: true,
  hasPrev: false
};
return CertusResponseBuilder.paginated(users, pagination, requestId);
```

##### `empty(message?, requestId?)`

**Description**: Creates an empty success response for operations that don't return data.

**Parameters**:
- `message`: `string` (optional) - Optional success message
- `requestId`: `string` (optional) - Optional request ID for tracing

**Returns**: `EmptyResponse` - Standardized empty success response

**Example**:
```typescript
// Basic empty response
return CertusResponseBuilder.empty();

// Empty response with custom message
return CertusResponseBuilder.empty('Operation completed successfully', 'req_123456');

// For DELETE endpoints
await userRepository.delete(userId);
return CertusResponseBuilder.empty('User deleted successfully', requestId);
```

##### `created(data, message?, requestId?)`

**Description**: Creates a success response specifically for resource creation (HTTP 201 equivalent).

**Type Parameters**:
- `T` - Type of the created resource data

**Parameters**:
- `data`: `T` - The created resource data
- `message`: `string` (optional) - Success message (default: 'Resource created successfully')
- `requestId`: `string` (optional) - Optional request ID for tracing

**Returns**: `SuccessResponse<T>` - Standardized creation success response

**Example**:
```typescript
// Create user response
const newUser = await userRepository.create(userData);
return CertusResponseBuilder.created(newUser, 'User created successfully', requestId);

// Create with custom message
return CertusResponseBuilder.created(
  product,
  'Product added to catalog',
  requestId
);
```

##### `updated(data, message?, requestId?)`

**Description**: Creates a success response specifically for resource updates (HTTP 200/204 equivalent).

**Type Parameters**:
- `T` - Type of the updated resource data

**Parameters**:
- `data`: `T` - The updated resource data
- `message`: `string` (optional) - Success message (default: 'Resource updated successfully')
- `requestId`: `string` (optional) - Optional request ID for tracing

**Returns**: `SuccessResponse<T>` - Standardized update success response

**Example**:
```typescript
// Update user response
const updatedUser = await userRepository.update(userId, updateData);
return CertusResponseBuilder.updated(updatedUser, 'User profile updated', requestId);

// Partial update response
return CertusResponseBuilder.updated(
  partialUser,
  'User preferences updated',
  requestId
);
```

##### `deleted(message?, requestId?)`

**Description**: Creates an empty success response specifically for resource deletion.

**Parameters**:
- `message`: `string` (optional) - Success message (default: 'Resource deleted successfully')
- `requestId`: `string` (optional) - Optional request ID for tracing

**Returns**: `EmptyResponse` - Standardized deletion success response

**Example**:
```typescript
// Delete user response
await userRepository.delete(userId);
return CertusResponseBuilder.deleted('User account deleted', requestId);

// Delete with custom message
return CertusResponseBuilder.deleted(
  'Product removed from inventory',
  requestId
);
```

## Response Formatter

### `ResponseFormatter` Class

**Description**: High-level response formatting utility for the CertusAdiValt system. Provides simplified, opinionated methods for formatting API responses with sensible defaults and enhanced error handling.

#### Static Methods

##### `formatSuccess(data, options?)`

**Description**: Formats a successful API response with data payload.

**Type Parameters**:
- `T` - Type of the data payload

**Parameters**:
- `data`: `T` - The main response data payload
- `options`: `Object` (optional) - Response formatting options
  - `message`: `string` (optional) - Optional success message
  - `requestId`: `string` (optional) - Optional request ID for tracing
  - `meta`: `Record<string, unknown>` (optional) - Optional additional metadata

**Returns**: `ApiResponse<T>` - Formatted success response

**Example**:
```typescript
// Basic success response
return ResponseFormatter.formatSuccess({ id: 1, name: 'John' });

// Success with all options
return ResponseFormatter.formatSuccess(
  userData,
  {
    message: 'User profile retrieved successfully',
    requestId: 'req_123456',
    meta: {
      cache: { hit: true, ttl: 300 },
      permissions: ['read', 'write']
    }
  }
);
```

##### `formatError(error, options?)`

**Description**: Formats an error response from any type of error with enhanced handling.

**Parameters**:
- `error`: `unknown` - The error to format (any type)
- `options`: `Object` (optional) - Error formatting options
  - `requestId`: `string` (optional) - Optional request ID for tracing
  - `includeDetails`: `boolean` (optional) - Whether to include detailed error messages in production (default: false)

**Returns**: `ApiResponse` - Formatted error response

**Example**:
```typescript
// Handle CertusAdiValtError (preserves original structure)
try {
  await userService.authenticate(credentials);
} catch (error) {
  return ResponseFormatter.formatError(error, {
    requestId: req.requestId
  });
}

// Handle generic errors with detail masking
try {
  JSON.parse(invalidJson);
} catch (error) {
  return ResponseFormatter.formatError(error, {
    requestId: req.requestId,
    includeDetails: process.env.NODE_ENV === 'development' // Show details only in dev
  });
}
```

##### `formatPaginated(data, pagination, options?)`

**Description**: Formats a paginated response with automatic pagination metadata calculation.

**Type Parameters**:
- `T` - Type of items in the data array

**Parameters**:
- `data`: `T[]` - Array of paginated items
- `pagination`: `Object` - Basic pagination parameters
  - `page`: `number` - Current page number (1-based)
  - `limit`: `number` - Number of items per page
  - `total`: `number` - Total number of items across all pages
- `options`: `Object` (optional) - Pagination formatting options
  - `requestId`: `string` (optional) - Optional request ID for tracing
  - `meta`: `Record<string, unknown>` (optional) - Optional additional metadata

**Returns**: `ApiResponse<T>` - Formatted paginated response

**Example**:
```typescript
// Basic pagination
return ResponseFormatter.formatPaginated(
  users,
  {
    page: 1,
    limit: 20,
    total: 150
  },
  {
    requestId: req.requestId
  }
);

// Pagination with metadata
return ResponseFormatter.formatPaginated(
  products,
  {
    page: 2,
    limit: 25,
    total: 1000
  },
  {
    requestId: req.requestId,
    meta: {
      filters: { category: 'electronics', priceRange: '100-500' },
      sort: { by: 'name', order: 'asc' }
    }
  }
);
```

## Type Guard Functions

### `isSuccessResponse(response)`

**Description**: Type guard to check if an API response is a success response with data.

**Type Parameters**:
- `T` - The expected type of the data payload

**Parameters**:
- `response`: `ApiResponse<T>` - The API response to check

**Returns**: `response is SuccessResponse<T>` - True if the response is a success response with data

**Example**:
```typescript
// Type-safe response handling
const response = await fetchUserData();

if (isSuccessResponse(response)) {
  // TypeScript now knows response is SuccessResponse<User>
  console.log(response.data.name); // Safe access to data
  console.log(response.data.email); // Safe access to data
}

// In conditional logic
function handleResponse<T>(response: ApiResponse<T>) {
  if (isSuccessResponse(response)) {
    processData(response.data); // response.data is type T
    return response.data;
  }
  throw new Error('Operation failed');
}
```

### `isErrorResponse(response)`

**Description**: Type guard to check if an API response is an error response.

**Parameters**:
- `response`: `ApiResponse` - The API response to check

**Returns**: `response is ErrorResponse` - True if the response is an error response

**Example**:
```typescript
// Safe error handling
const response = await apiCall();

if (isErrorResponse(response)) {
  // TypeScript now knows response is ErrorResponse
  console.error(response.error.message); // Safe access to error
  console.error(response.error.code); // Safe access to error code

  // Handle specific error types
  if (response.error.code === 'AUTH_INVALID_CREDENTIALS') {
    redirectToLogin();
  }
}

// In error processing middleware
function processErrorResponse(response: ApiResponse) {
  if (isErrorResponse(response)) {
    logger.error('API Error:', {
      code: response.error.code,
      message: response.error.message,
      statusCode: response.error.statusCode
    });

    if (response.error.statusCode >= 500) {
      notifyOperationsTeam(response.error);
    }
  }
}
```

### `isPaginatedResponse(response)`

**Description**: Type guard to check if an API response is a paginated response.

**Type Parameters**:
- `T` - The expected type of items in the data array

**Parameters**:
- `response`: `ApiResponse<T>` - The API response to check

**Returns**: `response is PaginatedResponse<T>` - True if the response is a paginated response

**Example**:
```typescript
// Handling paginated lists
const response = await fetchUsers({ page: 1, limit: 20 });

if (isPaginatedResponse(response)) {
  // TypeScript now knows response is PaginatedResponse<User>
  console.log(response.data.length); // Safe access to data array
  console.log(response.pagination.totalPages); // Safe access to pagination
  console.log(response.pagination.hasNext); // Safe access to pagination

  // Render pagination controls
  renderPaginationControls(response.pagination);
}

// In data table components
function DataTable<T>({ response }: { response: ApiResponse<T[]> }) {
  if (isPaginatedResponse(response)) {
    return (
      <div>
        <Table data={response.data} />
        <Pagination
          currentPage={response.pagination.page}
          totalPages={response.pagination.totalPages}
          hasNext={response.pagination.hasNext}
          hasPrev={response.pagination.hasPrev}
        />
      </div>
    );
  }

  return <ErrorMessage response={response} />;
}
```

### `isEmptyResponse(response)`

**Description**: Type guard to check if an API response is an empty success response.

**Parameters**:
- `response`: `ApiResponse` - The API response to check

**Returns**: `response is EmptyResponse` - True if the response is an empty success response

**Example**:
```typescript
// Handling delete operations
const response = await deleteUser(userId);

if (isEmptyResponse(response)) {
  // TypeScript now knows response is EmptyResponse
  console.log(response.message); // Safe access to optional message
  showSuccessNotification(response.message || 'Operation completed successfully');

  // Refresh the UI state
  refreshUserList();
}

// In API client methods
async function deleteResource(id: string): Promise<void> {
  const response = await api.delete(`/resources/${id}`);

  if (isEmptyResponse(response)) {
    // Success - no data returned, but operation completed
    return;
  }

  if (isErrorResponse(response)) {
    throw new Error(response.error.message);
  }

  throw new Error('Unexpected response type');
}
```

## Usage Examples

### Complete API Controller Example
```typescript
import { ResponseFormatter } from '@/response';
import { UserService } from '@/services';

class UserController {
  async getUser(req, res) {
    try {
      const user = await UserService.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json(
          ResponseFormatter.formatError(
            new Error('User not found'),
            { requestId: req.requestId }
          )
        );
      }

      return res.json(
        ResponseFormatter.formatSuccess(user, {
          message: 'User retrieved successfully',
          requestId: req.requestId
        })
      );
    } catch (error) {
      return res.status(500).json(
        ResponseFormatter.formatError(error, {
          requestId: req.requestId,
          includeDetails: process.env.NODE_ENV === 'development'
        })
      );
    }
  }

  async listUsers(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const { users, total } = await UserService.list({ page, limit });

      return res.json(
        ResponseFormatter.formatPaginated(users, {
          page: parseInt(page),
          limit: parseInt(limit),
          total
        }, {
          requestId: req.requestId,
          meta: {
            filters: req.query.filters,
            sort: req.query.sort
          }
        })
      );
    } catch (error) {
      return res.status(500).json(
        ResponseFormatter.formatError(error, {
          requestId: req.requestId
        })
      );
    }
  }

  async deleteUser(req, res) {
    try {
      await UserService.delete(req.params.id);
      
      return res.json(
        ResponseFormatter.formatSuccess(null, {
          message: 'User deleted successfully',
          requestId: req.requestId
        })
      );
    } catch (error) {
      return res.status(500).json(
        ResponseFormatter.formatError(error, {
          requestId: req.requestId
        })
      );
    }
  }
}
```

### Client-Side Response Handling
```typescript
// Type-safe API client
async function apiCall<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint);
  const data: ApiResponse<T> = await response.json();

  if (isSuccessResponse(data)) {
    return data.data;
  }

  if (isErrorResponse(data)) {
    throw new Error(`API Error: ${data.error.message} (${data.error.code})`);
  }

  throw new Error('Unexpected response format');
}

// Handling different response types
async function handleUserResponse() {
  try {
    const response = await fetch('/api/users');
    const data: ApiResponse<User[]> = await response.json();

    if (isPaginatedResponse(data)) {
      console.log(`Page ${data.pagination.page} of ${data.pagination.totalPages}`);
      console.log(`Showing ${data.data.length} of ${data.pagination.total} users`);
      return data.data;
    }

    if (isSuccessResponse(data)) {
      console.log(`Retrieved ${data.data.length} users`);
      return data.data;
    }

    if (isErrorResponse(data)) {
      throw new Error(data.error.message);
    }

    throw new Error('Unknown response type');
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}
```

# Valt
# CertusAdiValt - Logging & Middleware System Documentation

## Overview

Comprehensive logging system with multiple formatters, Express middleware for correlation IDs, error handling, request logging, response formatting, and data redaction utilities.

## Log Formatters

### `JsonFormat` Class

**Description**: JSON formatter for structured logging in the CertusAdiValt system. Transforms LogEntry objects into JSON strings with consistent formatting, timestamp normalization, and configurable output structure.

#### Constructor

**Parameters**:
- `config`: `Required<LoggerConfig>` - Required logger configuration

**Example**:
```typescript
const formatter = new JsonFormat({
  level: LogLevel.INFO,
  service: 'user-service',
  environment: 'production',
  version: '1.0.0',
  redactFields: ['password', 'token'],
  prettyPrint: false,
  timestampFormat: 'ISO'
});
```

#### Methods

##### `format(entry)`

**Description**: Formats a LogEntry into a JSON string with consistent structure.

**Parameters**:
- `entry`: `LogEntry` - The log entry to format

**Returns**: `string` - JSON string representation of the log entry

**Example**:
```typescript
const logEntry: LogEntry = {
  timestamp: new Date(),
  level: LogLevel.INFO,
  message: 'User login successful',
  service: 'user-service',
  environment: 'production',
  version: '1.0.0',
  requestId: 'req_123456',
  userId: 'user_789',
  context: { loginMethod: 'email', ip: '192.168.1.1' }
};

const jsonOutput = formatter.format(logEntry);
// Output: {"timestamp":"2024-01-15T10:30:00.000Z","level":"INFO","service":"user-service",...}
```

### `PrettyFormat` Class

**Description**: Pretty formatter for human-readable console logging in the CertusAdiValt system. Transforms LogEntry objects into colorful, formatted strings optimized for human readability during development and debugging.

#### Constructor

**Parameters**:
- `config`: `Required<LoggerConfig>` - Required logger configuration

**Example**:
```typescript
const formatter = new PrettyFormat({
  level: LogLevel.DEBUG,
  service: 'user-service',
  environment: 'development',
  version: '1.0.0',
  redactFields: ['password', 'token'],
  prettyPrint: true,
  timestampFormat: 'LOCAL'
});
```

#### Methods

##### `format(entry)`

**Description**: Formats a LogEntry into a colorful, human-readable string.

**Parameters**:
- `entry`: `LogEntry` - The log entry to format

**Returns**: `string` - Colorful, formatted string representation of the log entry

**Example**:
```typescript
const logEntry: LogEntry = {
  timestamp: new Date(),
  level: LogLevel.INFO,
  message: 'User login successful',
  service: 'user-service',
  environment: 'development',
  version: '1.0.0',
  requestId: 'req_123456',
  userId: 'user_789',
  context: { loginMethod: 'email', ip: '192.168.1.1' }
};

const prettyOutput = formatter.format(logEntry);
// Output (with colors):
// [1/15/2024, 10:30:00 AM] INFO  user-service: User login successful
```

## Logger Class

### `ValtLogger` Class

**Description**: Main logger class for the CertusAdiValt system with structured logging capabilities. Provides comprehensive logging solution with multiple log levels, formatting options, sensitive data redaction, performance timing, and child logger support.

#### Constructor

**Parameters**:
- `config`: `LoggerConfig` - Logger configuration options

**Example**:
```typescript
// Production configuration
const logger = new ValtLogger({
  level: LogLevel.INFO,
  service: 'api-gateway',
  environment: 'production',
  version: '2.1.0',
  redactFields: ['password', 'authorization', 'apiKey'],
  prettyPrint: false
});

// Development configuration
const devLogger = new ValtLogger({
  level: LogLevel.DEBUG,
  service: 'api-gateway',
  environment: 'development',
  prettyPrint: true
});
```

#### Methods

##### `error(message, context?, error?)`

**Description**: Logs an error message with optional context and error object.

**Parameters**:
- `message`: `string` - The error message
- `context`: `Record<string, unknown>` (optional) - Optional context data
- `error`: `Error` (optional) - Optional error object

**Example**:
```typescript
try {
  await someOperation();
} catch (error) {
  logger.error('Operation failed', { operation: 'user-create' }, error);
}

logger.error('Invalid configuration', { configKey: 'database.url' });
```

##### `warn(message, context?, error?)`

**Description**: Logs a warning message with optional context and error object.

**Parameters**:
- `message`: `string` - The warning message
- `context`: `Record<string, unknown>` (optional) - Optional context data
- `error`: `Error` (optional) - Optional error object

**Example**:
```typescript
logger.warn('Deprecated API called', { endpoint: '/v1/users', alternative: '/v2/users' });
logger.warn('High memory usage', { usage: '85%', threshold: '80%' });
```

##### `info(message, context?)`

**Description**: Logs an informational message with optional context.

**Parameters**:
- `message`: `string` - The info message
- `context`: `Record<string, unknown>` (optional) - Optional context data

**Example**:
```typescript
logger.info('User registered', { userId: '123', method: 'email' });
logger.info('Server started', { port: 3000, environment: 'production' });
```

##### `debug(message, context?)`

**Description**: Logs a debug message with optional context.

**Parameters**:
- `message`: `string` - The debug message
- `context`: `Record<string, unknown>` (optional) - Optional context data

**Example**:
```typescript
logger.debug('Database query executed', { query: 'SELECT * FROM users', duration: 45 });
logger.debug('Cache hit', { key: 'user:123', ttl: 300 });
```

##### `trace(message, context?)`

**Description**: Logs a trace message with optional context.

**Parameters**:
- `message`: `string` - The trace message
- `context`: `Record<string, unknown>` (optional) - Optional context data

**Example**:
```typescript
logger.trace('Function called', { args: ['param1', 'param2'], caller: 'userService' });
logger.trace('State updated', { previous: 'pending', current: 'completed' });
```

##### `time(operation, fn, context?)`

**Description**: Times the execution of a function and logs the duration.

**Type Parameters**:
- `T` - The return type of the function

**Parameters**:
- `operation`: `string` - The operation name for logging
- `fn`: `() => T` - The function to time
- `context`: `Record<string, unknown>` (optional) - Optional context data

**Returns**: `T` - The result of the function

**Example**:
```typescript
// Sync function
const result = logger.time('process-data', () => {
  return processLargeDataset(data);
}, { records: data.length });

// Async function
const user = await logger.time('fetch-user', async () => {
  return await userRepository.findById(userId);
}, { userId });
```

##### `child(context)`

**Description**: Creates a child logger with inherited context.

**Parameters**:
- `context`: `Record<string, unknown>` - Context to include in all child logs

**Returns**: `ValtLogger` - Child logger instance

**Example**:
```typescript
// Create child logger for request context
const requestLogger = logger.child({
  requestId: 'req_123',
  userId: 'user_456',
  sessionId: 'sess_789'
});

requestLogger.info('Processing request'); // Includes request context
requestLogger.debug('Database query', { table: 'users' }); // Merges contexts
```

## Middleware Classes

### `CorrelationMiddleware` Class

**Description**: Express middleware for generating and managing correlation IDs across distributed systems. Provides request tracing capabilities by generating unique correlation IDs that can be used to track requests through multiple services.

#### Methods

##### `generateRequestId()`

**Description**: Generates Express middleware for request ID correlation.

**Returns**: `function` - Express middleware function

**Example**:
```typescript
const correlationMiddleware = new CorrelationMiddleware();
app.use(correlationMiddleware.generateRequestId());

// Accessing request ID in route handlers
app.get('/api/users', (req: Request, res: Response) => {
  const requestId = req.headers['x-request-id'];
  logger.info('Processing user request', { requestId });
});
```

### `ErrorMiddleware` Class

**Description**: Express middleware for comprehensive error handling and 404 route management. Provides centralized error handling with structured logging, consistent error response formatting, and proper 404 handling.

#### Constructor

**Parameters**:
- `logger`: `ValtLogger` - Logger instance for structured error logging

**Example**:
```typescript
const logger = new ValtLogger({ /* config */ });
const errorMiddleware = new ErrorMiddleware(logger);
```

#### Methods

##### `handle()`

**Description**: Global error handler middleware for Express applications.

**Returns**: `function` - Express error handling middleware

**Example**:
```typescript
// Apply middleware in correct order
app.use('/api', apiRoutes);
app.use(errorMiddleware.notFound()); // 404 handler
app.use(errorMiddleware.handle());   // Global error handler (last)
```

##### `notFound()`

**Description**: 404 Not Found handler middleware for unmatched routes.

**Returns**: `function` - Express middleware for 404 handling

**Example**:
```typescript
app.use('/api', apiRoutes);        // Your API routes
app.use('/docs', docsRoutes);      // Documentation routes
app.use(errorMiddleware.notFound()); // 404 for everything else
app.use(errorMiddleware.handle());   // Error handler last
```

### `LoggingMiddleware` Class

**Description**: Express middleware for comprehensive request logging with performance monitoring. Provides detailed logging of incoming HTTP requests and responses, including timing information, status codes, and contextual data.

#### Constructor

**Parameters**:
- `logger`: `ValtLogger` - Logger instance for structured request logging

**Example**:
```typescript
const logger = new ValtLogger({ /* config */ });
const loggingMiddleware = new LoggingMiddleware(logger);
```

#### Methods

##### `requestLogger()`

**Description**: Request logging middleware for Express applications.

**Returns**: `function` - Express middleware function

**Example**:
```typescript
app.use(loggingMiddleware.requestLogger());

// Example log outputs:
// Request: { message: "Incoming request", method: "GET", path: "/api/users", ... }
// Response: { message: "Request completed: 200 OK in 120ms", statusCode: 200, duration: 120, ... }
```

### `ResponseMiddleware` Class

**Description**: Express middleware for standardizing success response formatting across the API. Provides consistent success response formatting by intercepting and transforming JSON responses.

#### Methods

##### `successHandler()`

**Description**: Success response formatting middleware for Express applications.

**Returns**: `function` - Express middleware function

**Example**:
```typescript
const responseMiddleware = new ResponseMiddleware();
app.use(responseMiddleware.successHandler());

// Route handlers work normally - formatting is automatic
app.get('/api/users', (req: Request, res: Response) => {
  const users = userService.getAll();
  res.json(users); // Automatically formatted
});
```

## Utility Classes

### `DataRedactor` Class

**Description**: Utility class for sensitive data redaction in logs and API responses. Provides comprehensive data sanitization capabilities to prevent accidental exposure of sensitive information.

#### Static Methods

##### `redact(data, sensitiveFields?)`

**Description**: Recursively redacts sensitive data from objects, arrays, and nested structures.

**Parameters**:
- `data`: `any` - The data to redact (object, array, or primitive)
- `sensitiveFields`: `string[]` (optional) - Additional custom sensitive field patterns

**Returns**: `any` - Redacted data with sensitive values replaced

**Example**:
```typescript
const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secret123',
  token: 'jwt-token-here',
  profile: {
    phone: '+1234567890',
    ssn: '123-45-6789'
  }
};

const redacted = DataRedactor.redact(userData);
// Result:
// {
//   name: 'John Doe',
//   email: '[REDACTED]',
//   password: '[REDACTED]',
//   token: '[REDACTED]',
//   profile: {
//     phone: '[REDACTED]',
//     ssn: '[REDACTED]'
//   }
// }
```

##### `redactHeaders(headers)`

**Description**: Redacts sensitive information from HTTP headers object.

**Parameters**:
- `headers`: `Record<string, string | string[] | undefined>` - HTTP headers object

**Returns**: `Record<string, string | string[]>` - Headers with sensitive values redacted

**Example**:
```typescript
const headers = {
  'authorization': 'Bearer jwt-token',
  'content-type': 'application/json',
  'cookie': 'session=abc123',
  'x-api-key': 'secret-key'
};

const safeHeaders = DataRedactor.redactHeaders(headers);
// Result:
// {
//   'authorization': '[REDACTED]',
//   'content-type': 'application/json',
//   'cookie': '[REDACTED]',
//   'x-api-key': '[REDACTED]'
// }
```

## Complete Application Setup Example

```typescript
import express from 'express';
import { 
  ValtLogger, 
  CorrelationMiddleware, 
  ErrorMiddleware, 
  LoggingMiddleware, 
  ResponseMiddleware 
} from 'certus-adivalt';

const app = express();

// Initialize logger
const logger = new ValtLogger({
  level: LogLevel.INFO,
  service: 'api-server',
  environment: process.env.NODE_ENV || 'development',
  version: '1.0.0',
  redactFields: ['password', 'token', 'authorization'],
  prettyPrint: process.env.NODE_ENV === 'development'
});

// Initialize middleware
const correlationMiddleware = new CorrelationMiddleware();
const errorMiddleware = new ErrorMiddleware(logger);
const loggingMiddleware = new LoggingMiddleware(logger);
const responseMiddleware = new ResponseMiddleware();

// Apply middleware in correct order
app.use(correlationMiddleware.generateRequestId()); // First - for request ID
app.use(loggingMiddleware.requestLogger());         // Second - for request logging
app.use(express.json());                            // Third - for body parsing
app.use(express.urlencoded({ extended: true }));

// Your application routes
app.use('/api', apiRoutes);

// Response formatting (before error handlers)
app.use(responseMiddleware.successHandler());

// Error handling (last)
app.use(errorMiddleware.notFound()); // 404 handler
app.use(errorMiddleware.handle());   // Global error handler

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`, { port: PORT, environment: process.env.NODE_ENV });
});
```

## Usage Examples

### Complete Route Handler with Logging

```typescript
import { Request, Response } from 'express';
import { ValtLogger } from 'certus-adivalt';

class UserController {
  private logger: ValtLogger;

  constructor(logger: ValtLogger) {
    this.logger = logger;
  }

  async getUser(req: Request, res: Response) {
    const requestLogger = this.logger.child({
      requestId: req.headers['x-request-id'],
      userId: req.params.id,
      method: 'GET',
      path: req.path
    });

    try {
      requestLogger.info('Fetching user data');

      // Time database operation
      const user = await requestLogger.time('database-query', async () => {
        return await userRepository.findById(req.params.id);
      }, { userId: req.params.id });

      if (!user) {
        requestLogger.warn('User not found', { userId: req.params.id });
        return res.status(404).json({ error: 'User not found' });
      }

      requestLogger.info('User data retrieved successfully', { 
        userId: user.id,
        userRole: user.role 
      });

      res.json(user);
    } catch (error) {
      requestLogger.error('Failed to fetch user', { userId: req.params.id }, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```

### Custom Logging Configuration

```typescript
// Production logging configuration
const productionLogger = new ValtLogger({
  level: LogLevel.INFO,
  service: 'order-service',
  environment: 'production',
  version: '2.3.1',
  redactFields: [
    'password',
    'creditCard',
    'cvv',
    'authorization',
    'apiKey',
    'sessionId'
  ],
  prettyPrint: false,
  timestampFormat: 'ISO'
});

// Development logging configuration
const developmentLogger = new ValtLogger({
  level: LogLevel.DEBUG,
  service: 'order-service',
  environment: 'development',
  version: '2.3.1',
  redactFields: ['password', 'creditCard'],
  prettyPrint: true,
  timestampFormat: 'LOCAL'
});
```

# 👥 **Built With Care**

## 🌟 **Founding Developer**

<div align="center">

| [![Raushan Kumar](https://github.com/raushan-kumar7.png?size=100)](https://github.com/raushan-kumar7) |
|:----------------------------------------------------------------------------------------------------:|
| **Raushan Kumar**                                                                                    |
| 🚀 Developer                                                                                         |
| 💻 Full-Stack Architect • 🔐 Security Focus • 📚 Documentation                                      |
| [![GitHub](https://img.shields.io/badge/GitHub-Profile-blue)](https://github.com/raushan-kumar7)    |

</div>

---

## 🤝 **Join Our Growing Community!**

### **We're Starting Our Journey Together** 🌱

You could be our **first contributor**! Every great project starts with a single commit.

### **Why Contribute Now?**
- 🏆 **Be a Pioneer** - Get ground-floor recognition
- 📈 **Shape the Future** - Influence the project direction early
- 🎯 **High Impact** - Your contributions will be highly visible
- 🤝 **Direct Collaboration** - Work closely with the founder

### **Perfect First Contributions** ✨

## 🎯 **Contribution Opportunities**

| Area | Priority | Good for Beginners | Status |
|------|----------|-------------------|---------|
| 🐛 Bug Fixes | 🔴 High | ✅ Yes | `0 fixed` |
| 📚 Documentation | 🟡 Medium | ✅ Yes | `Waiting for you!` |
| 🧪 Testing | 🟢 Low | ✅ Yes | `0 tests` |
| 🔧 Features | 🟡 Medium | ⚠️ Some | `Planned` |

## 🏆 **Milestones We're Targeting**
- [ ] **First External Contributor** 👶
- [ ] **10 Stars** ⭐ 
- [ ] **First Production Use** 🚀
- [ ] **v1.0 Release** 🎉

**Help us unlock these achievements!**

---

## 🚀 **Be the First to Make History!**

### **Your Name Could Be Here:**
```
| [![Your Avatar](https://via.placeholder.com/100/4CAF50/FFFFFF?text=You+)](https://github.com/your-username) |
|:----------------------------------------------------------------------------------------------------------:|
| **Your Name Here**                                                                                         |
| 🎯 First Contributor • 🌟 Project Pioneer                                                                  |
| *Added [amazing feature] on [date]*                                                                        |
```

### **Ready to Make Your Mark?**
1. **Browse** [Good First Issues](https://github.com/raushan-kumar7/certus-adivalt/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) 🎯
2. **Pick** something that interests you 💡
3. **Comment** "I'd like to work on this!" 👋
4. **Get** personalized guidance from the founder 🤝

### **Special Perks for Early Contributors** 🎁
- 📢 **Featured prominently** in our hall of fame
- 💬 **Direct access** to founder for guidance
- 🎯 **Meaningful impact** on project direction
- 🔥 **Bragging rights** as an early pioneer

---

## 💫 **A Message from the Founder**

> "I started CertusAdiValt to solve real problems in certificate management. While I've built the foundation alone, I truly believe this project will thrive with community collaboration. 
>
> **Your fresh perspective could be exactly what we need** to take this to the next level. Don't worry about experience level - I'm here to help you every step of the way!
>
> Let's build something amazing together! 🚀"
>
> — *Raushan Kumar*

---

## 🌟 **How You Can Help Right Now**

### **Even Small Contributions Make a Big Difference:**

#### 🎯 **Quick Wins** (5-15 minutes)
- 📝 Fix a typo in documentation
- 🔍 Report a small UI issue
- 💡 Suggest better variable names
- 📚 Improve a code comment

#### 🛠 **Meaningful Contributions** (1-2 hours)
- 🧪 Write a simple test case
- 📖 Improve one section of documentation
- 🔧 Fix a beginner-friendly bug
- 🎨 Suggest UI improvements

#### 🚀 **Impactful Projects** (Ongoing)
- 🌐 Add support for new certificate types
- 🔌 Create integration examples
- 📊 Improve error handling
- ⚡ Performance optimizations

---

## 🛠 **Getting Started Made Easy**

**Ready to contribute?** Here's how to start:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **No Contribution Too Small!**
- ✅ Found a typo? Fix it!
- ✅ Confused by documentation? Clarify it!
- ✅ Have an idea? Share it!
- ✅ Found a bug? Report it!

---

## 🌐 **Special Thanks**
- **Open Source Community** - For inspiration and collaboration
- **Early Adopters** - For testing in production and providing real-world feedback
- **Future Contributors** - For joining this journey with us

---

<div align="center">

## 🎉 **Your Journey Starts Here**

**Be the first to join our contributor family and help shape the future of CertusAdiValt!**

[![First Issue](https://img.shields.io/badge/Find%20Your%20First%20Issue-%20%E2%9C%A8-blue)](https://github.com/raushan-kumar7/certus-adivalt/issues)
[![Ask Question](https://img.shields.io/badge/Ask%20a%20Question-%20💬-green)](https://github.com/raushan-kumar7/certus-adivalt/discussions)
[![View Docs](https://img.shields.io/badge/Read%20Docs-%20📚-orange)](https://github.com/raushan-kumar7/certus-adivalt/blob/main/README.md)

**Together, let's turn this solo project into a thriving community!** 🌈

---

**Created with ❤️ by [Raushan Kumar](https://github.com/raushan-kumar7)**

</div>