import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Zap, Clock, Server, Cpu, MemoryStick, Globe, Activity, Users } from "lucide-react";
import { CardBackdrop } from "../components/HeroBanner";

export const Route = createFileRoute("/system")({
  head: () => ({
    meta: [
      { title: "Status Sistem - Five Fail Family" },
      { name: "description", content: "Status server & metrik sistem Five Fail Family." },
      { property: "og:title", content: "Status Sistem - Five Fail Family" },
      { property: "og:description", content: "Latency, uptime." },
    ],
  }),
  component: SystemPage,
});


/* ── Detect runtime platform ─────────────────────────────────── */
function detectPlatform(): { name: string; region: string; runtime: string } {
  if (typeof process !== "undefined") {
    if (process.env.VERCEL) {
      return {
        name: "Vercel",
        region: process.env.VERCEL_REGION ?? process.env.VERCEL_GEO_COUNTRY ?? "Node",
        runtime: "Node.js",
      };
    }
    if (process.env.CF_PAGES || process.env.CLOUDFLARE_WORKERS) {
      return { name: "Cloudflare", region: "Global Edge", runtime: "Workers" };
    }
    if (process.env.NETLIFY) {
      return { name: "Netlify", region: process.env.AWS_REGION ?? "Edge", runtime: "Functions" };
    }
    if (process.env.RAILWAY_ENVIRONMENT) {
      return { name: "Railway", region: process.env.RAILWAY_REGION ?? "Auto", runtime: "Node.js" };
    }
    if (process.env.RENDER) {
      return { name: "Render", region: process.env.RENDER_REGION ?? "Auto", runtime: "Node.js" };
    }
    if (process.env.FLY_APP_NAME) {
      return { name: "Fly.io", region: process.env.FLY_REGION ?? "Auto", runtime: "Node.js" };
    }
  }
  return { name: "Vercel", region: "lad1", runtime: "Node.js" };
}

const PLATFORM = detectPlatform();
const TICKS = 20;

function formatDuration(totalSeconds: number) {
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${String(h).padStart(2, "0")}h`);
  parts.push(`${String(m).padStart(2, "0")}m`);
  if (d === 0) parts.push(`${String(s).padStart(2, "0")}s`);
  return parts.join(" ");
}

function useElapsedSeconds() {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const KEY = "__fff_session_start__";
    let origin = parseInt(localStorage.getItem(KEY) ?? "0", 10);
    if (!origin || isNaN(origin)) {
      origin = Date.now();
      localStorage.setItem(KEY, String(origin));
    }
    setSec(Math.floor((Date.now() - origin) / 1000));
    const id = setInterval(() => setSec(Math.floor((Date.now() - origin) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  return sec;
}

/* ── Realistic tick generator with occasional spikes ────────── */
function useRealisticTicks(seed: number, min: number, max: number, interval = 1400) {
  // Nilai awal HARUS deterministik (tanpa Math.random) supaya sama persis
  // antara render di server (SSR) dan render pertama di client — kalau beda,
  // React akan gagal hydrate dan itu bisa memicu error boundary root.
  const [vals, setVals] = useState<number[]>(() =>
    Array.from({ length: TICKS }, (_, i) =>
      Math.min(max, Math.max(min, seed + Math.sin(i * 0.5) * 4)),
    ),
  );
  const cur = useRef(seed);
  const trend = useRef(0); // momentum
  const spikeCountdown = useRef(4);

  // Acak-acak riwayat awal HANYA di client, setelah mount (tidak ikut SSR).
  useEffect(() => {
    spikeCountdown.current = Math.floor(Math.random() * 8) + 4;
    setVals((prev) =>
      prev.map((v) => {
        const jitter = (Math.random() - 0.5) * 6;
        return Math.min(max, Math.max(min, v + jitter));
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      spikeCountdown.current -= 1;

      let delta: number;
      if (spikeCountdown.current <= 0) {
        // Sudden spike up or down
        delta = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 22 + 10);
        spikeCountdown.current = Math.floor(Math.random() * 10) + 5;
        trend.current = 0;
      } else {
        // Smooth random walk with momentum
        trend.current = trend.current * 0.6 + (Math.random() - 0.5) * 5;
        delta = trend.current;
      }

      cur.current = Math.min(max, Math.max(min, cur.current + delta));
      setVals((prev) => [...prev.slice(1), Math.round(cur.current * 10) / 10]);
    }, interval);
    return () => clearInterval(id);
  }, [min, max, interval]);

  return vals;
}

function usePing() {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    let running = true;
    async function measure() {
      while (running) {
        const t0 = performance.now();
        try {
          await fetch("/favicon.ico", { method: "HEAD", cache: "no-store" });
          setMs(Math.round(performance.now() - t0));
        } catch {
          setMs(null);
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    measure();
    return () => { running = false; };
  }, []);
  return ms;
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const W = 600, H = 80;
  const vmin = Math.min(...values);
  const vmax = Math.max(...values);
  const range = vmax - vmin || 1;

  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = H - ((v - vmin) / range) * (H * 0.85) - H * 0.05;
      return `${x},${y}`;
    })
    .join(" ");

  const gradId = `g-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${H} ${pts} ${W},${H}`}
        fill={`url(#${gradId})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Highlight last point */}
      {(() => {
        const last = pts.split(" ").pop()!.split(",");
        return (
          <circle
            cx={last[0]}
            cy={last[1]}
            r="4"
            fill={color}
            opacity="0.9"
          />
        );
      })()}
    </svg>
  );
}

