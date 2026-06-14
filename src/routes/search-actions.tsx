"use client";

import { useState } from "react";

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
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { storeActions } from "@/lib/store";
import type { Note } from "@/lib/mock-data";

function ConfirmDelete({
  title,
  description,
  onConfirm,
  children,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)} className="contents" role="presentation">
        {children}
      </span>
      <AlertDialog open={open} onOpenChange={(o) => !o && setOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function HighlightCardMenu({ highlightId }: { highlightId: string }) {
  return (
    <ConfirmDelete
      title="Delete Highlight?"
      description="This action cannot be undone."
      onConfirm={() => storeActions.deleteHighlight(highlightId)}
    >
      <Button
        aria-label="Delete highlight"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </ConfirmDelete>
  );
}

export function SummaryCardMenu({ summaryId }: { summaryId: string }) {
  return (
    <ConfirmDelete
      title="Delete Summary?"
      description="This action cannot be undone."
      onConfirm={() => storeActions.deleteSummary(summaryId)}
    >
      <Button
        aria-label="Delete summary"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </ConfirmDelete>
  );
}

export function NoteCardMenu({ note }: { note: any }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);

  return (
    <div className="flex items-center gap-1">
      {/* Edit Button */}
      <Button
        aria-label="Edit note"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md text-primary hover:bg-primary/10"
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      {/* Delete Button */}
      <ConfirmDelete
        title="Delete Note?"
        description="This action cannot be undone."
        onConfirm={() => storeActions.deleteNote(note.id)}
      >
        <Button
          aria-label="Delete note"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </ConfirmDelete>

      {/* Edit Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Note</AlertDialogTitle>
            <AlertDialogDescription>
              Update your note details below.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border p-2"
              placeholder="Title"
            />

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-30 w-full rounded-md border p-2"
              placeholder="Note"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <Button
              onClick={() => {
                storeActions.updateNote({
                  id: note.id,
                  title,
                  body,
                  topicSlug: note.topicSlug,
                  createdAt: note.createdAt,
                });

                setOpen(false);
              }}
            >
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
