import raw from "./dataset.json";

export type Lead = {
  id: number;
  mes: string;
  mesIndex: number;
  aba: string;
  empresa: string;
  responsavel: string;
  telefone: string | null;
  email: string | null;
  produto: string;
  setor: string;
  estado: string;
  cidade: string | null;
  cargo: string | null;
  origem: string;
  dataPrimeiroContato: string | null;
  dataSegundoContato: string | null;
  status: string;
  observacao: string | null;
};

export type Indicador = {
  mes: string;
  contatoMeta: number | null;
  contatoRealizado: number | null;
  conversaoMeta: number | null;
  conversaoRealizado: number | null;
};

export type ProspectEleva = {
  empresa: string;
  responsavel: string;
  origem: string | null;
  telefone: string | null;
  status: string;
  observacao: string | null;
};

export type MatriculadoEleva = {
  empresa: string;
  responsavel: string;
  turma: string | null;
  telefone: string | null;
  email: string | null;
  produto: string;
  valorTotal: number;
  parcelas: number;
  valorParcela: number;
  observacao: string | null;
};

type Dataset = {
  leads: Lead[];
  indicadoresIEC: Indicador[];
  indicadoresCO: Indicador[];
  prospectsEleva: ProspectEleva[];
  matriculadosEleva: MatriculadoEleva[];
};

export const dataset = raw as unknown as Dataset;

export const LEADS = dataset.leads;
export const INDICADORES_IEC = dataset.indicadoresIEC;
export const INDICADORES_CO = dataset.indicadoresCO;
export const PROSPECTS_ELEVA = dataset.prospectsEleva;
export const MATRICULADOS_ELEVA = dataset.matriculadosEleva;

export const MESES = [
  { key: "JAN/FEV", label: "Jan & Fev", index: 2 },
  { key: "MAR", label: "Março", index: 3 },
  { key: "ABR", label: "Abril", index: 4 },
  { key: "MAI", label: "Maio", index: 5 },
  { key: "JUN", label: "Junho", index: 6 },
  { key: "JUL", label: "Julho", index: 7 },
  { key: "AGO", label: "Agosto", index: 8 },
  { key: "SET", label: "Setembro", index: 9 },
];

export const STATUS_PROPOSTA = ["Orçamento Enviado", "Em Negociação"];
export const STATUS_CONVERTIDO = ["Convertido"];

const uniqSorted = (values: (string | null)[]) =>
  Array.from(new Set(values.filter((v): v is string => !!v))).sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );

export const OPCOES = {
  responsaveis: uniqSorted(LEADS.map((l) => l.responsavel)),
  produtos: uniqSorted(LEADS.map((l) => l.produto)),
  setores: uniqSorted(LEADS.map((l) => l.setor)),
  estados: uniqSorted(LEADS.map((l) => l.estado)),
  origens: uniqSorted(LEADS.map((l) => l.origem)),
  status: uniqSorted(LEADS.map((l) => l.status)),
};

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

export const num = (v: number) => v.toLocaleString("pt-BR");

export const pct = (v: number) => `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
