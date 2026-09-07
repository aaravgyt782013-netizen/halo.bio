import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Music4,
  Video,
  Palette,
  ShieldCheck,
  ArrowRight,
  Layers,
} from "lucide-react";
import { normalizeUsername } from "@/lib/bio";
import { LiquidOrbBackground } from "@/components/LiquidOrbBackground";

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
    body: "Upload a clip or paste a URL. Your page becomes a living, moving poster.",
    tag: "Liquid Motion",
  },
  {
    icon: Music4,
    title: "Auto-play music",
    body: "A tactile click-to-enter screen unlocks browser audio with soundwave visuals.",
    tag: "Spatial Audio",
  },
  {
    icon: Layers,
    title: "Hybrid Aesthetics",
    body: "Neomorphic depth, skeuomorphic switches, and liquid glass refraction in one unified UI.",
    tag: "Neo & Glass",
  },
  {
    icon: Palette,
    title: "Optical Sliders",
    body: "Dial in opacity, refraction blur, and tactile corner radiuses in real time.",
    tag: "Precision Styling",
  },
];

function Landing() {
  const [username, setUsername] = useState("");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Animated Liquid Glass Orbs Background */}
      <LiquidOrbBackground accentColor="#6366f1" />
      <div className="aura pointer-events-none absolute inset-0 -z-10" />

      {/* Floating Liquid Glass Header */}
      <header className="sticky top-0 z-30 mx-auto max-w-6xl px-5 py-4">
        <div className="flex items-center justify-between rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-t border-white/80 border-b border-black/10 border-x border-white/40 px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.06),_inset_0_1px_1px_rgba(255,255,255,0.9)]">
          <Link
            to="/"
            className="font-display text-lg font-bold tracking-tight hover:opacity-85 transition-transform active:scale-95"
          >
            halo<span className="text-primary">.bio</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/auth" className="btn-liquid-ghost text-xs py-1.5 px-3.5">
              Log in
            </Link>
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="btn-liquid text-xs py-1.5 px-4 inline-flex items-center gap-1.5"
            >
              <span>Get started</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24">
        <section className="pt-12 text-center sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full neo-raised px-4 py-1.5 text-xs font-semibold text-primary shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              Neomorphic · Skeuomorphic · Liquid Glass
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.08]"
          >
            A bio page that feels like a{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                tactile liquid jewel
              </span>
              <div className="absolute -inset-1 rounded-lg bg-primary/10 blur-xl -z-10" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Liquid glass optics, skeuomorphic physical bevels, ambient
            soundtracks, and butter-smooth fluid animations.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="neo-sunken mx-auto mt-9 flex max-w-md items-center gap-2 rounded-full p-2 pl-5 transition-all"
            onSubmit={(e) => {
              e.preventDefault();
              if (username) {
                try {
                  sessionStorage.setItem("halo:desired-username", username);
                } catch {
                  // ignore
                }
              }
            }}
          >
            <span className="text-sm font-semibold text-muted-foreground">
              halo.bio/
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(normalizeUsername(e.target.value))}
              placeholder="yourname"
              aria-label="Choose your username"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none text-foreground placeholder:text-muted-foreground/50"
            />
            <Link
              to="/auth"
              search={{ mode: "signup", u: username || undefined }}
              onClick={() => {
                if (username) {
                  try {
                    sessionStorage.setItem("halo:desired-username", username);
                  } catch {
                    // ignore
                  }
                }
              }}
              className="btn-liquid shrink-0 py-2 px-5 text-xs inline-flex items-center gap-1.5"
            >
              <span>Claim</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.form>
        </section>

        {/* Feature Grid with Neomorphic Depth and Liquid Gloss */}
        <section className="mt-24 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, idx) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="neo-raised rounded-3xl p-6 relative overflow-hidden group"
            >
              {/* Refractive gloss light pass on hover */}
              <div className="pointer-events-none absolute -inset-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent rotate-12" />

              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-[0_4px_12px_rgba(99,102,241,0.15),_inset_0_1px_1px_rgba(255,255,255,0.8)]">
                  <f.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-primary/80 uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10">
                  {f.tag}
                </span>
              </div>
              <h2 className="mt-5 font-display text-base font-bold text-foreground">
                {f.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {f.body}
              </p>
            </motion.article>
          ))}
        </section>

        {/* Liquid Glass CTA Card */}
        <motion.section
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="liquid-glass rounded-3xl mt-24 flex flex-col items-center gap-4 p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.1)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
          <span className="rounded-full neo-raised px-3.5 py-1 text-xs font-semibold text-primary">
            Instant Publishing
          </span>
          <h2 className="max-w-lg text-2xl font-extrabold sm:text-4xl text-foreground tracking-tight">
            Your audience clicks once. Make it unforgettable.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
            Free to start with ultra-sleek design engines, video playback, and
            ambient audio loops.
          </p>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="btn-liquid py-2.5 px-6 text-sm font-semibold inline-flex items-center gap-2 mt-2"
          >
            <span>Build my page</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.section>
      </main>

      <footer className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} halo.bio — crafted with tactile liquid
        glass & neomorphic depth
      </footer>
    </div>
  );
}
