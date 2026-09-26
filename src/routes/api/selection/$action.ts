import { createFileRoute } from "@tanstack/react-router";

import { selectionStore } from "../../../lib/selection-store";
import { fetchTikTokProfile, verifyTikTokVideoHashtag, TikTokLookupError } from "../../../lib/tiktok";
import { GEN_RULES, SELECTION_HASHTAG, SELECTION_OTP_TTL_MS } from "../../../lib/site-config";

/**
 * Satu endpoint untuk semua langkah alur seleksi, dibedakan lewat
 * segmen dinamis `$action`:
 *   POST /api/selection/create         → dipanggil BOT WhatsApp saat generate ID+OTP
 *   POST /api/selection/verify-otp     → dipanggil WEBSITE, step 1 (Verifikasi OTP)
 *   POST /api/selection/tiktok-profile → dipanggil WEBSITE, step 3 (input username TikTok)
 *   POST /api/selection/verify-post    → dipanggil WEBSITE, step 4 (link video + hashtag)
 *
 * ⚠️ Endpoint `create` sebaiknya diberi secret/header rahasia (mis.
 * `X-Bot-Secret`) supaya tidak sembarang orang bisa membuat ID+OTP
 * palsu langsung dari luar. Contoh pengecekan disediakan di bawah,
 * tinggal isi env var `SELECTION_BOT_SECRET` di konfigurasi deploy.
 */

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

function pickGen(followerCount: number): (typeof GEN_RULES)[number] {
  for (const rule of GEN_RULES) {
    if (rule.max == null) {
      if (followerCount >= rule.min) return rule;
    } else if (followerCount >= rule.min && followerCount <= rule.max) {
      return rule;
    }
  }
  return GEN_RULES[GEN_RULES.length - 1];
}

export const Route = createFileRoute("/api/selection/$action")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const { action } = params;

        try {
          switch (action) {
            case "create": {
              const botSecret = process.env.SELECTION_BOT_SECRET;
              if (botSecret && request.headers.get("x-bot-secret") !== botSecret) {
                return json({ ok: false, error: "Unauthorized" }, { status: 401 });
              }
              const body = (await request.json()) as {
                id?: string;
                otp?: string;
                requesterName?: string;
                requesterJid?: string;
              };
              if (!body.id || !body.otp) {
                return json({ ok: false, error: "id dan otp wajib diisi" }, { status: 400 });
              }
              const record = await selectionStore.create({
                id: body.id,
                otp: body.otp,
                ttlMs: SELECTION_OTP_TTL_MS,
                requesterName: body.requesterName,
                requesterJid: body.requesterJid,
              });
              return json({ ok: true, id: record.id, expiresAt: record.expiresAt });
            }

            case "verify-otp": {
              const body = (await request.json()) as { id?: string; otp?: string };
              if (!body.id || !body.otp) {
                return json({ ok: false, error: "ID dan kode OTP wajib diisi." }, { status: 400 });
              }
              const record = await selectionStore.get(body.id.trim().toUpperCase());
              if (!record) {
                return json({ ok: false, error: "ID Seleksi tidak ditemukan." }, { status: 404 });
              }
              if (Date.now() > record.expiresAt) {
                return json({ ok: false, error: "Kode OTP sudah kedaluwarsa. Minta kode baru." }, { status: 410 });
              }
              if (record.otp !== body.otp.trim()) {
                return json({ ok: false, error: "Kode OTP salah." }, { status: 401 });
              }
              const updated = await selectionStore.update(record.id, { status: "otp_verified" });
              return json({ ok: true, id: updated?.id });
            }

            case "tiktok-profile": {
              const body = (await request.json()) as { id?: string; username?: string };
              if (!body.id || !body.username) {
                return json({ ok: false, error: "ID sesi dan username TikTok wajib diisi." }, { status: 400 });
              }
              const record = await selectionStore.get(body.id.trim().toUpperCase());
              if (!record || record.status === "otp_pending") {
                return json({ ok: false, error: "Sesi tidak valid. Ulangi verifikasi OTP." }, { status: 401 });
              }
              const profile = await fetchTikTokProfile(body.username);
              await selectionStore.update(record.id, {
                tiktokUsername: profile.username,
                tiktokProfile: profile,
              });
              return json({ ok: true, profile });
            }

            case "verify-post": {
              const body = (await request.json()) as { id?: string; videoUrl?: string };
              if (!body.id || !body.videoUrl) {
                return json({ ok: false, error: "ID sesi dan link video wajib diisi." }, { status: 400 });
              }
              const record = await selectionStore.get(body.id.trim().toUpperCase());
              if (!record?.tiktokProfile) {
                return json({ ok: false, error: "Belum ada data profil TikTok untuk sesi ini." }, { status: 401 });
              }
              const { ok } = await verifyTikTokVideoHashtag(body.videoUrl, SELECTION_HASHTAG);
              if (!ok) {
                return json(
                  { ok: false, error: `Video belum mengandung hashtag #${SELECTION_HASHTAG}.` },
                  { status: 422 },
                );
              }
              const gen = pickGen(record.tiktokProfile.followerCount);
              await selectionStore.update(record.id, {
                videoUrl: body.videoUrl,
                status: "completed",
                assignedGen: gen.gen,
              });
              return json({ ok: true, gen: gen.gen, label: gen.label, desc: gen.desc });
            }

            default:
              return json({ ok: false, error: "Aksi tidak dikenal." }, { status: 404 });
          }
        } catch (error) {
          const message = error instanceof TikTokLookupError ? error.message : "Terjadi kesalahan pada server.";
          console.error(`[api/selection/${action}]`, error);
          return json({ ok: false, error: message }, { status: 502 });
        }
      },
    },
  },
});
