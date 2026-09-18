import { cn } from "@/lib/utils";

// Mapa esquemático do Brasil: cada UF ocupa sua posição geográfica aproximada
// em uma grade, permitindo seleção interativa por estado.
const GRID: { uf: string; col: number; row: number }[] = [
  { uf: "RR", col: 3, row: 1 },
  { uf: "AP", col: 5, row: 1 },
  { uf: "AM", col: 2, row: 2 },
  { uf: "PA", col: 4, row: 2 },
  { uf: "MA", col: 5, row: 2 },
  { uf: "CE", col: 6, row: 2 },
  { uf: "RN", col: 7, row: 2 },
  { uf: "AC", col: 1, row: 3 },
  { uf: "RO", col: 2, row: 3 },
  { uf: "TO", col: 4, row: 3 },
  { uf: "PI", col: 5, row: 3 },
  { uf: "PB", col: 7, row: 3 },
  { uf: "PE", col: 6, row: 3 },
  { uf: "MT", col: 3, row: 4 },
  { uf: "GO", col: 4, row: 4 },
  { uf: "BA", col: 5, row: 4 },
  { uf: "AL", col: 7, row: 4 },
  { uf: "SE", col: 6, row: 4 },
  { uf: "MS", col: 3, row: 5 },
  { uf: "DF", col: 4, row: 5 },
  { uf: "MG", col: 5, row: 5 },
  { uf: "ES", col: 6, row: 5 },
  { uf: "SP", col: 4, row: 6 },
  { uf: "RJ", col: 5, row: 6 },
  { uf: "PR", col: 3, row: 7 },
  { uf: "SC", col: 4, row: 7 },
  { uf: "RS", col: 3, row: 8 },
];

export function BrazilMap({
  counts,
  selected,
  onSelect,
}: {
  counts: Record<string, number>;
  selected: string | null;
  onSelect: (uf: string) => void;
}) {
  const max = Math.max(1, ...Object.values(counts));

  return (
    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
      {Array.from({ length: 8 * 7 }, (_, i) => {
        const row = Math.floor(i / 7) + 1;
        const col = (i % 7) + 1;
        const cell = GRID.find((g) => g.col === col && g.row === row);
        if (!cell) return <div key={i} />;
        const total = counts[cell.uf] ?? 0;
        const intensity = total / max;
        const isSelected = selected === cell.uf;
        return (
          <button
            key={cell.uf}
            type="button"
            onClick={() => onSelect(cell.uf)}
            title={`${cell.uf}: ${total} leads`}
            className={cn(
              "aspect-square rounded-md border text-[11px] font-semibold transition-all duration-200 hover:scale-105",
              isSelected
                ? "border-accent ring-2 ring-accent"
                : "border-border hover:border-accent",
              total === 0 && "opacity-45",
            )}
            style={{
              background:
                total === 0
                  ? "var(--color-secondary)"
                  : `color-mix(in oklab, var(--color-accent) ${15 + intensity * 85}%, var(--color-card))`,
            }}
          >
            <span className="block">{cell.uf}</span>
            <span className="block text-[10px] font-normal tabular-nums opacity-70">{total}</span>
          </button>
        );
      })}
    </div>
  );
}
