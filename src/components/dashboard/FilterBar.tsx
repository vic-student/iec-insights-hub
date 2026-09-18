import { Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MESES, OPCOES } from "@/data/dataset";
import { useFilters } from "@/context/filters";
import { FILTER_LABELS, type Filters } from "@/lib/analytics";

function FilterSelect({
  field,
  label,
  options,
}: {
  field: keyof Filters;
  label: string;
  options: { value: string; label: string }[];
}) {
  const { filters, setFilter } = useFilters();
  return (
    <Select value={filters[field]} onValueChange={(v) => setFilter(field, v)}>
      <SelectTrigger size="sm" className="w-full min-w-0 bg-card text-xs">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectItem value="todos">{label}: todos</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const toOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }));

export function FilterBar() {
  const { filters, setFilter, clearFilters, clearFilter, activeFilters, filtered } = useFilters();

  return (
    <div className="border-b border-border bg-card/80 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-3 lg:px-6">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
          <div className="relative col-span-2 md:col-span-2 xl:col-span-2">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.busca}
              onChange={(e) => setFilter("busca", e.target.value)}
              placeholder="Buscar empresa ou responsável…"
              className="h-8 bg-card pl-8 text-xs"
            />
          </div>
          <FilterSelect
            field="mes"
            label="Período"
            options={MESES.map((m) => ({ value: m.key, label: `${m.label} 2026` }))}
          />
          <FilterSelect field="responsavel" label="Responsável" options={toOptions(OPCOES.responsaveis)} />
          <FilterSelect field="produto" label="Produto" options={toOptions(OPCOES.produtos)} />
          <FilterSelect field="setor" label="Setor" options={toOptions(OPCOES.setores)} />
          <FilterSelect field="estado" label="Estado" options={toOptions(OPCOES.estados)} />
          <FilterSelect field="origem" label="Origem" options={toOptions(OPCOES.origens)} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect field="status" label="Status" options={toOptions(OPCOES.status)} />
          <span className="text-xs text-muted-foreground">
            <strong className="text-foreground">{filtered.length}</strong> leads no recorte atual
          </span>
          {activeFilters.map((f) => (
            <Badge
              key={f.key}
              variant="secondary"
              className="gap-1 border border-border bg-accent/15 text-[11px] font-medium text-foreground"
            >
              {FILTER_LABELS[f.key]}: {f.value}
              <button
                type="button"
                onClick={() => clearFilter(f.key)}
                aria-label={`Remover filtro ${FILTER_LABELS[f.key]}`}
                className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearFilters}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
