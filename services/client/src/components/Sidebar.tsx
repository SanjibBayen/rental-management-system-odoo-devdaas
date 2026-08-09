import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

export default function Sidebar() {
  const { categories, brands, filterProducts, activeFilters, isLoading } = useProducts();

  const [priceValue, setPriceValue] = useState(activeFilters.maxPrice);
  const [priceInputValue, setPriceInputValue] = useState(String(activeFilters.maxPrice));
  const [categorySearch, setCategorySearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxPrice = 10000;
  const minPrice = 0;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.categories?.length > 0) count += activeFilters.categories.length;
    if (activeFilters.brands?.length > 0) count += activeFilters.brands.length;
    if (activeFilters.duration && activeFilters.duration !== 'day') count += 1;
    if (activeFilters.maxPrice && activeFilters.maxPrice < maxPrice) count += 1;
    return count;
  }, [activeFilters, maxPrice]);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPriceValue(value);
    setPriceInputValue(String(value));

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      filterProducts({ ...activeFilters, maxPrice: value });
    }, 300);
  }, [activeFilters, filterProducts]);

  const handlePriceInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setPriceInputValue(rawValue);
  }, []);

  const handlePriceInputBlur = useCallback(() => {
    let value = parseInt(priceInputValue) || minPrice;
    value = Math.max(minPrice, Math.min(maxPrice, value));
    setPriceValue(value);
    setPriceInputValue(String(value));
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    filterProducts({ ...activeFilters, maxPrice: value });
  }, [priceInputValue, activeFilters, filterProducts, minPrice, maxPrice]);

  const handlePriceInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePriceInputBlur();
    }
  }, [handlePriceInputBlur]);

  const handleCategoryToggle = useCallback((category: string) => {
    const newCategories = activeFilters.categories?.includes(category)
      ? activeFilters.categories.filter((c: string) => c !== category)
      : [...(activeFilters.categories || []), category];
    filterProducts({ ...activeFilters, categories: newCategories });
  }, [activeFilters, filterProducts]);

  const handleBrandToggle = useCallback((brand: string) => {
    const newBrands = activeFilters.brands?.includes(brand)
      ? activeFilters.brands.filter((b: string) => b !== brand)
      : [...(activeFilters.brands || []), brand];
    filterProducts({ ...activeFilters, brands: newBrands });
  }, [activeFilters, filterProducts]);

  const handleDurationChange = useCallback((duration: string) => {
    filterProducts({ ...activeFilters, duration });
  }, [activeFilters, filterProducts]);

  const clearAllFilters = useCallback(() => {
    const defaultFilters = {
      categories: [],
      brands: [],
      duration: 'day',
      maxPrice: maxPrice,
    };
    setPriceValue(maxPrice);
    setPriceInputValue(String(maxPrice));
    filterProducts(defaultFilters);
  }, [filterProducts, maxPrice]);

  const toggleSection = useCallback((section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    const filtered = categories.filter(cat => 
      cat.toLowerCase().includes(categorySearch.toLowerCase())
    );
    return showAllCategories ? filtered : filtered.slice(0, 5);
  }, [categories, categorySearch, showAllCategories]);

  const filteredBrands = useMemo(() => {
    if (!brands) return [];
    const filtered = brands.filter(brand => 
      brand.toLowerCase().includes(brandSearch.toLowerCase())
    );
    return showAllBrands ? filtered : filtered.slice(0, 5);
  }, [brands, brandSearch, showAllBrands]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <aside className="hidden lg:block col-span-1 space-y-6">
      <div className="bg-white border border-border-standard p-6 rounded-xl shadow-sm sticky top-24">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-standard">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg text-on-surface">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button 
              onClick={clearAllFilters}
              className="text-primary font-medium text-sm hover:underline flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {activeFilterCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {activeFilters.categories?.map((cat: string) => (
              <span 
                key={cat}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full"
              >
                {cat}
                <button
                  onClick={() => handleCategoryToggle(cat)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {activeFilters.brands?.map((brand: string) => (
              <span 
                key={brand}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full"
              >
                {brand}
                <button
                  onClick={() => handleBrandToggle(brand)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {activeFilters.duration && activeFilters.duration !== 'day' && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full capitalize">
                {activeFilters.duration}
                <button
                  onClick={() => handleDurationChange('day')}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {activeFilters.maxPrice && activeFilters.maxPrice < maxPrice && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                Up to {formatPrice(activeFilters.maxPrice)}
                <button
                  onClick={() => {
                    setPriceValue(maxPrice);
                    setPriceInputValue(String(maxPrice));
                    filterProducts({ ...activeFilters, maxPrice });
                  }}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        <div className="mb-6">
          <button 
            onClick={() => toggleSection('category')}
            className="w-full flex justify-between items-center mb-3 group"
            aria-expanded={!collapsedSections.category}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
              Category
            </h3>
            {collapsedSections.category ? (
              <ChevronDown className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
            ) : (
              <ChevronUp className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
            )}
          </button>
          
          {!collapsedSections.category && (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-border-standard rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3">
                      <div className="w-4 h-4 bg-surface-muted rounded"></div>
                      <div className="h-4 bg-surface-muted rounded w-24"></div>
                    </div>
                  ))}
                </div>
              ) : filteredCategories.length > 0 ? (
                <ul className="space-y-2 font-medium text-sm text-on-surface-variant">
                  {filteredCategories.map((category) => (
                    <li key={category}>
                      <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors group">
                        <input
                          checked={activeFilters.categories?.includes(category) || false}
                          onChange={() => handleCategoryToggle(category)}
                          className="rounded border-outline text-primary focus:ring-primary w-4 h-4 accent-primary cursor-pointer"
                          type="checkbox"
                        />
                        <span className="flex-1">{category}</span>
                      </label>
                    </li>
                  ))}
                  
                  {categories && categories.length > 5 && !categorySearch && (
                    <li>
                      <button
                        onClick={() => setShowAllCategories(!showAllCategories)}
                        className="text-primary text-xs font-semibold hover:underline mt-1"
                      >
                        {showAllCategories 
                          ? 'Show Less' 
                          : `Show All (${categories.length})`
                        }
                      </button>
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-on-surface-variant italic">
                  No categories found
                </p>
              )}
            </>
          )}
        </div>

        <div className="pt-6 border-t border-border-standard mb-6">
          <button 
            onClick={() => toggleSection('brand')}
            className="w-full flex justify-between items-center mb-3 group"
            aria-expanded={!collapsedSections.brand}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
              Brand
            </h3>
            {collapsedSections.brand ? (
              <ChevronDown className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
            ) : (
              <ChevronUp className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
            )}
          </button>
          
          {!collapsedSections.brand && (
            <>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-border-standard rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3">
                      <div className="w-4 h-4 bg-surface-muted rounded"></div>
                      <div className="h-4 bg-surface-muted rounded w-24"></div>
                    </div>
                  ))}
                </div>
              ) : filteredBrands.length > 0 ? (
                <ul className="space-y-2 font-medium text-sm text-on-surface-variant">
                  {filteredBrands.map((brand) => (
                    <li key={brand}>
                      <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors group">
                        <input
                          checked={activeFilters.brands?.includes(brand) || false}
                          onChange={() => handleBrandToggle(brand)}
                          className="rounded border-outline text-primary focus:ring-primary w-4 h-4 accent-primary cursor-pointer"
                          type="checkbox"
                        />
                        <span className="flex-1">{brand}</span>
                      </label>
                    </li>
                  ))}
                  
                  {brands && brands.length > 5 && !brandSearch && (
                    <li>
                      <button
                        onClick={() => setShowAllBrands(!showAllBrands)}
                        className="text-primary text-xs font-semibold hover:underline mt-1"
                      >
                        {showAllBrands 
                          ? 'Show Less' 
                          : `Show All (${brands.length})`
                        }
                      </button>
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-on-surface-variant italic">
                  No brands found
                </p>
              )}
            </>
          )}
        </div>

        <div className="pt-6 border-t border-border-standard mb-6">
          <button 
            onClick={() => toggleSection('duration')}
            className="w-full flex justify-between items-center mb-3 group"
            aria-expanded={!collapsedSections.duration}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
              Duration
            </h3>
            {collapsedSections.duration ? (
              <ChevronDown className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
            ) : (
              <ChevronUp className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
            )}
          </button>
          
          {!collapsedSections.duration && (
            <div className="flex flex-wrap gap-2">
              {['Hour', 'Day', 'Week', 'Month'].map((duration) => (
                <button
                  key={duration}
                  onClick={() => handleDurationChange(duration.toLowerCase())}
                  className={`px-3 py-1.5 border rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeFilters.duration === duration.toLowerCase()
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'border-border-standard text-on-surface hover:border-primary hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-border-standard">
          <button 
            onClick={() => toggleSection('price')}
            className="w-full flex justify-between items-center mb-3 group"
            aria-expanded={!collapsedSections.price}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
              Price Range (Daily)
            </h3>
            {collapsedSections.price ? (
              <ChevronDown className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
            ) : (
              <ChevronUp className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
            )}
          </button>
          
          {!collapsedSections.price && (
            <div className="px-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-outline">Max:</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">₹</span>
                  <input
                    type="text"
                    value={priceInputValue}
                    onChange={handlePriceInputChange}
                    onBlur={handlePriceInputBlur}
                    onKeyDown={handlePriceInputKeyDown}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-border-standard rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-right font-medium"
                  />
                </div>
              </div>

              <div className="relative">
                <input
                  className="w-full appearance-none bg-transparent cursor-pointer
                    [&::-webkit-slider-runnable-track]:h-2 
                    [&::-webkit-slider-runnable-track]:rounded-full 
                    [&::-webkit-slider-runnable-track]:bg-surface-muted
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:w-5 
                    [&::-webkit-slider-thumb]:h-5 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-primary 
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:-mt-1.5
                    [&::-moz-range-track]:h-2 
                    [&::-moz-range-track]:rounded-full 
                    [&::-moz-range-track]:bg-surface-muted
                    [&::-moz-range-thumb]:appearance-none 
                    [&::-moz-range-thumb]:w-5 
                    [&::-moz-range-thumb]:h-5 
                    [&::-moz-range-thumb]:rounded-full 
                    [&::-moz-range-thumb]:bg-primary 
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:shadow-md
                    [&::-moz-range-thumb]:cursor-pointer"
                  max={maxPrice}
                  min={minPrice}
                  step={10}
                  type="range"
                  value={priceValue}
                  onChange={handlePriceChange}
                />
                <div 
                  className="absolute top-1/2 left-0 h-2 bg-primary/20 rounded-full pointer-events-none"
                  style={{ 
                    width: `${((priceValue - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    transform: 'translateY(-50%)'
                  }}
                />
              </div>

              <div className="flex justify-between items-center mt-3 font-medium text-sm text-on-surface-variant">
                <span>{formatPrice(minPrice)}</span>
                <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {formatPrice(priceValue)}
                </span>
                <span>{formatPrice(maxPrice)}+</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}