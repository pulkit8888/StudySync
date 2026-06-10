import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { User, Palette, Sparkles, Lock, Bell, Check } from "lucide-react";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "theme", label: "Appearance", icon: Palette },
  { id: "ai", label: "AI Model", icon: Sparkles },
  { id: "account", label: "Account", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — StudySync" },
      { name: "description", content: "Manage your StudySync preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [section, setSection] = useState<SectionId>("profile");

  return (
    <AppShell title="Settings" subtitle="Manage your account, appearance, and AI preferences.">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-0.5 rounded-xl border border-border bg-card p-2 shadow-sm">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium transition-colors ${
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                {s.label}
              </button>
            );
          })}
        </nav>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {section === "profile" && <ProfileSection />}
          {section === "theme" && <AppearanceSection />}
          {section === "ai" && <AISection />}
          {section === "account" && <AccountSection />}
          {section === "notifications" && <NotificationsSection />}
        </div>
      </div>
    </AppShell>
  );
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <p className="mt-0.5 text-[12.5px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 border-t border-border py-4 sm:grid-cols-[200px_1fr]">
      <div>
        <p className="text-[12.5px] font-medium">{label}</p>
        {hint ? <p className="mt-0.5 text-[11.5px] text-muted-foreground">{hint}</p> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

function TextField({
  defaultValue,
  placeholder,
  type = "text",
}: {
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      defaultValue={defaultValue}
      placeholder={placeholder}
      type={type}
      className="h-9 w-full max-w-md rounded-lg border border-border bg-background px-3 text-[13px] outline-none focus:border-primary/40 focus:ring-2 focus:ring-ring"
    />
  );
}

function ProfileSection() {
  return (
    <div>
      <SectionTitle title="Profile" sub="How you appear inside StudySync." />
      <div className="flex items-center gap-4 border-t border-border pt-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-primary text-lg font-semibold text-primary-foreground shadow-glow">
          AR
        </div>
        <div>
          <button className="h-8 rounded-md border border-border bg-card px-3 text-[12px] font-medium transition-colors hover:bg-secondary">
            Change avatar
          </button>
          <p className="mt-1 text-[11px] text-muted-foreground">PNG or JPG, up to 2MB.</p>
        </div>
      </div>
      <Row label="Full name">
        <TextField defaultValue="Aarav Rao" />
      </Row>
      <Row label="Email" hint="Used for sign-in and account recovery.">
        <TextField defaultValue="aarav@studysync.app" type="email" />
      </Row>
      <Row label="Bio" hint="Optional. Shown on your shared knowledge pages.">
        <textarea
          defaultValue="CS senior building a second brain for systems and algorithms."
          rows={3}
          className="w-full max-w-md rounded-lg border border-border bg-background p-3 text-[13px] outline-none focus:border-primary/40 focus:ring-2 focus:ring-ring"
        />
      </Row>
      <div className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
        <button className="h-9 rounded-lg border border-border bg-card px-3 text-[12.5px] font-medium hover:bg-secondary">
          Cancel
        </button>
        <button className="h-9 rounded-lg bg-gradient-primary px-3.5 text-[12.5px] font-semibold text-primary-foreground shadow-glow">
          Save changes
        </button>
      </div>
    </div>
  );
}

function AppearanceSection() {
  const themes = [
    { id: "light", label: "Light", swatch: ["#F8FAFC", "#FFFFFF", "#2563EB"] },
    { id: "dim", label: "Dim", swatch: ["#EEF2FF", "#FFFFFF", "#0F172A"] },
    { id: "system", label: "System", swatch: ["#F8FAFC", "#0F172A", "#2563EB"] },
  ];
  const [active, setActive] = useState("light");
  return (
    <div>
      <SectionTitle title="Appearance" sub="Customize how StudySync feels." />
      <Row label="Theme">
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`rounded-xl border p-3 text-left transition-colors ${
                active === t.id ? "border-primary/40 ring-2 ring-ring" : "border-border bg-card hover:bg-secondary"
              }`}
            >
              <div className="flex h-16 gap-1 overflow-hidden rounded-lg">
                {t.swatch.map((c) => (
                  <span key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
              <p className="mt-2 text-[12px] font-medium">{t.label}</p>
            </button>
          ))}
        </div>
      </Row>
      <Row label="Accent color" hint="Used for highlights and key actions.">
        <div className="flex gap-2">
          {["--topic-dbms", "--topic-os", "--topic-dsa", "--topic-cn", "--topic-oops"].map((v) => (
            <button
              key={v}
              className="h-8 w-8 rounded-full ring-2 ring-transparent transition-all hover:ring-ring"
              style={{ background: `var(${v})` }}
            />
          ))}
        </div>
      </Row>
      <Row label="Reduce motion" hint="Disable nonessential animations.">
        <Toggle />
      </Row>
    </div>
  );
}

