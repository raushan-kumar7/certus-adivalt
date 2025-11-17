import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConfigManager } from '../../../src/adi/config';

describe('ConfigManager', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Clear singleton instance before each test
    (ConfigManager as any).instance = undefined;
    originalEnv = { ...process.env };
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Singleton Pattern', () => {
    it('should return same instance multiple times', () => {
      const instance1 = ConfigManager.getInstance();
      const instance2 = ConfigManager.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('initialize()', () => {
    it('should initialize with default configuration', () => {
      const configManager = ConfigManager.getInstance();
      configManager.initialize();
      const config = configManager.getConfig();

      expect(config.logger.service).toBe('certus-adivalt-app');
      expect(config.responses.pagination.defaultPage).toBe(1);
      expect(config.responses.pagination.defaultLimit).toBe(20);
    });

    it('should merge user configuration with defaults', () => {
      const configManager = ConfigManager.getInstance();
      const userConfig = {
        logger: { service: 'custom-service' },
        responses: { includeTimestamp: false },
      };

      configManager.initialize(userConfig);
      const config = configManager.getConfig();

      expect(config.logger.service).toBe('custom-service');
      expect(config.responses.includeTimestamp).toBe(false);
      expect(config.responses.includeRequestId).toBe(true);
    });

    it('should throw error when already initialized', () => {
      const configManager = ConfigManager.getInstance();
      configManager.initialize();
      expect(() => configManager.initialize()).toThrow('Configuration already initialized');
    });
  });

  describe('Environment Detection', () => {
    it('should detect development environment', () => {
      process.env.NODE_ENV = 'development';
      const configManager = ConfigManager.getInstance();
      configManager.initialize();
      expect(configManager.isDevelopment()).toBe(true);
    });

    it('should detect production environment', () => {
      process.env.NODE_ENV = 'production';
      const configManager = ConfigManager.getInstance();
      configManager.initialize();
      expect(configManager.isProduction()).toBe(true);
    });

    it('should detect staging environment', () => {
      process.env.NODE_ENV = 'staging';
      const configManager = ConfigManager.getInstance();
      configManager.initialize();
      expect(configManager.isStaging()).toBe(true);
    });

    it('should detect test environment', () => {
      process.env.NODE_ENV = 'test';
      const configManager = ConfigManager.getInstance();
      configManager.initialize();
      expect(configManager.isTest()).toBe(true);
    });
  });

  describe('Configuration Validation', () => {
    let configManager: ConfigManager;

    beforeEach(() => {
      configManager = ConfigManager.getInstance();
      configManager.initialize();
    });

    it('should validate invalid pagination configuration', () => {
      const invalidConfig = {
        responses: { pagination: { defaultPage: 0 } },
      };
      expect(() => configManager.updateConfig(invalidConfig)).toThrow(
        'Default page must be at least 1'
      );
    });

    it('should validate invalid log level', () => {
      const invalidConfig = {
        logger: { level: 999 },
      };
      expect(() => configManager.updateConfig(invalidConfig)).toThrow('Invalid log level');
    });
  });

  describe('Environment Variable Helpers', () => {
    let configManager: ConfigManager;

    beforeEach(() => {
      configManager = ConfigManager.getInstance();
      configManager.initialize();
    });

    it('should get required environment variable', () => {
      process.env.TEST_VAR = 'test-value';
      const value = configManager.getEnvVar('TEST_VAR');
      expect(value).toBe('test-value');
    });

    it('should throw error for missing required environment variable', () => {
      delete process.env.MISSING_VAR;
      expect(() => configManager.getEnvVar('MISSING_VAR')).toThrow('Required environment variable');
    });

    it('should get numeric environment variable', () => {
      process.env.NUM_VAR = '42';
      const value = configManager.getEnvVarNumber('NUM_VAR');
      expect(value).toBe(42);
    });

    it('should get boolean environment variable', () => {
      process.env.BOOL_VAR = 'true';
      const value = configManager.getEnvVarBoolean('BOOL_VAR');
      expect(value).toBe(true);
    });
  });

  describe('Getters', () => {
    let configManager: ConfigManager;

    beforeEach(() => {
      configManager = ConfigManager.getInstance();
      configManager.initialize();
    });

    it('should get complete configuration', () => {
      const config = configManager.getConfig();
      expect(config).toHaveProperty('errors');
      expect(config).toHaveProperty('logger');
      expect(config).toHaveProperty('responses');
      expect(config).toHaveProperty('middleware');
    });

    it('should get specific configuration sections', () => {
      expect(configManager.getErrorsConfig()).toHaveProperty('includeStack');
      expect(configManager.getLoggerConfig()).toHaveProperty('level');
      expect(configManager.getResponsesConfig()).toHaveProperty('pagination');
      expect(configManager.getMiddlewareConfig()).toHaveProperty('enableErrorHandler');
    });
  });

  describe('updateConfig()', () => {
    let configManager: ConfigManager;

    beforeEach(() => {
      configManager = ConfigManager.getInstance();
      configManager.initialize();
    });

    it('should update configuration dynamically', () => {
      configManager.updateConfig({ logger: { service: 'updated-service' } });
      const config = configManager.getConfig();
      expect(config.logger.service).toBe('updated-service');
    });

    it('should throw error when updating before initialization', () => {
      const newManager = ConfigManager.getInstance();
      newManager.reset();
      expect(() => newManager.updateConfig({})).toThrow('Configuration not initialized');
    });
  });
});