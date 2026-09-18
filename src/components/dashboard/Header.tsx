import { CircleDot, Menu, RefreshCw } from "lucide-react";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MESES } from "@/data/dataset";
import { useFilters } from "@/context/filters";

const LOGO =
  "https://static.wixstatic.com/media/afea31_0cf0038e36f34b86af61965e302e98fc~mv2.png/v1/fill/w_201,h_46,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2_edited.png";

export function Header() {
  const { filters, setFilter, refresh, refreshedAt } = useFilters();

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-dark text-surface-dark-foreground">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-surface-dark-foreground hover:bg-white/10 hover:text-accent lg:hidden"
              aria-label="Abrir navegação"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-0 bg-sidebar p-0">
            <SheetTitle className="sr-only">Navegação</SheetTitle>
            <Sidebar />
          </SheetContent>
        </Sheet>

        <img src={LOGO} alt="IEC" className="h-7 w-auto shrink-0" />

        <div className="hidden h-8 w-px bg-white/15 sm:block" />

        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold tracking-tight sm:text-base">
            Dashboard Comercial
          </h1>
          <p className="hidden truncate text-xs text-white/55 sm:block">
            Gestão de Leads e Indicadores
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Select value={filters.mes} onValueChange={(v) => setFilter("mes", v)}>
            <SelectTrigger
              size="sm"
              className="w-[130px] border-white/20 bg-white/5 text-xs text-white data-[placeholder]:text-white/60"
            >
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todo o período</SelectItem>
              {MESES.map((m) => (
                <SelectItem key={m.key} value={m.key}>
                  {m.label} 2026
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={refresh}
            aria-label="Atualizar dados"
            className="text-surface-dark-foreground hover:bg-white/10 hover:text-accent"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <div className="hidden items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 md:flex">
            <CircleDot className="h-3.5 w-3.5 text-accent" />
            <span className="text-[11px] font-medium text-white/80">
              Dados atualizados • 2026
            </span>
          </div>
        </div>
      </div>
      <div className="h-0.5 w-full bg-accent" />
      <span className="sr-only">
        Última atualização: {refreshedAt.toLocaleString("pt-BR")}
      </span>
    </header>
  );
}
