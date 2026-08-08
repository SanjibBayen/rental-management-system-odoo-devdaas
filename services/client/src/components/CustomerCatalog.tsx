import Sidebar from './Sidebar';
import CatalogHeader from './CatalogHeader';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import { products } from '../data';

export default function CustomerCatalog({ setActiveView }: { setActiveView?: (view: string) => void }) {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <Sidebar />
      <section className="col-span-1 lg:col-span-3 flex flex-col gap-6">
        <CatalogHeader />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} setActiveView={setActiveView} />
          ))}
        </div>
        <Pagination />
      </section>
    </main>
  );
}
