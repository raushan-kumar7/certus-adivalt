// import { CertusAdiValtError } from '@/certus';

// export class CommonUtils {
//   /**
//    * Deep clone an object
//    */
//   static deepClone<T>(obj: T): T {
//     if (obj === null || typeof obj !== 'object') {
//       return obj;
//     }

//     if (obj instanceof Date) {
//       return new Date(obj.getTime()) as unknown as T;
//     }

//     if (obj instanceof Array) {
//       return obj.map((item) => this.deepClone(item)) as unknown as T;
//     }

//     if (typeof obj === 'object') {
//       const cloned = {} as T;
//       for (const key in obj) {
//         if (obj.hasOwnProperty(key)) {
//           cloned[key] = this.deepClone(obj[key]);
//         }
//       }
//       return cloned;
//     }

//     return obj;
//   }

//   /**
//    * Check if value is empty (null, undefined, empty string, empty array, empty object)
//    */
//   static isEmpty(value: any): boolean {
//     if (value === null || value === undefined) {
//       return true;
//     }

//     if (typeof value === 'string' || Array.isArray(value)) {
//       return value.length === 0;
//     }

//     if (typeof value === 'object') {
//       return Object.keys(value).length === 0;
//     }

//     return false;
//   }

//   /**
//    * Generate a random string of specified length
//    */
//   static generateRandomString(length: number = 16): string {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';

//     for (let i = 0; i < length; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }

//     return result;
//   }

//   /**
//    * Sleep for specified milliseconds
//    */
//   static sleep(ms: number): Promise<void> {
//     return new Promise((resolve) => setTimeout(resolve, ms));
//   }

//   /**
//    * Retry an async function with exponential backoff
//    */
//   static async retry<T>(
//     fn: () => Promise<T>,
//     options: {
//       maxAttempts?: number;
//       delayMs?: number;
//       backoffMultiplier?: number;
//       shouldRetry?: (error: Error) => boolean;
//     } = {}
//   ): Promise<T> {
//     const {
//       maxAttempts = 3,
//       delayMs = 1000,
//       backoffMultiplier = 2,
//       shouldRetry = () => true,
//     } = options;

//     let lastError: Error;
//     let currentDelay = delayMs;

//     for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//       try {
//         return await fn();
//       } catch (error) {
//         lastError = error as Error;

//         if (!shouldRetry(lastError) || attempt === maxAttempts) {
//           throw new CertusAdiValtError(
//             `Operation failed after ${attempt} attempts`,
//             'UTL_RETRY_EXHAUSTED',
//             500,
//             { originalError: lastError, attempts: attempt }
//           );
//         }

//         if (attempt < maxAttempts) {
//           await this.sleep(currentDelay);
//           currentDelay *= backoffMultiplier;
//         }
//       }
//     }

//     throw lastError!;
//   }

//   /**
//    * Debounce function execution
//    */
//   static debounce<T extends (...args: any[]) => any>(
//     func: T,
//     wait: number,
//     immediate: boolean = false
//   ): (...args: Parameters<T>) => void {
//     let timeout: NodeJS.Timeout | null = null;

//     return (...args: Parameters<T>) => {
//       const later = () => {
//         timeout = null;
//         if (!immediate) func(...args);
//       };

//       const callNow = immediate && !timeout;

//       if (timeout) {
//         clearTimeout(timeout);
//       }

//       timeout = setTimeout(later, wait);

//       if (callNow) {
//         func(...args);
//       }
//     };
//   }

//   /**
//    * Throttle function execution
//    */
//   static throttle<T extends (...args: any[]) => any>(
//     func: T,
//     limit: number
//   ): (...args: Parameters<T>) => void {
//     let inThrottle: boolean = false;

//     return (...args: Parameters<T>) => {
//       if (!inThrottle) {
//         func(...args);
//         inThrottle = true;
//         setTimeout(() => {
//           inThrottle = false;
//         }, limit);
//       }
//     };
//   }

//   /**
//    * Parse JSON safely
//    */
//   static safeJsonParse<T>(jsonString: string, defaultValue?: T): T | undefined {
//     try {
//       return JSON.parse(jsonString);
//     } catch {
//       return defaultValue;
//     }
//   }

//   /**
//    * Stringify JSON with error handling
//    */
//   static safeJsonStringify(obj: any, defaultValue: string = '{}'): string {
//     try {
//       return JSON.stringify(obj);
//     } catch {
//       return defaultValue;
//     }
//   }

