/**
 * Helper untuk mengambil data publik TikTok (profil & caption video)
 * lewat API pihak ketiga di api.deline.web.id ("creator": "Agas" pada
 * responsnya). Ini BUKAN API resmi TikTok/Anthropic — konsekuensinya:
 *  - Ketersediaan & rate limit tergantung sepenuhnya pada pihak ketiga
 *    itu; kalau server mereka down/berubah bentuk respons, fitur ini
 *    ikut berhenti bekerja.
 *  - Tidak ada jaminan SLA/keamanan seperti API resmi.
 *  - Belum diuji langsung dari sandbox ini (tidak ada akses jaringan
 *    keluar di sini) — tes dulu di `bun dev` sebelum production, dan
 *    pantau setelah deploy.
 */

const TTSTALK_API_URL = "https://api.deline.web.id/stalker/ttstalk";
const TT_DOWNLOADER_API_URL = "https://api.deline.web.id/downloader/tiktok";

export interface TikTokProfile {
  username: string;
  nickname: string;
  avatarUrl: string;
  bio: string;
  followerCount: number;
  followingCount?: number;
  heartCount?: number;
  videoCount?: number;
  verified?: boolean;
  privateAccount?: boolean;
}

interface TtStalkResponse {
  status: boolean;
  creator?: string;
  message?: string;
  result?: {
    user?: {
      uniqueId?: string;
      nickname?: string;
      signature?: string | null;
      avatarLarger?: string;
      avatarMedium?: string;
      avatarThumb?: string;
      verified?: boolean;
      privateAccount?: boolean;
    };
    stats?: {
      followerCount?: number;
      followingCount?: number;
      heartCount?: number;
      videoCount?: number;
    };
  };
}

interface TtDownloaderResponse {
  status: boolean;
  creator?: string;
  message?: string;
  result?: {
    title?: string; // caption video, termasuk hashtag-nya
    type?: string; // "video" | "image" dll
    download?: string;
    music?: string;
  };
}

export class TikTokLookupError extends Error {}

/**
 * Ambil profil TikTok publik berdasarkan username (tanpa "@") lewat
 * API pihak ketiga di atas. Melempar `TikTokLookupError` kalau akun
 * tidak ditemukan atau API mengembalikan error.
 */
export async function fetchTikTokProfile(username: string): Promise<TikTokProfile> {
  const clean = username.trim().replace(/^@/, "");
  if (!/^[a-zA-Z0-9._]{2,24}$/.test(clean)) {
    throw new TikTokLookupError("Format username TikTok tidak valid.");
  }

  const url = `${TTSTALK_API_URL}?username=${encodeURIComponent(clean)}`;
  let res: Response;
  try {
    res = await fetch(url, { headers: { Accept: "application/json" } });
  } catch {
    throw new TikTokLookupError("Tidak bisa menghubungi layanan pengecekan TikTok. Coba lagi nanti.");
  }

  if (!res.ok) {
    throw new TikTokLookupError(`Layanan pengecekan TikTok error (status ${res.status}). Coba lagi nanti.`);
  }

  let data: TtStalkResponse;
  try {
    data = (await res.json()) as TtStalkResponse;
  } catch {
    throw new TikTokLookupError("Respons layanan pengecekan TikTok tidak valid.");
  }

  if (!data.status || !data.result?.user?.uniqueId) {
    throw new TikTokLookupError(
      data.message || "Akun TikTok tidak ditemukan. Pastikan username sudah benar dan akun bersifat publik.",
    );
  }

  const { user, stats } = data.result;

  if (user.privateAccount) {
    throw new TikTokLookupError("Akun TikTok kamu privat. Ubah ke publik dulu supaya bisa diverifikasi.");
  }

  return {
    username: user.uniqueId,
    nickname: user.nickname ?? user.uniqueId,
    avatarUrl: user.avatarLarger ?? user.avatarMedium ?? user.avatarThumb ?? "",
    bio: user.signature ?? "",
    followerCount: stats?.followerCount ?? 0,
    followingCount: stats?.followingCount,
    heartCount: stats?.heartCount,
    videoCount: stats?.videoCount,
    verified: user.verified,
    privateAccount: user.privateAccount,
  };
}

/**
 * Cek apakah caption ("title") sebuah video TikTok mengandung hashtag
 * tertentu (tanpa tanda "#", perbandingan tidak case-sensitive), lewat
 * API downloader pihak ketiga di atas.
 */
export async function verifyTikTokVideoHashtag(
  videoUrl: string,
  hashtag: string,
): Promise<{ ok: boolean; caption: string }> {
  let parsed: URL;
  try {
    parsed = new URL(videoUrl);
  } catch {
    throw new TikTokLookupError("Link video tidak valid.");
  }
  const host = parsed.hostname.replace(/^www\./, "");
  if (!/(^|\.)tiktok\.com$/.test(host)) {
    throw new TikTokLookupError("Link harus berupa link video TikTok (tiktok.com atau vt.tiktok.com).");
  }

  const apiUrl = `${TT_DOWNLOADER_API_URL}?url=${encodeURIComponent(parsed.toString())}`;
  let res: Response;
  try {
    res = await fetch(apiUrl, { headers: { Accept: "application/json" } });
  } catch {
    throw new TikTokLookupError("Tidak bisa menghubungi layanan pengecekan video. Coba lagi nanti.");
  }

  if (!res.ok) {
    throw new TikTokLookupError(`Layanan pengecekan video error (status ${res.status}). Coba lagi nanti.`);
  }

  let data: TtDownloaderResponse;
  try {
    data = (await res.json()) as TtDownloaderResponse;
  } catch {
    throw new TikTokLookupError("Respons layanan pengecekan video tidak valid.");
  }

  if (!data.status) {
    throw new TikTokLookupError(data.message || "Link video tidak ditemukan / tidak bisa diproses.");
  }

  const caption = data.result?.title ?? "";
  const ok = caption.toLowerCase().includes(`#${hashtag.toLowerCase()}`);

  return { ok, caption };
}
