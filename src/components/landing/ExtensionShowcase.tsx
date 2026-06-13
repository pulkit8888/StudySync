import { useState } from "react";
import { motion } from "framer-motion";
import { BookmarkPlus, Sparkles, FolderPlus, Hash, Download, BookOpen, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ExtensionShowcase() {
  const [openInstructions, setOpenInstructions] = useState(false);

  const handleDownload = () => {
    fetch("/studysync-extension.zip")
      .then((res) => {
        if (!res.ok) throw new Error(`Download failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "studysync-extension.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <section id="extension" className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Browser Extension
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            One keystroke from reading to remembering
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Select any text on any page. A quiet StudySync popup appears with just two actions —
            generate an AI summary, or bookmark it into a topic.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-[13px] font-medium text-background shadow-sm transition-transform hover:scale-[1.02]"
            >
              <Download className="h-4 w-4" /> Add to Browser
            </button>
            <button
              onClick={() => setOpenInstructions(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-[13px] font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
            >
              <BookOpen className="h-4 w-4" /> Instructions to Setup
            </button>
          </div>

          <ul className="mt-8 space-y-4">
            {[
              { icon: Sparkles, t: "AI Summary", d: "Topic-aware bullets in under a second." },
              {
                icon: BookmarkPlus,
                t: "Bookmark",
                d: "Save into an existing topic or create a new one.",
              },
              {
                icon: FolderPlus,
                t: "Build your knowledge",
                d: "Every highlight compounds into a structured library.",
              },
            ].map((item) => (
              <li key={item.t} className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight">{item.t}</p>
                  <p className="text-[13px] text-muted-foreground">{item.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Popup mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-mesh opacity-50 blur-2xl" />

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Popup */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
              <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2">
                <div className="grid h-5 w-5 place-items-center rounded-md bg-gradient-primary text-[9px] font-semibold text-primary-foreground">
                  S
                </div>
                <p className="text-[11.5px] font-semibold">StudySync</p>
                <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-[9.5px] text-muted-foreground">
                  Selected
                </span>
              </div>
              <div
                className="m-3 rounded-md px-2 py-1.5 text-[11.5px] leading-snug text-foreground/85"
                style={{ background: "var(--highlight)" }}
              >
                "Reduces redundancy and supports concurrent transactions while ensuring data
                integrity."
              </div>
              <div className="space-y-1 px-2 pb-2">
                <div className="flex items-center gap-2 rounded-md bg-secondary px-2 py-1.5 text-[11.5px]">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="font-medium">AI Summary</span>
                  <span className="ml-auto text-[9.5px] text-muted-foreground">Generate</span>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11.5px]">
                  <BookmarkPlus className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">Bookmark</span>
                  <span className="ml-auto text-[9.5px] text-muted-foreground">Save</span>
                </div>
              </div>
            </div>

            {/* Bookmark dialog */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
              <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2">
                <BookmarkPlus className="h-3 w-3 text-primary" />
                <p className="text-[11.5px] font-semibold">Bookmark to topic</p>
              </div>
              <div className="p-3">
                <button className="mb-2 flex w-full items-center gap-2 rounded-md border border-dashed border-border px-2 py-1.5 text-[11px] text-primary">
                  <FolderPlus className="h-3 w-3" />
                  Create new topic
                </button>
                <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Existing
                </p>
                <div className="space-y-0.5">
                  {[
                    { name: "DBMS", v: "--topic-dbms", active: true },
                    { name: "Operating Systems", v: "--topic-os", active: false },
                    { name: "DSA", v: "--topic-dsa", active: false },
                    { name: "Computer Networks", v: "--topic-cn", active: false },
                    { name: "OOP", v: "--topic-oops", active: false },
                  ].map((t) => (
                    <div
                      key={t.name}
                      className={`flex items-center gap-2 rounded-md px-2 py-1 text-[11px] ${
                        t.active ? "bg-secondary" : ""
                      }`}
                    >
                      <Hash className="h-2.5 w-2.5" style={{ color: `var(${t.v})` }} />

                      <span className="font-medium">{t.name}</span>

                      {t.active && (
                        <span className="ml-auto text-[9.5px] text-primary">Selected</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog open={openInstructions} onOpenChange={setOpenInstructions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Install the StudySync extension
            </DialogTitle>
            <DialogDescription>
              Follow these steps to add StudySync to any Chromium browser (Chrome, Edge, Brave,
              Arc).
            </DialogDescription>
          </DialogHeader>
          <ol className="mt-2 space-y-3">
            {[
              "Download the extension package.",
              "Open chrome://extensions in your browser.",
              'Enable "Developer mode" using the toggle in the top-right.',
              'Click "Load unpacked".',
              "Select the unzipped StudySync folder.",
              "Pin the extension to your toolbar.",
              "Start capturing knowledge with StudySync.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-[11px] font-semibold text-foreground">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-[13px] leading-relaxed text-foreground/85">
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-secondary/40 p-3 text-[11.5px] text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-primary" />
            Works in all Chromium browsers. Unzip the file before loading.
          </div>
          <button
            onClick={handleDownload}
            className="mt-1 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-foreground text-[13px] font-medium text-background"
          >
            <Download className="h-4 w-4" /> Download extension
          </button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