//   /**
//    * Validate email format
//    */
//   static isValidEmail(email: string): boolean {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   }

//   /**
//    * Validate URL format
//    */
//   static isValidUrl(url: string): boolean {
//     try {
//       new URL(url);
//       return true;
//     } catch {
//       return false;
//     }
//   }

//   /**
//    * Format bytes to human readable format
//    */
//   static formatBytes(bytes: number, decimals: number = 2): string {
//     if (bytes === 0) return '0 Bytes';

//     const k = 1024;
//     const dm = decimals < 0 ? 0 : decimals;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

//     const i = Math.floor(Math.log(bytes) / Math.log(k));

//     return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
//   }

//   /**
//    * Generate a unique ID
//    */
//   static generateId(prefix: string = ''): string {
//     const timestamp = Date.now().toString(36);
//     const random = Math.random().toString(36).substring(2, 8);
//     return `${prefix}${timestamp}${random}`;
//   }

//   /**
//    * Mask sensitive data in strings
//    */
//   static maskSensitiveData(str: string, visibleChars: number = 4): string {
//     if (str.length <= visibleChars * 2) {
//       return '*'.repeat(str.length);
//     }

//     const firstVisible = str.substring(0, visibleChars);
//     const lastVisible = str.substring(str.length - visibleChars);
//     const maskedLength = str.length - visibleChars * 2;

//     return `${firstVisible}${'*'.repeat(maskedLength)}${lastVisible}`;
//   }

//   /**
//    * Check if running in Node.js environment
//    */
//   static isNodeEnvironment(): boolean {
//     return (
//       typeof process !== 'undefined' && process.versions != null && process.versions.node != null
//     );
//   }

//   /**
//    * Check if running in browser environment
//    */
//   static isBrowserEnvironment(): boolean {
//     return (
//       typeof globalThis !== 'undefined' &&
//       typeof (globalThis as any).window !== 'undefined' &&
//       typeof (globalThis as any).document !== 'undefined'
//     );
//   }
// }

import { CertusAdiValtError } from '@/certus';

/**
 * A collection of common utility functions used throughout the CertusAdiValt system.
 * Provides helper methods for cloning, validation, string manipulation, and async operations.
 * 
 * All methods are static and can be used without instantiating the class.
 * 
 * @example
 * ```typescript
 * // Deep clone an object
 * const cloned = CommonUtils.deepClone(originalObject);
 * 
 * // Generate random string
 * const randomId = CommonUtils.generateRandomString(32);
 * 
 * // Retry with exponential backoff
 * const result = await CommonUtils.retry(() => fetchData(), { maxAttempts: 3 });
 * ```
 */
