import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Bell, Sparkles } from "lucide-react";

export function TopBar({
  title,
  subtitle,
  actions,
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-6">
        <div className="min-w-0 flex-1">
          {title ? (
            <>
              <h1 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
                {title}
              </h1>
              {subtitle ? (
                <p className="truncate text-[11.5px] text-muted-foreground">{subtitle}</p>
              ) : null}
            </>
          ) : null}
        </div>
        <Link
          to="/search"
          className="hidden h-9 w-72 items-center gap-2 rounded-lg border border-border bg-card px-3 text-[12.5px] text-muted-foreground shadow-sm transition-colors hover:bg-secondary md:flex"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 truncate text-left">Search across your knowledge base…</span>
          <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </Link>
        {actions}
        <button className="hidden h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:grid">
          <Bell className="h-4 w-4" />
        </button>
        <button className="hidden h-9 items-center gap-1.5 rounded-lg bg-gradient-primary px-3 text-[12.5px] font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] sm:flex">
          <Sparkles className="h-3.5 w-3.5" />
          New summary
        </button>
      </div>
    </header>
  );
}