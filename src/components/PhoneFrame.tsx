import { type ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Skeuomorphic & Liquid Glass Device Frame for real-time mobile preview.
 * Features realistic brushed metal chassis bevel, dynamic island sensor,
 * tactile side buttons, and subtle glossy light reflection.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[340px] px-2 sm:px-0">
      {/* Outer tactile device chassis */}
      <div className="relative rounded-[2.8rem] sm:rounded-[3.4rem] p-[3px] bg-gradient-to-b from-white/70 via-slate-400/40 to-slate-800/80 shadow-[0_24px_60px_rgba(15,23,42,0.3),_0_8px_18px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.8)]">
        {/* Left Side Buttons (Volume Up/Down) */}
        <div className="absolute -left-[6px] top-28 h-8 w-[4px] rounded-l-sm bg-gradient-to-r from-slate-400 to-slate-600 shadow-sm" />
        <div className="absolute -left-[6px] top-40 h-8 w-[4px] rounded-l-sm bg-gradient-to-r from-slate-400 to-slate-600 shadow-sm" />

        {/* Right Side Button (Power/Lock) */}
        <div className="absolute -right-[6px] top-32 h-12 w-[4px] rounded-r-sm bg-gradient-to-l from-slate-400 to-slate-600 shadow-sm" />

        {/* Inner bezel with dark metallic finish */}
        <div className="relative rounded-[2.65rem] sm:rounded-[3.25rem] bg-gradient-to-b from-[#1c2230] via-[#0f141f] to-[#0a0d14] p-2.5 sm:p-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),_inset_0_-2px_4px_rgba(0,0,0,0.8)]">
          {/* Display viewport */}
          <div className="relative h-[580px] sm:h-[660px] w-full overflow-hidden rounded-[2.1rem] sm:rounded-[2.7rem] bg-background shadow-[inset_0_0_8px_rgba(0,0,0,0.4)]">
            {/* Skeuomorphic Dynamic Island */}
            <div className="pointer-events-none absolute left-1/2 top-2.5 z-40 flex h-6 w-24 sm:w-28 -translate-x-1/2 items-center justify-between rounded-full bg-black/95 px-2.5 shadow-[0_3px_10px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.15)]">
              {/* Speaker micro-mesh */}
              <div className="h-1 w-7 rounded-full bg-[#1b1f2b] shadow-inner" />
              {/* Camera lens with blue reflection */}
              <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#0d121c] ring-1 ring-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500/40 blur-[0.5px]" />
              </div>
            </div>

            {/* Diagonal Liquid Glass Gloss Sheen overlay across screen */}
            <div
              className="pointer-events-none absolute inset-0 z-30 opacity-40 mix-blend-overlay"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 28%, transparent 55%)",
              }}
            />

            {/* Screen content */}
            <div className="relative h-full w-full">{children}</div>

            {/* Home indicator bar at bottom */}
            <motion.div
              initial={{ opacity: 0.7 }}
              animate={{ opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute bottom-2 left-1/2 z-40 h-1 w-32 -translate-x-1/2 rounded-full bg-white/70 shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
