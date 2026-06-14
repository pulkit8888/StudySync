/* eslint-disable prettier/prettier */
import type { Note, TopicSlug } from "./mock-data";

export const NOTES_STORAGE_KEY = "studysync:notes";

type StoredNote = {
  id: string;
  topicSlug: TopicSlug;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function toStored(n: Note): StoredNote {
  return {
    id: n.id!,
    topicSlug: n.topicSlug,
    title: n.title,
    body: n.body,
    createdAt: n.createdAt,
    updatedAt: (n as any).updatedAt ?? n.createdAt,
  };
}

export function loadStoredNotes(): Note[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredNote[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((n) => n.id && n.topicSlug && n.title && n.body)
      .map((n) => ({
        id: n.id,
        topicSlug: n.topicSlug,
        title: n.title,
        body: n.body,
        createdAt: n.createdAt,
        // keep compatibility if Note type doesn't have updatedAt
        updatedAt: (n.updatedAt ?? n.createdAt) as any,
      }) as Note);
  } catch {
    return [];
  }
}

export function saveAllStoredNotes(notes: Note[]): void {
  if (!canUseStorage()) return;
  const next = [...notes].map(toStored);
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(next));
}

export function deleteStoredNote(noteId: string): void {
  const existing = loadStoredNotes();
  saveAllStoredNotes(existing.filter((n) => n.id !== noteId));
}

export function upsertStoredNote(note: Note): void {
  const existing = loadStoredNotes();
  const next = [
    ...existing.filter((n) => n.id !== note.id),
    note,
  ];
  saveAllStoredNotes(next);
}

