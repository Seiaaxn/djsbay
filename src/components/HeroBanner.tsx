import { onImgError } from "../lib/site-images";

/**
 * URL artwork yang dipakai sebagai "backdrop" di dalam kartu hero.
 * Ganti nilai ini kalau mau mengganti gambar banner di /  dan /system.
 */
export const CARD_BACKDROP_URL = "https://cdn.nekohime.site/file/u77cxelw.jpg";

/**
 * Backdrop artwork tipis DI DALAM kartu, di belakang teks — ala KyzzAPI:
 * gambar redup yang memudar (mask gradient) ke arah konten supaya teks
 * tetap kebaca. Ini bukan banner 16:9 terpisah, tapi lapisan paling
 * bawah dari kartu hero itu sendiri.
 *
 * Pemakaian: taruh sebagai child PERTAMA di dalam container yang sudah
 * `position: relative` + `overflow-hidden` (mis. class `glass-card`),
 * SEBELUM konten teks, supaya urutan tumpukan (stacking) benar.
 */
export function CardBackdrop({
  className = "",
  side = "right",
  opacity = 0.16,
}: {
  className?: string;
  /** Sisi mana gambar paling terlihat sebelum memudar. */
  side?: "left" | "right";
  opacity?: number;
}) {
  const mask =
    side === "right"
      ? "linear-gradient(to left, black 22%, transparent 78%)"
      : "linear-gradient(to right, black 22%, transparent 78%)";

  return (
    <img
      src={CARD_BACKDROP_URL}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-right grayscale ${className}`}
      style={{
        opacity,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
      loading="lazy"
      decoding="async"
      onError={onImgError}
    />
  );
}
