import { useState } from 'react';
import { LayoutGrid, List, Filter } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

interface CatalogHeaderProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onFilterClick: () => void;
}

export default function CatalogHeader({ 
  viewMode, 
  onViewModeChange, 
  sortBy, 
  onSortChange,
  onFilterClick 
}: CatalogHeaderProps) {
  const { products, pagination, category, isLoading } = useProducts();

  // Validate pagination data before displaying
  const hasValidPagination = pagination && typeof pagination.from === 'number' && typeof pagination.to === 'number' && typeof pagination.total === 'number';
  const from = hasValidPagination ? pagination.from : 0;
  const to = hasValidPagination ? pagination.to : 0;
  const total = hasValidPagination ? pagination.total : 0;
  const displayCategory = category || 'All Products';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-border-standard shadow-sm gap-4">
      <div className="font-medium text-sm text-on-surface-variant self-start sm:self-center">
        {isLoading ? (
          <span className="animate-pulse">Loading products...</span>
        ) : total > 0 ? (
          <>
            Showing <span className="font-bold text-on-surface">{from}-{to}</span> of{' '}
            <span className="font-bold text-on-surface">{total}</span> products in{' '}
            <span className="font-bold text-on-surface">"{displayCategory}"</span>
          </>
        ) : (
          <span>No products found in <span className="font-bold text-on-surface">"{displayCategory}"</span></span>
        )}
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
        {/* Filter Button - Now with onClick handler */}
        <button 
          onClick={onFilterClick}
          className="lg:hidden flex items-center gap-2 bg-surface-muted/50 px-3 py-1.5 rounded-lg border border-border-standard text-sm font-semibold text-on-surface hover:bg-surface-muted transition-colors"
          aria-label="Open filters"
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
        
        {/* Sort Dropdown - Now controlled with onChange */}
        <div className="flex items-center gap-2 bg-surface-muted/50 px-3 py-1.5 rounded-lg border border-border-standard">
          <span className="hidden sm:inline font-semibold text-xs text-outline uppercase tracking-wider">Sort by:</span>
          <select 
            value={sortBy}
            onChange={handleSortChange}
            className="bg-transparent border-none text-sm font-semibold text-on-surface focus:ring-0 cursor-pointer outline-none"
            aria-label="Sort products"
          >
            <option value="recommended">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
        
        {/* View Mode Toggle - Now functional */}
        <div className="hidden sm:flex bg-surface-muted/50 border border-border-standard rounded-lg p-1 gap-1" role="group" aria-label="View mode">
          <button 
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer border ${
              viewMode === 'grid' 
                ? 'bg-white shadow-sm text-primary border-border-standard' 
                : 'bg-transparent text-outline hover:text-primary border-transparent'
            }`}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer border ${
              viewMode === 'list' 
                ? 'bg-white shadow-sm text-primary border-border-standard' 
                : 'bg-transparent text-outline hover:text-primary border-transparent'
            }`}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}