import React, { useState, useEffect } from 'react';
import { useAPIPerformance, useMemoryUsage } from '@/hook/usePerformance';

const PerformanceDashboard = ({ isVisible = false }) => {
  const [isOpen, setIsOpen] = useState(isVisible);
  const [metrics, setMetrics] = useState({
    apiCalls: [],
    memoryUsage: null,
    pageLoadTime: 0,
    renderCount: 0,
  });

  const { getSlowestAPICalls, getAPIAverageTime } = useAPIPerformance();
  const { checkMemoryUsage } = useMemoryUsage();

  useEffect(() => {
    if (isOpen) {
      updateMetrics();
      const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const updateMetrics = () => {
    const apiCalls = getSlowestAPICalls(10);
    const memoryUsage = checkMemoryUsage();
    
    // Get page load time
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    const pageLoadTime = navigationEntry ? navigationEntry.loadEventEnd - navigationEntry.loadEventStart : 0;

    setMetrics({
      apiCalls,
      memoryUsage,
      pageLoadTime,
      renderCount: document.querySelectorAll('[data-component]').length,
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance Dashboard"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance Dashboard
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Page Load Time */}
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Page Load Time
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {metrics.pageLoadTime.toFixed(0)}ms
          </div>
        </div>

        {/* Memory Usage */}
        {metrics.memoryUsage && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm font-medium text-green-800 dark:text-green-200">
              Memory Usage
            </div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {metrics.memoryUsage.used}MB / {metrics.memoryUsage.total}MB
            </div>
            <div className="w-full bg-green-200 dark:bg-green-700 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(metrics.memoryUsage.used / metrics.memoryUsage.limit) * 100}%`
                }}
              />
            </div>
          </div>
        )}

        {/* API Performance */}
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Slowest API Calls
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {metrics.apiCalls.map((call, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-gray-600 dark:text-gray-400 truncate max-w-48">
                  {call.endpoint}
                </span>
                <span className="text-red-600 dark:text-red-400 font-mono">
                  {call.time}ms
                </span>
              </div>
            ))}
            {metrics.apiCalls.length === 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
                No API calls recorded
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={updateMetrics}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="flex-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-2 rounded text-sm hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
          >
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
