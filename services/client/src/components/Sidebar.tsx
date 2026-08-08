export default function Sidebar() {
  return (
    <aside className="hidden lg:block col-span-1 space-y-6">
      <div className="bg-white border border-border-standard p-6 rounded-xl shadow-sm sticky top-24">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-standard">
          <h2 className="font-bold text-lg text-on-surface">Filters</h2>
          <button className="text-primary font-medium text-sm hover:underline">Clear All</button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-3">Category</h3>
          <ul className="space-y-2 font-medium text-sm text-on-surface-variant">
            <li>
              <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                <input defaultChecked className="rounded border-outline text-primary focus:ring-primary w-4 h-4 accent-primary" type="checkbox" />
                <span>Electronics (24)</span>
              </label>
            </li>
            <li>
              <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                <input className="rounded border-outline text-primary focus:ring-primary w-4 h-4 accent-primary" type="checkbox" />
                <span>Furniture (18)</span>
              </label>
            </li>
            <li>
              <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                <input className="rounded border-outline text-primary focus:ring-primary w-4 h-4 accent-primary" type="checkbox" />
                <span>Tools & Hardware (12)</span>
              </label>
            </li>
            <li>
              <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                <input className="rounded border-outline text-primary focus:ring-primary w-4 h-4 accent-primary" type="checkbox" />
                <span>Events & Party (9)</span>
              </label>
            </li>
          </ul>
        </div>

        {/* Brand Filter */}
        <div className="pt-6 border-t border-border-standard mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-3">Brand</h3>
          <ul className="space-y-2 font-medium text-sm text-on-surface-variant">
            <li>
              <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                <input className="rounded border-outline text-primary focus:ring-primary w-4 h-4 accent-primary" type="checkbox" />
                <span>Sony</span>
              </label>
            </li>
            <li>
              <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                <input defaultChecked className="rounded border-outline text-primary focus:ring-primary w-4 h-4 accent-primary" type="checkbox" />
                <span>Apple</span>
              </label>
            </li>
            <li>
              <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
                <input className="rounded border-outline text-primary focus:ring-primary w-4 h-4 accent-primary" type="checkbox" />
                <span>Herman Miller</span>
              </label>
            </li>
          </ul>
        </div>

        {/* Duration Filter */}
        <div className="pt-6 border-t border-border-standard mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-3">Duration</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 border border-border-standard rounded-lg font-medium text-sm text-on-surface hover:border-primary hover:text-primary transition-colors">Hour</button>
            <button className="px-3 py-1.5 bg-primary/10 text-primary border border-primary rounded-lg font-bold text-sm transition-colors">Day</button>
            <button className="px-3 py-1.5 border border-border-standard rounded-lg font-medium text-sm text-on-surface hover:border-primary hover:text-primary transition-colors">Week</button>
            <button className="px-3 py-1.5 border border-border-standard rounded-lg font-medium text-sm text-on-surface hover:border-primary hover:text-primary transition-colors">Month</button>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="pt-6 border-t border-border-standard">
          <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-3">Price Range (Daily)</h3>
          <div className="px-1">
            <input className="w-full appearance-none bg-transparent" max="500" min="0" type="range" defaultValue="150" />
            <div className="flex justify-between items-center mt-3 font-medium text-sm text-on-surface-variant">
              <span>₹0</span>
              <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">₹150</span>
              <span>₹500+</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
