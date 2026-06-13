/* eslint-disable prettier/prettier */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Sparkles,
  BookmarkPlus,
  PenLine,
  FileText,
  ChevronRight,
  Search,
  Hash,
  Globe,
  MousePointer2,
  Check,
  FolderPlus,
} from "lucide-react";

type Topic = {
  id: string;
  name: string;
  shortName: string;
  tagVar: string;
  article: { title: string; source: string; paragraph: string; highlight: string };
  summary: string[];
};

const TOPICS: Topic[] = [
  {
    id: "dbms",
    name: "Database Management Systems",
    shortName: "DBMS",
    tagVar: "--topic-dbms",
    article: {
      title: "Introduction to Database Management Systems",
      source: "geeksforgeeks.org",
      paragraph:
        "A Database Management System (DBMS) is software designed to store, retrieve, and manage data efficiently. It reduces redundancy, enforces consistency, and supports concurrent transactions while ensuring data integrity across operations.",
      highlight:
        "It reduces redundancy, enforces consistency, and supports concurrent transactions while ensuring data integrity across operations.",
    },
    summary: [
      "DBMS manages data efficiently",
      "Reduces redundancy",
      "Improves consistency",
      "Supports transactions",
    ],
  },
  {
    id: "os",
    name: "Operating Systems",
    shortName: "OS",
    tagVar: "--topic-os",
    article: {
      title: "Process Scheduling in Operating Systems",
      source: "tutorialspoint.com",
      paragraph:
        "The CPU scheduler selects from among the processes in memory that are ready to execute and allocates the CPU to one of them. Scheduling decisions may take place under preemptive or non-preemptive modes.",
      highlight:
        "The CPU scheduler selects from among the processes in memory that are ready to execute and allocates the CPU to one of them.",
    },
    summary: [
      "Scheduler picks ready processes",
      "Allocates CPU by priority",
      "Preemptive vs non-preemptive",
      "Optimizes throughput",
    ],
  }
];

/**
 * Scene timeline (seconds per topic). Alternates AI Summary / Bookmark by index.
 *   0.0 - 0.8   cursor enters, settles at start of highlight
 *   0.8 - 2.2   selection drags L → R (1.4s, browser-style blue)
 *   2.2 - 4.8   selection visible, no other motion (2.6s)
 *   4.8 - 5.4   cursor moves toward popup, popup fades in
 *   5.4 - 6.8   popup visible (hover state)
 *   6.8 - 7.3   chosen action pressed
 *   7.3 - 13.5  result panel
 *      AI:  summary slides in, bullets reveal, Save → topic card
 *      BM:  Bookmark-to-topic panel, pick DBMS row, "Saved to <topic>"
 *   13.5 - 14.0 settle, advance
 */
const SCENE_DURATION = 14;
const DASHBOARD_DURATION = 7;
const TOTAL_LOOP = SCENE_DURATION * TOPICS.length + DASHBOARD_DURATION;

