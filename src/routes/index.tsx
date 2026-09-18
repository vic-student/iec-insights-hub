import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  FileText,
  Lightbulb,
  MapPin,
  Percent,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/dashboard/AppShell";
import { axisProps, CHART, PIE_COLORS, tooltipStyle } from "@/components/dashboard/chart-theme";
import { KpiCard, Panel, PageHeader } from "@/components/dashboard/primitives";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/context/filters";
import { brl, num, pct } from "@/data/dataset";
import { computeKpis, countBy, insights, monthlySeries } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão Geral • Dashboard Comercial IEC" },
      {
        name: "description",
        content:
          "Panorama executivo dos leads da IEC em 2026: volume, propostas, conversões e origem dos contatos.",
      },
      { property: "og:title", content: "Visão Geral • Dashboard Comercial IEC" },
      {
        property: "og:description",
        content: "Panorama executivo dos leads, propostas e conversões da IEC em 2026.",
      },
    ],
  }),
  component: VisaoGeral,
});

const SERIES = [
  { key: "leads", label: "Leads" },
  { key: "propostas", label: "Propostas" },
  { key: "conversoes", label: "Conversões" },
] as const;

function VisaoGeral() {
  const { filtered, setFilter, filters } = useFilters();
  const [serie, setSerie] = useState<(typeof SERIES)[number]["key"]>("leads");

  const kpis = useMemo(() => computeKpis(filtered), [filtered]);
  const mensal = useMemo(() => monthlySeries(filtered), [filtered]);
  const origens = useMemo(() => countBy(filtered, "origem").slice(0, 8), [filtered]);
  const setores = useMemo(
    () => countBy(filtered, "setor").filter((s) => s.name !== "Não informado").slice(0, 8),
    [filtered],
  );
  const ins = useMemo(() => insights(filtered), [filtered]);

  return (
    <AppShell>
      <PageHeader
        title="Visão Geral"
        description="Panorama executivo da operação comercial IEC em 2026."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Total de Leads" value={num(kpis.totalLeads)} icon={Users} dark hint="Base completa 2026" />
        <KpiCard
          label="Leads no Período"
          value={num(kpis.leadsPeriodo)}
          icon={TrendingUp}
          highlight
          hint="Conforme filtros ativos"
        />
        <KpiCard label="Taxa de Conversão" value={pct(kpis.taxaConversao)} icon={Percent} hint="Conversões / propostas" />
        <KpiCard label="Propostas Enviadas" value={num(kpis.propostas)} icon={FileText} hint="Orçamentos e negociações" />
        <KpiCard label="Conversões" value={num(kpis.conversoes)} icon={CheckCircle2} hint="Negócios fechados" />
        <KpiCard
          label="Valor Gerado (ELEVA)"
          value={brl(kpis.valorTotal)}
          icon={Wallet}
          dark
          hint={`Ticket médio ${brl(kpis.ticketMedio)}`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          title="Evolução mensal"
          subtitle="Janeiro a setembro de 2026"
          className="xl:col-span-2"
          action={
            <div className="flex gap-1 rounded-md bg-secondary p-0.5">
              {SERIES.map((s) => (
                <Button
                  key={s.key}
                  size="sm"
                  variant={serie === s.key ? "default" : "ghost"}
                  className="h-7 px-3 text-[11px]"
                  onClick={() => setSerie(s.key)}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mensal} margin={{ left: -18, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gradSerie" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.accent} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={CHART.accent} stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.light} vertical={false} />
              <XAxis dataKey="mes" {...axisProps} />
              <YAxis {...axisProps} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey={serie}
                stroke={CHART.accent}
                strokeWidth={2.5}
                fill="url(#gradSerie)"
                activeDot={{ r: 5, fill: CHART.dark }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Origem do lead" subtitle="Clique para filtrar a origem">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={origens}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                onClick={(d: { name?: string }) => d?.name && setFilter("origem", d.name)}
                className="cursor-pointer outline-none"
              >
                {origens.map((o, i) => (
                  <Cell
                    key={o.name}
                    fill={PIE_COLORS[i % PIE_COLORS.length]}
                    stroke="var(--color-card)"
                    strokeWidth={2}
                    opacity={filters.origem === "todos" || filters.origem === o.name ? 1 : 0.35}
                  />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} cursor={false} />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={(v: string) => <span className="text-foreground">{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Distribuição por setor" subtitle="Top 8 segmentos do recorte atual">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={setores} layout="vertical" margin={{ left: 40, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.light} horizontal={false} />
              <XAxis type="number" {...axisProps} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={120} {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill={CHART.dark} radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Performance mensal" subtitle="Leads, propostas, conversões e taxa">
          <div className="overflow-x-auto scroll-slim">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] tracking-wider text-muted-foreground uppercase">
                  <th className="py-2">Mês</th>
                  <th className="py-2 text-right">Leads</th>
                  <th className="py-2 text-right">Propostas</th>
                  <th className="py-2 text-right">Conversões</th>
                  <th className="py-2 text-right">Taxa</th>
                </tr>
              </thead>
              <tbody>
                {mensal.map((m) => (
                  <tr key={m.key} className="border-b border-border last:border-0">
                    <td className="py-2.5 font-medium">{m.mes}</td>
                    <td className="py-2.5 text-right tabular-nums">{m.leads || "—"}</td>
                    <td className="py-2.5 text-right tabular-nums">{m.propostas || "—"}</td>
                    <td className="py-2.5 text-right tabular-nums">{m.conversoes || "—"}</td>
                    <td className="py-2.5 text-right font-semibold tabular-nums">
                      {m.propostas ? pct(m.taxa) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <Panel title="Principais insights" subtitle="Leitura automática do recorte filtrado" dark>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Insight icon={TrendingUp} label="Mês de pico" value={ins.pico ? `${ins.pico.mes} • ${ins.pico.leads} leads` : "—"} />
          <Insight icon={Award} label="Setor líder" value={ins.setor ? `${ins.setor.name} • ${ins.setor.value}` : "—"} />
          <Insight icon={Lightbulb} label="Produto mais demandado" value={ins.produto ? `${ins.produto.name} • ${ins.produto.value}` : "—"} />
          <Insight icon={MapPin} label="Estado com mais oportunidades" value={ins.estado ? `${ins.estado.name} • ${ins.estado.value}` : "—"} />
        </div>
      </Panel>
    </AppShell>
  );
}

function Insight({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3.5 transition-colors hover:border-accent/60">
      <div className="flex items-center gap-2 text-accent">
        <Icon className="h-4 w-4" />
        <span className="text-[10px] font-semibold tracking-[0.14em] uppercase">{label}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
