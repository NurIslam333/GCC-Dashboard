import { useEffect, useRef, useCallback } from 'react';

export const usePerformance = (componentName) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  const mountTime = useRef(performance.now());

  // Track render performance
  useEffect(() => {
    renderCount.current += 1;
    const currentTime = performance.now();
    const renderDuration = currentTime - lastRenderTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${componentName}] Render #${renderCount.current} took ${renderDuration.toFixed(2)}ms`);
    }
    
    lastRenderTime.current = currentTime;
  });

  // Track mount performance
  useEffect(() => {
    const mountStartTime = mountTime.current;
    const mountDuration = performance.now() - mountStartTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${componentName}] Mounted in ${mountDuration.toFixed(2)}ms`);
    }
    
    return () => {
      const totalLifetime = performance.now() - mountStartTime;
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${componentName}] Unmounted after ${totalLifetime.toFixed(2)}ms (${renderCount.current} renders)`);
      }
    };
  }, [componentName]);

  // Performance measurement utility
  const measurePerformance = useCallback((operationName, operation) => {
    const startTime = performance.now();
    const result = operation();
    const duration = performance.now() - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${componentName}] ${operationName} took ${duration.toFixed(2)}ms`);
    }
    
    return { result, duration };
  }, [componentName]);

  // Async performance measurement
  const measureAsyncPerformance = useCallback(async (operationName, operation) => {
    const startTime = performance.now();
    const result = await operation();
    const duration = performance.now() - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${componentName}] ${operationName} took ${duration.toFixed(2)}ms`);
    }
    
    return { result, duration };
  }, [componentName]);

  return {
    renderCount: renderCount.current,
    measurePerformance,
    measureAsyncPerformance,
  };
};

// Performance monitoring for API calls
export const useAPIPerformance = () => {
  const apiCallTimes = useRef(new Map());

  const trackAPICall = useCallback((endpoint, startTime) => {
    const duration = performance.now() - startTime;
    apiCallTimes.current.set(endpoint, duration);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${endpoint} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }, []);

  const getAPIAverageTime = useCallback((endpoint) => {
    const times = Array.from(apiCallTimes.current.entries())
      .filter(([key]) => key === endpoint)
      .map(([, time]) => time);
    
    if (times.length === 0) return 0;
    
    const average = times.reduce((sum, time) => sum + time, 0) / times.length;
    return average;
  }, []);

  const getSlowestAPICalls = useCallback((limit = 5) => {
    const sortedCalls = Array.from(apiCallTimes.current.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);
    
    return sortedCalls.map(([endpoint, time]) => ({
      endpoint,
      time: time.toFixed(2),
    }));
  }, []);

  return {
    trackAPICall,
    getAPIAverageTime,
    getSlowestAPICalls,
  };
};

// Bundle size monitoring
export const useBundleSize = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Monitor bundle size in development
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const transferSize = entry.transferSize;
            const decodedBodySize = entry.decodedBodySize;
            
            console.log(`[Bundle Size] Transfer: ${(transferSize / 1024).toFixed(2)}KB, Decoded: ${(decodedBodySize / 1024).toFixed(2)}KB`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      
      return () => observer.disconnect();
    }
  }, []);
};

// Memory usage monitoring
export const useMemoryUsage = () => {
  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = performance.memory;
      const used = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
      const total = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
      const limit = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Memory] Used: ${used}MB, Total: ${total}MB, Limit: ${limit}MB`);
      }
      
      return { used, total, limit };
    }
    return null;
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(checkMemoryUsage, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [checkMemoryUsage]);

  return { checkMemoryUsage };
};
