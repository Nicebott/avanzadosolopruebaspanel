import React, { useMemo } from 'react';
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
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  const pageNumbers = useMemo(() => {
    if (totalPages <= 1) return [];

    const isMobile = window.innerWidth < 640;
    const siblingCount = isMobile ? 1 : 2;
    const range: (number | string)[] = [];

    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      for (let i = 1; i <= leftItemCount; i++) {
        range.push(i);
      }
      range.push('...');
      range.push(totalPages);
      return range;
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      range.push(1);
      range.push('...');
      for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      range.push(1);
      range.push('...');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        range.push(i);
      }
      range.push('...');
      range.push(totalPages);
      return range;
    }

    return range;
  }, [currentPage, totalPages]);

  if (pageNumbers.length <= 1) return null;

  return (
    <nav className="flex justify-center items-center gap-2 mt-4 px-2 w-full" aria-label="Pagination">
      <button
        onClick={() => paginate(currentPage - 1)}
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
        {pageNumbers.map((number, index) => (
          <button
            key={index}
            onClick={() => typeof number === 'number' ? paginate(number) : undefined}
            disabled={typeof number !== 'number'}
            className={`px-3 sm:px-4 py-2 rounded-md flex-shrink-0 min-w-[40px] sm:min-w-[44px] text-sm sm:text-base font-medium ${
              currentPage === number
                ? darkMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-600 text-white'
                : darkMode
                  ? 'bg-gray-800 text-blue-400 hover:bg-gray-700'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
            } ${typeof number !== 'number' ? 'cursor-default hover:bg-transparent' : 'transition-colors'}`}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => paginate(currentPage + 1)}
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
