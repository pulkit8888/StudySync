import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Brain, ArrowLeft } from "lucide-react";

export function AuthLayout({
  children,
  eyebrow,
  title,
  subtitle,
}: {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Mesh background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-hero" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-120 w-205 -translate-x-1/2 rounded-full bg-gradient-mesh opacity-50 blur-3xl" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Brain className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">StudySync</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-col px-6 pb-16 pt-6 sm:pt-12">
        <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur-xl">
          {eyebrow ? (
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-1.5 text-[13.5px] text-muted-foreground">{subtitle}</p>

          <div className="mt-7">{children}</div>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          By continuing, you agree to our{" "}
          <a className="underline-offset-4 hover:text-foreground hover:underline" href="#">
            Terms
          </a>{" "}
          and{" "}
          <a className="underline-offset-4 hover:text-foreground hover:underline" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </main>
    </div>
  );
}

export function SocialRow() {
  return (
    <button className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card text-[12.5px] font-medium text-foreground transition-colors hover:bg-secondary">
      <GoogleIcon /> Continue with Google
    </button>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.99 10.99 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}