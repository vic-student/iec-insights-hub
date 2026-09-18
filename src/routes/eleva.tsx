import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Layers, Percent, Users, Wallet } from "lucide-react";

import { AppShell } from "@/components/dashboard/AppShell";
import { KpiCard, PageHeader, Panel } from "@/components/dashboard/primitives";
import { brl, MATRICULADOS_ELEVA, num, pct, PROSPECTS_ELEVA } from "@/data/dataset";
import { parcelasEleva, ticketMedioEleva, valorTotalEleva } from "@/lib/analytics";

export const Route = createFileRoute("/eleva")({
  head: () => ({
    meta: [
      { title: "ELEVA • Dashboard Comercial IEC" },
      {
        name: "description",
        content: "Programa ELEVA: prospects, matriculados, receita e condições de pagamento.",
      },
      { property: "og:title", content: "ELEVA • Dashboard Comercial IEC" },
      {
        property: "og:description",
        content: "Funil e resultado financeiro do programa ELEVA da IEC.",
      },
    ],
  }),
  component: ElevaPage,
});

function ElevaPage() {
  const prospects = PROSPECTS_ELEVA.length;
  const matriculados = MATRICULADOS_ELEVA.length;
  const taxa = prospects ? (matriculados / prospects) * 100 : 0;

  return (
    <AppShell>
      <PageHeader title="ELEVA" description="Módulo dedicado ao programa ELEVA." />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Prospects" value={num(prospects)} icon={Users} />
        <KpiCard label="Matriculados" value={num(matriculados)} icon={GraduationCap} highlight />
        <KpiCard label="Prospect → Matrícula" value={pct(taxa)} icon={Percent} />
        <KpiCard label="Valor total" value={brl(valorTotalEleva)} icon={Wallet} dark />
        <KpiCard label="Ticket médio" value={brl(ticketMedioEleva)} icon={Wallet} />
        <KpiCard label="Total de parcelas" value={num(parcelasEleva)} icon={Layers} />
      </div>

      <Panel title="Funil ELEVA" subtitle="Prospects captados até a matrícula efetivada">
        <div className="space-y-3">
          {[
            { etapa: "Prospects", total: prospects },
            { etapa: "Matriculados", total: matriculados },
          ].map((e, i) => (
            <div key={e.etapa}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium">{e.etapa}</span>
                <span className="tabular-nums text-muted-foreground">{num(e.total)}</span>
              </div>
              <div className="h-9 w-full overflow-hidden rounded-md bg-secondary">
                <div
                  className={i === 0 ? "h-full bg-foreground" : "h-full bg-accent"}
                  style={{ width: `${Math.max((e.total / (prospects || 1)) * 100, 2)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Matriculados" subtitle="Detalhamento financeiro por matrícula">
        <div className="overflow-x-auto scroll-slim">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-dark text-[10px] tracking-wider text-surface-dark-foreground uppercase">
                <th className="px-3 py-2.5">Empresa</th>
                <th className="px-3 py-2.5">Responsável</th>
                <th className="px-3 py-2.5">Telefone</th>
                <th className="px-3 py-2.5">Produto</th>
                <th className="px-3 py-2.5 text-right">Valor total</th>
                <th className="px-3 py-2.5 text-right">Parcelas</th>
                <th className="px-3 py-2.5 text-right">Valor parcela</th>
                <th className="px-3 py-2.5">Observações</th>
              </tr>
            </thead>
            <tbody>
              {MATRICULADOS_ELEVA.map((m, i) => (
                <tr key={`${m.empresa}-${i}`} className="border-b border-border last:border-0 hover:bg-accent/10">
                  <td className="px-3 py-2.5 font-medium">{m.empresa}</td>
                  <td className="px-3 py-2.5">{m.responsavel}</td>
                  <td className="px-3 py-2.5 tabular-nums">{m.telefone ?? "—"}</td>
                  <td className="px-3 py-2.5">{m.produto}</td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{brl(m.valorTotal)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{m.parcelas || "—"}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{brl(m.valorParcela)}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{m.observacao ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Prospects ELEVA" subtitle={`${prospects} contatos na base do programa`}>
        <div className="max-h-[420px] overflow-y-auto scroll-slim">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border text-[10px] tracking-wider text-muted-foreground uppercase">
                <th className="py-2">Empresa</th>
                <th className="py-2">Responsável</th>
                <th className="py-2">Telefone</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {PROSPECTS_ELEVA.map((p, i) => (
                <tr key={`${p.empresa}-${i}`} className="border-b border-border last:border-0">
                  <td className="py-2 font-medium">{p.empresa}</td>
                  <td className="py-2">{p.responsavel}</td>
                  <td className="py-2 tabular-nums">{p.telefone ?? "—"}</td>
                  <td className="py-2">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}
