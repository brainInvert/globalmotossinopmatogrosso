import React, { createContext, useContext, useState, useEffect } from 'react';
import { Motorcycle } from '../types/motorcycle';

interface ComparisonContextType {
  comparisonList: Motorcycle[];
  addToComparison: (moto: Motorcycle) => boolean;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  isInComparison: (id: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparisonList, setComparisonList] = useState<Motorcycle[]>(() => {
    try {
      const saved = localStorage.getItem('portal_comparison_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('portal_comparison_list', JSON.stringify(comparisonList));
  }, [comparisonList]);

  const addToComparison = (moto: Motorcycle): boolean => {
    if (comparisonList.some((m) => m.id === moto.id)) return false;
    if (comparisonList.length >= 3) {
      alert('Você pode comparar no máximo 3 motocicletas ao mesmo tempo.');
      return false;
    }
    setComparisonList([...comparisonList, moto]);
    return true;
  };

  const removeFromComparison = (id: string) => {
    setComparisonList(comparisonList.filter((m) => m.id !== id));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const isInComparison = (id: string) => {
    return comparisonList.some((m) => m.id === id);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
