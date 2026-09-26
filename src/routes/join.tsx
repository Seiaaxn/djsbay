import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  TrendingUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PartyPopper,
} from "lucide-react";
import { AnimatedCounter } from "../components/AnimatedCounter";
import {
  WA_URL_SELECTION,
  WA_URL_DIRECT,
  GEN_MEMBER_COUNTS,
  GEN_RULES,
  SELECTION_HASHTAG,
  SELECTION_API_BASE,
} from "../lib/site-config";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join · Five Fail Family" },
      {
        name: "description",
        content:
          "Bergabung ke Five Fail Family lewat seleksi ID + OTP dan verifikasi akun TikTok.",
      },
      { property: "og:title", content: "Join · Five Fail Family" },
      {
        property: "og:description",
        content: "Selalu open recruitment - ikuti alur seleksi untuk bergabung kedalam grup",
      },
    ],
  }),
  component: JoinPage,
});

const totalMembers = GEN_MEMBER_COUNTS.reduce((sum, g) => sum + g.count, 0);
const genTints = ["var(--accent-2)", "var(--accent-3)", "var(--accent-4)"];

type TikTokProfile = {
  username: string;
  nickname: string;
  avatarUrl: string;
  bio: string;
  followerCount: number;
};

type GenResult = { gen: string; label: string; desc: string; detectedAs: string; aiReason: string };

