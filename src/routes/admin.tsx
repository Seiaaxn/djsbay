import { createFileRoute } from "@tanstack/react-router";
import { Crown, Users, BadgeCheck } from "lucide-react";
import { img, onImgError } from "../lib/site-images";
import { AnimatedCounter } from "../components/AnimatedCounter";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Five Fail Family - Admin" },
      { name: "description", content: "Tim admin Five Fail Family yang menjaga marga tetap solid." },
      { property: "og:title", content: "Admin - Five Fail Family" },
      { property: "og:description", content: "Admin Five Fail Family." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-muted-foreground">Gagal memuat halaman admin. Coba refresh.</p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 text-xs text-destructive">{String(error)}</pre>
        )}
      </div>
    </div>
  ),
  component: AdminPage,
});

const admins: { name: string; role: string; image?: string; owner?: boolean; gen?: string }[] = [
  { name: "@radzyprst1", role: "Owner Five Fail", image: "https://cdn.nekohime.site/file/7xbftxr3.jpeg", owner: true },
  { name: "@hanzyy_perset2", role: "Admin & Co Owner", image: "https://cdn.nekohime.site/file/gsgmhbku.jpg", gen: "Gen 1" },
  { name: "@z4nsprst", role: "Admin & Leader", image: "https://cdn.nekohime.site/file/tk05xeuf.jpg", gen: "Gen 1" },
  { name: "@yanzjeje_", role: "Admin Utama & Collab", image: "https://cdn.nekohime.site/file/uz7jd7mp.jpg", gen: "Gen 1" },
  { name: "𝟓𝐅 𝙁𝙞𝙠𝙠 𝗳𝘁 | 𝗖𝗚", role: "Admin Utama & Select", image: "https://cdn.nekohime.site/file/4pmprnmm.jpg", gen: "Gen 1" },
  { name: "@inishinjirs", role: "Bot & Security", image: "https://cdn.nekohime.site/file/z2r2374k.jpeg", gen: "Gen 1" },
  { name: "@fazzraijinup", role: "Admin Utama & Collab", image: "https://cdn.nekohime.site/file/u254l04v.jpg", gen: "Gen 1" },
  { name: "𝘿𝙖𝙣𝙪𝙥𝙧𝙨𝙩`𝗳𝘁 𝟓𝐅", role: "Admin Utama & Select", image: "https://cdn.nekohime.site/file/pypmkob6.jpeg", gen: "Gen 1" },
  { name: "Fiku", role: "Admin Gen 1 & Select", image: "https://cdn.nekohime.site/file/tvnvsfyk.jpeg", gen: "Gen 1" },
  { name: "@stevenprsttt", role: "Admin Utama & Select", image: "https://cdn.nekohime.site/file/dq6xs5r0.jpeg", gen: "Gen 1" },
  { name: "@yato.kragyy", role: "Admin Gen 1 & Select", image: "https://cdn.nekohime.site/file/j5ecxa0k.jpg", gen: "Gen 1" },
  { name: "@tianprst_50", role: "Admin Gen 2", image: "https://cdn.nekohime.site/file/tjlirecc.jpg", gen: "Gen 2" },
  { name: "@kyysz_prst", role: "Admin Gen 3", image: "https://cdn.nekohime.site/file/jscrn7mc.jpg", gen: "Gen 3" },
  { name: "@mas.biasa.x.ruri", role: "Admin Gen 3", image: "https://cdn.nekohime.site/file/y6o7u6wg.jpg", gen: "Gen 3" },
  { name: "@shinpejeje", role: "Admin Gen 3", image: "https://cdn.nekohime.site/file/9h56xw3s.jpg", gen: "Gen 3" },
  { name: "@fanneditt", role: "Admin Gen 2", image: "https://cdn.nekohime.site/file/2dr6drch.jpg", gen: "Gen 3" },
  { name: "@panz_editz", role: "Admin Partner", image: "https://cdn.nekohime.site/file/tin9lwzp.jpg" },
  { name: "@rikkalien", role: "Admin Partner", image: "https://cdn.nekohime.site/file/iyodlgq9.jpg" },
  { name: "@karrz01", role: "Admin Partner", image: "https://cdn.nekohime.site/file/s4q4i24y.jpg" },
  { name: "@guin_prst", role: "Admin Live", image: "https://cdn.nekohime.site/file/9g131bgj.jpg" },
];

