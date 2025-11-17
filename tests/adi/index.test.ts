import { describe, it, expect } from 'vitest';
import * as ADI from '../../src/adi';

describe('ADI Module', () => {
  it('should export ConfigManager', () => {
    expect(ADI.ConfigManager).toBeDefined();
    expect(typeof ADI.ConfigManager.getInstance).toBe('function');
  });

  it('should export CommonUtils', () => {
    expect(ADI.CommonUtils).toBeDefined();
    expect(typeof ADI.CommonUtils.deepClone).toBe('function');
  });

  it('should have all expected exports', () => {
    const exports = Object.keys(ADI);
    expect(exports).toEqual(['ConfigManager', 'CommonUtils']);
  });

  it('should allow ConfigManager instantiation', () => {
    const manager = ADI.ConfigManager.getInstance();
    expect(manager).toBeInstanceOf(ADI.ConfigManager);
  });

  it('should provide CommonUtils static methods', () => {
    expect(typeof ADI.CommonUtils.isEmpty).toBe('function');
    expect(typeof ADI.CommonUtils.generateRandomString).toBe('function');
    expect(typeof ADI.CommonUtils.isValidEmail).toBe('function');
    expect(typeof ADI.CommonUtils.retry).toBe('function');
  });
});