async function callSelectionApi<T>(action: string, body: unknown): Promise<T> {
  const res = await fetch(`${SELECTION_API_BASE}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string } & T;
  if (!res.ok || !data.ok) {
    throw new Error(data.error ?? "Terjadi kesalahan. Coba lagi.");
  }
  return data;
}

function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function StepHeader({
  step,
  total,
  title,
  desc,
}: {
  step: number;
  total: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{ background: i < step ? "var(--neo-purple)" : "var(--secondary)" }}
          />
        ))}
      </div>
      <p className="font-mono text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">
        Langkah {step} / {total}
      </p>
      <h2 className="font-display mt-1 text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function JoinPage() {
  const { t } = useI18n();
  const j = t.join;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 — OTP
  const [selectionId, setSelectionId] = useState("");
  const [otp, setOtp] = useState("");

  // Step 3 — TikTok profile
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<TikTokProfile | null>(null);

  // Step 4 — video link
  const [videoUrl, setVideoUrl] = useState("");

  // Step 5 — result
  const [result, setResult] = useState<GenResult | null>(null);

  // Countdown sederhana untuk kesan "batas waktu" seperti referensi
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  useEffect(() => {
    if (step !== 5) return;
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [step]);
  const countdown = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const s = (secondsLeft % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [secondsLeft]);

  async function handleVerifyOtp() {
    setError(null);
    if (!selectionId.trim() || !otp.trim()) {
      setError("ID Seleksi dan Kode OTP wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      await callSelectionApi("verify-otp", { id: selectionId.trim().toUpperCase(), otp: otp.trim() });
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal verifikasi OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFetchProfile() {
    setError(null);
    if (!username.trim()) {
      setError("Username TikTok wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const data = await callSelectionApi<{ profile: TikTokProfile }>("tiktok-profile", {
        id: selectionId.trim().toUpperCase(),
        username: username.trim(),
      });
      setProfile(data.profile);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengambil profil TikTok.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyPost() {
    setError(null);
    if (!videoUrl.trim()) {
      setError("Link video TikTok wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const data = await callSelectionApi<GenResult>("verify-post", {
        id: selectionId.trim().toUpperCase(),
        videoUrl: videoUrl.trim(),
      });
      setResult(data);
      setSecondsLeft(5 * 60);
      setStep(5);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verifikasi video gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-64px)] px-4 pb-20">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl pt-4 text-center">
        <span className="chip animate-rise">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          {j.badge}
        </span>
        <h1 className="font-display animate-rise mt-5 text-4xl font-bold tracking-tight md:text-5xl">
          {j.title}
        </h1>
        <p className="animate-rise mx-auto mt-4 max-w-xl text-muted-foreground">{j.desc}</p>

        <div className="animate-rise mx-auto mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-3">
          <span className="chip">
            <TrendingUp className="h-3.5 w-3.5" />
            <AnimatedCounter value={totalMembers} suffix="+" /> {t.common.members}
          </span>
          <span className="chip">
            <BadgeCheck className="h-3.5 w-3.5" />
            100% Gratis
          </span>
          <span className="chip">
            <Zap className="h-3.5 w-3.5" />3 Generasi Aktif
          </span>
        </div>
      </section>

      {/* ── Wizard seleksi ─────────────────────────────────────── */}
      <section className="mx-auto mt-12 max-w-xl">
        <article className="glass-card animate-rise p-6 md:p-8">
          {/* Step 1: Verifikasi OTP */}
          {step === 1 && (
            <>
              <StepHeader step={1} total={5} title="Verifikasi Seleksi" desc="Memastikan bahwa kamu bukan bot." />
              <a href={WA_URL_SELECTION} target="_blank" rel="noopener" className="btn-primary w-full justify-center">
                Dapatkan Kode OTP
              </a>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Ketik <span className="font-mono font-bold">.seleksi</span> di grup untuk meminta ID + kode OTP dari
                bot.
              </p>

              <div className="mt-5 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Masukkan ID Seleksi</label>
                  <input
                    value={selectionId}
                    onChange={(e) => setSelectionId(e.target.value)}
                    placeholder="Contoh: PP3VPK"
                    className="mt-1 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-mono uppercase outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Masukkan Kode OTP</label>
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6 digit"
                    inputMode="numeric"
                    className="mt-1 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  />
                </div>
              </div>

              <ErrorNote message={error} />

              <button onClick={handleVerifyOtp} disabled={loading} className="btn-primary mt-5 w-full justify-center">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Verifikasi OTP
              </button>
            </>
          )}

          {/* Step 2: Syarat & Ketentuan */}
          {step === 2 && (
            <>
              <StepHeader
                step={2}
                total={5}
                title="Syarat Join Five Fail"
                desc="Baca & pahami syarat di bawah sebelum lanjut."
              />

              <ol className="space-y-2.5 text-sm">
                <li className="flex gap-2.5">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>Wajib aktif posting konten — preset/AMV/edit (Gen 1 & 3) atau konten anime/manga/manhwa (Gen 2).</span>
                </li>
                <li className="flex gap-2.5">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    Wajib pakai hashtag <span className="font-mono font-bold">#{SELECTION_HASHTAG}</span> di video
                    verifikasi. AI akan membaca caption untuk menentukan generasimu secara otomatis.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>Bersedia ganti nama TikTok sesuai format marga maksimal 1x24 jam setelah lolos.</span>
                </li>
              </ol>

              <div className="mt-5 grid gap-2">
                {GEN_RULES.map((rule, i) => (
                  <div
                    key={rule.gen}
                    className="rounded-xl border px-3.5 py-3"
                    style={{
                      borderColor: `color-mix(in oklab, ${genTints[i]} 35%, white)`,
                      background: `color-mix(in oklab, ${genTints[i]} 6%, white)`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold tracking-widest uppercase">{rule.gen}</span>
                      <span className="font-mono text-xs font-bold" style={{ color: genTints[i] }}>
                        {rule.minFollowers > 0
                          ? `${rule.minFollowers.toLocaleString("id-ID")}+ followers`
                          : "Bebas followers"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{rule.label}.</span> {rule.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={() => setStep(1)} className="btn-ghost flex-1 justify-center">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 justify-center">
                  Saya Mengerti
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {/* Step 3: Pendataan diri (username TikTok) */}
          {step === 3 && (
            <>
              <StepHeader
                step={3}
                total={5}
                title="Pendataan Diri Anda"
                desc="Kami perlu memeriksa akun TikTok kamu."
              />

              <label className="text-xs font-semibold text-muted-foreground">Masukkan Username TikTok Anda</label>
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setProfile(null);
                }}
                placeholder="contoh: inishinjirs"
                className="mt-1 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
              <button onClick={handleFetchProfile} disabled={loading} className="btn-ghost mt-3 w-full justify-center">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Cek Profil
              </button>

              {profile && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3.5">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.nickname}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-secondary text-xs">
                      N/A
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{profile.nickname}</p>
                    <p className="truncate text-xs text-muted-foreground">@{profile.username}</p>
                    {profile.bio && <p className="mt-0.5 truncate text-xs text-muted-foreground">{profile.bio}</p>}
                    <p className="mt-0.5 font-mono text-xs font-bold text-accent">
                      {profile.followerCount.toLocaleString("id-ID")} followers
                    </p>
                  </div>
                  <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-emerald-500" />
                </div>
              )}

              <p className="mt-3 text-xs text-muted-foreground">
                Jika kamu belum ganti nama (CN), ganti dulu sesuai format marga sebelum lanjut.
              </p>

              <ErrorNote message={error} />

              <div className="mt-5 flex gap-3">
                <button onClick={() => setStep(2)} className="btn-ghost flex-1 justify-center">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </button>
                <button onClick={() => setStep(4)} disabled={!profile} className="btn-primary flex-1 justify-center">
                  Lanjut
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {/* Step 4: Link video + hashtag */}
          {step === 4 && (
            <>
              <StepHeader
                step={4}
                total={5}
                title="Hampir Selesai!"
                desc="Posting video terbaru kamu, lalu tempel link-nya di sini."
              />

              <label className="text-xs font-semibold text-muted-foreground">Masukkan Link Video Anda</label>
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@user/video/..."
                className="mt-1 w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Wajib gunakan hashtag <span className="font-mono font-bold">#{SELECTION_HASHTAG}</span> pada
                postingan video kamu.
              </p>

              <ErrorNote message={error} />

              <div className="mt-5 flex gap-3">
                <button onClick={() => setStep(3)} className="btn-ghost flex-1 justify-center">
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </button>
                <button onClick={handleVerifyPost} disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      AI menganalisis...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Konfirmasi
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Step 5: Hasil */}
          {step === 5 && result && (
            <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground">
                <PartyPopper className="h-7 w-7" />
              </div>
              <h2 className="font-display mt-4 text-2xl font-bold">Yayy, Kamu Lolos!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Kamu diterima di Five Fail Family sebagai{" "}
                <span className="font-bold text-foreground">{result.gen}</span> — {result.label}.
              </p>
              <p className="mx-auto mt-2 max-w-sm text-xs text-muted-foreground">{result.desc}</p>
              {result.detectedAs && (
                <div className="mx-auto mt-3 max-w-sm space-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1">
                    <Sparkles className="h-3 w-3 text-accent" />
                    <span className="font-mono text-xs text-accent">
                      AI mendeteksi: <span className="font-bold">{result.detectedAs}</span>
                    </span>
                  </div>
                  {result.aiReason && (
                    <p className="text-xs text-muted-foreground italic">
                      &ldquo;{result.aiReason}&rdquo;
                    </p>
                  )}
                </div>
              )}

              <a href={WA_URL_DIRECT} target="_blank" rel="noopener" className="btn-primary mt-6 w-full justify-center">
                Gabung Grup
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                Batas waktu bergabung: <span className="font-bold text-accent">{countdown}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Segera minta bergabung di WhatsApp.</p>
            </div>
          )}
        </article>

        <div className="mt-4 text-center">
          <Link
            to="/readme"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {j.readme}
          </Link>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="mx-auto mt-14 max-w-4xl">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold">{j.faqTitle}</h2>
          <span className="font-mono text-xs text-muted-foreground">
            {j.faqs.length} {j.faqCount}
          </span>
        </div>
        <div className="glass-card p-2 md:p-4">
          {j.faqs.map((f) => (
            <details key={f.q} className="group border-b border-border px-3 py-3 last:border-b-0">
              <summary className="cursor-pointer list-none font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
