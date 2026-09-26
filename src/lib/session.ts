/**
 * Menyimpan waktu pertama kali website dibuka (per-browser) ke localStorage,
 * supaya penghitung uptime/session di halaman "/" dan "/system" tidak reset
 * ke 0 setiap kali halaman di-reload — melainkan melanjutkan dari kunjungan
 * pertama yang tersimpan di local storage.
 */
const STORAGE_KEY = "5fam_session_start";

export function getPersistedSessionStart(): number {
  if (typeof window === "undefined") return Date.now();

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const ts = Number(saved);
      if (!Number.isNaN(ts)) return ts;
    }
    const now = Date.now();
    window.localStorage.setItem(STORAGE_KEY, String(now));
    return now;
  } catch {
    // localStorage tidak tersedia (mis. private mode) — fallback ke waktu sekarang
    return Date.now();
  }
}