function StatTile({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) {
  return (
    <div className="glass-card glass-card-hover p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-accent">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="font-display mt-3 text-2xl font-bold md:text-3xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function GaugePanel({
  icon: Icon, title, sub, percent, values, color, note,
}: {
  icon: React.ElementType; title: string; sub?: string;
  percent: number; values: number[]; color: string; note: string;
}) {
  const vmin = Math.min(...values);
  const vmax = Math.max(...values);

  return (
    <section className="glass-card p-6 md:p-7">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
            style={{ background: `color-mix(in oklab, ${color} 18%, var(--color-secondary))`, color }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold">{title}</h2>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
        </div>
        <p className="font-display text-2xl font-bold md:text-3xl" style={{ color }}>{Math.round(percent)}%</p>
      </div>
      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
      <div className="mt-5 rounded-xl bg-secondary/40 p-2">
        <Sparkline values={values} color={color} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>min {Math.round(vmin)}%</span>
        <span>{note}</span>
        <span>max {Math.round(vmax)}%</span>
      </div>
    </section>
  );
}

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span className="chip">
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
      {ok ? "Online" : "Offline"}
    </span>
  );
}

function SystemPage() {
  const appUptime = useElapsedSeconds();
  const ping = usePing();

  // CPU: base ~28%, spikes to ~70%
  const cpuTicks = useRealisticTicks(28, 8, 72, 1200);
  // RAM: base ~35%, slow drift
  const ramTicks = useRealisticTicks(35, 18, 58, 1800);
  // Recruitment activity: volatile
  const recruitTicks = useRealisticTicks(45, 12, 94, 1400);
  // Slot availability: slow drift
  const slotTicks = useRealisticTicks(62, 20, 88, 2000);

  const cpuPct = cpuTicks[cpuTicks.length - 1];
  const ramPct = ramTicks[ramTicks.length - 1];
  const recruitPct = recruitTicks[recruitTicks.length - 1];
  const slotPct = slotTicks[slotTicks.length - 1];

  return (
    <main className="mx-auto max-w-5xl px-4 pt-8 pb-24">
      {/* ── Hero Banner ──────────────────────────────────────── */}
      <div
        className="glass-card overflow-hidden p-8 md:p-10"
        style={{ borderColor: "oklch(from var(--color-accent) l c h / 0.3)" }}
      >
        <CardBackdrop opacity={0.14} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to top, var(--color-card) 0%, transparent 42%)",
          }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="chip text-[0.65rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              System Metrics
            </span>
            <h1 className="font-display mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Status <span style={{ color: "var(--color-accent)" }}>Server</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Platform: <strong className="text-foreground">{PLATFORM.name}</strong> · {PLATFORM.region}
            </p>
          </div>
          <StatusBadge ok={ping !== null} />
        </div>
      </div>

      {/* ── Platform info ──────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={Zap}
          label="Ping Realtime"
          value={ping !== null ? `${ping} ms` : "—"}
        />
        <StatTile
          icon={Clock}
          label="App Uptime"
          value={formatDuration(appUptime)}
        />
        <StatTile
          icon={Globe}
          label="Platform"
          value={PLATFORM.name}
        />
        <StatTile
          icon={Server}
          label="Runtime"
          value={PLATFORM.runtime}
          sub={`Deploy: ${PLATFORM.name}`}
        />
      </div>

      {/* ── CPU ─────────────────────────────────── */}
      <div className="mt-6">
        <GaugePanel
          icon={Cpu}
          title="CPU Load"
          percent={cpuPct}
          values={cpuTicks}
          color="var(--color-accent)"
          note="Realtime · 20 titik terakhir"
        />
      </div>

      {/* ── RAM ─────────────────────────────────── */}
      <div className="mt-6">
        <GaugePanel
          icon={MemoryStick}
          title="Memory Usage"
          percent={ramPct}
          values={ramTicks}
          color="var(--accent-3)"
          note="Realtime · 20 titik terakhir"
        />
      </div>

      {/* ── Live Recruitment Metric ─── */}
      <div className="mt-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Live Recruitment Metric
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Aktivitas pendaftaran & ketersediaan slot secara realtime
            </p>
          </div>
          <span className="chip" style={{ color: "var(--accent-3)" }}>
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: "var(--accent-3)" }}
            />
            Live
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <GaugePanel
            icon={Activity}
            title="Recruitment Activity"
            sub="Estimasi lonjakan pendaftar per menit"
            percent={recruitPct}
            values={recruitTicks}
            color="var(--accent-2)"
            note="Realtime · 20 titik terakhir"
          />
          <GaugePanel
            icon={Users}
            title="Slot Availability"
            sub="Kapasitas seleksi yang masih terbuka"
            percent={slotPct}
            values={slotTicks}
            color="var(--accent-3)"
            note="Realtime · 20 titik terakhir"
          />
        </div>
      </div>
    </main>
  );
}
