import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CTA() {
  return (
    <section id="pricing" className="relative mx-auto max-w-5xl px-4 py-16 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-card p-10 text-center shadow-elegant sm:p-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-mesh opacity-60" />
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Start building your second brain today
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-pretty text-muted-foreground">
          Join thousands of students and lifelong learners turning the open web into structured,
          searchable knowledge.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/signin"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
          >
            Start Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="mailto:pulkitvishwkarma9@gmail.com"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
          >
            Talk to founders
          </a>
        </div>
      </div>

      <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} StudySync. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </footer>
    </section>
  );
}
