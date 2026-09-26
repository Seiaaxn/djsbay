import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { FAVICON_URL, OG_IMAGE_URL } from "../lib/site-config";
import { NavBar } from "../components/NavBar";
import { ClickParticles } from "../components/ClickParticles";
import { LanguageProvider } from "../lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-primary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  function handleTryAgain() {
    // Navigate back if possible, otherwise go home — avoids re-triggering
    // the same broken route that caused this error boundary to fire.
    if (router.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. You can go back or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={handleTryAgain}
            className="btn-primary"
          >
            Try again
          </button>
          <Link to="/" className="btn-ghost">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Five Fail Family — Marga Editor & Kreator Anime" },
      {
        name: "description",
        content:
          "Marga editor & kreator anime di TikTok. Join komunitas Five Fail Family sekarang.",
      },
      { property: "og:title", content: "Five Fail Family" },
      { property: "og:description", content: "Marga editor & kreator anime di TikTok." },
      { property: "og:image", content: OG_IMAGE_URL },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE_URL },
      { name: "theme-color", content: "#ffffff" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: FAVICON_URL, type: "image/jpeg" },
      { rel: "shortcut icon", href: FAVICON_URL, type: "image/jpeg" },
      { rel: "apple-touch-icon", href: FAVICON_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Archivo+Black&family=Space+Grotesk:wght@600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <NavBar />
        <Outlet />
        <ClickParticles />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
