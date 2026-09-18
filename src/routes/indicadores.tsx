import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/dashboard/AppShell";
import { axisProps, CHART, tooltipStyle } from "@/components/dashboard/chart-theme";
import { PageHeader, Panel } from "@/components/dashboard/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INDICADORES_CO, INDICADORES_IEC, type Indicador } from "@/data/dataset";

export const Route = createFileRoute("/indicadores")({
  head: () => ({
    meta: [
      { title: "Indicadores • Dashboard Comercial IEC" },
      {
        name: "description",
        content: "Metas versus realizado de contato e conversão para as operações IEC e CO em 2026.",
      },
      { property: "og:title", content: "Indicadores • Dashboard Comercial IEC" },
      {
        property: "og:description",
        content: "Comparativo de metas e resultados mensais das operações IEC e CO.",
      },
    ],
  }),
  component: IndicadoresPage,
});

function Bloco({ dados, nome }: { dados: Indicador[]; nome: string }) {
  const chart = dados.map((d) => ({
    mes: d.mes,
    metaContato: d.contatoMeta ?? 0,
    realizadoContato: d.contatoRealizado ?? 0,
    metaConversao: d.conversaoMeta ?? 0,
    realizadoConversao: d.conversaoRealizado ?? 0,
  }));

  return (
    <div className="space-y-4">
      <Panel title={`Contato — ${nome}`} subtitle="Meta x realizado por mês">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chart} margin={{ left: -18, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.light} vertical={false} />
            <XAxis dataKey="mes" {...axisProps} />
            <YAxis {...axisProps} allowDecimals={false} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="metaContato" name="Meta" fill={CHART.dark} radius={[4, 4, 0, 0]} barSize={16} />
            <Bar
              dataKey="realizadoContato"
              name="Realizado"
              fill={CHART.accent}
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title={`Tabela de indicadores — ${nome}`} subtitle="Valores conforme planilha oficial">
        <div className="overflow-x-auto scroll-slim">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] tracking-wider text-muted-foreground uppercase">
                <th className="py-2">Mês</th>
                <th className="py-2 text-right">Meta contato</th>
                <th className="py-2 text-right">Realizado contato</th>
                <th className="py-2 text-right">Meta conversão</th>
                <th className="py-2 text-right">Realizado conversão</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((d) => {
                const atingiu =
                  d.contatoMeta != null && d.contatoRealizado != null && d.contatoRealizado >= d.contatoMeta;
                return (
                  <tr key={d.mes} className="border-b border-border last:border-0">
                    <td className="py-2.5 font-medium">{d.mes}</td>
                    <td className="py-2.5 text-right tabular-nums">{d.contatoMeta ?? "—"}</td>
                    <td
                      className={
                        atingiu
                          ? "py-2.5 text-right font-semibold tabular-nums text-accent"
                          : "py-2.5 text-right tabular-nums"
                      }
                    >
                      {d.contatoRealizado ?? "—"}
                    </td>
                    <td className="py-2.5 text-right tabular-nums">{d.conversaoMeta ?? "—"}</td>
                    <td className="py-2.5 text-right tabular-nums">{d.conversaoRealizado ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function IndicadoresPage() {
  return (
    <AppShell>
      <PageHeader title="Indicadores" description="Metas x realizado das operações IEC e CO." />
      <Tabs defaultValue="iec">
        <TabsList>
          <TabsTrigger value="iec">IEC</TabsTrigger>
          <TabsTrigger value="co">CO</TabsTrigger>
        </TabsList>
        <TabsContent value="iec" className="mt-4">
          <Bloco dados={INDICADORES_IEC} nome="IEC" />
        </TabsContent>
        <TabsContent value="co" className="mt-4">
          <Bloco dados={INDICADORES_CO} nome="CO" />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
