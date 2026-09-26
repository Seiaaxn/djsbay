import type { SyntheticEvent } from "react";

export const DEFAULT_IMAGE = "https://cdn.nekohime.site/file/kt63h8q2.jpeg";

export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#a855f7'/><stop offset='1' stop-color='#6366f1'/>
      </linearGradient></defs>
      <rect width='200' height='200' fill='url(#g)'/>
      <text x='50%' y='54%' font-family='system-ui,sans-serif' font-size='72' font-weight='800' fill='white' text-anchor='middle'>5F</text>
    </svg>`,
  );

export function img(url?: string): string {
  const trimmed = url?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : DEFAULT_IMAGE;
}

export function onImgError(e: SyntheticEvent<HTMLImageElement>) {
  const el = e.currentTarget;
  if (el.src === FALLBACK_IMAGE) return;
  if (el.src !== DEFAULT_IMAGE) {
    el.src = DEFAULT_IMAGE;
  } else {
    el.src = FALLBACK_IMAGE;
  }
}
