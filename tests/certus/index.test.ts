import { describe, it, expect } from 'vitest';
import * as CertusExports from '../../src/certus';
import * as CertusErrors from '../../src/certus/errors';
import * as CertusGuards from '../../src/certus/guards';
import * as CertusUtils from '../../src/certus/utils';

describe('Certus Index Exports', () => {
  it('should export all error classes', () => {
    expect(CertusExports.CertusAdiValtError).toBeDefined();
    expect(CertusExports.CertusClientError).toBeDefined();
    expect(CertusExports.CertusServerError).toBeDefined();
    expect(CertusExports.CertusAuthenticationError).toBeDefined();
    expect(CertusExports.CertusValidationError).toBeDefined();
    expect(CertusExports.CertusDatabaseError).toBeDefined();
  });

  it('should export all guard functions', () => {
    expect(CertusExports.isCertusError).toBeDefined();
    expect(CertusExports.isClientError).toBeDefined();
    expect(CertusExports.isServerError).toBeDefined();
    expect(CertusExports.isAuthenticationError).toBeDefined();
    expect(CertusExports.isValidationError).toBeDefined();
    expect(CertusExports.isDatabaseError).toBeDefined();
  });

  it('should export all utility functions', () => {
    expect(CertusExports.createCertusError).toBeDefined();
    expect(CertusExports.wrapError).toBeDefined();
    expect(CertusExports.toClientError).toBeDefined();
    expect(CertusExports.toServerError).toBeDefined();
    expect(CertusExports.assertCertusError).toBeDefined();
  });

  it('should have consistent exports between main index and sub-modules', () => {
    // Check that main index re-exports everything from sub-modules
    expect(CertusExports.CertusAdiValtError).toBe(CertusErrors.CertusAdiValtError);
    expect(CertusExports.isCertusError).toBe(CertusGuards.isCertusError);
    expect(CertusExports.createCertusError).toBe(CertusUtils.createCertusError);
  });
});