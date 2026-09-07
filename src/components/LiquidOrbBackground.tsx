import { useEffect, useState } from "react";

interface LiquidOrbBackgroundProps {
  accentColor?: string;
}

export function LiquidOrbBackground({
  accentColor = "#6366f1",
}: LiquidOrbBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      aria-hidden="true"
    >
      {/* Dynamic chromatic ambient liquid glass orbs */}
      <div
        className="liquid-orb orb-1"
        style={
          {
            "--orb-color": accentColor,
          } as React.CSSProperties
        }
      />
      <div
        className="liquid-orb orb-2"
        style={
          {
            "--orb-color": accentColor,
          } as React.CSSProperties
        }
      />
      <div
        className="liquid-orb orb-3"
        style={
          {
            "--orb-color": accentColor,
          } as React.CSSProperties
        }
      />
      {/* Refractive ambient mesh layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/80 backdrop-blur-[50px]" />
    </div>
  );
}
