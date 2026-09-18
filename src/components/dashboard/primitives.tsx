import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
  dark,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5",
        dark && "border-white/10 bg-surface-dark text-surface-dark-foreground",
        className,
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div>
            {title && <h3 className="text-sm font-semibold tracking-tight">{title}</h3>}
            {subtitle && (
              <p className={cn("mt-0.5 text-xs", dark ? "text-white/55" : "text-muted-foreground")}>
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  highlight,
  dark,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  highlight?: boolean;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        dark
          ? "border-white/10 bg-surface-dark text-surface-dark-foreground"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "text-[11px] font-semibold tracking-[0.12em] uppercase",
            dark ? "text-white/55" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            "rounded-md p-1.5 transition-colors",
            highlight
              ? "bg-accent text-accent-foreground"
              : dark
                ? "bg-white/10 text-white"
                : "bg-secondary text-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p
        className={cn(
          "mt-3 text-2xl font-semibold tracking-tight tabular-nums",
          highlight && "text-accent",
        )}
      >
        {value}
      </p>
      {hint && (
        <p className={cn("mt-1 text-xs", dark ? "text-white/50" : "text-muted-foreground")}>
          {hint}
        </p>
      )}
      <div className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
      {message}
    </div>
  );
}
