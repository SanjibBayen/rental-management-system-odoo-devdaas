import Sidebar from '../../components/Sidebar';
import CatalogHeader from '../../components/CatalogHeader';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types';

export default function CustomerCatalog({ 
  setActiveView, 
  setSelectedProductId 
}: { 
  setActiveView: (view: string) => void, 
  setSelectedProductId: (id: string) => void 
}) {
  const { 
    products, 
    isLoading, 
    error, 
    pagination, 
    changePage,
    filterProducts,
    activeFilters,
    refetch 
  } = useProducts();

  if (isLoading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Sidebar />
        <section className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          <CatalogHeader />
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-on-surface-variant">Loading products...</div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Sidebar />
        <section className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          <CatalogHeader />
          <div className="flex justify-center items-center py-12 text-danger-red">
            Error loading products: {error.message}
          </div>
          <button 
            onClick={refetch}
            className="mx-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Retry
          </button>
        </section>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Sidebar />
        <section className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          <CatalogHeader />
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-on-surface-variant mb-4">No products found matching your filters.</p>
            <button 
              onClick={() => filterProducts({ categories: [], brands: [], maxPrice: 500 })}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
            >
              Clear Filters
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <Sidebar />
      <section className="col-span-1 lg:col-span-3 flex flex-col gap-6">
        <CatalogHeader />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <div 
              key={product.id} 
              onClick={() => { 
                setSelectedProductId(product.id); 
                setActiveView('product_detail'); 
              }} 
              className="cursor-pointer"
            >
              <ProductCard product={product} setActiveView={setActiveView} />
            </div>
          ))}
        </div>
        {pagination && pagination.totalPages > 1 && (
          <Pagination 
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={changePage}
          />
        )}
      </section>
    </main>
  );
}