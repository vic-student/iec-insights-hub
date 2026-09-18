import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Package, Layers, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/dashboard/AppShell";
import { axisProps, CHART, tooltipStyle } from "@/components/dashboard/chart-theme";
import { KpiCard, PageHeader, Panel } from "@/components/dashboard/primitives";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/context/filters";
import { num } from "@/data/dataset";
import { countBy, rankingResponsaveis } from "@/lib/analytics";

export const Route = createFileRoute("/comercial")({
  head: () => ({
    meta: [
      { title: "Análise Comercial • Dashboard IEC" },
      {
        name: "description",
        content: "Produtos mais procurados, setores atendidos e ranking de responsáveis comerciais da IEC.",
      },
      { property: "og:title", content: "Análise Comercial • Dashboard IEC" },
      {
        property: "og:description",
        content: "Produtos, setores e performance dos responsáveis comerciais da IEC.",
      },
    ],
  }),
  component: ComercialPage,
});

function ComercialPage() {
  const { filtered, setFilter } = useFilters();
  const [ordem, setOrdem] = useState<"desc" | "asc">("desc");

  const produtos = useMemo(() => {
    const list = countBy(filtered, "produto").filter((p) => p.name !== "Não informado");
    const sorted = ordem === "desc" ? list : [...list].reverse();
    return sorted.slice(0, 12);
  }, [filtered, ordem]);

  const setores = useMemo(
    () => countBy(filtered, "setor").filter((s) => s.name !== "Não informado"),
    [filtered],
  );
  const ranking = useMemo(() => rankingResponsaveis(filtered, 12), [filtered]);

  return (
    <AppShell>
      <PageHeader
        title="Análise Comercial"
        description="Produtos, setores e performance dos responsáveis."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard label="Produtos mapeados" value={num(produtos.length)} icon={Package} highlight />
        <KpiCard label="Setores atendidos" value={num(setores.length)} icon={Layers} />
        <KpiCard label="Responsáveis ativos" value={num(ranking.length)} icon={UserCheck} dark />
      </div>

      <Panel
        title="Produtos mais procurados"
        subtitle="Clique em uma barra para filtrar o produto"
        action={
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-2 text-xs"
            onClick={() => setOrdem((o) => (o === "desc" ? "asc" : "desc"))}
          >
            {ordem === "desc" ? (
              <ArrowDownWideNarrow className="h-3.5 w-3.5" />
            ) : (
              <ArrowUpWideNarrow className="h-3.5 w-3.5" />
            )}
            {ordem === "desc" ? "Maior → menor" : "Menor → maior"}
          </Button>
        }
      >
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={produtos} layout="vertical" margin={{ left: 60, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.light} horizontal={false} />
            <XAxis type="number" {...axisProps} allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={150} {...axisProps} />
            <Tooltip {...tooltipStyle} />
            <Bar
              dataKey="value"
              fill={CHART.accent}
              radius={[0, 4, 4, 0]}
              barSize={16}
              className="cursor-pointer"
              onClick={(d: { name?: string }) => d?.name && setFilter("produto", d.name)}
            />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Setores e segmentos" subtitle="Top 12 do recorte atual">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={setores.slice(0, 12)} layout="vertical" margin={{ left: 50, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.light} horizontal={false} />
              <XAxis type="number" {...axisProps} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={140} {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Bar
                dataKey="value"
                fill={CHART.dark}
                radius={[0, 4, 4, 0]}
                barSize={16}
                className="cursor-pointer"
                onClick={(d: { name?: string }) => d?.name && setFilter("setor", d.name)}
              />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Ranking de responsáveis" subtitle="Volume de leads, propostas e conversões">
          <div className="space-y-2">
            {ranking.map((r, i) => (
              <button
                key={r.name}
                type="button"
                onClick={() => setFilter("responsavel", r.name)}
                className="flex w-full items-center gap-3 rounded-lg border border-border p-2.5 text-left transition-all hover:border-accent hover:bg-accent/5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-foreground text-xs font-semibold text-background">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{r.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{r.leads} leads</span>
                <span className="rounded-md bg-accent/20 px-2 py-0.5 text-xs font-semibold tabular-nums">
                  {r.conversoes} conv.
                </span>
              </button>
            ))}
            {ranking.length === 0 && (
              <p className="text-sm text-muted-foreground">Sem responsáveis no recorte atual.</p>
            )}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
