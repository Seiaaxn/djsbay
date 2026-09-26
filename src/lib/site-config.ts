export const FAVICON_URL = "https://cdn.nekohime.site/file/je5hnhcb.jpeg";

export const OG_IMAGE_URL =
  "https://iad.microlink.io/nk-L3M_4kB-axU4fsqBOZfxf19TgNmX0nDvwGKWGbTaODMS7VAXhHzSP4yVUcfpcEfXtEbru09gFh5j3rXyRPg.png";

export const WA_URL_SELECTION = "https://chat.whatsapp.com/J5NHH868UBZAtmSfPUeNSh";

export const WA_URL_DIRECT = "https://chat.whatsapp.com/JqBKCwH0LAtJdzFvYf9kEe";

export const GEN_MEMBER_COUNTS = [
  { gen: "Gen 1", count: 341 },
  { gen: "Gen 2", count: 87 },
  { gen: "Gen 3", count: 49 },
];

export const GEN_FOLLOWER_REQUIREMENTS = [
  { gen: "Gen 1", followers: 500 },
  { gen: "Gen 2", followers: 0 },
  { gen: "Gen 3", followers: 0 },
];

/**
 * Tipe konten per generasi — digunakan oleh AI untuk mendeteksi
 * gen yang tepat berdasarkan caption/bio TikTok pengguna.
 *
 * Gen 1 → creator preset, AMV, L2D, edit video (wajib 500+ followers)
 * Gen 2 → creator konten anime, manga, manhwa, manhua, dll (bebas followers)
 * Gen 3 → sama seperti Gen 1 (preset/AMV/L2D/edit) tapi bebas followers
 *
 * AI mendeteksi konten dari caption video yang di-submit:
 *   - Jika caption/bio mengandung kata kunci anime (judul anime, karakter,
 *     "anime edit", "amv", dll) → langsung Gen 2
 *   - Jika mengandung "preset", "l2d", "live2d", "amv", "edit" → Gen 1 atau Gen 3
 *     tergantung jumlah followers
 */

/**
 * Aturan penempatan generasi.
 * - Gen 1: creator preset/AMV/L2D/edit dengan MINIMAL 500 followers (wajib seleksi)
 * - Gen 2: creator konten anime, manga, manhwa, manhua (bebas followers, tanpa seleksi)
 * - Gen 3: creator preset/AMV/L2D/edit dengan KURANG DARI 500 followers (wajib seleksi)
 *
 * Logika pickGen di $action.ts perlu disesuaikan karena sekarang penentuan gen
 * bukan hanya berdasarkan follower count, tapi juga tipe konten (dari caption).
 */
export const GEN_RULES = [
  {
    gen: "Gen 1",
    contentType: "preset" as const,
    minFollowers: 500,
    label: "Creator Preset & AMV",
    desc: "Khusus creator preset, AMV, L2D, dan edit video yang sudah punya minimal 500 followers. Gen tertua yang jadi fondasi marga.",
  },
  {
    gen: "Gen 2",
    contentType: "anime" as const,
    minFollowers: 0,
    label: "Creator Anime & Manga",
    desc: "Khusus creator konten anime, manga, manhwa, manhua, dan sejenisnya. Bebas followers — langsung masuk tanpa seleksi ketat.",
  },
  {
    gen: "Gen 3",
    contentType: "preset" as const,
    minFollowers: 0,
    label: "Creator Preset & AMV (Pemula)",
    desc: "Sama seperti Gen 1 namun tanpa syarat followers minimal. Cocok untuk creator preset/AMV/edit yang baru mulai membangun akun.",
  },
] as const;

/** Hashtag wajib yang harus ada di caption video verifikasi. */
export const SELECTION_HASHTAG = "5fcreator";

/** Masa berlaku ID + OTP seleksi (harus sama dengan yang dipakai bot WA). */
export const SELECTION_OTP_TTL_MS = 5 * 60 * 1000; // 5 menit

/** Endpoint API internal untuk alur seleksi berbasis OTP. */
export const SELECTION_API_BASE = "/api/selection";
