/* eslint-disable prettier/prettier */
import type { Bookmark, Topic, TopicSlug } from "./mock-data";

export const BOOKMARKS_STORAGE_KEY = "studysync:bookmarks";

type StoredBookmark = {
  id: string;
  highlightId: string;
  topicSlug: TopicSlug;
  createdAt: string;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function loadStoredBookmarks(): Bookmark[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredBookmark[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((b) => b.id && b.highlightId && b.topicSlug).map((b) => ({
      ...b,
    }));
  } catch {
    return [];
  }
}

export function saveAllStoredBookmarks(bookmarks: Bookmark[]): void {
  if (!canUseStorage()) return;
  const next = [...bookmarks].map((b) => ({
    id: b.id,
    highlightId: b.highlightId,
    topicSlug: b.topicSlug,
    createdAt: b.createdAt,
  }));
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
}

export function deleteStoredBookmark(id: string): void {
  const existing = loadStoredBookmarks();
  saveAllStoredBookmarks(existing.filter((b) => b.id !== id));
}

