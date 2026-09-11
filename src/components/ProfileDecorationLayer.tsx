import { useMemo } from "react";
import { getProfileDecoration, type ProfileDecoration } from "@/lib/profile-decorations";

type Props = {
  decoration?: ProfileDecoration | unknown;
};

const PARTICLES = Array.from({ length: 14 }, (_, index) => index);

export function ProfileDecorationLayer({ decoration }: Props) {
  const active = useMemo(() => getProfileDecoration(decoration), [decoration]);
  if (active.id === "none") return null;

  const particleChar = active.id === "hearts" ? "♥" : active.id === "snow" ? "✦" : active.id === "sparkles" ? "✧" : active.id === "fireflies" ? "•" : "";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-7 z-0 overflow-visible"
      style={{
        borderRadius: "inherit",
        "--deco-primary": active.color,
        "--deco-secondary": active.secondaryColor,
      } as React.CSSProperties}
    >
      {active.id === "neon-aura" && <div className="absolute inset-4 rounded-[inherit] opacity-70 blur-2xl animate-pulse" style={{ background: `radial-gradient(circle, ${active.color}55 0%, ${active.secondaryColor}22 42%, transparent 72%)` }} />}

      {active.id === "aurora" && <div className="absolute inset-0 rounded-[inherit] opacity-55 blur-2xl animate-[spin_12s_linear_infinite]" style={{ background: `conic-gradient(from 90deg, transparent, ${active.color}55, ${active.secondaryColor}55, transparent)` }} />}

      {active.id === "rainbow-glow" && <div className="absolute inset-0 rounded-[inherit] opacity-80 blur-xl animate-[spin_8s_linear_infinite]" style={{ background: `conic-gradient(from 0deg, #ef444455, #f59e0b55, #22c55e55, #06b6d455, #6366f155, #ec489955, #ef444455)` }} />}

      {active.id === "orbit" && (
        <>
          <div className="absolute inset-1/2 h-[115%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 opacity-70 animate-[spin_9s_linear_infinite]" style={{ borderColor: active.color, boxShadow: `0 0 18px ${active.color}88` }} />
          <div className="absolute inset-1/2 h-[86%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border opacity-40 animate-[spin_13s_linear_infinite_reverse]" style={{ borderColor: active.secondaryColor, boxShadow: `0 0 16px ${active.secondaryColor}66` }} />
        </>
      )}

      {active.id === "scanlines" && <div className="absolute inset-0 rounded-[inherit] opacity-25 animate-[deco-scan_3s_linear_infinite]" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent 0 6px, ${active.color}33 7px, transparent 8px)` }} />}

      {particleChar && (
        <div className="absolute inset-0 overflow-visible">
          {PARTICLES.map((particle) => (
            <span
              key={particle}
              className="absolute text-[10px] font-bold opacity-0 animate-[deco-float_5s_ease-in-out_infinite]"
              style={{
                left: `${5 + ((particle * 37) % 90)}%`,
                top: `${4 + ((particle * 61) % 92)}%`,
                color: particle % 2 ? active.color : active.secondaryColor,
                animationDelay: `${(particle % 7) * -0.7}s`,
                animationDuration: `${4 + (particle % 4)}s`,
              }}
            >
              {particleChar}
            </span>
          ))}
        </div>
      )}

      {active.id === "neon-aura" && <div className="absolute inset-2 rounded-[inherit] border-2 opacity-60" style={{ borderColor: active.color, boxShadow: `0 0 24px ${active.color}66, inset 0 0 20px ${active.color}22` }} />}
    </div>
  );
}
