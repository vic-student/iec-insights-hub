import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Filter,
  GaugeCircle,
  GraduationCap,
  LayoutDashboard,
  MapPinned,
  Users,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Visão Geral", icon: LayoutDashboard },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/conversao", label: "Conversão & Funil", icon: Filter },
  { to: "/comercial", label: "Análise Comercial", icon: BarChart3 },
  { to: "/eleva", label: "ELEVA", icon: GraduationCap },
  { to: "/indicadores", label: "Indicadores", icon: GaugeCircle },
  { to: "/localizacao", label: "Localização", icon: MapPinned },
] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex h-full flex-col gap-1 bg-sidebar p-3 text-sidebar-foreground">
      <p className="px-3 pt-2 pb-3 text-[10px] font-semibold tracking-[0.18em] text-sidebar-foreground/45 uppercase">
        Navegação
      </p>
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
          activeProps={{
            className:
              "!bg-sidebar-accent !text-sidebar-primary border-l-2 border-sidebar-primary pl-[10px]",
          }}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{label}</span>
        </Link>
      ))}
      <div className="mt-auto rounded-md border border-sidebar-border p-3">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-sidebar-primary uppercase">
          IEC 2026
        </p>
        <p className="mt-1 text-xs text-sidebar-foreground/60">
          Inteligência comercial e gestão de leads.
        </p>
      </div>
    </nav>
  );
}
