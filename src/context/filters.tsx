import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { LEADS, type Lead } from "@/data/dataset";
import { applyFilters, EMPTY_FILTERS, type Filters } from "@/lib/analytics";

type Ctx = {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
  clearFilters: () => void;
  clearFilter: (key: keyof Filters) => void;
  activeFilters: { key: keyof Filters; value: string }[];
  filtered: Lead[];
  refreshedAt: Date;
  refresh: () => void;
};

const FiltersContext = createContext<Ctx | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [refreshedAt, setRefreshedAt] = useState(() => new Date(2026, 8, 30, 9, 0, 0));

  const setFilter = useCallback((key: keyof Filters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);
  const clearFilter = useCallback(
    (key: keyof Filters) => setFilters((f) => ({ ...f, [key]: EMPTY_FILTERS[key] })),
    [],
  );

  const filtered = useMemo(() => applyFilters(filters, LEADS), [filters]);

  const activeFilters = useMemo(
    () =>
      (Object.keys(filters) as (keyof Filters)[])
        .filter((k) => filters[k] && filters[k] !== EMPTY_FILTERS[k])
        .map((k) => ({ key: k, value: filters[k] })),
    [filters],
  );

  const value = useMemo<Ctx>(
    () => ({
      filters,
      setFilter,
      clearFilters,
      clearFilter,
      activeFilters,
      filtered,
      refreshedAt,
      refresh: () => setRefreshedAt(new Date()),
    }),
    [filters, setFilter, clearFilters, clearFilter, activeFilters, filtered, refreshedAt],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}
