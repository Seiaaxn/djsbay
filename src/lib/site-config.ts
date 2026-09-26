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
 * Aturan penempatan generasi berdasarkan jumlah followers TikTok.
 * min/max bersifat inklusif. `max: null` artinya tidak ada batas atas.
 * Gen 1 dicek lebih dulu (rentang spesifik), lalu Gen 2, lalu Gen 3
 * sebagai fallback paling akhir — sesuaikan urutan/angka ini sesuai
 * kebutuhan komunitas.
 */
export const GEN_RULES = [
  {
    gen: "Gen 1",
    min: 500,
    max: 10_000,
    label: "Editor Menengah",
    desc: "Untuk kreator/editor yang sudah punya basis followers (500–10K). Fokus konten: AMV/edit anime kualitas tinggi, konsisten posting, siap jadi contoh untuk gen di bawahnya.",
  },
  {
    gen: "Gen 2",
    min: 0,
    max: null,
    label: "Kreator Bebas",
    desc: "Terbuka untuk semua jumlah followers. Fokus konten: bebas selama masih seputar editor/anime — cocok untuk yang ingin berkembang bareng komunitas.",
  },
  {
    gen: "Gen 3",
    min: 0,
    max: null,
    label: "Pemula",
    desc: "Terbuka untuk semua jumlah followers, termasuk akun baru. Fokus konten: belajar dasar editing/posting, dibimbing member gen lain.",
  },
] as const;

/** Hashtag wajib yang harus ada di caption video verifikasi. */
export const SELECTION_HASHTAG = "5fcreator";

/** Masa berlaku ID + OTP seleksi (harus sama dengan yang dipakai bot WA). */
export const SELECTION_OTP_TTL_MS = 5 * 60 * 1000; // 5 menit

/** Endpoint API internal untuk alur seleksi berbasis OTP. */
export const SELECTION_API_BASE = "/api/selection";
