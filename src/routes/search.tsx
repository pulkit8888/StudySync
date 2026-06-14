import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { TopicChip } from "@/routes/dashboard";
import { relativeTime } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { topicColor } from "@/lib/utils";
import { storeActions } from "@/lib/store";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Ellipsis,
  Pencil,
  Trash2,
  Sparkles,
  Search as SearchIcon,
  PenLine,
  Globe,
  Hash,
  BookmarkIcon,
} from "lucide-react";

import {
  deleteStoredBookmark,
  loadStoredBookmarks,
  saveAllStoredBookmarks,
} from "@/lib/bookmark-storage";
import { loadStoredSavedSummaries, saveAllStoredSavedSummaries } from "@/lib/saved-summary-storage";
import { HighlightCardMenu, NoteCardMenu, SummaryCardMenu } from "./search-actions";

type Kind = "all" | "highlight" | "summary" | "note" | "topic" | "source";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — StudySync" },
      { name: "description", content: "Search across your entire knowledge base." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<Kind>("all");

  const HIGHLIGHTS = useStore((s) => s.highlights);
  const SUMMARIES = useStore((s) => s.summaries);
  const NOTES = useStore((s) => s.notes);
  const TOPICS = useStore((s) => s.topics);

  const norm = q.trim().toLowerCase();

  const highlightHits = useMemo(
    () => HIGHLIGHTS.filter((h) => !norm || h.text.toLowerCase().includes(norm)),
    [HIGHLIGHTS, norm],
  );
  const summaryHits = useMemo(
    () =>
      SUMMARIES.filter(
        (s) =>
          !norm ||
          s.title.toLowerCase().includes(norm) ||
          s.bullets.some((b) => b.toLowerCase().includes(norm)),
      ),
    [SUMMARIES, norm],
  );
  const noteHits = useMemo(
    () =>
      NOTES.filter(
        (n) => !norm || n.title.toLowerCase().includes(norm) || n.body.toLowerCase().includes(norm),
      ),
    [NOTES, norm],
  );
  const topicHits = useMemo(
    () =>
      TOPICS.filter(
        (t) =>
          !norm || t.name.toLowerCase().includes(norm) || t.shortName.toLowerCase().includes(norm),
      ),
    [TOPICS, norm],
  );
  const sourceHits = useMemo(() => {
    const map = new Map<string, { id: string; title: string; domain: string; url: string }>();
    HIGHLIGHTS.forEach((h) => map.set(h.source.id, h.source));
    SUMMARIES.forEach((s) => map.set(s.source.id, s.source));
    return Array.from(map.values()).filter(
      (s) => !norm || s.title.toLowerCase().includes(norm) || s.domain.toLowerCase().includes(norm),
    );
  }, [HIGHLIGHTS, SUMMARIES, norm]);

  const total =
    highlightHits.length +
    summaryHits.length +
    noteHits.length +
    topicHits.length +
    sourceHits.length;

  return (
    <AppShell title="Search" subtitle="Find anything across your second brain in milliseconds.">
      {/* Search bar */}
      <div className="rounded-2xl border border-border bg-gradient-card p-1.5 shadow-md">
        <div className="flex items-center gap-3 rounded-xl bg-card px-3.5 py-3 shadow-sm">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search highlights, notes, summaries, topics, sources…"
            className="h-7 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground/70"
          />
          {q ? (
            <button
              onClick={() => setQ("")}
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          ) : (
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {(
          [
            { id: "all", label: "All", count: total },
            { id: "highlight", label: "Highlights", count: highlightHits.length },
            { id: "summary", label: "Summaries", count: summaryHits.length },
            { id: "note", label: "Notes", count: noteHits.length },
            { id: "topic", label: "Topics", count: topicHits.length },
            { id: "source", label: "Sources", count: sourceHits.length },
          ] as { id: Kind; label: string; count: number }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setKind(t.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] transition-colors ${
              kind === t.id
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="font-medium">{t.label}</span>
            <span className="text-[10.5px] tabular-nums opacity-80">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-5 space-y-6">
        {(kind === "all" || kind === "highlight") && highlightHits.length > 0 && (
          <Group title="Highlights" icon={BookmarkIcon}>
            <div className="space-y-2.5">
              {highlightHits.slice(0, 6).map((h) => (
                <ResultCard
                  key={h.id}
                  topicSlug={h.topicSlug}
                  meta={`${h.source.domain} · ${relativeTime(h.createdAt)}`}
                  body={<Highlighted text={h.text} q={norm} />}
                  rightAction={<HighlightCardMenu highlightId={h.id} />}
                />
              ))}
            </div>
          </Group>
        )}

        {(kind === "all" || kind === "summary") && summaryHits.length > 0 && (
          <Group title="Summaries" icon={Sparkles}>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {summaryHits.map((s) => (
                <ResultCard
                  key={s.id}
                  topicSlug={s.topicSlug}
                  meta={relativeTime(s.createdAt)}
                  title={s.title}
                  body={
                    <ul className="space-y-1">
                      {s.bullets.slice(0, 3).map((b) => (
                        <li key={b} className="text-[12px] text-muted-foreground">
                          • <Highlighted text={b} q={norm} />
                        </li>
                      ))}
                    </ul>
                  }
                  rightAction={<SummaryCardMenu summaryId={s.id} />}
                />
              ))}
            </div>
          </Group>
        )}

        {(kind === "all" || kind === "note") && noteHits.length > 0 && (
          <Group title="Notes" icon={PenLine}>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {noteHits.map((n) => (
                <ResultCard
                  key={n.id}
                  topicSlug={n.topicSlug}
                  meta={relativeTime(n.createdAt)}
                  title={n.title}
                  body={
                    <p className="text-[12px] text-muted-foreground">
                      <Highlighted text={n.body} q={norm} />
                    </p>
                  }
                  rightAction={<NoteCardMenu note={n} />}
                />
              ))}
            </div>
          </Group>
        )}

        {(kind === "all" || kind === "topic") && topicHits.length > 0 && (
          <Group title="Topics" icon={Hash}>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {topicHits.map((t) => (
  <div
    key={t.slug}
    className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-sm"
  >
    <Link
      to="/topic/$slug"
      params={{ slug: t.slug }}
      className="flex min-w-0 flex-1 items-center gap-3"
    >
      <div
        className="grid h-9 w-9 place-items-center rounded-lg text-[12px] font-semibold text-white"
        style={{ background: topicColor(t.tagVar) }}
      >
        {t.shortName.slice(0, 2)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-semibold tracking-tight">
          <Highlighted text={t.shortName} q={norm} />
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {t.name}
        </p>
      </div>
    </Link>

    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-destructive hover:bg-destructive/10"
      onClick={() => {
        if (confirm(`Delete topic "${t.name}"?`)) {
          storeActions.deleteTopic(t.slug);
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
))}
            </div>
          </Group>
        )}

        {(kind === "all" || kind === "source") && sourceHits.length > 0 && (
          <Group title="Sources" icon={Globe}>
            <div className="space-y-1.5">
              {sourceHits.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-2.5 text-[12px] shadow-sm transition-colors hover:bg-secondary"
                >
                  <div className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      <Highlighted text={s.title} q={norm} />
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">{s.domain}</p>
                  </div>
                </a>
              ))}
            </div>
          </Group>
        )}

        {total === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-[13px] font-semibold tracking-tight">No results</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Try different keywords or remove the filter.
            </p>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function Group({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <h2 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function ResultCard({
  topicSlug,
  meta,
  title,
  body,
  rightAction,
}: {
  topicSlug: string;
  meta: string;
  title?: string;
  body: React.ReactNode;
  rightAction?: React.ReactNode;
}) {
  const topic = useStore((s) => s.topics.find((t) => t.slug === topicSlug));
  if (!topic) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
      <div className="mb-1.5 flex items-start gap-2">
        <TopicChip topic={topic} small />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">{meta}</span>
          </div>
        </div>

        {rightAction ? <div className="shrink-0">{rightAction}</div> : null}
      </div>

      {title ? <p className="mb-1 text-[12.5px] font-semibold tracking-tight">{title}</p> : null}
      <div className="text-[12.5px] leading-relaxed text-foreground/85">{body}</div>
    </div>
  );
}

function Highlighted({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-primary/15 px-0.5 text-foreground">
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  );
}
