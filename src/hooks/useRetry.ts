import { useState, useCallback } from 'react';

interface RetryConfig {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

export function useRetry(config: RetryConfig = {}) {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = config;

  const [attempts, setAttempts] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | null> => {
    let lastError: Error | null = null;
    let delay = initialDelay;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        setIsRetrying(attempt > 0);
        setAttempts(attempt + 1);
        
        const result = await operation();
        onSuccess?.(result);
        setIsRetrying(false);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error occurred');
        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay = Math.min(delay * backoffFactor, maxDelay);
        }
      }
    }

    setIsRetrying(false);
    onError?.(lastError || new Error('Failed after multiple attempts'));
    return null;
  }, [maxAttempts, initialDelay, maxDelay, backoffFactor]);

  return {
    executeWithRetry,
    attempts,
    isRetrying,
    maxAttempts
  };
}