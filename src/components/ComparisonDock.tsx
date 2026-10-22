import React from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, X, ArrowRight } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';

export const ComparisonDock: React.FC = () => {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();

  if (comparisonList.length === 0) return null;

  return (
    <aside
      aria-label="Comparador de Motos"
      className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] sm:w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-200"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-slate-800 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Indicator & items */}
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 min-w-0">
          <div className="flex items-center gap-1.5 pl-1 text-xs font-bold text-blue-400 shrink-0">
            <GitCompare className="w-4 h-4 shrink-0 text-blue-400" />
            <span className="hidden xs:inline">Comparar</span>
            <span className="bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded text-[11px] font-bold">
              {comparisonList.length}/3
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
            {comparisonList.map((moto) => (
              <div
                key={moto.id}
                className="flex items-center gap-1.5 bg-slate-800/90 px-2 py-1 rounded-lg border border-slate-700 text-xs shrink-0"
              >
                <span className="font-medium max-w-[100px] truncate text-slate-200">
                  {moto.brand} {moto.model}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromComparison(moto.id)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Remover moto"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={clearComparison}
            className="text-[11px] sm:text-xs text-slate-400 hover:text-white px-2 py-1.5 transition-colors cursor-pointer"
          >
            Limpar
          </button>
          <Link
            to="/comparar"
            className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 rounded-xl text-white shadow-sm shadow-blue-900 transition-all shrink-0 min-h-[36px]"
          >
            <span>Comparar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
