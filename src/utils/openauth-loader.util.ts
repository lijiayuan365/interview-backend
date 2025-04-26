import { loadEsm } from 'load-esm';
import * as nodeCrypto from 'crypto';

// 提供全局 crypto 对象，以兼容 ESM 环境
if (!global.crypto) {
  Object.defineProperty(global, 'crypto', {
    value: {
      getRandomValues: (buffer: Uint8Array) => {
        return nodeCrypto.randomFillSync(buffer);
      },
      subtle: nodeCrypto.webcrypto?.subtle,
      randomUUID: nodeCrypto.randomUUID,
    },
    configurable: true,
  });
}

// Define interfaces for the imported modules
export interface OpenAuthSubjectModule {
  createSubjects: (...args: any[]) => any;
}

export interface OpenAuthClientModule {
  createClient: (...args: any[]) => any;
}

// Cache loaded modules
const cachedModules: {
  subject?: OpenAuthSubjectModule;
  client?: OpenAuthClientModule;
} = {};

// Create a promise cache to ensure parallel calls wait for the same loading operation
const loadingPromises: {
  subject?: Promise<OpenAuthSubjectModule>;
  client?: Promise<OpenAuthClientModule>;
} = {};

/**
 * Load OpenAuth modules efficiently with promise caching
 * to prevent duplicate loading requests
 */
export const loadOpenAuth = async () => {
  // Load subject module if not already cached
  if (!cachedModules.subject) {
    if (!loadingPromises.subject) {
      loadingPromises.subject = loadEsm<OpenAuthSubjectModule>(
        '@openauthjs/openauth/subject',
      );
    }
    cachedModules.subject = await loadingPromises.subject;
  }
  // Load client module if not already cached
  if (!cachedModules.client) {
    if (!loadingPromises.client) {
      loadingPromises.client = loadEsm<OpenAuthClientModule>(
        '@openauthjs/openauth/client',
      );
    }
    cachedModules.client = await loadingPromises.client;
  }

  // Return the required functions
  return {
    createClient: cachedModules.client.createClient,
    createSubjects: cachedModules.subject.createSubjects,
  };
};

/**
 * Get the cached modules for debugging purposes
 */
export const getCachedModules = () => {
  return { ...cachedModules };
};
