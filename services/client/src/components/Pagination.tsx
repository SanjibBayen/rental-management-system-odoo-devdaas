import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination() {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button className="p-2 border border-border-standard rounded-lg bg-white text-outline hover:text-primary hover:border-primary shadow-sm transition-colors disabled:opacity-50 cursor-pointer" disabled>
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button className="w-10 h-10 border border-primary bg-primary text-white rounded-lg font-bold text-sm shadow-sm cursor-pointer hover:bg-opacity-90 transition-opacity">1</button>
      <button className="w-10 h-10 border border-border-standard bg-white text-on-surface hover:border-primary hover:text-primary rounded-lg font-medium text-sm shadow-sm transition-colors cursor-pointer">2</button>
      <button className="w-10 h-10 border border-border-standard bg-white text-on-surface hover:border-primary hover:text-primary rounded-lg font-medium text-sm shadow-sm transition-colors cursor-pointer">3</button>
      <span className="text-outline mx-1 font-bold">...</span>
      <button className="w-10 h-10 border border-border-standard bg-white text-on-surface hover:border-primary hover:text-primary rounded-lg font-medium text-sm shadow-sm transition-colors cursor-pointer">8</button>
      <button className="p-2 border border-border-standard rounded-lg bg-white text-outline hover:text-primary hover:border-primary shadow-sm transition-colors cursor-pointer">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
