import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, Compass } from "lucide-react";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "404 Halaman tidak ditemukan | Five Fail Family" },
      { name: "description", content: "Halaman yang kamu cari tidak ditemukan." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotFoundPage,
});

function NotFoundPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="font-display text-accent-soft text-7xl font-bold md:text-8xl">404</p>
      <h1 className="mt-3 text-2xl font-bold md:text-3xl">{t.notFound.title}</h1>
      <p className="mt-3 text-muted-foreground">{t.notFound.desc}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home className="h-4 w-4" /> {t.nav.home}
        </Link>
        <Link to="/generations" className="btn-ghost inline-flex items-center gap-2">
          <Compass className="h-4 w-4" /> {t.common.explore}
        </Link>
      </div>
    </main>
  );
}
