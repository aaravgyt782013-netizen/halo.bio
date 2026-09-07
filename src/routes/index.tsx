import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Music4, Video, Palette, ShieldCheck, ArrowRight } from "lucide-react";
import { normalizeUsername } from "@/lib/bio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Halo — Media-rich link in bio pages" },
      {
        name: "description",
        content:
          "Build a premium link-in-bio page with video backgrounds, auto-play music, frosted glass cards and a live preview builder.",
      },
      { property: "og:title", content: "Halo — Media-rich link in bio pages" },
      {
        property: "og:description",
        content:
          "Claim your username and build a glassmorphic bio page with video backgrounds, music and animations.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Video,
    title: "Video backgrounds",
    body: "Upload a clip or paste a URL. Your page becomes a moving poster.",
  },
  {
    icon: Music4,
    title: "Auto-play music",
    body: "A click-to-enter screen unlocks sound the way browsers require.",
  },
  {
    icon: Palette,
    title: "Glass controls",
    body: "Dial in card opacity, blur and corner radius with live sliders.",
  },
  {
    icon: ShieldCheck,
    title: "Yours alone",
    body: "Every page is locked to your account with strict access rules.",
  },
];

function Landing() {
  const [username, setUsername] = useState("");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="aura pointer-events-none absolute inset-0 -z-10" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <span className="font-display text-lg font-bold tracking-tight">halo.bio</span>
        <nav className="flex items-center gap-2">
          <Link to="/auth" className="btn-ghost">
            Log in
          </Link>
          <Link to="/auth" search={{ mode: "signup" }} className="btn-primary">
            Get started
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24">
        <section className="animate-float-in pt-10 text-center sm:pt-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-glass px-3 py-1 text-xs font-semibold text-muted-foreground shadow-soft">
            <Sparkles className="h-3.5 w-3.5" /> one link, all of you
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl">
            A bio page that feels like a
            <span className="block bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
              frosted piece of glass
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Video backgrounds, ambient music, buttery animations and a builder with a real-time
            phone preview. Claim your handle in seconds.
          </p>

          <form
            className="glass mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full p-1.5 pl-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <span className="text-sm text-muted-foreground">halo.bio/</span>
            <input
              value={username}
              onChange={(e) => setUsername(normalizeUsername(e.target.value))}
              placeholder="yourname"
              aria-label="Choose your username"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
            />
            <Link
              to="/auth"
              search={{ mode: "signup", u: username || undefined }}
              className="btn-primary shrink-0"
            >
              Claim <ArrowRight className="h-4 w-4" />
            </Link>
          </form>
        </section>

        <section className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <article key={f.title} className="glass-panel p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-display text-base font-semibold">{f.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </section>

        <section className="glass-panel mt-20 flex flex-col items-center gap-4 p-10 text-center">
          <h2 className="max-w-lg text-2xl font-bold sm:text-3xl">
            Your audience clicks once. Make it count.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Free to start. Upgradeable to Pro for premium badges and extras.
          </p>
          <Link to="/auth" search={{ mode: "signup" }} className="btn-primary">
            Build my page
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} halo.bio — made for creators
      </footer>
    </div>
  );
}
