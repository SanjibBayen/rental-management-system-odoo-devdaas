import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useCallback, useMemo, useEffect, useRef } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  siblingCount?: number;
  showFirstLast?: boolean;
  showItemsInfo?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage,
  siblingCount = 1,
  showFirstLast = true,
  showItemsInfo = true,
  size = 'md'
}: PaginationProps) {
  const paginationRef = useRef<HTMLDivElement>(null);
  const announcedRef = useRef<HTMLDivElement>(null);

  // Validate and clamp currentPage
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  
  // Calculate items range
  const itemsFrom = totalItems && itemsPerPage 
    ? Math.min((validCurrentPage - 1) * itemsPerPage + 1, totalItems)
    : null;
  const itemsTo = totalItems && itemsPerPage 
    ? Math.min(validCurrentPage * itemsPerPage, totalItems)
    : null;

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  // Generate page numbers with DOTS logic
  const pageNumbers = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2*DOTS
    
    // If total pages less than what we want to show, show all
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(validCurrentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(validCurrentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, 'DOTS', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount }, 
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, 'DOTS', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, 'DOTS', ...middleRange, 'DOTS', lastPageIndex];
    }

    return [];
  }, [validCurrentPage, totalPages, siblingCount]);

  // Announce page change to screen readers
  useEffect(() => {
    if (announcedRef.current) {
      announcedRef.current.textContent = `Page ${validCurrentPage} of ${totalPages}`;
    }
  }, [validCurrentPage, totalPages]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (validCurrentPage > 1) {
          onPageChange(validCurrentPage - 1);
          focusPageButton(validCurrentPage - 1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (validCurrentPage < totalPages) {
          onPageChange(validCurrentPage + 1);
          focusPageButton(validCurrentPage + 1);
        }
        break;
      case 'Home':
        e.preventDefault();
        if (validCurrentPage !== 1) {
          onPageChange(1);
          focusPageButton(1);
        }
        break;
      case 'End':
        e.preventDefault();
        if (validCurrentPage !== totalPages) {
          onPageChange(totalPages);
          focusPageButton(totalPages);
        }
        break;
    }
  }, [validCurrentPage, totalPages, onPageChange]);

  const focusPageButton = (page: number) => {
    if (paginationRef.current) {
      const button = paginationRef.current.querySelector(
        `[data-page="${page}"]`
      ) as HTMLElement;
      if (button) {
        button.focus();
      }
    }
  };

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== validCurrentPage) {
      onPageChange(page);
      // Announce to screen readers
      if (announcedRef.current) {
        announcedRef.current.textContent = `Navigated to page ${page}`;
      }
    }
  }, [totalPages, validCurrentPage, onPageChange]);

  // Don't render if there's only one page
  if (totalPages <= 1) return null;

  return (
    <nav 
      role="navigation" 
      aria-label="Pagination"
      className="flex flex-col items-center gap-4 mt-8"
    >
      {/* Live region for screen reader announcements */}
      <div 
        ref={announcedRef}
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      />
      
      {/* Items info */}
      {showItemsInfo && itemsFrom && itemsTo && totalItems && (
        <div className="text-sm text-on-surface-variant">
          Showing <span className="font-semibold text-on-surface">{itemsFrom}-{itemsTo}</span> of{' '}
          <span className="font-semibold text-on-surface">{totalItems}</span> items
        </div>
      )}

      <div 
        ref={paginationRef}
        className="flex justify-center items-center gap-1 sm:gap-2"
        onKeyDown={handleKeyDown}
        role="group"
        aria-label="Page navigation"
      >
        {/* First Page Button */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={validCurrentPage === 1}
            className={`${sizeClasses[size]} border border-border-standard rounded-lg bg-white text-outline hover:text-primary hover:border-primary shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-outline disabled:hover:border-border-standard cursor-pointer flex items-center justify-center`}
            aria-label="Go to first page"
            title="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(validCurrentPage - 1)}
          disabled={validCurrentPage === 1}
          className={`${sizeClasses[size]} border border-border-standard rounded-lg bg-white text-outline hover:text-primary hover:border-primary shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-outline disabled:hover:border-border-standard cursor-pointer flex items-center justify-center`}
          aria-label="Go to previous page"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNumber, index) => {
            // Generate unique key based on page number and position
            const uniqueKey = typeof pageNumber === 'number' 
              ? `page-${pageNumber}` 
              : `dots-${index}-${pageNumbers[index - 1]}-${pageNumbers[index + 1]}`;

            if (pageNumber === 'DOTS') {
              return (
                <span 
                  key={uniqueKey}
                  className={`${sizeClasses[size]} flex items-center justify-center text-outline font-bold select-none`}
                  aria-hidden="true"
                >
                  …
                </span>
              );
            }

            const isCurrentPage = pageNumber === validCurrentPage;
            
            return (
              <button
                key={uniqueKey}
                data-page={pageNumber}
                onClick={() => handlePageChange(pageNumber as number)}
                disabled={isCurrentPage}
                className={`${sizeClasses[size]} border rounded-lg font-medium shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center
                  ${isCurrentPage
                    ? 'border-primary bg-primary text-white shadow-md scale-105 cursor-default'
                    : 'border-border-standard bg-white text-on-surface hover:border-primary hover:text-primary hover:bg-primary/5 active:scale-95'
                  }
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                `}
                aria-label={`Page ${pageNumber}`}
                aria-current={isCurrentPage ? 'page' : undefined}
                tabIndex={isCurrentPage ? -1 : 0}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(validCurrentPage + 1)}
          disabled={validCurrentPage === totalPages}
          className={`${sizeClasses[size]} border border-border-standard rounded-lg bg-white text-outline hover:text-primary hover:border-primary shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-outline disabled:hover:border-border-standard cursor-pointer flex items-center justify-center`}
          aria-label="Go to next page"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page Button */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={validCurrentPage === totalPages}
            className={`${sizeClasses[size]} border border-border-standard rounded-lg bg-white text-outline hover:text-primary hover:border-primary shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-outline disabled:hover:border-border-standard cursor-pointer flex items-center justify-center`}
            aria-label="Go to last page"
            title="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Page jump for large paginations */}
      {totalPages > 10 && (
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="page-jump" className="text-on-surface-variant">
            Go to page:
          </label>
          <input
            id="page-jump"
            type="number"
            min={1}
            max={totalPages}
            defaultValue=""
            placeholder={`1-${totalPages}`}
            className="w-20 px-2 py-1 border border-border-standard rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = parseInt((e.target as HTMLInputElement).value);
                if (value >= 1 && value <= totalPages) {
                  handlePageChange(value);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
            aria-label="Jump to page number"
          />
        </div>
      )}
    </nav>
  );
}