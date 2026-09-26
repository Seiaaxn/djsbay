import { useEffect, useState } from "react";
import { Loader2, Search, ExternalLink } from "lucide-react";
import { useI18n } from "../lib/i18n";

const DEFAULT_TAGS = ["5fcreator"];

type TagInfo = {
  name: string;
  views?: number;
  videos?: number;
  loading: boolean;
  error?: "notFound" | "loadFail" | "rateLimit";
};

function formatNum(n?: number) {
  if (n == null) return "—";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

async function fetchHashtag(name: string): Promise<Partial<TagInfo>> {
  const url = `https://www.tikwm.com/api/challenge/info?challenge_name=${encodeURIComponent(name)}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      const json = await res.json();
      const d = json?.data?.ch_info ?? json?.data;
      if (!d) {
        const msg = String(json?.msg ?? "").toLowerCase();
        if (msg.includes("free api limit") || msg.includes("rate limit")) {
          await new Promise((r) => setTimeout(r, 1100 * attempt));
          continue;
        }
        return { error: "notFound" };
      }
      return {
        views: Number(d.view_count ?? 0),
        videos: Number(d.user_count ?? 0),
      };
    } catch {
      return { error: "loadFail" };
    }
  }
  return { error: "rateLimit" };
}

export function HashtagSection() {
  const { t } = useI18n();
  const [tags, setTags] = useState<TagInfo[]>(DEFAULT_TAGS.map((n) => ({ name: n, loading: true })));

  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      for (let idx = 0; idx < tags.length; idx++) {
        const tag = tags[idx];
        if (!tag.loading || cancelled) return;
        if (idx > 0) await new Promise((r) => setTimeout(r, 1200));
        if (cancelled) return;
        const d = await fetchHashtag(tag.name);
        if (cancelled) return;
        setTags((prev) => {
          const next = [...prev];
          if (next[idx]?.name === tag.name) next[idx] = { ...next[idx], ...d, loading: false };
          return next;
        });
      }
    }
    loadAll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags.length]);

  return (
    <section className="mt-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{t.tiktok.hashtagTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.tiktok.hashtagDesc}</p>
      </div>

      <div className="grid gap-4">
        {tags.map((h) => (
          <div key={h.name} className="glass-card glass-card-hover p-6">
            <a
              href={`https://www.tiktok.com/tag/${h.name}`}
              target="_blank"
              rel="noopener"
              className="text-accent-soft inline-flex items-center gap-1.5 font-mono text-sm hover:underline"
            >
              #{h.name}
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="font-display text-3xl font-bold">
                  {h.loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    formatNum(h.views)
                  )}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{t.tiktok.views}</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold">
                  {h.loading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    formatNum(h.videos)
                  )}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{t.tiktok.videos}</p>
              </div>
            </div>
            {h.error && <p className="mt-3 text-xs text-destructive">{t.tiktok[h.error]}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────

type TikTokUser = {
  unique_id: string;
  nickname: string;
  avatar: string;
  signature: string;
  follower_count: number;
  following_count: number;
  heart_count: number;
  video_count: number;
};

// Keywords in a TikTok profile that indicate a Five Fail Family member.
const MEMBER_KEYWORDS = [
  "5fcreator",
  "5f creator",
  "five fail",
  "fivefail",
  "5fail",
  "5f family",
  "5f fam",
  "#5f",
  "5f",
  "火",
];

// Normalize stylized unicode (mathematical alphanumeric, fullwidth, etc.)
// to plain ASCII so bios like "𝟓𝐅" or "５Ｆ" still match.
function normalizeText(input: string): string {
  return input.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function detectMember(u: TikTokUser): boolean {
  const raw = `${u.nickname} ${u.signature} ${u.unique_id}`;
  if (raw.includes("火")) return true;
  const hay = normalizeText(raw);
  return MEMBER_KEYWORDS.some((k) => hay.includes(normalizeText(k)));
}

export function TikTokSearchSection() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<TikTokUser | null>(null);

  async function search(e?: React.FormEvent) {
    e?.preventDefault();
    const name = q.trim().replace(/^@/, "");
    if (!name) return;
    setLoading(true);
    setError(null);
    setUser(null);
    try {
      const res = await fetch(
        `https://www.tikwm.com/api/user/info?unique_id=${encodeURIComponent(name)}`,
      );
      const json = await res.json();
      const u = json?.data?.user;
      const s = json?.data?.stats;
      if (!u) {
        setError(t.tiktok.accountNotFound);
      } else {
        setUser({
          unique_id: u.uniqueId ?? u.unique_id ?? name,
          nickname: u.nickname ?? name,
          avatar: u.avatarLarger ?? u.avatarMedium ?? u.avatar ?? "",
          signature: u.signature ?? "",
          follower_count: Number(s?.followerCount ?? s?.follower_count ?? 0),
          following_count: Number(s?.followingCount ?? s?.following_count ?? 0),
          heart_count: Number(s?.heartCount ?? s?.heart_count ?? 0),
          video_count: Number(s?.videoCount ?? s?.video_count ?? 0),
        });
      }
    } catch {
      setError(t.tiktok.searchFail);
    } finally {
      setLoading(false);
    }
  }

  const isMember = user ? detectMember(user) : false;

  const stats = user
    ? [
        { label: t.tiktok.followers, value: user.follower_count },
        { label: t.tiktok.following, value: user.following_count },
        { label: t.tiktok.likes, value: user.heart_count },
        { label: t.tiktok.videosLabel, value: user.video_count },
      ]
    : [];

  return (
    <section className="mt-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{t.tiktok.searchTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.tiktok.searchDesc}</p>
      </div>

      <form
        onSubmit={search}
        className="lego-block lego-stud flex items-center gap-2 p-2 pl-3"
      >
        <div className="flex items-center gap-2 px-2 text-muted-foreground">
          <Search className="h-4 w-4" />
          <span className="font-mono text-sm">@</span>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.tiktok.searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button type="submit" disabled={loading} className="btn-primary shrink-0 text-sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.tiktok.searchBtn}
        </button>
      </form>

      {error && <p className="mt-4 font-mono text-sm text-destructive">{error}</p>}

      {user && (
        <div className="lego-block lego-block-hover lego-stud mt-6 p-6">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            {user.avatar && (
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.nickname}
                  className="h-24 w-24 rounded-2xl object-cover"
                  style={{
                    boxShadow:
                      "0 4px 0 0 color-mix(in oklab, var(--color-accent) 70%, transparent)",
                  }}
                  referrerPolicy="no-referrer"
                />
                <span
                  className="absolute -bottom-2 -right-2 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: isMember ? "var(--color-accent)" : "var(--color-muted)",
                    color: isMember
                      ? "var(--color-accent-foreground)"
                      : "var(--color-muted-foreground)",
                    boxShadow:
                      "0 2px 0 0 color-mix(in oklab, var(--color-foreground) 25%, transparent)",
                  }}
                >
                  {isMember ? "5F" : "—"}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h3 className="text-lg font-bold">{user.nickname}</h3>
                <a
                  href={`https://www.tiktok.com/@${user.unique_id}`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1 font-mono text-xs opacity-80 hover:underline"
                >
                  @{user.unique_id}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div
                className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider"
                style={{
                  background: isMember
                    ? "color-mix(in oklab, var(--color-accent) 85%, transparent)"
                    : "var(--color-muted)",
                  color: isMember
                    ? "var(--color-accent-foreground)"
                    : "var(--color-muted-foreground)",
                  boxShadow: isMember
                    ? "0 3px 0 0 color-mix(in oklab, var(--color-accent) 55%, transparent)"
                    : "none",
                }}
                title={isMember ? t.tiktok.memberDesc : t.tiktok.notMemberDesc}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    background: isMember
                      ? "var(--color-accent-foreground)"
                      : "var(--color-muted-foreground)",
                  }}
                />
                {isMember ? t.tiktok.member : t.tiktok.notMember}
              </div>

              {user.signature && (
                <p className="mt-3 text-sm whitespace-pre-line text-muted-foreground">
                  {user.signature}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="lego-stat">
                <p className="font-display text-xl font-bold">{formatNum(s.value)}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
