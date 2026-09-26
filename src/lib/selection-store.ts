/**
 * Store untuk sesi seleksi (ID + OTP → data TikTok → hasil gen).
 *
 * ⚠️ PENTING — BACA INI SEBELUM DEPLOY:
 * Project ini di-build oleh Nitro dengan target Cloudflare Workers
 * (lihat vite.config.ts). Worker itu STATELESS: variabel di memori
 * (seperti Map di bawah) TIDAK dijamin bertahan antar-request, dan
 * TIDAK dibagi antar-instance/edge-location. Bot WhatsApp (yang
 * generate ID+OTP) dan website ini juga berjalan sebagai proses
 * terpisah — jadi keduanya butuh 1 sumber data yang sama.
 *
 * Implementasi `InMemorySelectionStore` di bawah HANYA untuk:
 *  - development lokal (`bun dev` / `vite dev`, satu proses saja), atau
 *  - referensi bentuk data.
 * JANGAN dipakai apa adanya di production Cloudflare Workers — OTP
 * bisa "hilang" kalau request kedua mendarat di instance Worker yang
 * berbeda dari saat OTP dibuat.
 *
 * Untuk production, ganti `InMemorySelectionStore` dengan salah satu:
 *  - Cloudflare KV (butuh binding `SELECTION_KV` di konfigurasi Nitro/
 *    Cloudflare, lalu simpan/ambil JSON per-key `id`), atau
 *  - Database eksternal (Supabase/Postgres/PlanetScale, dll) via HTTP.
 * Interface `SelectionStore` di bawah sengaja dibuat kecil supaya
 * gampang diganti tanpa mengubah kode di route API / join.tsx.
 */

export type SelectionStatus =
  | "otp_pending"
  | "otp_verified"
  | "tiktok_verified"
  | "completed"
  | "rejected";

export interface SelectionRecord {
  id: string; // contoh: "PP3VPK"
  otp: string; // contoh: "693296"
  status: SelectionStatus;
  createdAt: number;
  expiresAt: number;
  requesterName?: string;
  requesterJid?: string; // nomor WA yang minta seleksi (opsional, dari bot)
  tiktokUsername?: string;
  tiktokProfile?: {
    nickname: string;
    avatarUrl: string;
    bio: string;
    followerCount: number;
  };
  videoUrl?: string;
  assignedGen?: string;
}

export interface SelectionStore {
  create(input: {
    id: string;
    otp: string;
    ttlMs: number;
    requesterName?: string;
    requesterJid?: string;
  }): Promise<SelectionRecord>;
  get(id: string): Promise<SelectionRecord | null>;
  update(id: string, patch: Partial<SelectionRecord>): Promise<SelectionRecord | null>;
}

class InMemorySelectionStore implements SelectionStore {
  private records = new Map<string, SelectionRecord>();

  async create(input: {
    id: string;
    otp: string;
    ttlMs: number;
    requesterName?: string;
    requesterJid?: string;
  }): Promise<SelectionRecord> {
    const now = Date.now();
    const record: SelectionRecord = {
      id: input.id,
      otp: input.otp,
      status: "otp_pending",
      createdAt: now,
      expiresAt: now + input.ttlMs,
      requesterName: input.requesterName,
      requesterJid: input.requesterJid,
    };
    this.records.set(input.id, record);
    return record;
  }

  async get(id: string): Promise<SelectionRecord | null> {
    const record = this.records.get(id);
    if (!record) return null;
    if (Date.now() > record.expiresAt && record.status === "otp_pending") {
      return { ...record, status: "rejected" };
    }
    return record;
  }

  async update(id: string, patch: Partial<SelectionRecord>): Promise<SelectionRecord | null> {
    const existing = this.records.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    this.records.set(id, updated);
    return updated;
  }
}

// Singleton dev-only. Ganti baris ini dengan implementasi KV/DB untuk production.
export const selectionStore: SelectionStore = new InMemorySelectionStore();
