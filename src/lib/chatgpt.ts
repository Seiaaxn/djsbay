/**
 * ChatGPT client (Android anon session) — dipakai untuk analisis
 * caption TikTok saat proses seleksi gen.
 *
 * Sumber kode session/chat dari kode yang diberikan oleh owner.
 * File ini HANYA dipakai di sisi server (server functions TanStack Start).
 */

import { createHash, randomUUID } from "crypto";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatGPTAuth {
  cookie: string;
  deviceId: string;
  parentMessageId: string;
  authorization?: string;
  token?: string;
  accountId?: string;
}

export interface ChatGPTResult {
  response: string;
  chatId: string | null;
  auth: ChatGPTAuth;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseCookies(arr: string[] | undefined): Record<string, string> {
  return Object.fromEntries(
    (arr ?? []).map((c) => c.split(";")[0].split("=").map((s) => s.trim()) as [string, string]),
  );
}

function cleanSpecialTags(text: string): string {
  if (!text) return "";
  text = text.replace(/\ue200entity\ue202([^\ue201]+)\ue201/g, (_match, p1: string) => {
    try {
      const arr = JSON.parse(p1) as unknown[];
      return String(arr[1] ?? arr[0] ?? "");
    } catch {
      return "";
    }
  });
  text = text.replace(/\ue200[^\ue201]*\ue201/g, "");
  return text.trim();
}

// ─── Session ─────────────────────────────────────────────────────────────────

export async function getSession(): Promise<ChatGPTAuth> {
  const deviceId = randomUUID();

  const res = await fetch(
    "https://android.chat.openai.com/backend-anon/sentinel/chat-requirements",
    {
      method: "POST",
      headers: {
        "User-Agent": "ChatGPT/1.2026.181 (Android 16; Neo/1.0; build 2222222)",
        "OAI-Package-Name": "com.openai.chatgpt",
        "OAI-Client-Type": "android",
        "OAI-Device-Id": deviceId,
        "Accept-Language": "id-ID,in;q=0.9",
        "X-Device-Tier": "upper_mid",
        "X-OpenAI-Target-Path": "/backend-anon/sentinel/chat-requirements",
        "ChatGPT-Account-Id": "default",
        "ChatGPT-Residency-Region": "no_constraint",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: "{}",
    },
  );

  const setCookieHeaders = res.headers.getSetCookie?.() ?? [];
  const cookies = parseCookies(setCookieHeaders);
  const cookieStr = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

  const data = (await res.json().catch(() => ({}))) as { token?: string };
  let oaiSc = cookies["oai-sc"];
  if (!oaiSc && data.token) oaiSc = `0${data.token}`;

  const cookie =
    oaiSc && !cookieStr.includes("oai-sc") ? `oai-sc=${oaiSc}; ${cookieStr}` : cookieStr;

  return { cookie, deviceId, parentMessageId: randomUUID() };
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export async function chatgpt(
  prompt: string,
  auth?: ChatGPTAuth | null,
  chatId?: string | null,
): Promise<ChatGPTResult> {
  const resolvedAuth: ChatGPTAuth = auth ?? (await getSession());
  if (!resolvedAuth.deviceId) resolvedAuth.deviceId = randomUUID();
  if (!resolvedAuth.parentMessageId) resolvedAuth.parentMessageId = randomUUID();

  const isAuthorized = !!(resolvedAuth.authorization || resolvedAuth.token);
  const baseUrl = isAuthorized
    ? "https://android.chat.openai.com/backend-api"
    : "https://android.chat.openai.com/backend-anon";

  const currentMessageId = randomUUID();
  const parentMessageId = resolvedAuth.parentMessageId;

  const headers: Record<string, string> = {
    "User-Agent": "ChatGPT/1.2026.181 (Android 16; Neo/1.0; build 2222222)",
    "OAI-Package-Name": "com.openai.chatgpt",
    "OAI-Client-Type": "android",
    "OAI-Device-Id": resolvedAuth.deviceId,
    "Accept-Language": "id-ID,in;q=0.9",
    "X-Device-Tier": "upper_mid",
    "X-OpenAI-Target-Path": isAuthorized
      ? "/backend-api/f/conversation"
      : "/backend-anon/f/conversation",
    "ChatGPT-Account-Id": isAuthorized ? (resolvedAuth.accountId ?? "default") : "default",
    "ChatGPT-Residency-Region": "no_constraint",
    "Content-Type": "application/json",
    Accept: "text/event-stream",
    Cookie: resolvedAuth.cookie,
    "X-Sentinel-Payload": JSON.stringify({
      bot_token: {
        failure_reason:
          "-2: Standard Integrity API error (-2): The Play Store app is either not installed or not the official version.\nAsk the user to install an official and recent version of Play Store.\n (https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/StandardIntegrityErrorCode.html#PLAY_STORE_NOT_FOUND).",
        failure_detail:
          "[qdb0.j(SourceFile:9), g4n.a(SourceFile:85), f4n.invokeSuspend(SourceFile:14), kotlin.coroutines.jvm.internal.BaseContinuationImpl.resumeWith(SourceFile:5), qni.run(SourceFile:104), fnf.run(SourceFile:112)]",
      },
    }),
  };

  if (isAuthorized) {
    headers["Authorization"] = resolvedAuth.authorization ?? `Bearer ${resolvedAuth.token}`;
  }

  const body: Record<string, unknown> = {
    action: "next",
    messages: [
      {
        id: currentMessageId,
        author: { role: "user" },
        content: { content_type: "text", parts: [prompt] },
        status: "finished_successfully",
        recipient: "all",
      },
    ],
    model: "auto",
    history_and_training_disabled: false,
    fork_from_shared_post: false,
    enable_message_followups: true,
    force_use_sse: true,
    force_use_search: null,
    force_paragen: false,
    supported_encodings: ["v1"],
    supports_buffering: true,
    timezone: "Asia/Makassar",
    timezone_offset_min: -480,
    system_hints: [],
    is_onboarding_conversation: false,
    no_auth_ad_preferences: { personalization_enabled: true, history_enabled: true },
    client_prepare_state: "none",
    stream: true,
  };

  if (chatId) {
    body.conversation_id = chatId;
    body.parent_message_id = parentMessageId;
  }

  const streamRes = await fetch(`${baseUrl}/f/conversation`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!streamRes.ok || !streamRes.body) {
    throw new Error(`ChatGPT stream error: ${streamRes.status}`);
  }

  return new Promise<ChatGPTResult>((resolve, reject) => {
    let text = "";
    let buf = "";
    let lastPath: string | null = null;
    let lastOp: string | null = null;
    let finalChatId = chatId ?? null;
    let currentAssistantMsgId: string | null = null;

    const reader = streamRes.body!.getReader();
    const decoder = new TextDecoder();

    function processChunk(chunk: string) {
      buf += chunk;
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === "data: [DONE]") continue;
        if (!trimmed.startsWith("data: ")) continue;

        try {
          const data = JSON.parse(trimmed.substring(6)) as Record<string, unknown>;

          if (data.conversation_id && typeof data.conversation_id === "string") {
            finalChatId = data.conversation_id;
          }

          const p = data.p !== undefined ? (data.p as string) : lastPath;
          const o = data.o !== undefined ? (data.o as string) : lastOp;

          if (data.p !== undefined) lastPath = data.p as string;
          if (data.o !== undefined) lastOp = data.o as string;

          if (o === "add" && data.v && typeof data.v === "object") {
            const v = data.v as Record<string, unknown>;
            if (v.message && typeof v.message === "object") {
              const msg = v.message as Record<string, unknown>;
              const author = msg.author as Record<string, unknown> | undefined;
              if (author?.role === "assistant") {
                currentAssistantMsgId = msg.id as string;
                const parts = (msg.content as Record<string, unknown>)?.parts as unknown[];
                if (parts?.[0]) text = parts[0] as string;
              }
            }
          } else if (o === "patch" && Array.isArray(data.v)) {
            for (const op of data.v as Record<string, unknown>[]) {
              if (
                op.o === "append" &&
                typeof op.p === "string" &&
                op.p.startsWith("/message/content/parts/")
              ) {
                text += op.v as string;
              }
            }
          } else if (
            o === "append" &&
            p &&
            p.startsWith("/message/content/parts/") &&
            typeof data.v === "string"
          ) {
            text += data.v;
          }
        } catch {
          // skip malformed SSE line
        }
      }
    }

    function pump() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            if (currentAssistantMsgId) {
              resolvedAuth.parentMessageId = currentAssistantMsgId;
            }
            resolve({ response: cleanSpecialTags(text), chatId: finalChatId, auth: resolvedAuth });
            return;
          }
          processChunk(decoder.decode(value, { stream: true }));
          pump();
        })
        .catch(reject);
    }

    pump();
  });
}
