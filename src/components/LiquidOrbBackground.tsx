import { motion } from "motion/react";

interface Props {
  className?: string;
  accentColor?: string;
}

export function LiquidOrbBackground({
  className = "",
  accentColor = "#6366f1",
}: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden -z-10 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Primary animated liquid orb */}
      <motion.div
        animate={{
          x: [0, 50, -40, 20, 0],
          y: [0, -60, 40, -30, 0],
          scale: [1, 1.15, 0.95, 1.08, 1],
          opacity: [0.35, 0.5, 0.3, 0.45, 0.35],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] left-[10%] h-[380px] w-[380px] sm:h-[520px] sm:w-[520px] rounded-full blur-[90px] sm:blur-[120px]"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, rgba(99, 102, 241, 0.4) 45%, transparent 70%)`,
        }}
      />

      {/* Cyan/Aqua fluid orb */}
      <motion.div
        animate={{
          x: [0, -60, 45, -20, 0],
          y: [0, 50, -45, 35, 0],
          scale: [1, 0.9, 1.12, 0.98, 1],
          opacity: [0.25, 0.4, 0.2, 0.38, 0.25],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute top-[25%] -right-[10%] h-[360px] w-[360px] sm:h-[480px] sm:w-[480px] rounded-full blur-[80px] sm:blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, rgba(59, 130, 246, 0.35) 50%, transparent 70%)",
        }}
      />

      {/* Violet/Rose warm orb */}
      <motion.div
        animate={{
          x: [0, 40, -50, 30, 0],
          y: [0, -40, 30, -50, 0],
          scale: [1, 1.1, 0.92, 1.05, 1],
          opacity: [0.2, 0.35, 0.18, 0.32, 0.2],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute -bottom-[15%] left-[25%] h-[420px] w-[420px] sm:h-[560px] sm:w-[560px] rounded-full blur-[100px] sm:blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 70%)",
        }}
      />

      {/* Fluid specular shimmer grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}
