import { LayoutGrid, List } from 'lucide-react';

export default function CatalogHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-border-standard shadow-sm gap-4">
      <div className="font-medium text-sm text-on-surface-variant">
        Showing <span className="font-bold text-on-surface">1-9</span> of <span className="font-bold text-on-surface">24</span> products in <span className="font-bold text-on-surface">"Electronics"</span>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="flex items-center gap-2 bg-surface-muted px-3 py-1.5 rounded-lg border border-border-standard">
          <span className="font-semibold text-xs text-outline uppercase tracking-wider">Sort by:</span>
          <select className="bg-transparent border-none text-sm font-semibold text-on-surface pr-6 focus:ring-0 cursor-pointer outline-none">
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Highest Rated</option>
          </select>
        </div>
        <div className="hidden sm:flex bg-surface-muted border border-border-standard rounded-lg p-1 gap-1">
          <button className="p-1.5 bg-white shadow-sm rounded text-primary cursor-pointer transition-colors border border-border-standard">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="p-1.5 bg-transparent text-outline hover:text-primary transition-colors cursor-pointer border border-transparent">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
