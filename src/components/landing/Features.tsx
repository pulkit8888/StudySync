import { motion } from "framer-motion";
import {
  Highlighter,
  Sparkles,
  FolderTree,
  PenLine,
  LayoutDashboard,
  Globe,
  Search,
  Repeat,
} from "lucide-react";

const features = [
  {
    icon: Highlighter,
    title: "Smart Highlighting",
    desc: "Select text on any website and capture it with one keystroke. StudySync preserves context, source, and timestamp automatically.",
  },
  {
    icon: Sparkles,
    title: "AI Summaries",
    desc: "Distill long articles into crisp bullet points. Summaries adapt to the topic so technical depth is preserved.",
  },
  {
    icon: FolderTree,
    title: "Topic Organization",
    desc: "Group highlights into color-coded topics. DBMS, OS, DSA — your knowledge takes shape as you learn.",
  },
  {
    icon: PenLine,
    title: "Personal Notes",
    desc: "Add your own context to any highlight. Markdown-ready, threaded, and always linked to the source.",
  },
  {
    icon: LayoutDashboard,
    title: "Knowledge Dashboard",
    desc: "One workspace for every topic. See highlights, summaries, and notes side by side at a glance.",
  },
  {
    icon: Globe,
    title: "Browser Extension",
    desc: "Works on Chrome, Arc, Edge, and Brave. Capture knowledge without leaving the page.",
  },
  {
    icon: Search,
    title: "Universal Search",
    desc: "Find anything you've ever read in milliseconds. Semantic search understands intent, not just keywords.",
  },
  {
    icon: Repeat,
    title: "Revision Mode",
    desc: "Spaced revision prompts surface the right notes at the right time, so concepts actually stick.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Everything you need
        </p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          A complete system for serious learners
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Eight tightly integrated features that turn scattered reading into a structured,
          searchable knowledge base.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant"
          >
            <div className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-primary transition-colors group-hover:border-primary/30">
              <f.icon className="h-4 w-4" strokeWidth={2} />
            </div>
            <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{f.desc}</p>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}