function AISection() {
  const models = [
    { id: "fast", name: "StudySync Fast", desc: "Best for quick captures. Sub-second summaries.", default: false },
    { id: "balanced", name: "StudySync Balanced", desc: "Recommended. Great quality for most reading.", default: true },
    { id: "deep", name: "StudySync Deep", desc: "Slower, deeper synthesis for research-grade work.", default: false },
  ];
  const [active, setActive] = useState("balanced");
  return (
    <div>
      <SectionTitle title="AI Model" sub="Choose the engine powering your summaries and synthesis." />
      <div className="mt-4 space-y-2">
        {models.map((m) => (
          <button
            key={m.id}
            onClick={() => setActive(m.id)}
            className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors ${
              active === m.id ? "border-primary/40 bg-primary/5" : "border-border bg-card hover:bg-secondary"
            }`}
          >
            <div
              className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                active === m.id ? "border-primary bg-primary text-primary-foreground" : "border-border"
              }`}
            >
              {active === m.id ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
            </div>
            <div className="flex-1">
              <p className="text-[12.5px] font-semibold">{m.name}</p>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">{m.desc}</p>
            </div>
            {m.default ? (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Default
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <Row label="Summary length" hint="How verbose AI summaries should be.">
        <div className="flex gap-1.5 rounded-lg border border-border bg-card p-0.5">
          {["Short", "Medium", "Long"].map((l, i) => (
            <button
              key={l}
              className={`flex-1 rounded-md px-3 py-1.5 text-[12px] transition-colors ${
                i === 1 ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </Row>
    </div>
  );
}

function AccountSection() {
  return (
    <div>
      <SectionTitle title="Account" sub="Manage authentication and data." />
      <Row label="Password" hint="Use at least 8 characters with a mix of cases and numbers.">
        <button className="h-9 rounded-lg border border-border bg-card px-3 text-[12.5px] font-medium hover:bg-secondary">
          Change password
        </button>
      </Row>
      <Row label="Two-factor auth" hint="Add an extra layer of security to your account.">
        <Toggle defaultOn />
      </Row>
      <Row label="Export data" hint="Download a JSON archive of your highlights, notes, and summaries.">
        <button className="h-9 rounded-lg border border-border bg-card px-3 text-[12.5px] font-medium hover:bg-secondary">
          Export
        </button>
      </Row>
      <Row label="Delete account" hint="Permanently delete your account and all data.">
        <button className="h-9 rounded-lg border border-destructive/30 bg-destructive/5 px-3 text-[12.5px] font-medium text-destructive hover:bg-destructive/10">
          Delete account
        </button>
      </Row>
    </div>
  );
}

function NotificationsSection() {
  return (
    <div>
      <SectionTitle title="Notifications" sub="Decide what reaches your inbox." />
      <Row label="Weekly digest" hint="A weekly recap of your knowledge growth.">
        <Toggle defaultOn />
      </Row>
      <Row label="New summary ready" hint="Notify me when AI finishes processing a long article.">
        <Toggle defaultOn />
      </Row>
      <Row label="Product updates" hint="Occasional emails about new features.">
        <Toggle />
      </Row>
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-primary" : "bg-secondary"}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
