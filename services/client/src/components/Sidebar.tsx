import { useProducts } from '../hooks/useProducts';

export default function Sidebar() {
  const { categories, brands, filterProducts, activeFilters } = useProducts();

  const handleCategoryToggle = (category: string) => {
    const newCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter(c => c !== category)
      : [...activeFilters.categories, category];
    filterProducts({ ...activeFilters, categories: newCategories });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = activeFilters.brands.includes(brand)
      ? activeFilters.brands.filter(b => b !== brand)
      : [...activeFilters.brands, brand];
    filterProducts({ ...activeFilters, brands: newBrands });
  };

  const handleDurationChange = (duration: string) => {
    filterProducts({ ...activeFilters, duration });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    filterProducts({ ...activeFilters, maxPrice: value });
  };

  const clearAllFilters = () => {
    filterProducts({
      categories: [],
      brands: [],
      duration: 'day',
      maxPrice: 500,
    });
  };

  return (
    <aside className="hidden lg:block col-span-1 space-y-6">
      <div className="bg-white border border-border-standard p-6 rounded-xl shadow-sm sticky top-24">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-standard">
          <h2 className="font-bold text-lg text-on-surface">Filters</h2>
          <button 
            onClick={clearAllFilters}
            className="text-primary font-medium text-sm hover:underline"
          >
            Clear All
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-3">Category</h3>
          <ul className="space-y-2 font-medium text-sm text-on-surface-variant">
            {categories.map((category) => (
              <li key={category}>
                <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                  <input
                    checked={activeFilters.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="rounded border-outline text-primary focus:ring-primary w-4 h-4 accent-primary"
                    type="checkbox"
                  />
                  <span>{category}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand Filter */}
        <div className="pt-6 border-t border-border-standard mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-3">Brand</h3>
          <ul className="space-y-2 font-medium text-sm text-on-surface-variant">
            {brands.map((brand) => (
              <li key={brand}>
                <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                  <input
                    checked={activeFilters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="rounded border-outline text-primary focus:ring-primary w-4 h-4 accent-primary"
                    type="checkbox"
                  />
                  <span>{brand}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Duration Filter */}
        <div className="pt-6 border-t border-border-standard mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-3">Duration</h3>
          <div className="flex flex-wrap gap-2">
            {['Hour', 'Day', 'Week', 'Month'].map((duration) => (
              <button
                key={duration}
                onClick={() => handleDurationChange(duration.toLowerCase())}
                className={`px-3 py-1.5 border rounded-lg font-medium text-sm transition-colors ${
                  activeFilters.duration === duration.toLowerCase()
                    ? 'bg-primary/10 text-primary border-primary'
                    : 'border-border-standard text-on-surface hover:border-primary hover:text-primary'
                }`}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="pt-6 border-t border-border-standard">
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-3">Price Range (Daily)</h3>
          <div className="px-1">
            <input
              className="w-full appearance-none bg-transparent"
              max="500"
              min="0"
              type="range"
              value={activeFilters.maxPrice}
              onChange={handlePriceChange}
            />
            <div className="flex justify-between items-center mt-3 font-medium text-sm text-on-surface-variant">
              <span>₹0</span>
              <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                ₹{activeFilters.maxPrice}
              </span>
              <span>₹500+</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}