import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  /** Angka akhir yang dituju */
  value: number;
  /** Durasi animasi dalam ms */
  duration?: number;
  /** Teks tambahan di belakang angka, mis. "+" */
  suffix?: string;
  className?: string;
}

/**
 * Menampilkan angka yang bertambah dari 0 sampai `value` dengan easing halus,
 * dipicu begitu elemen terlihat di viewport (sekali saja).
 */
export function AnimatedCounter({
  value,
  duration = 1400,
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const node = spanRef.current;
    if (!node) return;

    const runAnimation = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;

      const startTime = performance.now();

      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        // easeOutCubic — cepat di awal, melambat menjelang akhir
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplay(value);
        }
      };

      requestAnimationFrame(step);
    };

    if (typeof IntersectionObserver === "undefined") {
      runAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            runAnimation();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={spanRef} className={className}>
      {display.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}
