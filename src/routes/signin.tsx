import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, Divider, SocialRow } from "@/components/auth/AuthLayout";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — StudySync" },
      { name: "description", content: "Sign in to your StudySync account." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to StudySync"
      subtitle="Pick up where you left off in your second brain."
    >
      <SocialRow />
      <Divider label="or continue with email" />

      <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
        <Field label="Email" type="email" placeholder="you@example.com" />
        <Field
          label="Password"
          type="password"
          placeholder="••••••••"
          rightLabel={
            <Link
              to="/forgot-password"
              className="text-[11.5px] text-primary hover:underline"
            >
              Forgot password?
            </Link>
          }
        />

        <button
          type="submit"
          className="mt-2 h-10 w-full rounded-lg bg-gradient-primary text-[13px] font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01]"
        >
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-[12.5px] text-muted-foreground">
        New to StudySync?{" "}
        <Link to="/signup" className="font-medium text-foreground hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

function Field({
  label,
  rightLabel,
  ...props
}: { label: string; rightLabel?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[12px] font-medium text-foreground">{label}</span>
        {rightLabel}
      </div>
      <input
        {...props}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
