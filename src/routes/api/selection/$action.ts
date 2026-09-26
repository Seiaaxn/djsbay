import { createFileRoute } from "@tanstack/react-router";

import { selectionStore } from "../../../lib/selection-store";
import { fetchTikTokProfile, verifyTikTokVideoHashtag, TikTokLookupError } from "../../../lib/tiktok";
import { GEN_RULES, SELECTION_HASHTAG, SELECTION_OTP_TTL_MS } from "../../../lib/site-config";
import { chatgpt, getSession } from "../../../lib/chatgpt";

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
 * palsu langsung dari luar.
 */

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

// ─── AI content detection ─────────────────────────────────────────────────────

type ContentType = "anime" | "preset" | "unknown";

interface AIDetectionResult {
  contentType: ContentType;
  reason: string;
  detectedKeywords: string[];
}

/**
 * Kirim caption video TikTok ke ChatGPT untuk dianalisis.
 * AI menentukan apakah konten termasuk:
 *   - "anime"  → anime, manga, manhwa, manhua, webtoon, dll
 *   - "preset" → preset editing, AMV, L2D, video edit, template, dll
 *   - "unknown" → tidak bisa ditentukan
 *
 * Return fallback "unknown" jika AI gagal / timeout.
 */
async function detectContentTypeWithAI(
  caption: string,
  username: string,
): Promise<AIDetectionResult> {
  const prompt = `Kamu adalah sistem klasifikasi konten TikTok untuk komunitas kreator.

Tugasmu: Analisis caption video TikTok berikut dan tentukan tipe kontennya.

Username TikTok: @${username}
Caption video:
"""
${caption}
"""

Klasifikasikan ke salah satu dari tiga kategori:
1. "anime" → konten terkait anime, manga, manhwa, manhua, webtoon, atau judul/karakter anime spesifik (contoh: One Piece, Naruto, Demon Slayer, scene pack anime, manga edit, manhwa cap, dll)
2. "preset" → konten terkait preset editing, AMV (Anime Music Video), L2D/Live2D, video edit, template CapCut/Alight Motion, lyric video, after effect, dll
3. "unknown" → tidak bisa ditentukan karena caption terlalu umum, kosong, atau tidak relevan

PENTING: Balas HANYA dengan JSON berikut, tanpa teks lain:
{"contentType":"anime"|"preset"|"unknown","reason":"alasan singkat dalam bahasa Indonesia","detectedKeywords":["kata kunci 1","kata kunci 2"]}`;

  try {
    const auth = await getSession();
    const result = await chatgpt(prompt, auth, null);

    // Parse JSON dari response AI
    const raw = result.response.trim();
    // Cari JSON object di dalam response (AI kadang bungkus dengan markdown)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in AI response");

    const parsed = JSON.parse(jsonMatch[0]) as Partial<AIDetectionResult>;
    const contentType: ContentType =
      parsed.contentType === "anime" || parsed.contentType === "preset"
        ? parsed.contentType
        : "unknown";

    return {
      contentType,
      reason: parsed.reason ?? "Tidak ada alasan dari AI.",
      detectedKeywords: Array.isArray(parsed.detectedKeywords) ? parsed.detectedKeywords : [],
    };
  } catch (err) {
    console.warn("[detectContentTypeWithAI] AI gagal, fallback ke unknown:", err);
    // Fallback jika AI tidak bisa dihubungi
    return {
      contentType: "unknown",
      reason: "AI tidak dapat dianalisis saat ini, menggunakan fallback.",
      detectedKeywords: [],
    };
  }
}

// ─── Gen picker ───────────────────────────────────────────────────────────────

/**
 * Tentukan generasi berdasarkan hasil deteksi AI dan jumlah followers.
 *
 * Gen 2 → konten anime/manga/manhwa (semua followers, tanpa seleksi)
 * Gen 1 → konten preset/AMV/edit dengan 500+ followers (via seleksi)
 * Gen 3 → konten preset/AMV/edit dengan <500 followers (via seleksi)
 * Gen 3 → unknown/tidak terdeteksi (fallback)
 */
