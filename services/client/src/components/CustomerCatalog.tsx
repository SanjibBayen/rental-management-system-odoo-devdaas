import { useState, useMemo } from 'react';
import Sidebar from "./Sidebar";
import CatalogHeader from "./CatalogHeader";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types";

export default function CustomerCatalog({
  setActiveView,
  setSelectedProductId,
}: {
  setActiveView: (view: string) => void;
  setSelectedProductId: (id: string) => void;
}) {
  const { products, isLoading, error, pagination, changePage, filterProducts } = useProducts();
  
  // Local state for UI controls
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recommended');

  // Apply sorting to products
  const sortedProducts = useMemo(() => {
    if (!products) return [];
    
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
      case 'price_desc':
        return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'recommended':
      default:
        // Assuming products come pre-sorted as recommended from API
        return sorted;
    }
  }, [products, sortBy]);

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    // Optionally reset to page 1 when sorting changes
    if (changePage && pagination?.page !== 1) {
      changePage(1);
    }
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
    setActiveView("product_detail");
  };

  const handleFilterApply = (newFilters: any) => {
    filterProducts(newFilters);
  };

  // Extract layout to avoid duplication
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="animate-pulse text-on-surface-variant">Loading products...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="text-red-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">Error loading products</p>
            <p className="text-sm text-red-400 mt-1">{error.message}</p>
            <button 
              onClick={() => changePage?.(pagination?.page || 1)} 
              className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (!sortedProducts || sortedProducts.length === 0) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-outline mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-semibold text-on-surface">No products found</p>
            <p className="text-sm text-on-surface-variant mt-1">
              Try adjusting your filters or search criteria
            </p>
            <button 
              onClick={() => filterProducts({ categories: [], brands: [], duration: 'day', maxPrice: 500 })} 
              className="mt-3 px-4 py-2 text-sm border border-border-standard rounded-lg hover:bg-surface-muted transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Product Grid/List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product: Product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="cursor-pointer transform transition-transform hover:scale-[1.02]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Pagination - Only show if there are pages to navigate */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => {
              changePage?.(page);
              // Scroll to top of product section when page changes
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </>
    );
  };

  return (
    <>
      <main className="flex-1 max-w-7xl mx-auto w-full px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Sidebar />
        <section className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          <CatalogHeader
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onFilterClick={() => {}}
          />
          {renderContent()}
        </section>
      </main>
    </>
  );
}