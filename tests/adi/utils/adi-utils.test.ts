import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CommonUtils } from '../../../src/adi/utils';
import { CertusAdiValtError } from '../../../src/certus';

describe('CommonUtils', () => {
  describe('deepClone()', () => {
    it('should clone primitive values', () => {
      expect(CommonUtils.deepClone(42)).toBe(42);
      expect(CommonUtils.deepClone('hello')).toBe('hello');
      expect(CommonUtils.deepClone(null)).toBe(null);
    });

    it('should clone Date objects', () => {
      const original = new Date('2023-01-01');
      const cloned = CommonUtils.deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it('should clone objects and arrays deeply', () => {
      const original = {
        name: 'test',
        nested: { value: 42 },
        array: [1, 2, 3],
      };
      const cloned = CommonUtils.deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.array).not.toBe(original.array);
    });
  });

  describe('isEmpty()', () => {
    it('should return true for empty values', () => {
      expect(CommonUtils.isEmpty(null)).toBe(true);
      expect(CommonUtils.isEmpty('')).toBe(true);
      expect(CommonUtils.isEmpty([])).toBe(true);
      expect(CommonUtils.isEmpty({})).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(CommonUtils.isEmpty('hello')).toBe(false);
      expect(CommonUtils.isEmpty([1])).toBe(false);
      expect(CommonUtils.isEmpty({ key: 'value' })).toBe(false);
      expect(CommonUtils.isEmpty(0)).toBe(false);
    });
  });

  describe('generateRandomString()', () => {
    it('should generate string of specified length', () => {
      const result = CommonUtils.generateRandomString(10);
      expect(result).toHaveLength(10);
    });

    it('should generate different strings each time', () => {
      const result1 = CommonUtils.generateRandomString(8);
      const result2 = CommonUtils.generateRandomString(8);
      expect(result1).not.toBe(result2);
    });
  });

  describe('sleep()', () => {
    it('should sleep for specified time', async () => {
      const start = Date.now();
      await CommonUtils.sleep(50);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(45);
    });
  });

  describe('retry()', () => {
    it('should return result on successful attempt', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      const result = await CommonUtils.retry(mockFn);
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const mockFn = vi
        .fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValueOnce('success');

      const result = await CommonUtils.retry(mockFn, { maxAttempts: 2, delayMs: 10 });
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max attempts', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Persistent failure'));
      await expect(CommonUtils.retry(mockFn, { maxAttempts: 2, delayMs: 10 })).rejects.toThrow(
        CertusAdiValtError
      );
    });
  });

  describe('debounce()', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce function calls', () => {
      const mockFn = vi.fn();
      const debounced = CommonUtils.debounce(mockFn, 100);

      debounced('first');
      debounced('second');
      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });

  describe('throttle()', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('should throttle function calls', () => {
      const mockFn = vi.fn();
      const throttled = CommonUtils.throttle(mockFn, 100);

      throttled('first');
      throttled('second');
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled('third');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('safeJsonParse()', () => {
    it('should parse valid JSON', () => {
      const result = CommonUtils.safeJsonParse('{"name": "test"}');
      expect(result).toEqual({ name: 'test' });
    });

    it('should return default value for invalid JSON', () => {
      const result = CommonUtils.safeJsonParse('invalid', { fallback: true });
      expect(result).toEqual({ fallback: true });
    });
  });

  describe('safeJsonStringify()', () => {
    it('should stringify valid objects', () => {
      const result = CommonUtils.safeJsonStringify({ name: 'test' });
      expect(result).toBe('{"name":"test"}');
    });
  });

  describe('isValidEmail()', () => {
    it('should validate correct email formats', () => {
      expect(CommonUtils.isValidEmail('test@example.com')).toBe(true);
      expect(CommonUtils.isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(CommonUtils.isValidEmail('invalid')).toBe(false);
      expect(CommonUtils.isValidEmail('test@.com')).toBe(false);
    });
  });

  describe('isValidUrl()', () => {
    it('should validate correct URL formats', () => {
      expect(CommonUtils.isValidUrl('https://example.com')).toBe(true);
      expect(CommonUtils.isValidUrl('http://localhost:3000')).toBe(true);
    });

    it('should reject invalid URL formats', () => {
      expect(CommonUtils.isValidUrl('not-a-url')).toBe(false);
      expect(CommonUtils.isValidUrl('http://')).toBe(false);
    });
  });

  describe('formatBytes()', () => {
    it('should format bytes correctly', () => {
      expect(CommonUtils.formatBytes(0)).toBe('0 Bytes');
      expect(CommonUtils.formatBytes(1024)).toBe('1 KB');
      expect(CommonUtils.formatBytes(1048576)).toBe('1 MB');
    });
  });

  describe('generateId()', () => {
    it('should generate unique IDs', () => {
      const id1 = CommonUtils.generateId();
      const id2 = CommonUtils.generateId();
      expect(id1).not.toBe(id2);
    });

    it('should include prefix when provided', () => {
      const id = CommonUtils.generateId('test-');
      expect(id).toMatch(/^test-/);
    });
  });

  describe('maskSensitiveData()', () => {
    it('should mask strings with default visible characters', () => {
      const result = CommonUtils.maskSensitiveData('1234567890');
      // Test the pattern instead of exact value since implementation may vary
      expect(result).toMatch(/^1234\*+7890$/);
      expect(result.length).toBeLessThanOrEqual(10);
    });

    it('should handle short strings', () => {
      expect(CommonUtils.maskSensitiveData('1234')).toBe('****');
    });

    it('should mask with custom visible characters', () => {
      const result = CommonUtils.maskSensitiveData('1234567890', 2);
      expect(result).toMatch(/^12\*+90$/);
    });
  });

  describe('Environment Detection', () => {
    it('should detect Node.js environment', () => {
      expect(CommonUtils.isNodeEnvironment()).toBe(true);
    });
  });
});