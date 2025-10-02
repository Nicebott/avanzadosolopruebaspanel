import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
  darkMode: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  itemsPerPage,
  totalItems,
  paginate,
  currentPage,
  darkMode
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const delta = isMobile ? 1 : 2; // Adjust range based on mobile/desktop

  const getPageNumbers = () => {
    if (totalPages <= 1) return [];

    const pages: (number | string)[] = [];
    const range = isMobile ? 2 : 3; // Show 3 pages on mobile, 5-7 on desktop

    // Calculate the range of pages to show
    let startPage = Math.max(1, currentPage - delta);
    let endPage = Math.min(totalPages, currentPage + delta);

    // Adjust if near the start or end
    if (currentPage <= delta + 1) {
      endPage = Math.min(delta * 2 + 1, totalPages);
    }
    if (currentPage >= totalPages - delta) {
      startPage = Math.max(totalPages - (delta * 2), 1);
    }

    // Add first page and ellipsis
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    // Add the page range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (pageNumbers.length <= 1) return null;

  return (
    <nav className="flex justify-center items-center gap-2 mt-4 px-2 w-full" aria-label="Pagination">
      <button
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-2 sm:px-3 py-2 rounded-md flex-shrink-0 ${
          darkMode
            ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 disabled:text-gray-600'
            : 'bg-white text-blue-600 hover:bg-blue-50 disabled:text-gray-400'
        } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} className="sm:w-5 sm:h-5" />
      </button>
      
      <div className="flex items-center gap-1 sm:gap-2 justify-center overflow-x-auto scrollbar-hide">
        {pageNumbers.map((number, index) => {
          const isNumber = typeof number === 'number';
          const isActive = isNumber && number === currentPage;
          const uniqueKey = isNumber ? `page-${number}` : `dots-${index}`;

          return (
            <button
              key={uniqueKey}
              onClick={() => isNumber ? paginate(number) : undefined}
              disabled={!isNumber}
              className={`px-3 sm:px-4 py-2 rounded-md flex-shrink-0 min-w-[40px] sm:min-w-[44px] text-sm sm:text-base font-medium ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-gray-800 text-blue-400 hover:bg-gray-700'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
              } ${!isNumber ? 'cursor-default hover:bg-transparent dark:hover:bg-gray-800' : 'transition-colors'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {number}
            </button>
          );
        })}
      </div>
      
      <button
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-2 sm:px-3 py-2 rounded-md flex-shrink-0 ${
          darkMode
            ? 'bg-gray-800 text-blue-400 hover:bg-gray-700 disabled:text-gray-600'
            : 'bg-white text-blue-600 hover:bg-blue-50 disabled:text-gray-400'
        } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        aria-label="Next page"
      >
        <ChevronRight size={20} className="sm:w-5 sm:h-5" />
      </button>
    </nav>
  );
};

export default Pagination;
