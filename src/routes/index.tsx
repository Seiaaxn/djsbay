import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Zap,
  ShieldCheck,
  Activity,
  Users,
  Sparkles,
  ArrowRight,
  GitBranch,
} from "lucide-react";
import { img as resolveImg, onImgError } from "../lib/site-images";
import { getPersistedSessionStart } from "../lib/session";
import { CardBackdrop } from "../components/HeroBanner";
import { HashtagSection } from "../components/TikTokSections";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { GEN_MEMBER_COUNTS, GEN_FOLLOWER_REQUIREMENTS } from "../lib/site-config";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Five Fail Family — Marga Editor & Kreator Anime" },
      {
        name: "description",
        content:
          "Marga editor & kreator anime. Selalu open member — Gen 1, Gen 2, dan Gen 3 dengan jalur seleksi terbuka.",
      },
      { property: "og:title", content: "Five Fail Family" },
      {
        property: "og:description",
        content: "Marga editor & kreator anime. Selalu open member.",
      },
    ],
  }),
  component: Index,
});

const RAW_IMAGES = [
  "https://cdn.nekohime.site/file/1cnw6mmj.png",
  "https://cdn.nekohime.site/file/nntkcmr6.png",
  "https://cdn.nekohime.site/file/89zjqlrw.png",
];

const genImages = RAW_IMAGES.map(resolveImg);
const memberCounts = GEN_MEMBER_COUNTS;
const totalMembers = memberCounts.reduce((s, g) => s + g.count, 0);

