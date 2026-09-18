import type { ReactNode } from "react";

import { FilterBar } from "@/components/dashboard/FilterBar";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-sidebar-border lg:block">
          <Sidebar />
        </aside>
        <main className="min-w-0 flex-1">
          <FilterBar />
          <div className="space-y-5 p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
