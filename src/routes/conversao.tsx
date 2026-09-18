import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, FileText, Percent, Users } from "lucide-react";
import { useMemo } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/dashboard/AppShell";
import { axisProps, CHART, tooltipStyle } from "@/components/dashboard/chart-theme";
import { KpiCard, PageHeader, Panel } from "@/components/dashboard/primitives";
import { useFilters } from "@/context/filters";
import { num, pct } from "@/data/dataset";
import { computeKpis, countBy, monthlySeries } from "@/lib/analytics";

export const Route = createFileRoute("/conversao")({
  head: () => ({
    meta: [
      { title: "Conversão & Funil • Dashboard Comercial IEC" },
      {
        name: "description",
        content: "Funil comercial da IEC: leads, contatos, propostas e conversões mês a mês.",
      },
      { property: "og:title", content: "Conversão & Funil • Dashboard Comercial IEC" },
      {
        property: "og:description",
        content: "Acompanhe o funil comercial da IEC do primeiro contato à conversão.",
      },
    ],
  }),
  component: ConversaoPage,
});

function ConversaoPage() {
  const { filtered } = useFilters();
  const kpis = useMemo(() => computeKpis(filtered), [filtered]);
  const mensal = useMemo(() => monthlySeries(filtered), [filtered]);

  const etapas = useMemo(() => {
    const contatados = filtered.filter((l) => l.status !== "Sem Status").length;
    return [
      { etapa: "Leads captados", total: filtered.length },
      { etapa: "Em contato", total: contatados },
      { etapa: "Propostas enviadas", total: kpis.propostas },
      { etapa: "Conversões", total: kpis.conversoes },
    ];
  }, [filtered, kpis]);

  const perdas = useMemo(
    () => countBy(filtered, "status").filter((s) => ["Reprovado", "Churn", "Sondagem"].includes(s.name)),
    [filtered],
  );

  const base = etapas[0]?.total || 1;

  return (
    <AppShell>
      <PageHeader title="Conversão & Funil" description="Do primeiro contato ao fechamento." />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Leads" value={num(kpis.leadsPeriodo)} icon={Users} />
        <KpiCard label="Propostas" value={num(kpis.propostas)} icon={FileText} />
        <KpiCard label="Conversões" value={num(kpis.conversoes)} icon={CheckCircle2} dark />
        <KpiCard label="Taxa de conversão" value={pct(kpis.taxaConversao)} icon={Percent} highlight />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Funil comercial" subtitle="Volume por etapa no recorte atual">
          <div className="space-y-3">
            {etapas.map((e, i) => {
              const share = (e.total / base) * 100;
              return (
                <div key={e.etapa}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{e.etapa}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {num(e.total)} • {pct(share)}
                    </span>
                  </div>
                  <div className="h-8 w-full overflow-hidden rounded-md bg-secondary">
                    <div
                      className={
                        i === etapas.length - 1
                          ? "h-full rounded-md bg-accent transition-all duration-700"
                          : "h-full rounded-md bg-foreground transition-all duration-700"
                      }
                      style={{ width: `${Math.max(share, 1.5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Taxa de conversão mensal" subtitle="Conversões sobre propostas enviadas">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={mensal} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.light} vertical={false} />
              <XAxis dataKey="mes" {...axisProps} />
              <YAxis {...axisProps} unit="%" />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="taxa"
                stroke={CHART.accent}
                strokeWidth={3}
                dot={{ r: 4, fill: CHART.dark }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="Propostas x Conversões por mês" subtitle="Comparativo direto">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mensal} margin={{ left: -18, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.light} vertical={false} />
            <XAxis dataKey="mes" {...axisProps} />
            <YAxis {...axisProps} allowDecimals={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="propostas" name="Propostas" fill={CHART.dark} radius={[4, 4, 0, 0]} barSize={18} />
            <Bar dataKey="conversoes" name="Conversões" fill={CHART.accent} radius={[4, 4, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Pontos de atenção" subtitle="Status que indicam risco ou perda">
        <div className="grid gap-3 sm:grid-cols-3">
          {perdas.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum registro de perda no recorte atual.</p>
          )}
          {perdas.map((p) => (
            <div key={p.name} className="rounded-lg border border-border p-3">
              <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                {p.name}
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{p.value}</p>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
