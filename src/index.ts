import { ConfigManager } from './adi';
import { CertusAdiValtConfig } from './types';

// Core exports
export * from './certus';
export * from './responses';
export * from './valt';
export * from './adi';

// Type exports
export * from './types';

// Constant exports
export * from './constants';

// Initialization function
export function initializeCertusAdiValt(config?: Partial<CertusAdiValtConfig>): void {
  const configManager = ConfigManager.getInstance();
  configManager.initialize(config);
}

// Default initialization with environment variables
if (process.env.CERTUS_ADI_VALT_AUTO_INIT !== 'false') {
  initializeCertusAdiValt();
}
