/* eslint-disable prettier/prettier */
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Brain,
  Home,
  LayoutDashboard,
  Bookmark,
  Search,
  Settings,
  Hash,
  Plus,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/search", label: "Search", icon: Search },
  { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const topics = useStore((s) => s.topics);

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/";
    return to === "/dashboard" ? pathname === to : pathname.startsWith(to);
  };

  const isTopicActive = (slug: string) => pathname === `/topic/${slug}`;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur-xl md:flex">
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
          <Brain className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight">StudySync</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* Main */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
                  strokeWidth={2}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Topics */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between px-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Hash className="h-3 w-3" />
              Topics
            </div>
            <button className="grid h-5 w-5 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-0.5">
            {topics.map((t) => {
              const active = isTopicActive(t.slug);
              return (
                <Link
                  key={t.slug}
                  to="/topic/$slug"
                  params={{ slug: t.slug }}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors ${
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: `var(${t.tagVar})` }}
                  />
                  <span className="flex-1 truncate font-medium">{t.shortName}</span>
                  <span className="text-[10.5px] tabular-nums text-muted-foreground">
                    {t.highlightsCount}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg bg-gradient-card p-3 shadow-sm">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-[12px] font-semibold text-primary-foreground">
            AR
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold tracking-tight">Aarav Rao</p>
            <p className="truncate text-[11px] text-muted-foreground">Pro plan</p>
          </div>
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
      </div>
    </aside>
  );
}
