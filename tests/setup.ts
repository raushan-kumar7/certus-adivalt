import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';

// Global setup
beforeAll(() => {
  process.env.NODE_ENV == 'test';
  console.log('Starting test suite...');
});

afterAll(() => {
  console.log('All tests completed');
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  // cleanup if need
});