const heroFeatures = [
  { icon: Zap, label: "Editor & Kreator" },
  { icon: ShieldCheck, label: "Seleksi Terkurasi" },
  { icon: Activity, label: "Aktif Harian" },
  { icon: Sparkles, label: "3 Generasi" },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function useSessionUptime() {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    // Origin diambil dari local storage agar uptime tidak reset tiap reload
    const origin = getPersistedSessionStart();
    setSec(Math.floor((Date.now() - origin) / 1000));
    const id = setInterval(() => setSec(Math.floor((Date.now() - origin) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const parts = [`${d}d`];
  if (h > 0) parts.push(`${pad(h)}h`);
  parts.push(`${pad(m)}m`);
  parts.push(`${pad(s)}s`);
  return parts.join(" ");
}

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  tint,
  delay,
}: {
  label: string;
  value: React.ReactNode;
  note: string;
  icon: React.ElementType;
  tint: string;
  delay: number;
}) {
  return (
    <div
      className="glass-card glass-card-hover animate-rise p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[0.68rem] font-bold tracking-widest text-muted-foreground uppercase">
          {label}
        </p>
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
          style={{ background: `color-mix(in oklab, ${tint} 14%, white)`, color: tint }}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="font-display mt-4 text-3xl font-bold tracking-tight md:text-4xl">{value}</p>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs font-semibold" style={{ color: tint }}>
          {note}
        </span>
        <span className="font-mono text-[0.65rem] tracking-wider text-muted-foreground uppercase">
          Realtime
        </span>
      </div>
    </div>
  );
}

function Index() {
  const { t } = useI18n();
  const [slide, setSlide] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(genImages.map(() => false));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gens = t.home.gens;

  const handleLoad = (i: number) => {
    setLoaded((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  const allLoaded = loaded.every(Boolean);

  const startTimer = () => {
    timerRef.current = setInterval(() => setSlide((s) => (s + 1) % genImages.length), 4500);
  };

  useEffect(() => {
    if (!allLoaded) return;
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [allLoaded]);

  const goToSlide = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSlide(i);
    startTimer();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      {/* ── Hero card ─────────────────────────────────────────── */}
      <section className="glass-card animate-rise mt-8 overflow-hidden p-7 md:p-12">
        {/* Banner artwork di dalam kartu — memudar ke arah teks (ala KyzzAPI) */}
        <CardBackdrop />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--color-card) 0%, transparent 38%)",
          }}
          aria-hidden
        />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="chip">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              {t.home.badge}
            </span>

            <h1 className="font-display mt-5 flex flex-wrap items-center gap-3 text-4xl font-bold tracking-tight md:text-6xl">
              Five Fail
              <span className="rounded-xl bg-secondary px-3 py-1 text-2xl md:text-4xl">
                FAMILY
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-muted-foreground">{t.home.heroDesc}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {heroFeatures.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold"
                >
                  <f.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  {f.label}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/join" className="btn-primary">
                {t.common.joinNow}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#konten" className="btn-ghost">
                {t.common.explore}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-2.5 py-1.5 font-mono text-xs text-muted-foreground">
                <GitBranch className="h-3.5 w-3.5" />
                v3.0.0
              </span>
              <span className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground">
                Created by <strong className="text-foreground">Kyuna</strong>
              </span>
            </div>
          </div>

          {/* Gen artwork stack */}
          <div className="relative hidden justify-center md:flex">
            {genImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={gens[i]?.title ?? `Gen ${i + 1}`}
                className="animate-float-soft h-40 w-40 rounded-3xl object-cover shadow-lg ring-1 ring-border lg:h-48 lg:w-48"
                style={{
                  marginLeft: i === 0 ? 0 : "-2.5rem",
                  animationDelay: `${i * 700}ms`,
                  zIndex: i === 1 ? 3 : 2 - i,
                  transform: `rotate(${(i - 1) * 5}deg)`,
                }}
                loading="eager"
                decoding="sync"
                onError={onImgError}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Overview metric ──────────────────────────────────── */}
      <section className="mt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Overview Metric</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.home.statsDesc}</p>
          </div>
          <span className="chip" style={{ color: "var(--accent-3)" }}>
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: "var(--accent-3)" }}
            />
            Live Status
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            label="Total Member"
            value={<AnimatedCounter value={totalMembers} suffix="+" />}
            note="Gabungan 3 generasi"
            icon={Users}
            tint="var(--accent-2)"
            delay={0}
          />
          <MetricCard
            label="Generasi Aktif"
            value={<AnimatedCounter value={memberCounts.length} />}
            note="Open recruitment"
            icon={Sparkles}
            tint="var(--accent-3)"
            delay={90}
          />
        </div>
      </section>

      {/* ── Recent activity / generasi table ─────────────────── */}
      <section className="mt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">{t.home.statsTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ringkasan generasi & syarat followers terkini
            </p>
          </div>
          <Link
            to="/generations"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Lihat semua →
          </Link>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="hidden grid-cols-[1.6fr_0.8fr_0.8fr] gap-4 border-b border-border bg-secondary/60 px-6 py-3 font-mono text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase sm:grid">
            <span>Generasi</span>
            <span>Member</span>
            <span>Syarat Followers</span>
          </div>
          {memberCounts.map((m, i) => (
            <div
              key={m.gen}
              className="grid grid-cols-1 gap-2 border-b border-border px-6 py-4 transition-colors last:border-b-0 hover:bg-secondary/40 sm:grid-cols-[1.6fr_0.8fr_0.8fr] sm:items-center sm:gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary font-mono text-xs font-bold">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{gens[i]?.title ?? m.gen}</p>
                  <p className="truncate text-xs text-muted-foreground">{gens[i]?.tag}</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold tabular-nums">{m.count} member</span>
              <span
                className="w-fit rounded-full border px-2.5 py-1 font-mono text-[0.7rem] font-bold"
                style={{
                  color: "var(--accent-3)",
                  borderColor: "color-mix(in oklab, var(--accent-3) 35%, white)",
                  background: "color-mix(in oklab, var(--accent-3) 10%, white)",
                }}
              >
                {GEN_FOLLOWER_REQUIREMENTS[i]?.followers
                  ? `${GEN_FOLLOWER_REQUIREMENTS[i]!.followers}+`
                  : "Bebas"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Slider ───────────────────────────────────────────── */}
      <section id="konten" className="glass-card mt-16 p-6 md:p-10">
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {genImages.map((src, i) => (
            <img
              key={`preload-${i}`}
              src={src}
              alt=""
              width={224}
              height={224}
              onLoad={() => handleLoad(i)}
              onError={() => handleLoad(i)}
            />
          ))}
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex"
            style={{
              transform: `translateX(-${slide * 100}%)`,
              transition: allLoaded ? "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
              willChange: "transform",
            }}
          >
            {gens.map((g, i) => (
              <div
                key={g.title}
                className="flex min-w-full flex-col items-center gap-6 md:flex-row"
              >
                <img
                  src={genImages[i]}
                  alt={g.title}
                  className="h-40 w-40 rounded-2xl object-cover ring-1 ring-border md:h-56 md:w-56"
                  loading="eager"
                  decoding="sync"
                  onError={onImgError}
                />
                <div className="text-center md:text-left">
                  <p className="text-accent-soft text-xs tracking-widest uppercase">{g.tag}</p>
                  <h2 className="mt-1 text-2xl font-bold md:text-3xl">{g.title}</h2>
                  <p className="mt-2 max-w-md text-muted-foreground">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {gens.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === slide ? "w-8 bg-accent" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hashtags (live via TikTok public API) */}
      <HashtagSection />

      <footer className="mt-20 border-t border-border pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Five Fail Family ·{" "}
        <a
          href="https://www.tiktok.com/@inishinjirs"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-foreground underline-offset-4 transition-colors hover:underline"
        >
          {t.home.footer}
        </a>
      </footer>
    </main>
  );
}