function rolePriority(a: (typeof admins)[0]): number {
  if (a.owner) return 0;
  if (a.gen === "Gen 1") return 1;
  if (a.gen === "Gen 2") return 2;
  if (a.gen === "Gen 3") return 3;
  return 4;
}

function AdminPage() {
  const owner = admins.find((a) => a.owner);
  const rest = admins
    .filter((a) => !a.owner)
    .sort((a, b) => rolePriority(a) - rolePriority(b));

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20">
      {/* ── Hero — tanpa logo ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl pt-6 text-center">
        <span className="chip">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Tim di balik layar
        </span>
        <h1 className="font-display mt-5 text-4xl font-bold tracking-tight md:text-5xl">
          Tim Admin
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Tim di balik layar yang menjaga marga tetap solid.
        </p>
        <div className="mx-auto mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-3">
          <span className="chip">
            <Users className="h-3.5 w-3.5" />
            <AnimatedCounter value={admins.length} /> admin aktif
          </span>
          <span className="chip">
            <BadgeCheck className="h-3.5 w-3.5" />
            Terverifikasi
          </span>
        </div>
      </section>

      {/* ── Owner spotlight ─────────────────────────────────────── */}
      {owner && (
        <div className="glass-card relative mx-auto mt-12 flex max-w-6xl flex-col items-center gap-5 overflow-hidden p-6 sm:flex-row md:p-8"
          style={{ borderColor: "oklch(from var(--color-accent) l c h / 0.35)" }}>
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-10"
            style={{ background: "radial-gradient(circle at 20% 50%, var(--color-accent), transparent 65%)" }}
            aria-hidden
          />
          <div className="relative shrink-0">
            <img
              src={img(owner.image)}
              alt={owner.name}
              className="relative h-24 w-24 rounded-2xl object-cover shadow-md ring-2 ring-border md:h-28 md:w-28"

              loading="lazy"
              onError={onImgError}
            />
          </div>
          <div className="relative min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="chip font-extrabold" style={{ background: "oklch(from var(--color-accent) l c h / 0.15)", color: "var(--color-accent)", borderColor: "oklch(from var(--color-accent) l c h / 0.4)" }}>
                <Crown className="h-3.5 w-3.5" />
                Owner
              </span>
              <span className="chip text-xs">Five Fail Family</span>
            </div>
            <h2 className="mt-2 truncate text-2xl font-bold md:text-3xl">{owner.name}</h2>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{owner.role}</p>
          </div>
        </div>
      )}

      {/* ── Semua admin dalam satu grid flat ────────────────────── */}
      <section className="mx-auto mt-10 max-w-6xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
            Semua Admin
          </span>
          <span className="font-mono text-xs text-muted-foreground">{rest.length} orang</span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {rest.map((a) => (
            <div
              key={a.name}
              className="glass-card glass-card-hover relative flex flex-col items-center p-4 text-center sm:p-5"
            >
              <img
                src={img(a.image)}
                alt={a.name}
                className="mt-2 h-16 w-16 rounded-xl object-cover ring-1 ring-border sm:h-[4.5rem] sm:w-[4.5rem]"
                loading="lazy"
                onError={onImgError}
              />
              <h3 className="mt-3 line-clamp-1 w-full text-sm font-semibold">{a.name}</h3>
              <p className="mt-1.5 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[0.65rem] text-muted-foreground leading-tight">
                {a.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
  }
