import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { TOPICS } from "@/lib/mock-data";
import {
  Sparkles,
  BookmarkPlus,
  Search,
  Globe,
  Check,
  Hash,
} from "lucide-react";

export const Route = createFileRoute("/extension")({
  head: () => ({
    meta: [
      { title: "Extension — StudySync" },
      { name: "description", content: "Preview the StudySync browser extension." },
    ],
  }),
  component: ExtensionPage,
});

function ExtensionPage() {
  return (
    <AppShell
      title="Browser extension"
      subtitle="The fastest way to capture knowledge from anywhere on the web."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr]">
        {/* Popup */}
        <div className="space-y-4">
          <ExtensionPopup />
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-[12.5px] font-semibold tracking-tight">Shortcuts</p>
            <ul className="mt-2 space-y-2 text-[12px]">
              {[
                ["Open popup", "⌘ ⇧ S"],
                ["Generate summary", "⌘ ⇧ G"],
                ["Save to topic", "⌘ ⇧ K"],
                ["Add note", "⌘ ⇧ N"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10.5px] tracking-wider text-muted-foreground">
                    {v}
                  </kbd>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Topic selector + summary generator */}
        <div className="space-y-4">
          <TopicSelector />
          <SummaryGenerator />
          <QuickSaveFlow />
        </div>
      </div>
    </AppShell>
  );
}

function ExtensionPopup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-3.5 py-2.5">
        <div className="grid h-5 w-5 place-items-center rounded-md bg-gradient-primary text-[9px] font-semibold text-primary-foreground">
          S
        </div>
        <p className="text-[12.5px] font-semibold">StudySync</p>
        <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-[10px] text-muted-foreground">
          Selected
        </span>
      </div>

      <div className="border-b border-border p-3.5">
        <p className="rounded-md bg-primary/8 px-2 py-1.5 text-[12px] leading-relaxed text-foreground/90"
           style={{ background: "var(--highlight)" }}>
          "A DBMS reduces redundancy, enforces consistency, and supports concurrent transactions while ensuring data integrity."
        </p>
      </div>

      <div className="space-y-1 p-2">
        <PopupRow icon={Sparkles} label="AI Summary" hint="Generate" />
        <PopupRow icon={BookmarkPlus} label="Bookmark" hint="Save" />
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-secondary/30 px-3 py-2 text-[10.5px] text-muted-foreground">
        <Globe className="h-3 w-3" /> geeksforgeeks.org
        <span className="ml-auto inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Synced
        </span>
      </div>
    </div>
  );
}

function PopupRow({
  icon: Icon,
  label,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint: string;
}) {
  return (
    <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[12.5px] text-foreground/85 transition-colors hover:bg-secondary">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-medium">{label}</span>
      <span className="ml-auto text-[10.5px] text-muted-foreground">{hint}</span>
    </button>
  );
}

function TopicSelector() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Hash className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-[12.5px] font-semibold tracking-tight">Topic selector</p>
        <span className="ml-auto text-[11px] text-muted-foreground">Pick where to save</span>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          placeholder="Search or create a topic…"
          className="h-7 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground/70"
        />
      </div>
      <div className="mt-3 space-y-1">
        {TOPICS.map((t, i) => (
          <div
            key={t.slug}
            className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12.5px] ${
              i === 0 ? "bg-secondary" : "hover:bg-secondary/50"
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: `var(${t.tagVar})` }} />
            <span className="font-medium">{t.shortName}</span>
            <span className="text-muted-foreground">·</span>
            <span className="truncate text-[11.5px] text-muted-foreground">{t.name}</span>
            {i === 0 ? <Check className="ml-auto h-3.5 w-3.5 text-primary" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryGenerator() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <p className="text-[12.5px] font-semibold tracking-tight">Summary generator</p>
        <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10.5px] text-muted-foreground">
          4 points · DBMS
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {[
          "DBMS manages data efficiently at scale",
          "Reduces redundancy across tables",
          "Improves consistency and integrity",
          "Supports concurrent transactions safely",
        ].map((b) => (
          <li key={b} className="flex items-start gap-2 text-[12.5px] leading-snug text-foreground/85">
            <span
              className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
              style={{ background: "var(--topic-dbms)" }}
            />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-2">
        <button className="h-8 rounded-md bg-foreground px-3 text-[11.5px] font-medium text-background">
          Save summary
        </button>
        <button className="h-8 rounded-md border border-border bg-card px-3 text-[11.5px] font-medium hover:bg-secondary">
          Regenerate
        </button>
      </div>
    </div>
  );
}

function QuickSaveFlow() {
  const steps = [
    { label: "Highlight text", done: true },
    { label: "Pick a topic", done: true },
    { label: "AI summarizes", done: true },
    { label: "Saved to your brain", done: true },
  ];
  return (
    <div className="rounded-xl border border-border bg-gradient-card p-5 shadow-sm">
      <p className="text-[12.5px] font-semibold tracking-tight">Quick save workflow</p>
      <p className="mt-0.5 text-[11.5px] text-muted-foreground">
        From selection to organized knowledge in under three seconds.
      </p>
      <ol className="mt-4 space-y-2.5">
        {steps.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2.5">
            <span
              className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-semibold ${
                s.done
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground"
              }`}
            >
              {s.done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
            </span>
            <span className="text-[12.5px] font-medium">{s.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}