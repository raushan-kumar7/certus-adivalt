import { beforeEach, vi } from 'vitest';
import { ErrorCodes, HttpStatus } from '../../src/constants';

// Mock data factories
export const createMockContext = (overrides = {}) => ({
  requestId: 'test-request-123',
  userId: 'user-123',
  sessionId: 'session-123',
  ...overrides,
});

export const createMockErrorOptions = (overrides = {}): any => ({
  code: ErrorCodes.GEN_VALIDATION_ERROR,
  statusCode: HttpStatus.BAD_REQUEST,
  context: { field: 'test' },
  ...overrides,
});

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});