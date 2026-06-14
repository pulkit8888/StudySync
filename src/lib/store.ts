/* eslint-disable prettier/prettier */
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
import {
  appendStoredTopic,
  loadStoredTopics,
  removeStoredTopic,
} from "./topic-storage";

export type CreateTopicResult =
  | { ok: true; topic: Topic }
  | { ok: false; error: "empty" | "duplicate"; message: string };

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
let storageHydrated = false;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mergeTopicsWithStored(): Topic[] {
  const builtins = INITIAL_TOPICS.map((t) => ({ ...t }));
  const builtinSlugs = new Set(builtins.map((t) => t.slug));
  const stored = loadStoredTopics().filter((t) => !builtinSlugs.has(t.slug));
  return [...builtins, ...stored];
}

function hydrateFromStorage() {
  if (storageHydrated || typeof window === "undefined") return;
  storageHydrated = true;
  const merged = mergeTopicsWithStored();
  const storedCount = merged.length - INITIAL_TOPICS.length;
  if (storedCount === 0) return;
  state = recompute({ ...state, topics: merged });
  emit();
}

function emit() {
  for (const l of listeners) l();
}
function subscribe(l: () => void) {
  hydrateFromStorage();
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot() {
  hydrateFromStorage();
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
  createTopic(name: string, color: string): CreateTopicResult {
    const trimmed = name.trim();
    if (!trimmed) {
      return { ok: false, error: "empty", message: "Topic name is required." };
    }

    const normalized = trimmed.toLowerCase();
    if (state.topics.some((t) => t.name.toLowerCase() === normalized)) {
      return { ok: false, error: "duplicate", message: "A topic with this name already exists." };
    }

    let slug = slugify(trimmed);
    if (!slug) {
      return { ok: false, error: "empty", message: "Topic name is required." };
    }
    if (state.topics.some((t) => t.slug === slug)) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const topic: Topic = {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      slug,
      name: trimmed,
      shortName: trimmed,
      description: "",
      tagVar: color,
      highlightsCount: 0,
      summariesCount: 0,
      notesCount: 0,
      sourcesCount: 0,
      updatedAt: new Date().toISOString(),
    };

    set((s) => ({
      ...s,
      topics: [...s.topics, topic],
      activity: [
        activityFor("topic", slug, "Created topic", trimmed),
        ...s.activity,
      ],
    }));

    appendStoredTopic(topic);
    return { ok: true, topic };
  },
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
    const topic = state.topics.find((t) => t.slug === slug);
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
    if (topic?.id) {
      removeStoredTopic(topic.id);
    }
  },
};

export function useStore<T>(selector: (s: StoreState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(state),
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