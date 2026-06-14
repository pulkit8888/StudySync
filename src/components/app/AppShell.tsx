import { type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { Toaster } from "@/components/ui/sooner";

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background">
      <Toaster position="bottom-right" />
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar title={title} subtitle={subtitle} actions={actions} />
          <main className="flex-1">
            <div className="mx-auto w-full max-w-7xl px-6 py-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
