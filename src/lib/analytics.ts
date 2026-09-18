import {
  LEADS,
  MESES,
  MATRICULADOS_ELEVA,
  STATUS_CONVERTIDO,
  STATUS_PROPOSTA,
  type Lead,
} from "@/data/dataset";

export type Filters = {
  mes: string;
  responsavel: string;
  produto: string;
  setor: string;
  estado: string;
  origem: string;
  status: string;
  busca: string;
};

export const EMPTY_FILTERS: Filters = {
  mes: "todos",
  responsavel: "todos",
  produto: "todos",
  setor: "todos",
  estado: "todos",
  origem: "todos",
  status: "todos",
  busca: "",
};

export const FILTER_LABELS: Record<keyof Filters, string> = {
  mes: "Período",
  responsavel: "Responsável",
  produto: "Produto",
  setor: "Setor",
  estado: "Estado",
  origem: "Origem",
  status: "Status",
  busca: "Busca",
};

export function applyFilters(filters: Filters, leads: Lead[] = LEADS): Lead[] {
  const q = filters.busca.trim().toLowerCase();
  return leads.filter((l) => {
    if (filters.mes !== "todos" && l.mes !== filters.mes) return false;
    if (filters.responsavel !== "todos" && l.responsavel !== filters.responsavel) return false;
    if (filters.produto !== "todos" && l.produto !== filters.produto) return false;
    if (filters.setor !== "todos" && l.setor !== filters.setor) return false;
    if (filters.estado !== "todos" && l.estado !== filters.estado) return false;
    if (filters.origem !== "todos" && l.origem !== filters.origem) return false;
    if (filters.status !== "todos" && l.status !== filters.status) return false;
    if (q) {
      const hay = `${l.empresa} ${l.responsavel} ${l.email ?? ""} ${l.telefone ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export const isProposta = (l: Lead) => STATUS_PROPOSTA.includes(l.status);
export const isConvertido = (l: Lead) => STATUS_CONVERTIDO.includes(l.status);

export const valorTotalEleva = MATRICULADOS_ELEVA.reduce((s, m) => s + m.valorTotal, 0);
export const parcelasEleva = MATRICULADOS_ELEVA.reduce((s, m) => s + m.parcelas, 0);
export const ticketMedioEleva = MATRICULADOS_ELEVA.length
  ? valorTotalEleva / MATRICULADOS_ELEVA.length
  : 0;

export type Kpis = {
  totalLeads: number;
  leadsPeriodo: number;
  propostas: number;
  conversoes: number;
  taxaConversao: number;
  valorTotal: number;
  ticketMedio: number;
};

export function computeKpis(filtered: Lead[]): Kpis {
  const propostas = filtered.filter(isProposta).length;
  const conversoes = filtered.filter(isConvertido).length;
  return {
    totalLeads: LEADS.length,
    leadsPeriodo: filtered.length,
    propostas,
    conversoes,
    taxaConversao: propostas ? (conversoes / propostas) * 100 : 0,
    valorTotal: valorTotalEleva,
    ticketMedio: ticketMedioEleva,
  };
}

export function countBy(leads: Lead[], key: keyof Lead) {
  const map = new Map<string, number>();
  for (const l of leads) {
    const k = (l[key] as string) || "Não informado";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function monthlySeries(leads: Lead[]) {
  return MESES.map((m) => {
    const rows = leads.filter((l) => l.mes === m.key);
    const propostas = rows.filter(isProposta).length;
    const conversoes = rows.filter(isConvertido).length;
    return {
      mes: m.label,
      key: m.key,
      leads: rows.length,
      propostas,
      conversoes,
      taxa: propostas ? Number(((conversoes / propostas) * 100).toFixed(1)) : 0,
    };
  });
}

export function rankingResponsaveis(leads: Lead[], limit = 10) {
  const map = new Map<string, { name: string; leads: number; propostas: number; conversoes: number }>();
  for (const l of leads) {
    const cur = map.get(l.responsavel) ?? {
      name: l.responsavel,
      leads: 0,
      propostas: 0,
      conversoes: 0,
    };
    cur.leads += 1;
    if (isProposta(l)) cur.propostas += 1;
    if (isConvertido(l)) cur.conversoes += 1;
    map.set(l.responsavel, cur);
  }
  return Array.from(map.values())
    .sort((a, b) => b.leads - a.leads)
    .slice(0, limit);
}

export function estadoBreakdown(leads: Lead[]) {
  const map = new Map<string, Lead[]>();
  for (const l of leads) {
    const arr = map.get(l.estado) ?? [];
    arr.push(l);
    map.set(l.estado, arr);
  }
  return Array.from(map, ([uf, rows]) => ({ uf, total: rows.length, rows })).sort(
    (a, b) => b.total - a.total,
  );
}

export function insights(leads: Lead[]) {
  const months = monthlySeries(leads).filter((m) => m.leads > 0);
  const pico = months.slice().sort((a, b) => b.leads - a.leads)[0];
  const setor = countBy(leads, "setor").filter((s) => s.name !== "Não informado")[0];
  const produto = countBy(leads, "produto").filter((s) => s.name !== "Não informado")[0];
  const estado = countBy(leads, "estado").filter((s) => s.name !== "ND")[0];
  const origem = countBy(leads, "origem").filter((s) => s.name !== "Não informado")[0];
  return { pico, setor, produto, estado, origem };
}
