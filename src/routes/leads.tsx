import { createFileRoute } from "@tanstack/react-router";
import { Building2, Mail, Phone, Users } from "lucide-react";
import { useMemo } from "react";

import { AppShell } from "@/components/dashboard/AppShell";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { KpiCard, PageHeader, Panel } from "@/components/dashboard/primitives";
import { useFilters } from "@/context/filters";
import { num, pct } from "@/data/dataset";
import { countBy } from "@/lib/analytics";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Leads • Dashboard Comercial IEC" },
      {
        name: "description",
        content: "Base completa de leads da IEC com busca, ordenação, exportação e ficha detalhada.",
      },
      { property: "og:title", content: "Leads • Dashboard Comercial IEC" },
      {
        property: "og:description",
        content: "Explore a base completa de leads da IEC com filtros e ficha detalhada.",
      },
    ],
  }),
  component: LeadsPage,
});

function LeadsPage() {
  const { filtered } = useFilters();

  const stats = useMemo(() => {
    const comTelefone = filtered.filter((l) => !!l.telefone).length;
    const comEmail = filtered.filter((l) => !!l.email).length;
    const empresas = new Set(filtered.map((l) => l.empresa)).size;
    return { comTelefone, comEmail, empresas };
  }, [filtered]);

  const statusDist = useMemo(() => countBy(filtered, "status"), [filtered]);

  return (
    <AppShell>
      <PageHeader
        title="Leads"
        description="Análise aprofundada e base completa de contatos comerciais."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Leads filtrados" value={num(filtered.length)} icon={Users} highlight />
        <KpiCard label="Empresas únicas" value={num(stats.empresas)} icon={Building2} />
        <KpiCard
          label="Com telefone"
          value={num(stats.comTelefone)}
          icon={Phone}
          hint={filtered.length ? pct((stats.comTelefone / filtered.length) * 100) : "—"}
        />
        <KpiCard
          label="Com e-mail"
          value={num(stats.comEmail)}
          icon={Mail}
          hint={filtered.length ? pct((stats.comEmail / filtered.length) * 100) : "—"}
        />
      </div>

      <Panel title="Distribuição por status" subtitle="Situação atual dos leads filtrados">
        <div className="flex flex-wrap gap-2">
          {statusDist.map((s) => (
            <div
              key={s.name}
              className="rounded-lg border border-border bg-secondary/50 px-3 py-2 transition-colors hover:border-accent"
            >
              <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                {s.name}
              </p>
              <p className="text-lg font-semibold tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
      </Panel>

      <LeadsTable leads={filtered} />
    </AppShell>
  );
}
