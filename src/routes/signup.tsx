import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, Divider, SocialRow } from "@/components/auth/AuthLayout";
import { Check } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — StudySync" },
      { name: "description", content: "Start building your second brain with StudySync." },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your StudySync account"
      subtitle="Highlight anything. Summarize with AI. Organize knowledge that compounds."
    >
      <SocialRow />
      <Divider label="or sign up with email" />

      <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" placeholder="Aarav" />
          <Field label="Last name" placeholder="Rao" />
        </div>
        <Field label="Email" type="email" placeholder="you@example.com" />
        <Field label="Password" type="password" placeholder="At least 8 characters" />

        <ul className="space-y-1 pt-1 text-[11.5px] text-muted-foreground">
          {["8+ characters", "One uppercase letter", "One number"].map((r) => (
            <li key={r} className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-primary" />
              {r}
            </li>
          ))}
        </ul>

        <button
          type="submit"
          className="mt-2 h-10 w-full rounded-lg bg-gradient-primary text-[13px] font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01]"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-[12.5px] text-muted-foreground">
        Already have an account?{" "}
        <Link to="/signin" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[12px] font-medium text-foreground">{label}</div>
      <input
        {...props}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
