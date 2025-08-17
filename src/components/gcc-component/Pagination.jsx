// components/Pagination.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Pagination = ({ currentPage, totalPages, fetchData }) => {
  const [loading, setLoading] = useState(false);

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      setLoading(true);
      await fetchData(currentPage + 1);
      setLoading(false);
    }
  };

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      setLoading(true);
      await fetchData(currentPage - 1);
      setLoading(false);
    }
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="inline-flex h-10 -space-x-px text-base">
        <li>
          <button
            onClick={handlePrevPage}
            disabled={loading || currentPage === 1}
            className="ms-0 border-e-0 rounded-s-lg flex h-10 items-center justify-center border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Previous
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
          >
            <button
              className={`page-link  flex h-10 items-center justify-center border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                currentPage === index + 1 ? 'bg-blue-500 text-white' : ''
              } `}
              onClick={() => fetchData(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={handleNextPage}
            disabled={loading || currentPage === totalPages}
            className="flex h-10 items-center justify-center border border-gray-300 bg-white px-4 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
