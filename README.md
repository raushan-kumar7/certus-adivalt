# CertusAdiValt 🛡️

**The Certain Shield for Your Applications**

> Certainty Meets Elegance in Modern Application Development

[![npm version](https://img.shields.io/npm/v/certus-adivalt.svg)](https://www.npmjs.com/package/certus-adivalt)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/min/certus-adivalt)](https://bundlephobia.com/package/certus-adivalt)
[![Downloads](https://img.shields.io/npm/dm/certus-adivalt.svg)](https://www.npmjs.com/package/certus-adivalt)

## ✨ Why CertusAdiValt?

In the complex landscape of modern software development, where uncertainty is the only certainty, **CertusAdiValt** emerges as your unwavering guardian. Born from the Latin word "Certus" meaning *certain, sure, and reliable*, combined with our distinctive brand identity "Adi" and the protective concept of "Valt" (vault), we provide the definitive solution for robust error handling, structured logging, and consistent API responses.

**Stop wrestling with inconsistent error handling and fragmented logging. Start building with certainty.**

## 🚀 Quick Start

### Installation

```bash
npm install certus-adivalt
```

### Basic Usage

```typescript
import { 
  ConfigManager, 
  ValtLogger, 
  CertusResponseBuilder,
  ErrorMiddleware,
  LoggingMiddleware,
  CorrelationMiddleware,
  LogLevel 
} from 'certus-adivalt';
import express from 'express';

// Initialize configuration
ConfigManager.getInstance().initialize({
  logger: {
    level: LogLevel.INFO,
    service: 'my-app',
    environment: 'development'
  }
});

// Create logger
const logger = new ValtLogger(ConfigManager.getInstance().getLoggerConfig());

// Setup Express app with middleware
const app = express();
app.use(new CorrelationMiddleware().generateRequestId());
app.use(new LoggingMiddleware(logger).requestLogger());
app.use(express.json());

// Your API routes
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await userService.getById(req.params.id);
    return res.json(CertusResponseBuilder.success(user, 'User found'));
  } catch (error) {
    return res.status(500).json(CertusResponseBuilder.error(error));
  }
});

// Error handling (must be last)
app.use(new ErrorMiddleware(logger).notFound());
app.use(new ErrorMiddleware(logger).handle());

app.listen(3000, () => {
  logger.info('Server started on port 3000');
});
```

## 🎯 The Trinity of Reliability

### 🛡️ CERTUS (Certainty)
- **Predictable error handling** with comprehensive type safety
- **Environment-aware configuration** management
- **Consistent behavior** across all environments

### 🎨 ADI (Brand Excellence)
- **Beautiful, human-readable logs** in development
- **Structured, machine-parseable logs** in production
- **Consistent API response formats** that delight frontend developers

### 🔒 VALT (Secure Vault)
- **Automatic sensitive data redaction**
- **Secure error exposure controls**
- **Protected configuration management**

## 📚 Comprehensive Documentation

### Table of Contents
- [Configuration Management](#configuration-management)
- [Error Handling](#error-handling) 
- [Logging System](#logging-system)
- [API Responses](#api-responses)
- [Express Middleware](#express-middleware)
- [Utilities](#utilities)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)

## ⚙️ Configuration Management

Centralized, type-safe configuration with environment-specific defaults.

```typescript
// Initialize with defaults
ConfigManager.getInstance().initialize();

// Or with custom configuration
ConfigManager.getInstance().initialize({
  logger: {
    level: LogLevel.DEBUG,
    service: 'my-service',
    redactFields: ['password', 'token', 'authorization']
  },
  responses: {
    pagination: {
      defaultLimit: 50,
      maxLimit: 200
    }
  }
});

// Access configuration
const config = ConfigManager.getInstance().getConfig();
const loggerConfig = ConfigManager.getInstance().getLoggerConfig();

// Environment checks
if (ConfigManager.getInstance().isDevelopment()) {
  // Development-specific logic
}

// Type-safe environment variables
const dbUrl = ConfigManager.getInstance().getEnvVar('DATABASE_URL');
const port = ConfigManager.getInstance().getEnvVarNumber('PORT', 3000);
const debug = ConfigManager.getInstance().getEnvVarBoolean('DEBUG', false);
```

## 🚨 Error Handling

Comprehensive error hierarchy with structured information and proper HTTP status codes.

### Error Classes

```typescript
// Authentication & Authorization
throw new CertusAuthenticationError('Invalid credentials');
throw new CertusTokenExpiredError('Session expired');
throw new CertusInsufficientPermissionsError('Admin access required');

// Client Errors (4xx)
throw new CertusValidationError('Invalid email format');
throw new CertusNotFoundError('User not found');
throw new CertusUnauthorizedError('Authentication required');

// Server Errors (5xx)  
throw new CertusDatabaseError('Database connection failed');
throw new CertusExternalServiceError('Payment gateway unavailable');

// Business Logic
throw new CertusBusinessRuleError('Insufficient funds');
```

### Error Utilities

```typescript
// Type-safe error handling
try {
  await someOperation();
} catch (error) {
  if (isCertusError(error)) {
    // TypeScript knows this is a CertusAdiValtError
    logger.error('Operation failed', { context }, error);
    
    if (isClientError(error)) {
      // Handle client errors appropriately
      return ResponseFormatter.formatError(error, { requestId });
    }
  }
  
  // Wrap unknown errors
  const wrappedError = wrapError(error, 'Operation failed');
  return ResponseFormatter.formatError(wrappedError, { requestId });
}

// Error factories
const validationError = createValidationError('Invalid input', { field: 'email' });
const notFoundError = createNotFoundError('User not found');
const authError = createAuthenticationError('Invalid token');
```

## 📊 Logging System

Structured logging with multiple levels, sensitive data redaction, and performance timing.

```typescript
// Create logger
const logger = new ValtLogger({
  level: LogLevel.INFO,
  service: 'user-service',
  environment: 'production',
  redactFields: ['password', 'token', 'creditCard'],
  prettyPrint: false
});

// Different log levels
logger.error('Database connection failed', { host: 'db.example.com' }, error);
logger.warn('High memory usage', { usage: '85%', threshold: '80%' });
logger.info('User registered', { userId: '123', method: 'email' });
logger.debug('Query executed', { query: 'SELECT * FROM users', duration: 45 });
logger.trace('Function called', { args: ['param1', 'param2'] });

// Performance timing
const result = await logger.time('database-query', async () => {
  return await database.query('SELECT * FROM large_table');
}, { table: 'large_table', conditions: 'complex' });

// Child loggers for request context
const requestLogger = logger.child({ 
  requestId: 'req_123', 
  userId: 'user_456',
  sessionId: 'sess_789'
});
requestLogger.info('Processing request');
```

## 🔄 API Responses

Standardized response formatting for success, error, and paginated responses.

### Response Builder

```typescript
// Success responses
return CertusResponseBuilder.success(userData, 'User retrieved successfully');
return CertusResponseBuilder.created(newUser, 'User created successfully');
return CertusResponseBuilder.updated(updatedUser, 'User profile updated');
return CertusResponseBuilder.deleted('User deleted successfully');

// Error responses
try {
  await someOperation();
} catch (error) {
  return CertusResponseBuilder.error(error);
}

// Paginated responses
return CertusResponseBuilder.paginated(users, {
  page: 1,
  limit: 20,
  total: 150,
  totalPages: 8,
  hasNext: true,
  hasPrev: false
}, 'req_123', { 
  filters: { status: 'active' },
  sort: { field: 'name', order: 'asc' }
});
```

### Response Formatter (Simplified)

```typescript
// Automatic formatting
return ResponseFormatter.formatSuccess(userData, {
  message: 'User retrieved successfully',
  requestId: req.headers['x-request-id']
});

return ResponseFormatter.formatError(error, {
  requestId: req.headers['x-request-id'],
  includeDetails: process.env.NODE_ENV === 'development'
});

return ResponseFormatter.formatPaginated(products, {
  page: 1,
  limit: 25,
  total: 1000
}, {
  requestId: req.headers['x-request-id'],
  meta: {
    category: 'electronics',
    inStock: true
  }
});
```

### Type-Safe Response Handling

```typescript
const response = await apiCall();

if (isSuccessResponse(response)) {
  // TypeScript knows response.data exists
  console.log(response.data);
  return response.data;
}

if (isErrorResponse(response)) {
  // TypeScript knows response.error exists
  logger.error('API call failed', { error: response.error });
  throw new Error(response.error.message);
}

if (isPaginatedResponse(response)) {
  // TypeScript knows response.pagination exists
  renderPagination(response.pagination);
  return response.data;
}
```

## 🛣️ Express Middleware

Seamless integration with Express.js applications.

```typescript
import {
  CorrelationMiddleware,
  LoggingMiddleware,
  ResponseMiddleware,
  ErrorMiddleware
} from 'certus-adivalt';

const logger = new ValtLogger(/* config */);

// Create middleware instances
const correlation = new CorrelationMiddleware();
const logging = new LoggingMiddleware(logger);
const response = new ResponseMiddleware();
const error = new ErrorMiddleware(logger);

const app = express();

// Apply in correct order
app.use(correlation.generateRequestId());    // 1. Request ID generation
app.use(logging.requestLogger());           // 2. Request logging
app.use(express.json());                    // 3. Body parsing
app.use(response.successHandler());         // 4. Response formatting

// Your routes here
app.use('/api', apiRoutes);

// Error handling (MUST be last)
app.use(error.notFound());                  // 5. 404 handler
app.use(error.handle());                    // 6. Global error handler
```

## 🔧 Utilities

### Common Utilities

```typescript
// Object manipulation
const cloned = CommonUtils.deepClone(originalObject);
const isEmpty = CommonUtils.isEmpty(value);

// String generation & validation
const randomString = CommonUtils.generateRandomString(32);
const uniqueId = CommonUtils.generateId('user_');
const isValidEmail = CommonUtils.isValidEmail('user@example.com');
const isValidUrl = CommonUtils.isValidUrl('https://example.com');

// Async utilities
await CommonUtils.sleep(1000); // Sleep for 1 second

const result = await CommonUtils.retry(() => apiCall(), {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  shouldRetry: (error) => error.statusCode >= 500
});

// Function control
const debouncedSearch = CommonUtils.debounce((query) => search(query), 300);
const throttledScroll = CommonUtils.throttle(() => updatePosition(), 100);

// Data formatting
const formattedBytes = CommonUtils.formatBytes(1048576); // "1 MB"
const maskedData = CommonUtils.maskSensitiveData('1234567890123456', 4); // "1234************3456"

// Safe operations
const parsed = CommonUtils.safeJsonParse('{"a": 1}');
const stringified = CommonUtils.safeJsonStringify(obj);
```

### Data Redaction

```typescript
// Automatic sensitive data redaction
const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secret123',
  creditCard: '4111111111111111',
  profile: {
    ssn: '123-45-6789',
    phone: '+1234567890'
  }
};

const safeData = DataRedactor.redact(userData);
// {
//   name: 'John Doe',
//   email: '[REDACTED]',
//   password: '[REDACTED]',
//   creditCard: '[REDACTED]',
//   profile: {
//     ssn: '[REDACTED]',
//     phone: '[REDACTED]'
//   }
// }

// HTTP header redaction
const headers = {
  'authorization': 'Bearer eyJhbGciOi...',
  'content-type': 'application/json',
  'cookie': 'session=abc123',
  'x-api-key': 'sk_live_123456'
};

const safeHeaders = DataRedactor.redactHeaders(headers);
// {
//   'authorization': '[REDACTED]',
//   'content-type': 'application/json',
//   'cookie': '[REDACTED]',
//   'x-api-key': '[REDACTED]'
// }
```

## 📖 API Reference

### Core Components

| Component | Description | Main Classes |
|-----------|-------------|--------------|
| **Configuration** | Centralized config management | `ConfigManager` |
| **Error Handling** | Structured error hierarchy | `CertusAdiValtError`, `CertusClientError`, `CertusServerError` |
| **Logging** | Structured logging system | `ValtLogger`, `JsonFormat`, `PrettyFormat` |
| **API Responses** | Response formatting | `CertusResponseBuilder`, `ResponseFormatter` |
| **Middleware** | Express.js integration | `CorrelationMiddleware`, `LoggingMiddleware`, `ErrorMiddleware`, `ResponseMiddleware` |
| **Utilities** | Common helper functions | `CommonUtils`, `DataRedactor` |

### Error Class Hierarchy

```
CertusAdiValtError (Base)
├── CertusClientError (4xx)
│   ├── CertusAuthenticationError
│   ├── CertusValidationError
│   ├── CertusNotFoundError
│   └── CertusForbiddenError
└── CertusServerError (5xx)
    ├── CertusDatabaseError
    ├── CertusExternalServiceError
    ├── CertusConfigurationError
    └── CertusInternalServerError
```

### Log Levels

| Level | Value | Description |
|-------|-------|-------------|
| `ERROR` | 0 | System failures and crashes |
| `WARN` | 1 | Recoverable issues and warnings |
| `INFO` | 2 | Important application events |
| `DEBUG` | 3 | Development debugging information |
| `TRACE` | 4 | Very detailed tracing information |

## 🏗️ Complete Example

Here's a complete real-world example demonstrating CertusAdiValt in action:

```typescript
import express from 'express';
import {
  ConfigManager,
  ValtLogger,
  CertusResponseBuilder,
  ResponseFormatter,
  ErrorMiddleware,
  LoggingMiddleware,
  CorrelationMiddleware,
  ResponseMiddleware,
  LogLevel,
  createNotFoundError,
  createValidationError,
  wrapError
} from 'certus-adivalt';

// Initialize configuration
ConfigManager.getInstance().initialize({
  logger: {
    level: LogLevel.INFO,
    service: 'ecommerce-api',
    environment: process.env.NODE_ENV || 'development',
    redactFields: ['password', 'token', 'creditCard', 'authorization']
  },
  responses: {
    includeTimestamp: true,
    includeRequestId: true,
    pagination: {
      defaultPage: 1,
      defaultLimit: 20,
      maxLimit: 100
    }
  },
  errors: {
    includeStack: process.env.NODE_ENV === 'development',
    logErrors: true,
    exposeDetails: process.env.NODE_ENV === 'development'
  }
});

// Create logger
const logger = new ValtLogger(ConfigManager.getInstance().getLoggerConfig());

// Create middleware
const correlation = new CorrelationMiddleware();
const logging = new LoggingMiddleware(logger);
const response = new ResponseMiddleware();
const error = new ErrorMiddleware(logger);

const app = express();

// Apply middleware
app.use(correlation.generateRequestId());
app.use(logging.requestLogger());
app.use(express.json());
app.use(response.successHandler());

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await productService.getProducts({
      page: Number(page),
      limit: Number(limit)
    });
    
    return res.json(ResponseFormatter.formatPaginated(
      result.products,
      {
        page: result.page,
        limit: result.limit,
        total: result.total
      },
      {
        requestId: req.headers['x-request-id'] as string,
        meta: {
          category: req.query.category,
          inStock: req.query.inStock === 'true'
        }
      }
    ));
  } catch (error) {
    const wrappedError = wrapError(error, 'Failed to fetch products');
    logger.error('Product fetch failed', { query: req.query }, wrappedError);
    return res.status(500).json(ResponseFormatter.formatError(wrappedError));
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    // Input validation
    if (!req.body.items || !Array.isArray(req.body.items)) {
      throw createValidationError('Order items are required', {
        field: 'items',
        received: req.body.items
      });
    }

    const order = await orderService.createOrder(req.body);
    
    logger.info('Order created', { 
      orderId: order.id, 
      total: order.total,
      items: order.items.length 
    });

    return res.status(201).json(CertusResponseBuilder.created(
      order,
      'Order created successfully',
      req.headers['x-request-id'] as string
    ));
  } catch (error) {
    logger.error('Order creation failed', { body: req.body }, error);
    return res.json(ResponseFormatter.formatError(error, {
      requestId: req.headers['x-request-id'] as string
    }));
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    if (!user) {
      throw createNotFoundError(`User ${req.params.id} not found`, {
        userId: req.params.id,
        searchedBy: 'id'
      });
    }

    return res.json(ResponseFormatter.formatSuccess(user, {
      message: 'User retrieved successfully',
      requestId: req.headers['x-request-id'] as string
    }));
  } catch (error) {
    return res.json(ResponseFormatter.formatError(error, {
      requestId: req.headers['x-request-id'] as string
    }));
  }
});

// Error handling
app.use(error.notFound());
app.use(error.handle());

// Start server
const PORT = ConfigManager.getInstance().getEnvVarNumber('PORT', 3000);
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: ConfigManager.getInstance().getLoggerConfig().environment,
    version: ConfigManager.getInstance().getLoggerConfig().version
  });
});
```

## ✅ Best Practices

### Configuration Management
1. **Initialize early** - Call `ConfigManager.getInstance().initialize()` as soon as possible
2. **Use environment-specific configs** - Leverage the built-in environment detection
3. **Validate critical config** - Use the built-in validation for required environment variables
4. **Type-safe access** - Always use the provided getters for type safety

### Error Handling
1. **Use specific error classes** - Choose the most specific error class for each scenario
2. **Include meaningful context** - Always provide context for better debugging
3. **Proper HTTP status codes** - Use appropriate status codes for different error types
4. **Type guards** - Use `isCertusError()`, `isClientError()`, etc. for safe error handling

### Logging
1. **Choose appropriate levels**:
   - `ERROR`: System failures and crashes
   - `WARN`: Recoverable issues and warnings  
   - `INFO`: Important business events
   - `DEBUG`: Development debugging
   - `TRACE`: Very detailed tracing

2. **Always redact sensitive data** - Configure `redactFields` properly
3. **Use child loggers** - Create context-specific loggers for requests
4. **Structured logging** - Always provide context objects

### API Responses
1. **Consistent formatting** - Always use the response builders
2. **Request correlation** - Include request IDs in all responses
3. **Proper status codes** - Use appropriate HTTP status codes
4. **Meaningful messages** - Provide helpful success/error messages

### Middleware Order
Always apply middleware in this exact order:
1. `CorrelationMiddleware` - Request ID generation
2. `LoggingMiddleware` - Request logging
3. Body parsing middleware
4. `ResponseMiddleware` - Response formatting
5. Your application routes
6. `ErrorMiddleware.notFound()` - 404 handler
7. `ErrorMiddleware.handle()` - Global error handler

## 🚀 Migration Guide

### From Basic Error Handling

**Before:**
```typescript
try {
  const user = await getUser(id);
  res.json(user);
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: error.message });
}
```

**After:**
```typescript
try {
  const user = await getUser(id);
  res.json(ResponseFormatter.formatSuccess(user));
} catch (error) {
  logger.error('Get user failed', { userId: id }, error);
  res.json(ResponseFormatter.formatError(error));
}
```

### From Console Logging

**Before:**
```typescript
console.log('User registered:', user);
console.error('Error creating user:', error);
```

**After:**
```typescript
logger.info('User registered', { userId: user.id, method: 'email' });
logger.error('Error creating user', { userData }, error);
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 [Full Documentation](https://certus-adivalt.dev)
- 🐛 [Issue Tracker](https://github.com/certus-adivalt/certus-adivalt/issues)
- 💬 [Discussions](https://github.com/certus-adivalt/certus-adivalt/discussions)
- 🚀 [Releases](https://github.com/certus-adivalt/certus-adivalt/releases)

## 🌟 Show Your Support

If you find CertusAdiValt helpful, please give it a ⭐️ on GitHub!

---

**Built with ❤️ for developers who care about code quality, reliability, and maintainability.**

**Welcome to CertusAdiValt—where every line of code is certain, every error is meaningful, and every log tells a story.**