function pickGen(
  followerCount: number,
  aiResult: AIDetectionResult,
): { gen: string; label: string; desc: string; detectedAs: string; aiReason: string } {
  const { contentType, reason, detectedKeywords } = aiResult;
  const kwStr = detectedKeywords.length > 0 ? ` (${detectedKeywords.slice(0, 3).join(", ")})` : "";

  if (contentType === "anime") {
    const rule = GEN_RULES.find((r) => r.contentType === "anime")!;
    return {
      gen: rule.gen,
      label: rule.label,
      desc: rule.desc,
      detectedAs: `Konten anime/manga${kwStr}`,
      aiReason: reason,
    };
  }

  if (contentType === "preset" || contentType === "unknown") {
    if (followerCount >= 500) {
      const rule = GEN_RULES.find((r) => r.contentType === "preset" && r.minFollowers >= 500)!;
      return {
        gen: rule.gen,
        label: rule.label,
        desc: rule.desc,
        detectedAs:
          contentType === "preset"
            ? `Konten preset/AMV${kwStr} · ${followerCount.toLocaleString("id-ID")} followers`
            : `Tidak terdeteksi · ${followerCount.toLocaleString("id-ID")} followers`,
        aiReason: reason,
      };
    } else {
      const rule = GEN_RULES.find((r) => r.contentType === "preset" && r.minFollowers === 0)!;
      return {
        gen: rule.gen,
        label: rule.label,
        desc: rule.desc,
        detectedAs:
          contentType === "preset"
            ? `Konten preset/AMV${kwStr} · ${followerCount.toLocaleString("id-ID")} followers`
            : `Tidak terdeteksi · ${followerCount.toLocaleString("id-ID")} followers`,
        aiReason: reason,
      };
    }
  }

  // Absolute fallback (shouldn't reach here)
  const fallback = GEN_RULES[GEN_RULES.length - 1];
  return {
    gen: fallback.gen,
    label: fallback.label,
    desc: fallback.desc,
    detectedAs: "Fallback otomatis",
    aiReason: reason,
  };
}

// ─── Route ────────────────────────────────────────────────────────────────────

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
                return json(
                  { ok: false, error: "Kode OTP sudah kedaluwarsa. Minta kode baru." },
                  { status: 410 },
                );
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
                return json(
                  { ok: false, error: "ID sesi dan username TikTok wajib diisi." },
                  { status: 400 },
                );
              }
              const record = await selectionStore.get(body.id.trim().toUpperCase());
              if (!record || record.status === "otp_pending") {
                return json(
                  { ok: false, error: "Sesi tidak valid. Ulangi verifikasi OTP." },
                  { status: 401 },
                );
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
                return json(
                  { ok: false, error: "ID sesi dan link video wajib diisi." },
                  { status: 400 },
                );
              }
              const record = await selectionStore.get(body.id.trim().toUpperCase());
              if (!record?.tiktokProfile) {
                return json(
                  { ok: false, error: "Belum ada data profil TikTok untuk sesi ini." },
                  { status: 401 },
                );
              }

              // 1. Verifikasi hashtag dari caption video
              const { ok, caption } = await verifyTikTokVideoHashtag(body.videoUrl, SELECTION_HASHTAG);
              if (!ok) {
                return json(
                  { ok: false, error: `Video belum mengandung hashtag #${SELECTION_HASHTAG}.` },
                  { status: 422 },
                );
              }

              // 2. Kirim caption ke AI untuk deteksi tipe konten
              const aiResult = await detectContentTypeWithAI(
                caption,
                record.tiktokProfile.username,
              );

              // 3. Tentukan gen berdasarkan hasil AI + follower count
              const gen = pickGen(record.tiktokProfile.followerCount, aiResult);

              // 4. Simpan hasil
              await selectionStore.update(record.id, {
                videoUrl: body.videoUrl,
                status: "completed",
                assignedGen: gen.gen,
              });

              return json({
                ok: true,
                gen: gen.gen,
                label: gen.label,
                desc: gen.desc,
                detectedAs: gen.detectedAs,
                aiReason: gen.aiReason,
              });
            }

            default:
              return json({ ok: false, error: "Aksi tidak dikenal." }, { status: 404 });
          }
        } catch (error) {
          const message =
            error instanceof TikTokLookupError ? error.message : "Terjadi kesalahan pada server.";
          console.error(`[api/selection/${action}]`, error);
          return json({ ok: false, error: message }, { status: 502 });
        }
      },
    },
  },
});
