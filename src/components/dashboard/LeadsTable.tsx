import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useMemo, useState } from "react";

import { LeadDrawer } from "@/components/dashboard/LeadDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/data/dataset";
import { cn } from "@/lib/utils";

type Col = { key: keyof Lead; label: string; className?: string };

const COLS: Col[] = [
  { key: "empresa", label: "Empresa", className: "min-w-[180px]" },
  { key: "responsavel", label: "Responsável", className: "min-w-[150px]" },
  { key: "telefone", label: "Telefone", className: "min-w-[130px]" },
  { key: "email", label: "E-mail", className: "min-w-[190px]" },
  { key: "produto", label: "Produto", className: "min-w-[150px]" },
  { key: "setor", label: "Setor", className: "min-w-[140px]" },
  { key: "estado", label: "UF", className: "w-[60px]" },
  { key: "cidade", label: "Cidade / Praça", className: "min-w-[130px]" },
  { key: "origem", label: "Origem", className: "min-w-[120px]" },
  { key: "status", label: "Status", className: "min-w-[150px]" },
];

const PAGE_SIZE = 12;

function exportCsv(rows: Lead[]) {
  const head = COLS.map((c) => c.label).join(";");
  const body = rows
    .map((r) =>
      COLS.map((c) => `"${String(r[c.key] ?? "").replace(/"/g, "'")}"`).join(";"),
    )
    .join("\n");
  const blob = new Blob([`\uFEFF${head}\n${body}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "leads-iec.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [sort, setSort] = useState<{ key: keyof Lead; dir: "asc" | "desc" }>({
    key: "empresa",
    dir: "asc",
  });
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Lead | null>(null);

  const sorted = useMemo(() => {
    const copy = [...leads];
    copy.sort((a, b) => {
      const av = String(a[sort.key] ?? "");
      const bv = String(b[sort.key] ?? "");
      return sort.dir === "asc" ? av.localeCompare(bv, "pt-BR") : bv.localeCompare(av, "pt-BR");
    });
    return copy;
  }, [leads, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, totalPages - 1);
  const rows = sorted.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  const toggleSort = (key: keyof Lead) => {
    setPage(0);
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-4">
        <div>
          <h3 className="text-sm font-semibold">Base de Leads</h3>
          <p className="text-xs text-muted-foreground">
            {sorted.length} registros • clique em uma linha para ver a ficha completa
          </p>
        </div>
        <Button size="sm" variant="outline" className="h-8 gap-2 text-xs" onClick={() => exportCsv(sorted)}>
          <Download className="h-3.5 w-3.5" /> Exportar CSV
        </Button>
      </div>

      <div className="overflow-x-auto scroll-slim">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-surface-dark text-surface-dark-foreground">
              {COLS.map((c) => (
                <th key={String(c.key)} className={cn("px-3 py-2.5 font-semibold", c.className)}>
                  <button
                    type="button"
                    onClick={() => toggleSort(c.key)}
                    className="inline-flex items-center gap-1 tracking-wide uppercase transition-colors hover:text-accent"
                  >
                    {c.label}
                    {sort.key === c.key ? (
                      sort.dir === "asc" ? (
                        <ArrowUp className="h-3 w-3 text-accent" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-accent" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((l) => (
              <tr
                key={l.id}
                onClick={() => setSelected(l)}
                className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-accent/10"
              >
                <td className="px-3 py-2.5 font-medium text-foreground">{l.empresa}</td>
                <td className="px-3 py-2.5">{l.responsavel}</td>
                <td className="px-3 py-2.5 tabular-nums">{l.telefone ?? "—"}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{l.email ?? "—"}</td>
                <td className="px-3 py-2.5">{l.produto}</td>
                <td className="px-3 py-2.5">{l.setor}</td>
                <td className="px-3 py-2.5 font-semibold">{l.estado}</td>
                <td className="px-3 py-2.5">{l.cidade ?? "—"}</td>
                <td className="px-3 py-2.5">
                  <Badge variant="outline" className="text-[10px] font-medium">
                    {l.origem}
                  </Badge>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      l.status === "Convertido"
                        ? "bg-accent text-accent-foreground"
                        : l.status === "Sem Status"
                          ? "bg-secondary text-muted-foreground"
                          : "bg-foreground/90 text-background",
                    )}
                  >
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLS.length} className="px-3 py-10 text-center text-muted-foreground">
                  Nenhum lead encontrado para os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border p-3">
        <p className="text-xs text-muted-foreground">
          Página {current + 1} de {totalPages}
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={current >= totalPages - 1}
            onClick={() => setPage(current + 1)}
            aria-label="Próxima página"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <LeadDrawer lead={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