export function ProductShowcase() {
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const raw = Math.max(0, (now - start) / 1000);
      const elapsed = TOTAL_LOOP > 0 ? raw % TOTAL_LOOP : 0;
      setT(Number.isFinite(elapsed) ? elapsed : 0);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const safeT = Number.isFinite(t) && t >= 0 ? t : 0;
  const showingDashboard = safeT >= SCENE_DURATION * TOPICS.length;
  const topicIndex = Math.min(
    Math.max(0, Math.floor(safeT / SCENE_DURATION)),
    TOPICS.length - 1,
  );
  const localT = safeT - topicIndex * SCENE_DURATION;
  const topic = TOPICS[topicIndex] ?? TOPICS[0];
  const mode: "summary" | "bookmark" = topicIndex % 2 === 0 ? "summary" : "bookmark";

  return (
    <div id="showcase" className="relative mx-auto w-full max-w-6xl px-4">
      <div className="relative">
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-mesh opacity-60 blur-2xl" />

        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-premium"
        >
          {/* Browser title bar */}
          <div className="flex items-center gap-3 border-b border-border bg-secondary/60 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-lg border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span className="truncate">
                {showingDashboard
                  ? "studysync.app/dashboard"
                  : `${topic?.article?.source ?? "example.com"}/article`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="grid h-6 w-6 place-items-center rounded-md bg-gradient-primary text-[10px] font-semibold text-primary-foreground">
                S
              </div>
            </div>
          </div>

          {/* Stage */}
          <div className="relative h-[460px] overflow-hidden bg-gradient-to-b from-background to-secondary/30 sm:h-[520px] md:h-[580px]">
            <AnimatePresence mode="wait">
              {showingDashboard ? (
                <DashboardScene key="dashboard" />
              ) : (
                <ArticleScene key={`topic-${topicIndex}`} topic={topic} localT={localT} mode={mode} />
              )}
            </AnimatePresence>

            {/* Progress dots */}
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-card/80 px-2.5 py-1.5 backdrop-blur">
              {TOPICS.map((tp, i) => (
                <span
                  key={tp.id}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: !showingDashboard && i === topicIndex ? 22 : 6,
                    background:
                      !showingDashboard && i === topicIndex
                        ? `var(${tp.tagVar})`
                        : "color-mix(in oklab, var(--foreground) 18%, transparent)",
                  }}
                />
              ))}
              <span
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: showingDashboard ? 28 : 6,
                  background: showingDashboard
                    ? "var(--primary)"
                    : "color-mix(in oklab, var(--foreground) 18%, transparent)",
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function ArticleScene({
  topic,
  localT,
  mode,
}: {
  topic: Topic;
  localT: number;
  mode: "summary" | "bookmark";
}) {
  // Phases
  const selectProgress = clamp01((localT - 0.8) / 1.4); // 0.8 → 2.2 (1.4s)
  const popupVisible = localT >= 4.8 && localT < 7.3;
  const aiPressed = mode === "summary" && localT >= 6.8 && localT < 7.3;
  const bmPressed = mode === "bookmark" && localT >= 6.8 && localT < 7.3;

  // AI Summary phase
  const summaryVisible = mode === "summary" && localT >= 7.3 && localT < 12.5;
  const savePressed = mode === "summary" && localT >= 12.0 && localT < 12.5;
  const topicCardVisible = mode === "summary" && localT >= 12.5;

  // Bookmark phase
  const bookmarkPanelVisible = mode === "bookmark" && localT >= 7.3 && localT < 10.5;
  const bmRowSelected = mode === "bookmark" && localT >= 8.8;
  const bmSavePressed = mode === "bookmark" && localT >= 9.8 && localT < 10.3;
  const bmSuccessVisible = mode === "bookmark" && localT >= 10.5;

  // Saved highlight persists in topic color after either flow completes
  const savedHighlight =
    (mode === "bookmark" && localT >= 10.5) ||
    (mode === "summary" && localT >= 12.5);

  const [before, hl, after] = splitHighlight(topic.article.paragraph, topic.article.highlight);

  // Measure highlight span relative to the stage so the cursor tracks the
  // ACTUAL text regardless of topic / paragraph length / wrap.
  const stageRef = useRef<HTMLDivElement>(null);
  const hlRef = useRef<HTMLSpanElement>(null);
  const [hlRect, setHlRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current?.getBoundingClientRect();
      const hl = hlRef.current?.getBoundingClientRect();
      if (!stage || !hl || stage.width === 0 || stage.height === 0) return;
      setHlRect({
        left: ((hl.left - stage.left) / stage.width) * 100,
        top: ((hl.top - stage.top) / stage.height) * 100,
        width: (hl.width / stage.width) * 100,
        height: (hl.height / stage.height) * 100,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [topic.id]);

  // Cursor position (% of stage). When we have a measured highlight rect we
  // drive selection-phase positions from it; otherwise fall back to defaults
  // so the first paint still looks reasonable.
  const hlStartX = hlRect ? hlRect.left : 12;
  const hlEndX = hlRect ? hlRect.left + hlRect.width : 44;
  const hlMidY = hlRect ? hlRect.top + hlRect.height * 0.7 : 66;
  const popupX = 72;
  const popupYSummary = 28;
  const popupYBookmark = 36;

  let cursor: { x: number; y: number; opacity: number } = { x: hlStartX, y: hlMidY, opacity: 0 };
  if (localT < 0.8) {
    const p = clamp01(localT / 0.8);
    cursor = { x: hlStartX - 4 + p * 4, y: hlMidY + 22 - p * 22, opacity: p };
  } else if (localT < 2.2) {
    const p = clamp01((localT - 0.8) / 1.4);
    cursor = { x: hlStartX + (hlEndX - hlStartX) * p, y: hlMidY, opacity: 1 };
  } else if (localT < 4.8) {
    cursor = { x: hlEndX, y: hlMidY, opacity: 1 };
  } else if (localT < 5.6) {
    const targetY = mode === "summary" ? popupYSummary : popupYBookmark;
    const p = clamp01((localT - 4.8) / 0.8);
    cursor = { x: hlEndX + (popupX - hlEndX) * p, y: hlMidY + (targetY - hlMidY) * p, opacity: 1 };
  } else if (localT < 6.8) {
    const y = mode === "summary" ? popupYSummary : popupYBookmark;
    cursor = { x: popupX, y, opacity: 1 };
  } else if (localT < 7.3) {
    const y = mode === "summary" ? popupYSummary : popupYBookmark;
    cursor = { x: popupX, y, opacity: 1 };
  } else if (mode === "summary") {
    if (localT < 11.8) {
      cursor = { x: popupX, y: 36, opacity: 0.35 };
    } else if (localT < 12.5) {
      const p = clamp01((localT - 11.8) / 0.7);
      cursor = { x: popupX + (78 - popupX) * p, y: 36 + (78 - 36) * p, opacity: 0.4 + p * 0.6 };
    } else {
      cursor = { x: 78, y: 78, opacity: 0 };
    }
  } else {
    if (localT < 8.8) {
      const p = clamp01((localT - 7.3) / 1.5);
      cursor = { x: popupX, y: popupYBookmark + (52 - popupYBookmark) * p, opacity: 1 };
    } else if (localT < 9.8) {
      const p = clamp01((localT - 8.8) / 1.0);
      cursor = { x: popupX + (84 - popupX) * p, y: 52 + (78 - 52) * p, opacity: 1 };
    } else if (localT < 10.5) {
      cursor = { x: 84, y: 78, opacity: 1 };
    } else {
      const p = clamp01((localT - 10.5) / 1.0);
      cursor = { x: 84, y: 78, opacity: 1 - p };
    }
  }


  return (
    <motion.div
      ref={stageRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 grid grid-cols-12 gap-4 p-5 sm:p-7 md:p-9"
    >
      {/* Article column */}
      <div className="col-span-12 flex flex-col md:col-span-7">
        <div
          className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium"
          style={{ color: `var(${topic.tagVar})` }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: `var(${topic.tagVar})` }} />
          {topic.shortName}
        </div>
        <h3 className="text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {topic.article.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{topic.article.source} · 5 min read</p>

        <div className="mt-5 space-y-3 text-[13.5px] leading-relaxed text-foreground/85 sm:text-sm">
          <p className="text-pretty">
            {before}
            <span
              ref={hlRef}
              className="rounded-[2px] box-decoration-clone px-0.5 transition-[background-size,background-color] duration-100 ease-linear"
              style={
                savedHighlight
                  ? {
                      backgroundImage: `linear-gradient(color-mix(in oklab, var(${topic.tagVar}) 28%, transparent), color-mix(in oklab, var(${topic.tagVar}) 28%, transparent))`,
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                      color: `var(${topic.tagVar})`,
                    }
                  : {
                      backgroundImage:
                        "linear-gradient(rgba(52,120,246,0.32), rgba(52,120,246,0.32))",
                      backgroundSize: `${selectProgress * 100}% 100%`,
                      backgroundRepeat: "no-repeat",
                      color: selectProgress > 0.02 ? "var(--foreground)" : undefined,
                    }
              }
            >
              {hl}
            </span>
            {after}
          </p>
          <p className="text-pretty text-muted-foreground">
            Modern systems abstract away the underlying storage so applications can focus on business logic rather than low-level data wrangling.
          </p>
          <div className="mt-1 h-px bg-border" />
          <p className="text-pretty text-muted-foreground">
            This trade-off between abstraction and performance has shaped decades of engineering decisions and remains central to modern infrastructure.
          </p>
        </div>
      </div>

      {/* Side rail */}
      <div className="relative col-span-12 hidden md:col-span-5 md:block">
        {/* Extension popup */}
        <AnimatePresence>
          {popupVisible && (
            <motion.div
              key="popup"
              initial={{ opacity: 0, y: 8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-2 top-2 w-[280px] overflow-hidden rounded-xl border border-border bg-card shadow-premium"
            >
              <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                <div className="grid h-5 w-5 place-items-center rounded-md bg-gradient-primary text-[9px] font-semibold text-primary-foreground">
                  S
                </div>
                <p className="text-xs font-medium">StudySync</p>
                <span className="ml-auto text-[10px] text-muted-foreground">Selected</span>
              </div>
              <div className="space-y-1 p-1.5">
                <PopupRow
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  label="AI Summary"
                  hint="Generate"
                  highlight={mode === "summary"}
                  pressed={aiPressed}
                />
                <PopupRow
                  icon={<BookmarkPlus className="h-3.5 w-3.5" />}
                  label="Bookmark"
                  hint="Save"
                  highlight={mode === "bookmark"}
                  pressed={bmPressed}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary card */}
        <AnimatePresence>
          {summaryVisible && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-2 w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-card shadow-premium"
            >
              <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-3.5 py-2.5">
                <Sparkles className="h-3.5 w-3.5" style={{ color: `var(${topic.tagVar})` }} />
                <p className="text-xs font-semibold tracking-tight">AI Summary</p>
                <span className="ml-auto rounded-full bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
                  4 points
                </span>
              </div>
              <ul className="space-y-2 p-3.5">
                {topic.summary.map((s, i) => {
                  const revealAt = 7.6 + i * 0.4;
                  const shown = localT >= revealAt;
                  return (
                    <motion.li
                      key={s}
                      initial={false}
                      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 8 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-start gap-2 text-[12.5px] leading-snug text-foreground/85"
                    >
                      <span
                        className="mt-1 grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full"
                        style={{ background: `color-mix(in oklab, var(${topic.tagVar}) 18%, transparent)` }}
                      >
                        <Check className="h-2 w-2" style={{ color: `var(${topic.tagVar})` }} strokeWidth={3} />
                      </span>
                      {s}
                    </motion.li>
                  );
                })}
              </ul>
              <div className="flex items-center gap-1.5 border-t border-border bg-secondary/30 px-3 py-2">
                <button
                  className={`rounded-md px-2 py-1 text-[10.5px] font-medium transition-colors ${
                    savePressed ? "bg-foreground text-background" : "bg-card text-foreground/80"
                  }`}
                >
                  Save to Topic
                </button>
                <span className="text-[10px] text-muted-foreground">→ {topic.shortName}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bookmark-to-topic panel */}
        <AnimatePresence>
          {bookmarkPanelVisible && (
            <motion.div
              key="bm-panel"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-2 w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-card shadow-premium"
            >
              <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-3.5 py-2.5">
                <BookmarkPlus className="h-3.5 w-3.5 text-primary" />
                <p className="text-xs font-semibold tracking-tight">Bookmark to topic</p>
              </div>
              <div className="p-3">
                <button className="mb-2.5 flex w-full items-center gap-2 rounded-md border border-dashed border-border px-2 py-1.5 text-[11px] text-primary hover:bg-secondary">
                  <FolderPlus className="h-3 w-3" />
                  Create new topic
                </button>
                <p className="mb-1.5 text-[9.5px] font-medium uppercase tracking-wider text-muted-foreground">
                  Existing
                </p>
                <div className="space-y-0.5">
                  {[
                    { name: "DBMS", v: "--topic-dbms" },
                    { name: "Operating Systems", v: "--topic-os" },
                    { name: "DSA", v: "--topic-dsa" },
                    { name: "Computer Networks", v: "--topic-cn" },
                    { name: "OOPS", v: "--topic-oops" },
                  ].map((tp) => {
                    const active = bmRowSelected && tp.v === topic.tagVar;
                    return (
                      <div
                        key={tp.name}
                        className={`flex items-center gap-2 rounded-md px-2 py-1 text-[11px] transition-colors ${
                          active ? "bg-secondary" : ""
                        }`}
                      >
                        <Hash className="h-2.5 w-2.5" style={{ color: `var(${tp.v})` }} />
                        <span className="font-medium">{tp.name}</span>
                        {active ? (
                          <span className="ml-auto inline-flex items-center gap-1 text-[9.5px] text-primary">
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                            Selected
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5 border-t border-border bg-secondary/30 px-3 py-2">
                <button
                  className={`rounded-md px-2.5 py-1 text-[10.5px] font-medium transition-colors ${
                    bmSavePressed
                      ? "bg-foreground text-background scale-[0.98]"
                      : bmRowSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  Save bookmark
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bookmark success state */}
        <AnimatePresence>
          {bmSuccessVisible && (
            <motion.div
              key="bm-success"
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-2 w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-card shadow-elegant"
            >
              <div className="flex items-center gap-3 p-3.5">
                <div
                  className="grid h-11 w-11 place-items-center rounded-lg text-[13px] font-semibold text-white"
                  style={{ background: `var(${topic.tagVar})` }}
                >
                  {topic.shortName.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold tracking-tight">
                    Saved to {topic.shortName}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Bookmark added to topic</p>
                </div>
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.15 }}
                  className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </motion.span>
              </div>
              <div className="h-1 w-full bg-border">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  className="h-full"
                  style={{ background: `var(${topic.tagVar})` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Summary → topic card (final state) */}
        <AnimatePresence>
          {topicCardVisible && (
            <motion.div
              key="save"
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-2 w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-card shadow-elegant"
            >
              <div className="flex items-center gap-3 p-3.5">
                <div
                  className="grid h-11 w-11 place-items-center rounded-lg text-[13px] font-semibold text-white"
                  style={{ background: `var(${topic.tagVar})` }}
                >
                  {topic.shortName.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold tracking-tight">{topic.shortName}</p>
                  <p className="text-[11px] text-muted-foreground">{topic.name}</p>
                </div>
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.15 }}
                  className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </motion.span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                {[
                  { label: "Highlights", base: 11 },
                  { label: "Notes", base: 4 },
                  { label: "Summaries", base: 6 },
                ].map((c, i) => (
                  <CounterCell key={c.label} label={c.label} base={c.base} delay={0.25 + i * 0.1} />
                ))}
              </div>
              <div className="h-1 w-full bg-border">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  className="h-full"
                  style={{ background: `var(${topic.tagVar})` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-30"
        animate={{
          left: `${cursor.x}%`,
          top: `${cursor.y}%`,
          opacity: 0,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ filter: "drop-shadow(0 2px 6px rgba(15,23,42,0.18))" }}
      >
        <MousePointer2
          className="h-5 w-5 -translate-x-[2px] -translate-y-[2px] fill-foreground text-foreground"
          strokeWidth={1.5}
        />
        {aiPressed || bmPressed || bmSavePressed || savePressed ? (
          <motion.span
            initial={{ scale: 0.4, opacity: 0.6 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute left-0 top-0 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground/50"
          />
        ) : null}
      </motion.div>
    </motion.div>
  );
}

function CounterCell({ label, base, delay }: { label: string; base: number; delay: number }) {
  return (
    <div className="px-3 py-2.5 text-center">
      <motion.p
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.4 }}
        className="text-[14px] font-semibold tabular-nums"
      >
        {base + 1}
      </motion.p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function PopupRow({
  icon,
  label,
  hint,
  highlight,
  pressed,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  highlight?: boolean;
  pressed?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] transition-all ${
        pressed
          ? "scale-[0.98] bg-primary/12 text-foreground"
          : highlight
            ? "bg-secondary text-foreground"
            : "text-foreground/80"
      }`}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="font-medium">{label}</span>
      <span className="ml-auto text-[10px] text-muted-foreground">{hint}</span>
    </div>
  );
}

function DashboardScene() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 grid grid-cols-12 gap-4 p-5 sm:p-7 md:p-9"
    >
      <aside className="col-span-3 hidden md:flex md:flex-col">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <Hash className="h-3 w-3" /> Topics
        </div>
        <div className="space-y-1">
          {TOPICS.map((tp, i) => (
            <motion.div
              key={tp.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] hover:bg-secondary"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: `var(${tp.tagVar})` }} />
              <span className="font-medium">{tp.shortName}</span>
              <span className="ml-auto text-[10px] text-muted-foreground">
                {12 + i * 3}
              </span>
            </motion.div>
          ))}
        </div>
      </aside>

      <div className="col-span-12 flex flex-col md:col-span-9">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
            <Search className="h-3.5 w-3.5" />
            <span>Search across your knowledge base…</span>
          </div>
          <div className="hidden items-center gap-1 text-[10px] text-muted-foreground sm:flex">
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5">⌘</kbd>
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5">K</kbd>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
          {TOPICS.map((tp, i) => (
            <motion.div
              key={tp.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-gradient-card p-4 shadow-soft"
            >
              <div className="flex items-start justify-between">
                <div
                  className="grid h-9 w-9 place-items-center rounded-lg text-[12px] font-semibold text-white"
                  style={{ background: `var(${tp.tagVar})` }}
                >
                  {tp.shortName.slice(0, 2)}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="mt-3 text-[13px] font-semibold tracking-tight">{tp.shortName}</p>
              <p className="line-clamp-1 text-[11px] text-muted-foreground">{tp.name}</p>
              <div className="mt-3 flex items-center gap-3 text-[10.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <FileText className="h-3 w-3" /> {12 + i * 3}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> {6 + i * 2}
                </span>
                <span className="inline-flex items-center gap-1">
                  <PenLine className="h-3 w-3" /> {3 + i}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function splitHighlight(paragraph: string, highlight: string): [string, string, string] {
  const idx = paragraph.indexOf(highlight);
  if (idx === -1) return [paragraph, "", ""];
  return [
    paragraph.slice(0, idx),
    paragraph.slice(idx, idx + highlight.length),
    paragraph.slice(idx + highlight.length),
  ];
}
