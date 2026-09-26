import { createFileRoute, Link } from "@tanstack/react-router";
import { img, onImgError } from "../lib/site-images";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { GEN_MEMBER_COUNTS } from "../lib/site-config";
import { useI18n } from "../lib/i18n";

export const Route = createFileRoute("/generations")({
  head: () => ({
    meta: [
      { title: "Five Fail Family - Generasi" },
      { name: "description", content: "Tiga generasi Five Fail Family: dari sepuh sampai newbie." },
      { property: "og:title", content: "Generasi - Five Fail Family" },
      { property: "og:description", content: "Tiga generasi Five Fail Family." },
    ],
  }),
  component: GenPage,
});

const genImages = [
  "https://cdn.nekohime.site/file/1cnw6mmj.png",
  "https://cdn.nekohime.site/file/nntkcmr6.png",
  "https://cdn.nekohime.site/file/89zjqlrw.png",
];

const genData = GEN_MEMBER_COUNTS.map((m, i) => ({
  image: genImages[i],
  title: m.gen,
  count: m.count,
}));

function GenPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{t.gens.title}</h1>
      <p className="mt-2 text-muted-foreground">{t.gens.desc}</p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {genData.map((g, i) => (
          <article
            key={g.title}
            className="glass-card glass-card-hover flex flex-col items-center p-6 text-center"
          >
            <img
              src={img(g.image)}
              alt={g.title}
              className="h-28 w-28 rounded-2xl object-cover ring-1 ring-border"
              loading="lazy"
              width={512}
              height={512}
              onError={onImgError}
            />
            <h2 className="mt-4 text-xl font-bold">Five Fail Family {g.title}</h2>
            <p className="text-accent-soft mt-1 text-xs tracking-widest uppercase">
              {t.gens.items[i]?.subtitle}
            </p>
            <p className="mt-3 flex-1 text-sm text-muted-foreground">{t.gens.items[i]?.body}</p>
            <p className="font-display mt-4 text-3xl font-bold">
              <AnimatedCounter value={g.count} />
              <span className="font-sans text-sm font-normal text-muted-foreground">
                {" "}
                {t.common.members}
              </span>
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/join" className="btn-primary">
          {t.common.joinNow}
        </Link>
      </div>
    </main>
  );
}
