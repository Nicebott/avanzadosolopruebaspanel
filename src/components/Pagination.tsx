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
    const maxButtons = isMobile ? 5 : 9;
    const range: number[] = [];

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    // Siempre incluir la página 1
    let startPage = 1;
    let endPage = maxButtons;

    // Ajustar el rango basado en la página actual
    if (currentPage > Math.floor(maxButtons / 2) + 1) {
      startPage = currentPage - Math.floor(maxButtons / 2);
      endPage = currentPage + Math.floor(maxButtons / 2);

      // Si nos pasamos del final, ajustar
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - maxButtons + 1;
      }
    } else {
      // Estamos al inicio
      startPage = 1;
      endPage = maxButtons;
    }

    // Siempre mostrar la página 1 si no está en el rango
    if (startPage > 1) {
      range.push(1);
      // Llenar el resto del rango
      const remainingSlots = maxButtons - 1;
      const adjustedStart = Math.max(startPage, totalPages - remainingSlots + 1);
      for (let i = adjustedStart; i <= totalPages && range.length < maxButtons; i++) {
        if (i > 1) {
          range.push(i);
        }
      }
    } else {
      // Llenar normalmente desde el inicio
      for (let i = startPage; i <= endPage && range.length < maxButtons; i++) {
        range.push(i);
      }
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
