/* eslint-disable prettier/prettier */
import type { SavedSummary, TopicSlug } from "./mock-data";

export const SAVED_SUMMARIES_STORAGE_KEY = "studysync:saved_summaries";

type StoredSavedSummary = {
  id: string;
  summaryId: string;
  topicSlug: TopicSlug;
  createdAt: string;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function loadStoredSavedSummaries(): SavedSummary[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(SAVED_SUMMARIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredSavedSummary[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s) => s.id && s.summaryId && s.topicSlug).map((s) => ({
      ...s,
    }));
  } catch {
    return [];
  }
}

export function saveAllStoredSavedSummaries(items: SavedSummary[]): void {
  if (!canUseStorage()) return;
  const next = [...items].map((x) => ({
    id: x.id,
    summaryId: x.summaryId,
    topicSlug: x.topicSlug,
    createdAt: x.createdAt,
  }));
  localStorage.setItem(SAVED_SUMMARIES_STORAGE_KEY, JSON.stringify(next));
}

export function deleteStoredSavedSummariesBySummaryId(summaryId: string): void {
  const existing = loadStoredSavedSummaries();
  saveAllStoredSavedSummaries(existing.filter((s) => s.summaryId !== summaryId));
}

export function deleteStoredSavedSummariesByTopicSlug(topicSlug: TopicSlug): void {
  const existing = loadStoredSavedSummaries();
  saveAllStoredSavedSummaries(existing.filter((s) => s.topicSlug !== topicSlug));
}