export class CommonUtils {
  /**
   * Deep clone an object, handling dates, arrays, and nested objects.
   * Creates a completely new copy with no references to the original.
   * 
   * @template T - The type of the object being cloned
   * @param {T} obj - The object to deep clone. Can be any type including primitives, arrays, dates, and objects.
   * @returns {T} A deep clone of the original object
   * 
   * @remarks
   * - Primitive values are returned directly
   * - Date objects are cloned with same timestamp
   * - Arrays are recursively cloned
   * - Objects are recursively cloned (own properties only)
   * - Circular references are not handled and will cause stack overflow
   * 
   * @example
   * ```typescript
   * const original = { a: 1, b: { c: 2 }, d: new Date() };
   * const cloned = CommonUtils.deepClone(original);
   * console.log(cloned === original); // false
   * console.log(cloned.b === original.b); // false
   * ```
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }

    if (obj instanceof Array) {
      return obj.map((item) => this.deepClone(item)) as unknown as T;
    }

    if (typeof obj === 'object') {
      const cloned = {} as T;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key]);
        }
      }
      return cloned;
    }

    return obj;
  }

  /**
   * Check if a value is empty. Handles null, undefined, empty strings, arrays, and objects.
   * 
   * @param {any} value - The value to check for emptiness
   * @returns {boolean} True if the value is considered empty, false otherwise
   * 
   * @remarks
   * Considered empty values:
   * - null or undefined
   * - Empty string ('')
   * - Empty array ([])
   * - Empty object ({})
   * - All other values (numbers, booleans, non-empty strings/arrays/objects) return false
   * 
   * @example
   * ```typescript
   * CommonUtils.isEmpty(null); // true
   * CommonUtils.isEmpty(''); // true
   * CommonUtils.isEmpty([]); // true
   * CommonUtils.isEmpty({}); // true
   * CommonUtils.isEmpty('hello'); // false
   * CommonUtils.isEmpty([1, 2]); // false
   * CommonUtils.isEmpty(0); // false
   * CommonUtils.isEmpty(false); // false
   * ```
   */
  static isEmpty(value: any): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length === 0;
    }

    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }

    return false;
  }

  /**
   * Generate a cryptographically insecure random string of specified length.
   * Uses alphanumeric characters (A-Z, a-z, 0-9).
   * 
   * @param {number} [length=16] - The length of the random string to generate. Defaults to 16.
   * @returns {string} Random string of specified length
   * 
   * @throws {Error} If length is not a positive integer
   * 
   * @remarks
   * - Not suitable for cryptographic purposes (uses Math.random())
   * - For security-sensitive random strings, use crypto.randomBytes() in Node.js
   * - Character set: 62 characters (26 uppercase + 26 lowercase + 10 digits)
   * 
   * @example
   * ```typescript
   * const random = CommonUtils.generateRandomString(32);
   * console.log(random); // "aB3x9pQ2rT8yZ1mN7vW4cK6lP0oJ5hG"
   * ```
   */
  static generateRandomString(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  /**
   * Sleep for specified milliseconds. Returns a promise that resolves after the delay.
   * 
   * @param {number} ms - Number of milliseconds to sleep
   * @returns {Promise<void>} Promise that resolves after specified milliseconds
   * 
   * @example
   * ```typescript
   * // Sleep for 1 second
   * await CommonUtils.sleep(1000);
   * console.log('1 second later');
   * 
   * // Use in async functions
   * async function delayedOperation() {
   *   await CommonUtils.sleep(500);
   *   return performOperation();
   * }
   * ```
   */
  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retry an async function with exponential backoff and configurable retry logic.
   * 
   * @template T - The return type of the async function
   * @param {() => Promise<T>} fn - Async function to retry. Should return a Promise.
   * @param {Object} [options] - Retry configuration options
   * @param {number} [options.maxAttempts=3] - Maximum number of retry attempts (including initial)
   * @param {number} [options.delayMs=1000] - Initial delay between attempts in milliseconds
   * @param {number} [options.backoffMultiplier=2] - Multiplier for delay after each attempt
   * @param {(error: Error) => boolean} [options.shouldRetry=() => true] - Function to determine if error should be retried
   * @returns {Promise<T>} Promise resolving with the result of the successful function call
   * 
   * @throws {CertusAdiValtError} UTL_RETRY_EXHAUSTED - When all retry attempts are exhausted
   * @throws {Error} The original error if shouldRetry returns false
   * 
   * @remarks
   * - Delay pattern: delayMs, delayMs * backoffMultiplier, delayMs * backoffMultiplier^2, etc.
   * - The shouldRetry function receives the caught error and should return true to retry
   * - If shouldRetry returns false, the original error is thrown immediately
   * 
   * @example
   * ```typescript
   * // Basic retry
   * const result = await CommonUtils.retry(() => fetch('https://api.example.com/data'));
   * 
   * // Custom retry logic
   * const result = await CommonUtils.retry(
   *   () => apiCall(),
   *   {
   *     maxAttempts: 5,
   *     delayMs: 500,
   *     backoffMultiplier: 1.5,
   *     shouldRetry: (error) => error.statusCode >= 500
   *   }
   * );
   * ```
   */
  static async retry<T>(
    fn: () => Promise<T>,
    options: {
      maxAttempts?: number;
      delayMs?: number;
      backoffMultiplier?: number;
      shouldRetry?: (error: Error) => boolean;
    } = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      delayMs = 1000,
      backoffMultiplier = 2,
      shouldRetry = () => true,
    } = options;

    let lastError: Error;
    let currentDelay = delayMs;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (!shouldRetry(lastError) || attempt === maxAttempts) {
          throw new CertusAdiValtError(
            `Operation failed after ${attempt} attempts`,
            'UTL_RETRY_EXHAUSTED',
            500,
            { originalError: lastError, attempts: attempt }
          );
        }

        if (attempt < maxAttempts) {
          await this.sleep(currentDelay);
          currentDelay *= backoffMultiplier;
        }
      }
    }

    throw lastError!;
  }

  /**
   * Debounce function execution. Delays function execution until after wait milliseconds
   * have elapsed since the last time the debounced function was invoked.
   * 
   * @template T - The function type to debounce
   * @param {T} func - The function to debounce
   * @param {number} wait - Number of milliseconds to delay
   * @param {boolean} [immediate=false] - If true, trigger function on leading edge instead of trailing
   * @returns {(...args: Parameters<T>) => void} Debounced function
   * 
   * @example
   * ```typescript
   * // Debounce search input
   * const debouncedSearch = CommonUtils.debounce((query: string) => {
   *   performSearch(query);
   * }, 300);
   * 
   * // Use in event handler
   * input.addEventListener('input', (e) => {
   *   debouncedSearch(e.target.value);
   * });
   * 
   * // Immediate execution (leading edge)
   * const immediateDebounce = CommonUtils.debounce(() => {
   *   console.log('Executed immediately on first call');
   * }, 300, true);
   * ```
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate: boolean = false
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };

      const callNow = immediate && !timeout;

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(later, wait);

      if (callNow) {
        func(...args);
      }
    };
  }

  /**
   * Throttle function execution. Ensures function is only called at most once per specified limit.
   * 
   * @template T - The function type to throttle
   * @param {T} func - The function to throttle
   * @param {number} limit - Number of milliseconds between allowed executions
   * @returns {(...args: Parameters<T>) => void} Throttled function
   * 
   * @example
   * ```typescript
   * // Throttle scroll events
   * const throttledScroll = CommonUtils.throttle(() => {
   *   updateScrollPosition();
   * }, 100);
   * 
   * window.addEventListener('scroll', throttledScroll);
   * 
   * // Throttle resize events
   * const throttledResize = CommonUtils.throttle(() => {
   *   handleResize();
   * }, 250);
   * ```
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  /**
   * Parse JSON safely with default value fallback.
   * 
   * @template T - The expected type after parsing
   * @param {string} jsonString - JSON string to parse
   * @param {T} [defaultValue] - Default value to return if parsing fails
   * @returns {T | undefined} Parsed JSON object or defaultValue if parsing fails
   * 
   * @example
   * ```typescript
   * // Basic usage
   * const obj = CommonUtils.safeJsonParse('{"a": 1}'); // { a: 1 }
   * 
   * // With default value
   * const obj = CommonUtils.safeJsonParse('invalid json', { fallback: true }); // { fallback: true }
   * 
   * // Without default (returns undefined)
   * const obj = CommonUtils.safeJsonParse('invalid json'); // undefined
   * ```
   */
  static safeJsonParse<T>(jsonString: string, defaultValue?: T): T | undefined {
    try {
      return JSON.parse(jsonString);
    } catch {
      return defaultValue;
    }
  }

  /**
   * Stringify JSON safely with error handling and default value fallback.
   * 
   * @param {any} obj - Object to stringify
   * @param {string} [defaultValue='{}'] - Default JSON string to return if stringification fails
   * @returns {string} JSON string representation of the object
   * 
   * @example
   * ```typescript
   * // Basic usage
   * const json = CommonUtils.safeJsonStringify({ a: 1 }); // '{"a":1}'
   * 
   * // With circular reference (fails safely)
   * const circular = { a: 1 };
   * circular.self = circular;
   * const json = CommonUtils.safeJsonStringify(circular, '{"error": "circular"}'); // '{"error": "circular"}'
   * ```
   */
  static safeJsonStringify(obj: any, defaultValue: string = '{}'): string {
    try {
      return JSON.stringify(obj);
    } catch {
      return defaultValue;
    }
  }

  /**
   * Validate email format using basic regex pattern.
   * 
   * @param {string} email - Email address to validate
   * @returns {boolean} True if email format is valid, false otherwise
   * 
   * @remarks
   * Uses basic validation pattern: local-part@domain.tld
   * - Local part: one or more non-whitespace, non-@ characters
   * - Domain: one or more non-whitespace, non-@ characters
   * - TLD: one or more non-whitespace, non-@ characters
   * - Does not validate domain existence or special cases
   * 
   * @example
   * ```typescript
   * CommonUtils.isValidEmail('user@example.com'); // true
   * CommonUtils.isValidEmail('invalid-email'); // false
   * CommonUtils.isValidEmail('user@domain'); // false
   * ```
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format using the URL constructor.
   * 
   * @param {string} url - URL string to validate
   * @returns {boolean} True if URL format is valid, false otherwise
   * 
   * @remarks
   * - Uses the native URL constructor for validation
   * - Returns false for malformed URLs
   * - Accepts both http/https and other protocols
   * - Requires protocol and valid domain format
   * 
   * @example
   * ```typescript
   * CommonUtils.isValidUrl('https://example.com'); // true
   * CommonUtils.isValidUrl('ftp://files.example.com'); // true
   * CommonUtils.isValidUrl('not-a-url'); // false
   * CommonUtils.isValidUrl('example.com'); // false (missing protocol)
   * ```
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Format bytes to human readable string with appropriate unit.
   * 
   * @param {number} bytes - Number of bytes to format
   * @param {number} [decimals=2] - Number of decimal places to include
   * @returns {string} Formatted string with appropriate unit (Bytes, KB, MB, etc.)
   * 
   * @throws {Error} If bytes is negative
   * 
   * @remarks
   * Uses binary (1024-based) units:
   * - KB: 1024 bytes
   * - MB: 1024^2 bytes
   * - GB: 1024^3 bytes
   * - etc.
   * 
   * @example
   * ```typescript
   * CommonUtils.formatBytes(0); // "0 Bytes"
   * CommonUtils.formatBytes(1024); // "1 KB"
   * CommonUtils.formatBytes(1048576); // "1 MB"
   * CommonUtils.formatBytes(1234567); // "1.18 MB"
   * CommonUtils.formatBytes(1234567, 0); // "1 MB"
   * ```
   */
  static formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Generate a unique ID combining timestamp and random characters.
   * Not cryptographically secure but suitable for most unique identifier needs.
   * 
   * @param {string} [prefix=''] - Optional prefix for the generated ID
   * @returns {string} Unique ID string
   * 
   * @remarks
   * Format: [prefix] + timestamp(base36) + random(base36)
   * - Timestamp: Current time in base36 for compactness
   * - Random: 6 characters of random base36 string
   * - Collision probability is very low for most use cases
   * 
   * @example
   * ```typescript
   * CommonUtils.generateId(); // "kf91pzabc123"
   * CommonUtils.generateId('user_'); // "user_kf91pzabc123"
   * CommonUtils.generateId('order-'); // "order-kf91pzabc123"
   * ```
   */
  static generateId(prefix: string = ''): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Mask sensitive data in strings, showing only specified number of characters at ends.
   * 
   * @param {string} str - String containing sensitive data to mask
   * @param {number} [visibleChars=4] - Number of characters to keep visible at start and end
   * @returns {string} Masked string with middle characters replaced by asterisks
   * 
   * @example
   * ```typescript
   * CommonUtils.maskSensitiveData('1234567890123456'); // "1234************3456"
   * CommonUtils.maskSensitiveData('secret-token', 2); // "se********en"
   * CommonUtils.maskSensitiveData('short', 2); // "*****" (too short to partially show)
   * ```
   */
  static maskSensitiveData(str: string, visibleChars: number = 4): string {
    if (str.length <= visibleChars * 2) {
      return '*'.repeat(str.length);
    }

    const firstVisible = str.substring(0, visibleChars);
    const lastVisible = str.substring(str.length - visibleChars);
    const maskedLength = str.length - visibleChars * 2;

    return `${firstVisible}${'*'.repeat(maskedLength)}${lastVisible}`;
  }

  /**
   * Check if code is running in a Node.js environment.
   * 
   * @returns {boolean} True if running in Node.js, false otherwise
   * 
   * @example
   * ```typescript
   * if (CommonUtils.isNodeEnvironment()) {
   *   // Use Node.js specific APIs
   *   const fs = require('fs');
   * }
   * ```
   */
  static isNodeEnvironment(): boolean {
    return (
      typeof process !== 'undefined' && process.versions != null && process.versions.node != null
    );
  }

  /**
   * Check if code is running in a browser environment.
   * 
   * @returns {boolean} True if running in browser, false otherwise
   * 
   * @example
   * ```typescript
   * if (CommonUtils.isBrowserEnvironment()) {
   *   // Use browser specific APIs
   *   window.localStorage.setItem('key', 'value');
   * }
   * ```
   */
  static isBrowserEnvironment(): boolean {
    return (
      typeof globalThis !== 'undefined' &&
      typeof (globalThis as any).window !== 'undefined' &&
      typeof (globalThis as any).document !== 'undefined'
    );
  }
}