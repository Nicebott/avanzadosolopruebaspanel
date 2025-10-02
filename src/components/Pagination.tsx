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
  
  const getPageNumbers = () => {
    if (totalPages <= 1) return [];

    const maxButtons = isMobile ? 5 : 9;
    const pages: number[] = [];
    
    if (totalPages <= maxButtons) {
      // Si hay menos páginas que el máximo, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre incluir la primera página
      pages.push(1);
      
      // Calcular cuántas páginas mostrar a cada lado de la actual
      const sideButtons = Math.floor((maxButtons - 3) / 2); // -3 porque tenemos primera, última y actual
      
      let start = Math.max(2, currentPage - sideButtons);
      let end = Math.min(totalPages - 1, currentPage + sideButtons);
      
      // Ajustar si estamos cerca del inicio
      if (currentPage <= sideButtons + 2) {
        end = Math.min(totalPages - 1, maxButtons - 1);
        start = 2;
      }
      
      // Ajustar si estamos cerca del final
      if (currentPage >= totalPages - sideButtons - 1) {
        start = Math.max(2, totalPages - maxButtons + 2);
        end = totalPages - 1;
      }
      
      // Agregar páginas del medio
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      // Siempre incluir la última página
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
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
      
      <div className="flex items-center gap-1 sm:gap-2 justify-center">
        {pageNumbers.map((number) => (
          <button
            key={`page-${number}`}
            onClick={() => paginate(number)}
            className={`px-3 sm:px-4 py-2 rounded-md flex-shrink-0 min-w-[40px] sm:min-w-[44px] text-sm sm:text-base font-medium ${
              currentPage === number
                ? 'bg-blue-600 text-white'
                : darkMode
                  ? 'bg-gray-800 text-blue-400 hover:bg-gray-700'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
            } transition-colors`}
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        ))}
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
