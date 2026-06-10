import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — StudySync" },
      { name: "description", content: "Reset your StudySync password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="Enter the email associated with your account and we'll send a reset link."
    >
      <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
        <label className="block">
          <div className="mb-1.5 text-[12px] font-medium text-foreground">Email</div>
          <input
            type="email"
            placeholder="you@example.com"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[13px] text-foreground shadow-sm outline-none placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-2 focus:ring-ring"
          />
        </label>
        <button
          type="submit"
          className="h-10 w-full rounded-lg bg-gradient-primary text-[13px] font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01]"
        >
          Send reset link
        </button>
      </form>

      <p className="mt-6 text-center text-[12.5px] text-muted-foreground">
        Remember it?{" "}
        <Link to="/signin" className="font-medium text-foreground hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}