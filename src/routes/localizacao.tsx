import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/dashboard/AppShell";
import { BrazilMap } from "@/components/dashboard/BrazilMap";
import { PageHeader, Panel } from "@/components/dashboard/primitives";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/context/filters";
import { num } from "@/data/dataset";
import { countBy, estadoBreakdown } from "@/lib/analytics";

export const Route = createFileRoute("/localizacao")({
  head: () => ({
    meta: [
      { title: "Localização • Dashboard Comercial IEC" },
      {
        name: "description",
        content: "Distribuição geográfica dos leads da IEC por estado, cidade, setor e produto.",
      },
      { property: "og:title", content: "Localização • Dashboard Comercial IEC" },
      {
        property: "og:description",
        content: "Mapa interativo da distribuição regional dos leads da IEC.",
      },
    ],
  }),
  component: LocalizacaoPage,
});

function LocalizacaoPage() {
  const { filtered, setFilter } = useFilters();
  const [uf, setUf] = useState<string | null>(null);

  const breakdown = useMemo(() => estadoBreakdown(filtered), [filtered]);
  const counts = useMemo(
    () => Object.fromEntries(breakdown.map((b) => [b.uf, b.total])) as Record<string, number>,
    [breakdown],
  );

  const detalhe = useMemo(() => {
    const rows = uf ? (breakdown.find((b) => b.uf === uf)?.rows ?? []) : [];
    return {
      total: rows.length,
      cidades: countBy(rows, "cidade").slice(0, 6),
      setores: countBy(rows, "setor").filter((s) => s.name !== "Não informado").slice(0, 6),
      produtos: countBy(rows, "produto").filter((s) => s.name !== "Não informado").slice(0, 6),
    };
  }, [uf, breakdown]);

  const semUf = counts["ND"] ?? 0;

  return (
    <AppShell>
      <PageHeader
        title="Localização"
        description="Distribuição geográfica e detalhamento regional dos leads."
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <Panel
          title="Mapa do Brasil"
          subtitle={`Clique em um estado para detalhar • ${num(semUf)} leads sem UF informada`}
        >
          <BrazilMap counts={counts} selected={uf} onSelect={(v) => setUf(v === uf ? null : v)} />
        </Panel>

        <Panel
          title={uf ? `Detalhe de ${uf}` : "Selecione um estado"}
          subtitle={uf ? `${num(detalhe.total)} leads no recorte atual` : "Os detalhes aparecem aqui"}
          action={
            uf ? (
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setFilter("estado", uf)}>
                Filtrar por {uf}
              </Button>
            ) : undefined
          }
        >
          {!uf && (
            <p className="text-sm text-muted-foreground">
              Escolha um estado no mapa para ver cidades, setores e produtos locais.
            </p>
          )}
          {uf && (
            <div className="grid gap-4 sm:grid-cols-3">
              <DetailList title="Cidades / praças" items={detalhe.cidades} />
              <DetailList title="Setores" items={detalhe.setores} />
              <DetailList title="Produtos" items={detalhe.produtos} />
            </div>
          )}
        </Panel>
      </div>

      <Panel title="Ranking de estados" subtitle="Volume de leads por UF no recorte atual">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {breakdown.map((b) => (
            <button
              key={b.uf}
              type="button"
              onClick={() => setUf(b.uf === uf ? null : b.uf)}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:border-accent hover:bg-accent/5"
            >
              <span className="font-medium">{b.uf === "ND" ? "Não informado" : b.uf}</span>
              <span className="tabular-nums text-muted-foreground">{num(b.total)}</span>
            </button>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}

function DetailList({ title, items }: { title: string; items: { name: string; value: number }[] }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.length === 0 && <li className="text-xs text-muted-foreground">Sem dados</li>}
        {items.map((i) => (
          <li key={i.name} className="flex items-center justify-between gap-2 text-xs">
            <span className="truncate">{i.name}</span>
            <span className="tabular-nums text-muted-foreground">{i.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
