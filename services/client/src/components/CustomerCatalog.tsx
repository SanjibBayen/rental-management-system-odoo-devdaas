import Sidebar from '../../components/Sidebar';
import CatalogHeader from '../../components/CatalogHeader';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';
import { products } from '../../data';

export default function CustomerCatalog({ setActiveView, setSelectedProductId }: { setActiveView: (view: string) => void, setSelectedProductId: (id: string) => void }) {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <Sidebar />
      <section className="col-span-1 lg:col-span-3 flex flex-col gap-6">
        <CatalogHeader />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} onClick={() => { setSelectedProductId(product.id); setActiveView('product_detail'); }} className="cursor-pointer">
              <ProductCard product={product} setActiveView={setActiveView} />
            </div>
          ))}
        </div>
        <Pagination />
      </section>
    </main>
  );
}
