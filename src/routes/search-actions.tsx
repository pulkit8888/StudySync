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
import { Trash2 } from "lucide-react";
import { storeActions } from "@/lib/store";

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

export function NoteCardMenu({ noteId }: { noteId: string }) {
  return (
    <ConfirmDelete
      title="Delete Note?"
      description="This action cannot be undone."
      onConfirm={() => storeActions.deleteNote(noteId)}
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
  );
}
