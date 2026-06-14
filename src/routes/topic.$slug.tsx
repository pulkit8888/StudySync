/* eslint-disable prettier/prettier */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { TopicChip } from "@/routes/dashboard";
import { relativeTime, type TopicSlug } from "@/lib/mock-data";
import { selectSources, storeActions, useStore } from "@/lib/store";
import { topicColor } from "@/lib/utils";
import { Pencil } from "lucide-react";
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
  Globe,
  Search,
  Plus,
  ExternalLink,
  ArrowLeft,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/topic/$slug")({
  parseParams: (params) => ({ slug: params.slug as TopicSlug }),
  head: ({ params }) => ({
    meta: [
      { title: `${(params.slug as string).toUpperCase()} — StudySync` },
      { name: "description", content: "Topic in your second brain." },
    ],
  }),
  component: TopicDetailPage,
});

type Pending =
  | { kind: "highlight" | "summary" | "note" | "source"; id: string }
  | { kind: "topic"; id: TopicSlug }
  | null;

function TopicDetailPage() {
  const [editingNote, setEditingNote] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const params = Route.useParams();
  const navigate = useNavigate();
  const slug = params.slug as TopicSlug;

  const topic = useStore((s) => s.topics.find((t) => t.slug === slug));
  const topics = useStore((s) => s.topics);
  const allHighlights = useStore((s) => s.highlights);
  const allSummaries = useStore((s) => s.summaries);
  const allNotes = useStore((s) => s.notes);

  const highlights = allHighlights.filter((h) => h.topicSlug === slug);

  const summaries = allSummaries.filter((s) => s.topicSlug === slug);

  const notes = allNotes.filter((n) => n.topicSlug === slug);

  const [pending, setPending] = useState<Pending>(null);

  if (!topic) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-[14px] font-semibold tracking-tight">Topic not found</p>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            This topic was deleted or never existed.
          </p>
          <Link
            to="/dashboard"
            className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-primary"
          >
            <ArrowLeft className="h-3 w-3" /> Back to dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  // Sources scoped to this topic
  const topicSources = Array.from(
    new Map([
      ...highlights.map((h) => [h.source.id, h.source] as const),
      ...summaries.map((s) => [s.source.id, s.source] as const),
    ]).values(),
  );

  const confirm = () => {
    if (!pending) return;
    if (pending.kind === "highlight") storeActions.deleteHighlight(pending.id);
    if (pending.kind === "summary") storeActions.deleteSummary(pending.id);
    if (pending.kind === "note") storeActions.deleteNote(pending.id);
    if (pending.kind === "source") storeActions.deleteSource(pending.id);
    if (pending.kind === "topic") {
      storeActions.deleteTopic(pending.id);
      setPending(null);
      navigate({ to: "/dashboard" });
      return;
    }
    setPending(null);
  };

  const labels: Record<NonNullable<Pending>["kind"], { title: string; desc: string }> = {
    highlight: { title: "Delete this highlight?", desc: "The highlight will be removed." },
    summary: {
      title: "Delete this summary?",
      desc: "Are you sure you want to delete this summary? This action cannot be undone.",
    },
    note: { title: "Delete this note?", desc: "Your note will be permanently removed." },
    source: {
      title: "Delete this source?",
      desc: "All highlights and summaries from this source will be removed.",
    },
    topic: {
      title: `Delete ${topic.shortName}?`,
      desc: "This permanently removes the topic and all its highlights, summaries, and notes.",
    },
  };

  return (
    <AppShell>
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Back to dashboard
        </Link>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/dashboard"
            className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors bg-secondary text-foreground hover:bg-secondary/80"
          >
            All Topics
          </Link>
          {topics.map((t) => {
            const isActive = t.slug === slug;
            return (
              <Link
                key={t.slug}
                to="/topic/$slug"
                params={{ slug: t.slug }}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
                  isActive ? "text-primary-foreground" : "text-foreground hover:bg-secondary/60"
                }`}
                style={{
                  backgroundColor: isActive ? topicColor(t.tagVar) : "transparent",
                  border: isActive ? "none" : `1px solid ${topicColor(t.tagVar)}`,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: topicColor(t.tagVar) }}
                />
                {t.shortName}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex items-start gap-4">
          <div
            className="grid h-14 w-14 place-items-center rounded-2xl text-base font-semibold text-white shadow-lg"
            style={{ background: topicColor(topic.tagVar) }}
          >
            {topic.shortName.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <TopicChip topic={topic} />
              <span className="text-[11px] text-muted-foreground">
                Updated {relativeTime(topic.updatedAt)}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {topic.name}
            </h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">{topic.description}</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-[12.5px] font-medium text-foreground shadow-sm transition-colors hover:bg-secondary">
              <Sparkles className="h-3.5 w-3.5" /> Generate
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-primary px-3 text-[12.5px] font-medium text-primary-foreground shadow-glow">
              <Plus className="h-3.5 w-3.5" /> Add note
            </button>
            <button
              onClick={() => setPending({ kind: "topic", id: slug })}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-[12.5px] font-medium text-destructive shadow-sm transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete topic
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder={`Search inside ${topic.shortName}…`}
            className="h-7 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground/70"
          />
          <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
            /
          </kbd>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Metric label="Highlights" value={topic.highlightsCount} icon={Bookmark} />
          <Metric label="Summaries" value={topic.summariesCount} icon={Sparkles} />
          <Metric label="Notes" value={topic.notesCount} icon={PenLine} />
          <Metric label="Sources" value={topic.sourcesCount} icon={Globe} />
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title="Saved highlights" count={highlights.length}>
            {highlights.length === 0 ? (
              <Empty label="No highlights in this topic yet." />
            ) : (
              <div className="space-y-3">
                {highlights.map((h) => (
                  <div
                    key={h.id}
                    className="group rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-secondary/40"
                  >
                    <p className="text-[13.5px] leading-relaxed text-foreground/85">{h.text}</p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <span className="truncate">{h.source.title}</span>
                      <span>·</span>
                      <span>{h.source.domain}</span>
                      <span className="ml-auto">{relativeTime(h.createdAt)}</span>
                      <button
                        aria-label="Delete highlight"
                        onClick={() => setPending({ kind: "highlight", id: h.id })}
                        className="grid h-6 w-6 place-items-center rounded-md opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="AI summaries" count={summaries.length}>
            {summaries.length === 0 ? (
              <Empty label="No summaries yet." />
            ) : (
              <div className="space-y-3">
                {summaries.map((s) => (
                  <div
                    key={s.id}
                    className="group relative rounded-lg border border-border bg-gradient-card p-4 shadow-sm"
                  >
                    <button
                      aria-label="Delete summary"
                      onClick={() => setPending({ kind: "summary", id: s.id })}
                      className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <div className="flex items-center gap-2 pr-7">
                      <Sparkles
                        className="h-3.5 w-3.5"
                        style={{ color: topicColor(topic.tagVar) }}
                      />
                      <p className="text-[13px] font-semibold tracking-tight">{s.title}</p>
                      <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10.5px] text-muted-foreground">
                        {s.bullets.length} points
                      </span>
                    </div>
                    <ul className="mt-2.5 space-y-1.5">
                      {s.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2 text-[12.5px] leading-snug text-foreground/85"
                        >
                          <span
                            className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                            style={{ background: topicColor(topic.tagVar) }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-center gap-2 border-t border-border pt-2.5 text-[11px] text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <span className="truncate">{s.source.title}</span>
                      <span className="ml-auto">{relativeTime(s.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Personal notes" count={notes.length}>
            <div className="space-y-2.5">
              {notes.length === 0 ? (
                <Empty label="No notes yet. Capture your thoughts as you learn." />
              ) : (
                notes.map((n) => (
                  <div
                    key={n.id}
                    className="group relative rounded-lg border border-border bg-card p-3"
                  >
                    {/* NOTE CONTENT */}
                    <p className="text-[13px] font-semibold">{n.title}</p>
                    <p className="mt-1 text-[12.5px] text-muted-foreground">{n.body}</p>

                    {/* ACTIONS */}
                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-all group-hover:opacity-100">
                      <button
                        aria-label="Edit note"
                        onClick={() => {
                          setEditingNote(n);
                          setEditTitle(n.title);
                          setEditBody(n.body);
                        }}
                        className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>

                      <button
                        aria-label="Delete note"
                        onClick={() => setPending({ kind: "note", id: n.id })}
                        className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card title="Source references" count={topicSources.length}>
            {topicSources.length === 0 ? (
              <Empty label="No sources yet." />
            ) : (
              <div className="space-y-2">
                {topicSources.map((s) => (
                  <div
                    key={s.id}
                    className="group flex items-center gap-2.5 rounded-lg p-2 text-[12px] transition-colors hover:bg-secondary"
                  >
                    <div className="grid h-7 w-7 place-items-center rounded-md bg-secondary text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" />
                    </div>
                    <a href={s.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{s.title}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{s.domain}</p>
                    </a>
                    <a href={s.url} target="_blank" rel="noreferrer" aria-label="Open source">
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                    <button
                      aria-label="Delete source"
                      onClick={() => setPending({ kind: "source", id: s.id })}
                      className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Revision notes">
            <div className="rounded-lg border border-dashed border-border bg-gradient-card p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <p className="text-[12.5px] font-semibold tracking-tight">Generate revision pack</p>
              </div>
              <p className="mt-1 text-[11.5px] text-muted-foreground">
                Turn this topic into spaced-repetition flashcards and a one-page recap.
              </p>
              <button className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[11.5px] font-medium text-background transition-transform hover:scale-[1.02]">
                <Sparkles className="h-3 w-3" /> Generate pack
              </button>
            </div>
          </Card>

          <Card title="Other topics">
            <div className="grid grid-cols-2 gap-2">
              {topics
                .filter((t) => t.slug !== slug)
                .map((t) => (
                  <Link
                    key={t.slug}
                    to="/topic/$slug"
                    params={{ slug: t.slug }}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 text-[12px] transition-colors hover:bg-secondary"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: topicColor(t.tagVar) }}
                    />
                    <span className="truncate font-medium">{t.shortName}</span>
                  </Link>
                ))}
            </div>
          </Card>
        </div>
      </div>

      <AlertDialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pending ? labels[pending.kind].title : ""}</AlertDialogTitle>
            <AlertDialogDescription>
              {pending ? labels[pending.kind].desc : ""}
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
      {editingNote && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="w-100 rounded-lg bg-card p-4">
            <h2 className="font-semibold">Edit Note</h2>

            <input
              className="mt-3 w-full border p-2"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <textarea
              className="mt-2 w-full border p-2"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            />

            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setEditingNote(null)}>Cancel</button>

              <button
                onClick={() => {
                  storeActions.updateNote({
                    ...editingNote,
                    title: editTitle,
                    body: editBody,
                  });

                  setEditingNote(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-lg font-semibold tabular-nums leading-none text-foreground">{value}</p>
      </div>
    </div>
  );
}

function Card({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold tracking-tight text-foreground">{title}</h2>
        {typeof count === "number" ? (
          <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
            {count}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border bg-secondary/30 p-4 text-center text-[12px] text-muted-foreground">
      {label}
    </p>
  );
}

// keep import used
export const _u = selectSources;
