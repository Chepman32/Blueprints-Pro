/**
 * Performance Utilities
 * Memory management, lazy loading, and optimization helpers
 */

import {useEffect, useRef, useCallback} from 'react';
import {InteractionManager, Platform} from 'react-native';

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Hook for running code after interactions
export const useAfterInteractions = (callback: () => void, deps: any[] = []) => {
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      callback();
    });

    return () => task.cancel();
  }, deps);
};

// Hook for lazy loading
export const useLazyLoad = <T>(
  loadData: () => Promise<T>,
  deps: any[] = []
): {data: T | null; loading: boolean; error: Error | null} => {
  const [state, setState] = React.useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setState({data: null, loading: true, error: null});
        const result = await loadData();

        if (!cancelled) {
          setState({data: result, loading: false, error: null});
        }
      } catch (error) {
        if (!cancelled) {
          setState({data: null, loading: false, error: error as Error});
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, deps);

  return state;
};

// Memory-efficient list rendering helper
export const getItemLayout = (
  data: any[] | null | undefined,
  index: number,
  itemHeight: number
) => ({
  length: itemHeight,
  offset: itemHeight * index,
  index,
});

// Image cache management
class ImageCacheManager {
  private cache: Map<string, string> = new Map();
  private maxSize: number = 50; // Maximum cached images

  get(uri: string): string | undefined {
    return this.cache.get(uri);
  }

  set(uri: string, data: string): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(uri, data);
  }

  clear(): void {
    this.cache.clear();
  }

  remove(uri: string): void {
    this.cache.delete(uri);
  }

  get size(): number {
    return this.cache.size;
  }
}

export const imageCache = new ImageCacheManager();

// Performance monitoring
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static mark(name: string): void {
    this.marks.set(name, Date.now());
  }

  static measure(name: string, startMark: string): number {
    const startTime = this.marks.get(startMark);
    if (!startTime) {
      console.warn(`No mark found with name: ${startMark}`);
      return 0;
    }

    const duration = Date.now() - startTime;
    console.log(`${name}: ${duration}ms`);
    return duration;
  }

  static clear(): void {
    this.marks.clear();
  }
}

// FPS counter (development only)
export class FPSCounter {
  private frames: number = 0;
  private lastTime: number = Date.now();
  private fps: number = 60;
  private rafId: number | null = null;

  start(callback?: (fps: number) => void): void {
    if (this.rafId) return;

    const tick = () => {
      this.frames++;
      const currentTime = Date.now();

      if (currentTime >= this.lastTime + 1000) {
        this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
        this.frames = 0;
        this.lastTime = currentTime;

        if (callback) {
          callback(this.fps);
        }

        if (__DEV__) {
          console.log(`FPS: ${this.fps}`);
        }
      }

      this.rafId = requestAnimationFrame(tick) as any;
    };

    tick();
  }

  stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  getFPS(): number {
    return this.fps;
  }
}

// Batch updates helper
export const batchUpdates = <T>(
  updates: T[],
  processFn: (batch: T[]) => void,
  batchSize: number = 10,
  delayMs: number = 16
): Promise<void> => {
  return new Promise((resolve) => {
    let index = 0;

    const processBatch = () => {
      const batch = updates.slice(index, index + batchSize);
      if (batch.length === 0) {
        resolve();
        return;
      }

      processFn(batch);
      index += batchSize;

      setTimeout(processBatch, delayMs);
    };

    processBatch();
  });
};

// Platform-specific optimizations
export const platformOptimization = {
  shouldUseNativeDriver: Platform.OS !== 'web',
  shouldEnableHermes: Platform.OS === 'android',
  maxListItems: Platform.select({
    ios: 100,
    android: 80,
    default: 50,
  }),
  imageQuality: Platform.select({
    ios: 0.9,
    android: 0.85,
    default: 0.8,
  }),
};

// Memory warning handler
export const useMemoryWarning = (callback: () => void) => {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      // iOS memory warning handling
      const subscription = require('react-native').AppState.addEventListener(
        'memoryWarning',
        callback
      );

      return () => subscription?.remove();
    }
  }, [callback]);
};

// Hook for viewport-based lazy loading
export const useInViewport = (
  onEnterViewport?: () => void,
  onExitViewport?: () => void
) => {
  const ref = useRef<any>(null);
  const [isInViewport, setIsInViewport] = React.useState(false);

  useEffect(() => {
    if (isInViewport && onEnterViewport) {
      onEnterViewport();
    } else if (!isInViewport && onExitViewport) {
      onExitViewport();
    }
  }, [isInViewport, onEnterViewport, onExitViewport]);

  return {ref, isInViewport};
};

import React from 'react';
