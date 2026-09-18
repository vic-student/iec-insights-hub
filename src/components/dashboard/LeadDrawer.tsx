import { Building2, Mail, MapPin, Phone, Tag, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Lead } from "@/data/dataset";

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="border-b border-border py-2.5 last:border-0">
      <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm break-words text-foreground">{value || "—"}</p>
    </div>
  );
}

export function LeadDrawer({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  return (
    <Sheet open={!!lead} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md scroll-slim">
        {lead && (
          <>
            <SheetHeader className="bg-surface-dark p-5 text-surface-dark-foreground">
              <SheetTitle className="text-base text-white">{lead.empresa}</SheetTitle>
              <SheetDescription className="text-white/60">
                {lead.responsavel} • {lead.mes} 2026
              </SheetDescription>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge className="bg-accent text-accent-foreground hover:bg-accent">{lead.status}</Badge>
                <Badge variant="outline" className="border-white/25 text-white/80">
                  {lead.origem}
                </Badge>
              </div>
            </SheetHeader>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                <InfoTile icon={Phone} label="Telefone" value={lead.telefone} />
                <InfoTile icon={Mail} label="E-mail" value={lead.email} />
                <InfoTile icon={MapPin} label="Local" value={[lead.cidade, lead.estado].filter(Boolean).join(" • ")} />
                <InfoTile icon={Tag} label="Produto" value={lead.produto} />
              </div>
              <div className="mt-4">
                <Field label="Setor / Segmento" value={lead.setor} />
                <Field label="Cargo" value={lead.cargo} />
                <Field label="Origem do lead" value={lead.origem} />
                <Field label="Data primeiro contato" value={lead.dataPrimeiroContato} />
                <Field label="Data segundo contato" value={lead.dataSegundoContato} />
                <Field label="Status" value={lead.status} />
                <Field label="Observação" value={lead.observacao} />
                <Field label="Aba de origem" value={lead.aba} />
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2 | typeof User;
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase">{label}</span>
      </div>
      <p className="mt-1 text-xs break-words text-foreground">{value || "—"}</p>
    </div>
  );
}
