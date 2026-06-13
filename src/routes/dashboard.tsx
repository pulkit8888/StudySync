/* eslint-disable prettier/prettier */
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import {
  KNOWLEDGE_GROWTH,
  relativeTime,
  type Activity,
  type Highlight,
  type Note,
  type Summary,
} from "@/lib/mock-data";
import { storeActions, useStore } from "@/lib/store";
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
  Sparkles,
  Bookmark,
  PenLine,
  FileText,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — StudySync" },
      { name: "description", content: "Your second brain at a glance." },
    ],
  }),
  component: DashboardPage,
});

type Pending =
  | { kind: "highlight"; id: string }
  | { kind: "summary"; id: string }
  | { kind: "note"; id: string }
  | { kind: "topic"; slug: string }
  | null;

function DashboardPage() {
  const topics = useStore((s) => s.topics);
  const highlights = useStore((s) => s.highlights);
  const summaries = useStore((s) => s.summaries);
  const notes = useStore((s) => s.notes);
  const activity = useStore((s) => s.activity);

  const [pending, setPending] = useState<Pending>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Filter data based on selected topic
  const filteredHighlights = selectedTopic
    ? highlights.filter((h) => h.topicSlug === selectedTopic)
    : highlights;
  const filteredSummaries = selectedTopic
    ? summaries.filter((s) => s.topicSlug === selectedTopic)
    : summaries;
  const filteredNotes = selectedTopic ? notes.filter((n) => n.topicSlug === selectedTopic) : notes;
  const filteredActivity = selectedTopic
    ? activity.filter((a) => a.topicSlug === selectedTopic)
    : activity;

  const totalHighlights = filteredHighlights.length;
  const totalSummaries = filteredSummaries.length;
  const totalNotes = filteredNotes.length;

  const confirm = () => {
    if (!pending) return;
    if (pending.kind === "highlight") storeActions.deleteHighlight(pending.id);
    if (pending.kind === "summary") storeActions.deleteSummary(pending.id);
    if (pending.kind === "note") storeActions.deleteNote(pending.id);
    if (pending.kind === "topic") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storeActions.deleteTopic(pending.slug as any);
      setSelectedTopic(null);
    }
    setPending(null);
  };

  const messages: Record<NonNullable<Pending>["kind"], { title: string; desc: string }> = {
    highlight: {
      title: "Delete this highlight?",
      desc: "The highlight will be removed from your second brain.",
    },
    summary: {
      title: "Delete this summary?",
      desc: "Are you sure you want to delete this summary? This action cannot be undone.",
    },
    note: { title: "Delete this note?", desc: "Your note will be permanently removed." },
    topic: {
      title: "Delete this topic and all associated data?",
      desc: "All highlights, summaries, notes, and sources linked to this topic will be permanently removed. This action cannot be undone.",
    },
  };

  const topicFilter = topics.find((t) => t.slug === selectedTopic);

  return (
    <AppShell
      title={selectedTopic ? `${topicFilter?.name}` : "Welcome back, Aarav"}
      subtitle={
        selectedTopic
          ? `Viewing ${topicFilter?.shortName} content`
          : "Here's what's growing in your second brain."
      }
    >
      {/* Topic Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTopic(null)}
          className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
            selectedTopic === null
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground hover:bg-secondary/80"
          }`}
        >
          All Topics
        </button>
        {topics.map((t) => (
          <button
            key={t.slug}
            onClick={() => setSelectedTopic(t.slug)}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
              selectedTopic === t.slug
                ? "text-primary-foreground"
                : "text-foreground hover:bg-secondary/60"
            }`}
            style={{
              backgroundColor: selectedTopic === t.slug ? `var(${t.tagVar})` : "transparent",
              border: selectedTopic === t.slug ? "none" : `1px solid var(${t.tagVar})`,
            }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: `var(${t.tagVar})` }} />
            {t.shortName}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Highlights" value={totalHighlights} icon={Bookmark} delta="+8 this week" />
        <Stat label="Summaries" value={totalSummaries} icon={Sparkles} delta="+5 this week" />
        <Stat label="Notes" value={totalNotes} icon={PenLine} delta="+3 this week" />
        <Stat
          label="Topics"
          value={topics.length}
          icon={FileText}
          delta={`${topics.length} active`}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <GrowthCard />
          <RecentHighlights
            items={filteredHighlights.slice(0, 4)}
            topics={topics}
            onDelete={(id) => setPending({ kind: "highlight", id })}
          />
          <RecentSummaries
            items={filteredSummaries.slice(0, 3)}
            topics={topics}
            onDelete={(id) => setPending({ kind: "summary", id })}
          />
        </div>
        <div className="space-y-5">
          <TopicStats
            topics={topics}
            selectedTopic={selectedTopic}
            onSelectTopic={setSelectedTopic}
            onDeleteTopic={(slug) => setPending({ kind: "topic", slug })}
          />
          <ActivityTimeline items={filteredActivity} topics={topics} />
          <RecentNotes
            items={filteredNotes.slice(0, 3)}
            topics={topics}
            onDelete={(id) => setPending({ kind: "note", id })}
          />
        </div>
      </div>

      <AlertDialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pending ? messages[pending.kind].title : ""}</AlertDialogTitle>
            <AlertDialogDescription>
              {pending ? messages[pending.kind].desc : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirm}
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

function Stat({
  label,
  value,
  icon: Icon,
  delta,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  delta: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-primary">{delta}</p>
    </div>
  );
}

function SectionHeader({
  title,
  href,
  hrefLabel = "View all",
}: {
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[13.5px] font-semibold tracking-tight text-foreground">{title}</h2>
      {href ? (
        <Link
          to={href}
          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {hrefLabel} <ChevronRight className="h-3 w-3" />
        </Link>
      ) : null}
    </div>
  );
}

function GrowthCard() {
  const data = KNOWLEDGE_GROWTH;
  const max = Math.max(...data.map((d) => d.count));
  const min = Math.min(...data.map((d) => d.count));
  const w = 100;
  const h = 36;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d.count - min) / (max - min || 1)) * h;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const latest = data[data.length - 1].count;
  const first = data[0].count;
  const growthPct = Math.round(((latest - first) / first) * 100);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11.5px] font-medium uppercase tracking-wider text-muted-foreground">
            Knowledge growth
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl font-semibold tracking-tight tabular-nums">{latest}</p>
            <p className="inline-flex items-center gap-0.5 text-[11.5px] font-medium text-primary">
              <TrendingUp className="h-3 w-3" /> +{growthPct}% in 14 days
            </p>
          </div>
          <p className="mt-0.5 text-[11.5px] text-muted-foreground">
            Total items captured into your second brain
          </p>
        </div>
        <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
          Last 14 days
        </span>
      </div>

      <div className="mt-4">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-28 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="growth-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline fill="url(#growth-fill)" stroke="none" points={`0,${h} ${points} ${w},${h}`} />
          <polyline
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
          {[0, 4, 8, 13].map((i) => (
            <span key={i}>{data[i].day}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentHighlights({
  items,
  topics,
  onDelete,
}: {
  items: Highlight[];
  topics: { slug: string; shortName: string; tagVar: string }[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <SectionHeader title="Recent highlights" href="/bookmarks" />
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-secondary/30 p-6 text-center text-[12px] text-muted-foreground">
          No highlights yet.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((h) => {
            const topic = topics.find((t) => t.slug === h.topicSlug);
            if (!topic) return null;
            return (
              <div
                key={h.id}
                className="group rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-secondary/40"
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <TopicChip topic={topic} />
                  <span className="text-[11px] text-muted-foreground">·</span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {h.source.domain}
                  </span>
                  <span className="ml-auto text-[10.5px] text-muted-foreground">
                    {relativeTime(h.createdAt)}
                  </span>
                  <button
                    aria-label="Delete highlight"
                    onClick={() => onDelete(h.id)}
                    className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-[13px] leading-relaxed text-foreground/85">{h.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecentSummaries({
  items,
  topics,
  onDelete,
}: {
  items: Summary[];
  topics: { slug: string; shortName: string; tagVar: string }[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <SectionHeader title="Recent AI summaries" href="/bookmarks" />
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-secondary/30 p-6 text-center text-[12px] text-muted-foreground">
          No summaries yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {items.map((s) => {
            const topic = topics.find((t) => t.slug === s.topicSlug);
            if (!topic) return null;
            return (
              <div
                key={s.id}
                className="group relative rounded-lg border border-border bg-gradient-card p-3.5 shadow-sm"
              >
                <button
                  aria-label="Delete summary"
                  onClick={() => onDelete(s.id)}
                  className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                <div className="mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" style={{ color: `var(${topic.tagVar})` }} />
                  <TopicChip topic={topic} small />
                </div>
                <p className="pr-6 text-[12.5px] font-semibold tracking-tight">{s.title}</p>
                <ul className="mt-2 space-y-1">
                  {s.bullets.slice(0, 3).map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-1.5 text-[11.5px] leading-snug text-muted-foreground"
                    >
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                        style={{ background: `var(${topic.tagVar})` }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TopicStats({
  topics,
  selectedTopic,
  onSelectTopic,
  onDeleteTopic,
}: {
  topics: {
    slug: string;
    shortName: string;
    tagVar: string;
    highlightsCount: number;
    summariesCount: number;
    notesCount: number;
  }[];
  selectedTopic: string | null;
  onSelectTopic: (slug: string | null) => void;
  onDeleteTopic: (slug: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <SectionHeader title="Topic statistics" />
      <div className="space-y-2.5">
        {topics.map((t) => {
          const total = t.highlightsCount + t.summariesCount + t.notesCount;
          const max = 60;
          const pct = Math.min(100, Math.round((total / max) * 100));
          const isSelected = selectedTopic === t.slug;
          return (
            <div
              key={t.slug}
              className={`rounded-lg p-2 transition-colors ${
                isSelected ? "bg-secondary" : "hover:bg-secondary/50"
              } group flex items-center gap-2`}
            >
              <button
                onClick={() => onSelectTopic(isSelected ? null : t.slug)}
                className="flex-1 text-left"
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: `var(${t.tagVar})` }}
                    />
                    <span className="text-[12.5px] font-medium">{t.shortName}</span>
                  </div>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{total}</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: `var(${t.tagVar})` }}
                  />
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTopic(t.slug);
                }}
                className="opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1"
                title="Delete topic"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
        {topics.length === 0 && <p className="text-[12px] text-muted-foreground">No topics yet.</p>}
      </div>
    </div>
  );
}

function ActivityTimeline({
  items,
  topics,
}: {
  items: Activity[];
  topics: { slug: string; shortName: string; tagVar: string }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <SectionHeader title="Recent activity" />
      <ol className="relative ml-2 space-y-3 border-l border-border pl-4">
        {items.slice(0, 6).map((a) => {
          const topic = topics.find((t) => t.slug === a.topicSlug);
          const color = topic ? `var(${topic.tagVar})` : "var(--muted-foreground)";
          return (
            <li key={a.id} className="relative">
              <span
                className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ring-2 ring-card"
                style={{ background: color }}
              />
              <p className="text-[12px] font-medium text-foreground">{a.label}</p>
              <p className="truncate text-[11.5px] text-muted-foreground">{a.detail}</p>
              <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                {topic?.shortName ?? a.topicSlug.toUpperCase()} · {relativeTime(a.createdAt)}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function RecentNotes({
  items,
  topics,
  onDelete,
}: {
  items: Note[];
  topics: { slug: string; shortName: string; tagVar: string }[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <SectionHeader title="Recent notes" />
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-secondary/30 p-6 text-center text-[12px] text-muted-foreground">
          No notes yet.
        </p>
      ) : (
        <div className="space-y-2.5">
          {items.map((n) => {
            const topic = topics.find((t) => t.slug === n.topicSlug);
            if (!topic) return null;
            return (
              <div
                key={n.id}
                className="group relative rounded-lg border border-border bg-gradient-card p-3 shadow-sm"
              >
                <button
                  aria-label="Delete note"
                  onClick={() => onDelete(n.id)}
                  className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                <div className="mb-1 flex items-center gap-2">
                  <TopicChip topic={topic} small />
                  <span className="ml-auto pr-6 text-[10.5px] text-muted-foreground">
                    {relativeTime(n.createdAt)}
                  </span>
                </div>
                <p className="pr-6 text-[12.5px] font-semibold tracking-tight">{n.title}</p>
                <p className="mt-0.5 line-clamp-2 text-[11.5px] text-muted-foreground">{n.body}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function TopicChip({
  topic,
  small,
}: {
  topic: { shortName: string; tagVar: string };
  small?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-card font-medium ${
        small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[10.5px]"
      }`}
      style={{ color: `var(${topic.tagVar})` }}
    >
      <span className="h-1 w-1 rounded-full" style={{ background: `var(${topic.tagVar})` }} />
      {topic.shortName}
    </span>
  );
}

export const _unused = ArrowUpRight;
