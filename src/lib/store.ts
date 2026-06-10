// Tiny global mock store for StudySync. Backed by useSyncExternalStore so
// every page sees deletions instantly without a refresh. Initialised from the
// static mock data; swap for a real API later by replacing the action bodies.
import { useSyncExternalStore } from "react";
import {
  ACTIVITY as INITIAL_ACTIVITY,
  HIGHLIGHTS as INITIAL_HIGHLIGHTS,
  NOTES as INITIAL_NOTES,
  SUMMARIES as INITIAL_SUMMARIES,
  TOPICS as INITIAL_TOPICS,
  type Activity,
  type Highlight,
  type Note,
  type Source,
  type Summary,
  type Topic,
  type TopicSlug,
} from "./mock-data";

export type StoreState = {
  topics: Topic[];
  highlights: Highlight[];
  summaries: Summary[];
  notes: Note[];
  activity: Activity[];
};

let state: StoreState = recompute({
  topics: INITIAL_TOPICS.map((t) => ({ ...t })),
  highlights: [...INITIAL_HIGHLIGHTS],
  summaries: [...INITIAL_SUMMARIES],
  notes: [...INITIAL_NOTES],
  activity: [...INITIAL_ACTIVITY],
});

const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot() {
  return state;
}

function recompute(s: StoreState): StoreState {
  return {
    ...s,
    topics: s.topics.map((t) => {
      const hs = s.highlights.filter((h) => h.topicSlug === t.slug);
      const ss = s.summaries.filter((x) => x.topicSlug === t.slug);
      const ns = s.notes.filter((n) => n.topicSlug === t.slug);
      const sourceIds = new Set<string>();
      hs.forEach((h) => sourceIds.add(h.source.id));
      ss.forEach((x) => sourceIds.add(x.source.id));
      return {
        ...t,
        highlightsCount: hs.length,
        summariesCount: ss.length,
        notesCount: ns.length,
        sourcesCount: sourceIds.size,
      };
    }),
  };
}

function set(updater: (s: StoreState) => StoreState) {
  state = recompute(updater(state));
  emit();
}

function activityFor(kind: Activity["kind"], topicSlug: TopicSlug, label: string, detail: string): Activity {
  return {
    id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    topicSlug,
    label,
    detail,
    createdAt: new Date().toISOString(),
  };
}

// A "source" is orphaned when no highlight and no summary still references it.
// Nothing else to do because sources are embedded in those records.
function sourceStillUsed(s: StoreState, sourceId: string): boolean {
  return (
    s.highlights.some((h) => h.source.id === sourceId) ||
    s.summaries.some((x) => x.source.id === sourceId)
  );
}

export const storeActions = {
  deleteHighlight(id: string) {
    set((s) => {
      const h = s.highlights.find((x) => x.id === id);
      if (!h) return s;
      const next: StoreState = {
        ...s,
        highlights: s.highlights.filter((x) => x.id !== id),
        activity: [
          activityFor("highlight", h.topicSlug, "Deleted highlight", h.text.slice(0, 60) + "…"),
          ...s.activity,
        ],
      };
      // No-op: sourceStillUsed check is implicit (sources live on records)
      return next;
    });
  },
  deleteSummary(id: string) {
    set((s) => {
      const sm = s.summaries.find((x) => x.id === id);
      if (!sm) return s;
      return {
        ...s,
        summaries: s.summaries.filter((x) => x.id !== id),
        activity: [
          activityFor("summary", sm.topicSlug, "Deleted summary", sm.title),
          ...s.activity,
        ],
      };
    });
  },
  deleteNote(id: string) {
    set((s) => {
      const n = s.notes.find((x) => x.id === id);
      if (!n) return s;
      return {
        ...s,
        notes: s.notes.filter((x) => x.id !== id),
        activity: [activityFor("note", n.topicSlug, "Deleted note", n.title), ...s.activity],
      };
    });
  },
  deleteSource(sourceId: string) {
    set((s) => {
      const sample =
        s.highlights.find((h) => h.source.id === sourceId)?.source ||
        s.summaries.find((x) => x.source.id === sourceId)?.source;
      const topicForActivity =
        s.highlights.find((h) => h.source.id === sourceId)?.topicSlug ||
        s.summaries.find((x) => x.source.id === sourceId)?.topicSlug;
      const next: StoreState = {
        ...s,
        highlights: s.highlights.filter((h) => h.source.id !== sourceId),
        summaries: s.summaries.filter((x) => x.source.id !== sourceId),
      };
      if (sample && topicForActivity) {
        next.activity = [
          activityFor("highlight", topicForActivity, "Removed source", sample.title),
          ...s.activity,
        ];
      }
      return next;
    });
  },
  deleteTopic(slug: TopicSlug) {
    set((s) => ({
      ...s,
      topics: s.topics.filter((t) => t.slug !== slug),
      highlights: s.highlights.filter((h) => h.topicSlug !== slug),
      summaries: s.summaries.filter((x) => x.topicSlug !== slug),
      notes: s.notes.filter((n) => n.topicSlug !== slug),
      activity: [
        activityFor("topic", slug, "Deleted topic", slug.toUpperCase()),
        ...s.activity.filter((a) => a.topicSlug !== slug),
      ],
    }));
  },
};

export function useStore<T>(selector: (s: StoreState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getSnapshot()),
  );
}

// Derive all unique sources currently referenced.
export function selectSources(s: StoreState): Source[] {
  const m = new Map<string, Source>();
  s.highlights.forEach((h) => m.set(h.source.id, h.source));
  s.summaries.forEach((x) => m.set(x.source.id, x.source));
  return Array.from(m.values());
}

export function selectTopicBySlug(s: StoreState, slug: string): Topic | undefined {
  return s.topics.find((t) => t.slug === slug);
}