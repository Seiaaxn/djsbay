import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useI18n } from "../lib/i18n";

export function NavBar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/generations", label: t.nav.generations },
    { to: "/system", label: "System" },
    { to: "/admin", label: t.nav.admin },
    { to: "/readme", label: t.nav.readme },
  ];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-border bg-card" style={{ borderBottomColor: "var(--neo-purple)", boxShadow: "0 3px 0 0 var(--neo-purple-dark), 0 3px 12px 0 rgba(70,24,107,0.15)" }}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex items-baseline gap-2">
            <span className="font-display text-base font-bold tracking-tight">Five Fail</span>
            <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">
              Family
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 text-sm md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: true }}
                activeProps={{
                  className: "text-foreground font-bold bg-accent border-[3px] border-foreground",
                }}
                inactiveProps={{
                  className:
                    "text-muted-foreground border-[3px] border-transparent hover:text-foreground hover:bg-secondary hover:border-foreground",
                }}
                className="rounded-lg px-3 py-1.5 font-semibold transition"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link to="/join" className="btn-primary hidden px-4 py-2 sm:inline-flex">
            {t.nav.join}
          </Link>

          <div ref={ref} className="relative md:hidden">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-[3px] border-foreground bg-card shadow-[3px_3px_0_0_var(--neo-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border-[3px] border-foreground bg-popover shadow-[6px_6px_0_0_var(--neo-ink)]">
                <ul className="py-1 text-sm">
                  {[...links, { to: "/join", label: t.nav.join }].map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        onClick={() => setOpen(false)}
                        activeOptions={{ exact: true }}
                        activeProps={{ className: "bg-secondary font-semibold text-foreground" }}
                        inactiveProps={{
                          className: "text-muted-foreground hover:bg-secondary/70",
                        }}
                        className="block px-4 py-2.5 transition"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
