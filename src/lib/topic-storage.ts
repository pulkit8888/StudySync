/* eslint-disable prettier/prettier */
import type { Topic } from "./mock-data";

export const TOPICS_STORAGE_KEY = "studysync:topics";

type StoredTopic = {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  tagVar: string;
  description: string;
  updatedAt: string;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function toStored(topic: Topic): StoredTopic {
  return {
    id: topic.id!,
    name: topic.name,
    shortName: topic.shortName,
    slug: topic.slug,
    tagVar: topic.tagVar,
    description: topic.description,
    updatedAt: topic.updatedAt,
  };
}

function fromStored(stored: StoredTopic): Topic {
  return {
    ...stored,
    highlightsCount: 0,
    summariesCount: 0,
    notesCount: 0,
    sourcesCount: 0,
  };
}

export function loadStoredTopics(): Topic[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(TOPICS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredTopic[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((t) => t.id && t.slug && t.name).map(fromStored);
  } catch {
    return [];
  }
}

export function appendStoredTopic(topic: Topic): void {
  if (!canUseStorage() || !topic.id) return;
  const existing = loadStoredTopics();
  const next = [...existing.filter((t) => t.id !== topic.id), topic];
  localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(next.map(toStored)));
}

export function removeStoredTopic(id: string): void {
  if (!canUseStorage()) return;
  const existing = loadStoredTopics();
  localStorage.setItem(
    TOPICS_STORAGE_KEY,
    JSON.stringify(existing.filter((t) => t.id !== id).map(toStored)),
  );
}
