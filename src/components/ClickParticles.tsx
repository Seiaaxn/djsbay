import { useEffect, useRef } from "react";

/**
 * Warna partikel — diambil dari token neobrutalism di styles.css
 * (--particle-1..6) supaya satu sumber kebenaran dengan tema.
 */
const PARTICLE_COLORS = [
  "var(--particle-1)",
  "var(--particle-2)",
  "var(--particle-3)",
  "var(--particle-4)",
  "var(--particle-5)",
  "var(--particle-6)",
];

const SHAPES = ["50%", "2px", "0 50% 50% 50%"]; // lingkaran, kotak, tetesan

let seq = 0;

/**
 * Overlay global yang memunculkan ledakan partikel warna-warni setiap kali
 * pengguna klik/tap di mana pun pada halaman — efek khas neobrutalism yang
 * playful. Taruh sekali saja di root layout (lihat routes/__root.tsx).
 *
 * - Tidak memblokir klik apa pun (semua elemen `pointer-events: none`).
 * - Otomatis nonaktif kalau user mengaktifkan `prefers-reduced-motion`.
 * - Partikel dibuang dari DOM sendiri setelah animasinya selesai, jadi
 *   tidak ada memory leak walau diklik ribuan kali.
 */
export function ClickParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotionQuery.matches) return;

    function burst(x: number, y: number) {
      const count = 10 + Math.floor(Math.random() * 4); // 10–13 partikel

      for (let i = 0; i < count; i++) {
        const particle = document.createElement("span");
        particle.className = "neo-particle";

        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
        const distance = 28 + Math.random() * 46;
        const px = Math.cos(angle) * distance;
        const py = Math.sin(angle) * distance;
        const size = 6 + Math.random() * 7;
        const duration = 480 + Math.random() * 380;
        const rotation = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360);
        const color = PARTICLE_COLORS[(seq + i) % PARTICLE_COLORS.length];
        const shape = SHAPES[i % SHAPES.length];

        particle.style.setProperty("--p-x", `${px}px`);
        particle.style.setProperty("--p-y", `${py}px`);
        particle.style.setProperty("--p-rot", `${rotation}deg`);
        particle.style.setProperty("--p-duration", `${duration}ms`);
        particle.style.setProperty("--p-color", color);
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = shape;
        // Gunakan left/top agar posisi awal = titik klik yang sebenarnya
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        container.appendChild(particle);
        particle.addEventListener("animationend", () => particle.remove(), { once: true });
        // Jaring pengaman kalau animationend tidak terpanggil (mis. tab pindah tools).
        window.setTimeout(() => particle.remove(), duration + 300);
      }

      seq += count;
    }

    function handlePointerDown(event: PointerEvent) {
      // Klik kanan / non-primary tidak perlu ledakan partikel.
      if (event.button !== undefined && event.button !== 0) return;
      burst(event.clientX, event.clientY);
    }

    document.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    />
  );
}
