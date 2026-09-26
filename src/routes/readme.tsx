import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Gift,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Palette,
  Film,
  GraduationCap,
  Hash,
  Users,
  DoorOpen,
  ScrollText,
  ArrowRight,
} from "lucide-react";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/readme")({
  head: () => ({
    meta: [
      { title: "Five Fail Family Readme" },
      {
        name: "description",
        content:
          "Tujuan utama grup Five Fail Family: kumpulan creator preset, creator anime, editor, dan creator TikTok.",
      },
      { property: "og:title", content: "Readme Five Fail Family" },
      {
        property: "og:description",
        content: "Apa itu Five Fail Family? Penjelasan tujuan, divisi, dan peran.",
      },
    ],
  }),
  component: ReadmePage,
});

const purposeIcons = [BookOpen, Gift, Megaphone, ShieldCheck];
const roleIcons = [Palette, Film, GraduationCap, Hash, Users, DoorOpen];

function ReadmePage() {
  const { t } = useI18n();
  const r = t.readme;

  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden px-4 pb-20">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl pt-4 text-center">

        <span className="chip mt-5">
          <ScrollText className="h-3.5 w-3.5" />
          {r.badge}
        </span>
        <h1 className="font-display mt-5 text-4xl font-bold tracking-tight md:text-5xl">
          {r.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{r.intro}</p>
      </section>

      {/* ── Purpose ────────────────────────────────────────────── */}
      <section className="mx-auto mt-14 max-w-3xl">
        <h2 className="mb-5 text-2xl font-bold">{r.purposeTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {r.purposes.map((p, i) => {
            const Icon = purposeIcons[i] ?? Sparkles;
            return (
              <div key={p} className="glass-card glass-card-hover flex items-start gap-3 p-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-foreground bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="pt-1.5 text-sm text-muted-foreground">{p}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Roles ──────────────────────────────────────────────── */}
      <section className="mx-auto mt-14 max-w-3xl">
        <h2 className="mb-5 text-2xl font-bold">{r.rolesTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {r.roles.map((role, i) => {
            const Icon = roleIcons[i] ?? Sparkles;
            return (
              <article key={role.title} className="glass-card glass-card-hover p-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 border-foreground bg-secondary/50 text-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-bold">{role.title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{role.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Rules ──────────────────────────────────────────────── */}
      <section className="glass-card mx-auto mt-14 max-w-3xl p-6 md:p-8">
        <h2 className="text-xl font-bold">{r.rulesTitle}</h2>
        <ol className="mt-5 space-y-0">
          {r.rules.map((rule, i) => (
            <li key={rule} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-foreground bg-accent font-mono text-xs font-extrabold text-accent-foreground">
                  {i + 1}
                </span>
                {i < r.rules.length - 1 && (
                  <span className="mt-1 mb-1 w-0.5 flex-1 bg-foreground/20" style={{ minHeight: 20 }} />
                )}
              </div>
              <span className="pt-1 pb-4 text-sm text-muted-foreground">{rule}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────── */}
      <section className="glass-card mx-auto mt-14 max-w-3xl p-6 text-center md:p-8">
        <h3 className="font-display text-xl font-bold">{r.ctaTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{r.ctaDesc}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link to="/generations" className="btn-ghost inline-flex items-center gap-2">
            <Users className="h-4 w-4" />
            {r.viewGens}
          </Link>
          <Link to="/join" className="btn-primary inline-flex items-center gap-2">
            {t.common.joinNow}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
