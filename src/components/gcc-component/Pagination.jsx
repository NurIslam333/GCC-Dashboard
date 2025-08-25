// components/Pagination.js
import React, { useState, useEffect } from 'react';

const Pagination = ({ currentPage, totalPages, fetchData, showPageInfo = true }) => {
  const [loading, setLoading] = useState(false);

  // Reset loading state when currentPage changes
  useEffect(() => {
    setLoading(false);
  }, [currentPage]);

  const handlePageChange = async (newPage) => {
    if (newPage === currentPage || newPage < 1 || newPage > totalPages) {
      return;
    }
    
    setLoading(true);
    try {
      await fetchData(newPage);
    } catch (error) {
      console.error('Error changing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near start: show 1, 2, 3, 4, 5, ..., last
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show 1, ..., last-4, last-3, last-2, last-1, last
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Page Info */}
      {showPageInfo && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
      )}
      
      {/* Pagination Controls */}
      <nav aria-label="Page navigation" className="flex items-center">
        <ul className="inline-flex h-10 -space-x-px text-base">
          {/* Previous Button */}
          <li>
            <button
              onClick={handlePrevPage}
              disabled={loading || currentPage === 1}
              className="ms-0 border-e-0 rounded-s-lg flex h-10 items-center justify-center border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
              title="Previous page"
            >
              {loading && currentPage > 1 ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              ) : (
                'Previous'
              )}
            </button>
          </li>
          
          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <li key={index}>
              {page === '...' ? (
                <span className="flex h-10 items-center justify-center border border-gray-300 bg-white px-4 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  className={`page-link flex h-10 items-center justify-center border border-gray-300 px-4 leading-tight transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                  onClick={() => handlePageChange(page)}
                  disabled={loading}
                  title={`Go to page ${page}`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
          
          {/* Next Button */}
          <li>
            <button
              onClick={handleNextPage}
              disabled={loading || currentPage === totalPages}
              className="ms-0 border-s-0 rounded-e-lg flex h-10 items-center justify-center border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
              title="Next page"
            >
              {loading && currentPage < totalPages ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              ) : (
                'Next'
              )}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
