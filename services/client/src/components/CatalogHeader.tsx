import { LayoutGrid, List, Filter } from 'lucide-react';

export default function CatalogHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-border-standard shadow-sm gap-4">
      <div className="font-medium text-sm text-on-surface-variant self-start sm:self-center">
        Showing <span className="font-bold text-on-surface">1-9</span> of <span className="font-bold text-on-surface">24</span> products in <span className="font-bold text-on-surface">"Electronics"</span>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
        <button className="lg:hidden flex items-center gap-2 bg-surface-muted/50 px-3 py-1.5 rounded-lg border border-border-standard text-sm font-semibold text-on-surface hover:bg-surface-muted transition-colors">
          <Filter className="w-4 h-4" /> Filters
        </button>
        <div className="flex items-center gap-2 bg-surface-muted/50 px-3 py-1.5 rounded-lg border border-border-standard">
          <span className="hidden sm:inline font-semibold text-xs text-outline uppercase tracking-wider">Sort by:</span>
          <select className="bg-transparent border-none text-sm font-semibold text-on-surface focus:ring-0 cursor-pointer outline-none">
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Highest Rated</option>
          </select>
        </div>
        <div className="hidden sm:flex bg-surface-muted/50 border border-border-standard rounded-lg p-1 gap-1">
          <button className="p-1.5 bg-white shadow-sm rounded-md text-primary cursor-pointer transition-colors border border-border-standard">
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
