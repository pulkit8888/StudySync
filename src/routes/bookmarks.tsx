import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { TopicChip } from "@/routes/dashboard";
import { relativeTime, type TopicSlug } from "@/lib/mock-data";
import { storeActions, useStore } from "@/lib/store";
import { topicColor } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Globe, Bookmark, Sparkles, PenLine, Trash2 } from "lucide-react";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Bookmarks — StudySync" },
      { name: "description", content: "Every highlight you've saved, beautifully organized." },
    ],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const highlights = useStore((s) => s.highlights);
  const topics = useStore((s) => s.topics);
  const [topicFilter, setTopicFilter] = useState<TopicSlug | "all">("all");
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<string>("all");
  const [pending, setPending] = useState<string | null>(null);

  const domains = useMemo(
    () => Array.from(new Set(highlights.map((h) => h.source.domain))),
    [highlights],
  );

  const filtered = useMemo(
    () =>
      highlights
        .filter((h) => topicFilter === "all" || h.topicSlug === topicFilter)
        .filter((h) => domain === "all" || h.source.domain === domain)
        .filter((h) => h.text.toLowerCase().includes(query.toLowerCase())),
    [highlights, topicFilter, domain, query],
  );

  return (
    <AppShell title="Bookmarks" subtitle={`${highlights.length} saved highlights across your second brain`}>
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-64">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 shadow-sm">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search highlights…"
                className="h-6 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground/70"
              />
            </div>

            <FilterGroup label="Topic">
              <FilterPill
                active={topicFilter === "all"}
                onClick={() => setTopicFilter("all")}
                label="All topics"
                count={highlights.length}
              />
              {topics.map((t) => {
                const n = highlights.filter((h) => h.topicSlug === t.slug).length;
                return (
                  <FilterPill
                    key={t.slug}
                    active={topicFilter === t.slug}
                    onClick={() => setTopicFilter(t.slug)}
                    label={t.shortName}
                    count={n}
                    dotVar={t.tagVar}
                  />
                );
              })}
            </FilterGroup>

            <FilterGroup label="Source">
              <FilterPill
                active={domain === "all"}
                onClick={() => setDomain("all")}
                label="All sources"
              />
              {domains.map((d) => (
                <FilterPill
                  key={d}
                  active={domain === d}
                  onClick={() => setDomain(d)}
                  label={d}
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Date">
              {["Today", "This week", "This month", "All time"].map((d, i) => (
                <FilterPill key={d} active={i === 3} onClick={() => {}} label={d} />
              ))}
            </FilterGroup>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] text-muted-foreground">
              <span className="font-medium text-foreground">{filtered.length}</span> highlights
            </p>
          </div>

          <div className="space-y-3">
            {filtered.map((h) => {
              const topic = topics.find((t) => t.slug === h.topicSlug);
              if (!topic) return null;
              return (
                <article
                  key={h.id}
                  className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <TopicChip topic={topic} />
                    <span className="text-[11px] text-muted-foreground">·</span>
                    <span className="text-[11px] text-muted-foreground">{h.source.domain}</span>
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      {relativeTime(h.createdAt)}
                    </span>
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-foreground/90">{h.text}</p>
                  <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-[11.5px] text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    <span className="truncate">{h.source.title}</span>
                    <div className="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <IconBtn icon={Sparkles} label="Summarize" />
                      <IconBtn icon={PenLine} label="Add note" />
                      <IconBtn icon={Bookmark} label="Saved" />
                      <IconBtn
                        icon={Trash2}
                        label="Delete"
                        onClick={() => setPending(h.id)}
                        destructive
                      />
                    </div>
                  </div>
                </article>
              );
            })}
            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-[12.5px] text-muted-foreground">
                No highlights match your filters.
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this highlight?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The highlight will be removed from your second brain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pending) storeActions.deleteHighlight(pending);
                setPending(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="mb-1.5 px-1 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  dotVar,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  dotVar?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[12px] transition-colors ${
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      }`}
    >
      {dotVar ? (
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: topicColor(dotVar) }} />
      ) : null}
      <span className="flex-1 truncate text-left font-medium">{label}</span>
      {typeof count === "number" ? (
        <span className="text-[10.5px] tabular-nums text-muted-foreground">{count}</span>
      ) : null}
    </button>
  );
}

function IconBtn({
  icon: Icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`grid h-7 w-7 place-items-center rounded-md transition-colors ${
        destructive
          ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
