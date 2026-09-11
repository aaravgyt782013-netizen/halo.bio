export type ProfileDecorationId =
  | "none"
  | "neon-aura"
  | "aurora"
  | "sparkles"
  | "hearts"
  | "snow"
  | "scanlines"
  | "orbit"
  | "fireflies"
  | "rainbow-glow";

export type ProfileDecoration = {
  id: ProfileDecorationId;
  name: string;
  description: string;
  color: string;
  secondaryColor: string;
  animated?: boolean;
};

export const DEFAULT_PROFILE_DECORATION: ProfileDecoration = {
  id: "none",
  name: "None",
  description: "Clean profile with no extra decoration.",
  color: "#6366f1",
  secondaryColor: "#22d3ee",
};

export const PROFILE_DECORATIONS: ProfileDecoration[] = [
  DEFAULT_PROFILE_DECORATION,
  { id: "neon-aura", name: "Neon Aura", description: "Soft glowing aura around the profile card.", color: "#3b82f6", secondaryColor: "#8b5cf6", animated: true },
  { id: "aurora", name: "Aurora", description: "Slow-moving colorful light behind the card.", color: "#22d3ee", secondaryColor: "#a855f7", animated: true },
  { id: "sparkles", name: "Sparkles", description: "Tiny drifting stars around the profile.", color: "#f8fafc", secondaryColor: "#60a5fa", animated: true },
  { id: "hearts", name: "Hearts", description: "Subtle floating heart particles.", color: "#ec4899", secondaryColor: "#fb7185", animated: true },
  { id: "snow", name: "Snow", description: "Light falling snow particles.", color: "#e0f2fe", secondaryColor: "#93c5fd", animated: true },
  { id: "scanlines", name: "Scanlines", description: "Cyber-style moving scanline texture.", color: "#22d3ee", secondaryColor: "#3b82f6", animated: true },
  { id: "orbit", name: "Orbit", description: "Glowing orbital ring around the card.", color: "#8b5cf6", secondaryColor: "#ec4899", animated: true },
  { id: "fireflies", name: "Fireflies", description: "Warm floating light particles.", color: "#fbbf24", secondaryColor: "#f59e0b", animated: true },
  { id: "rainbow-glow", name: "Rainbow Glow", description: "Animated multi-color edge glow.", color: "#ef4444", secondaryColor: "#3b82f6", animated: true },
];

export function getProfileDecoration(value: unknown): ProfileDecoration {
  if (!value || typeof value !== "object") return DEFAULT_PROFILE_DECORATION;
  const candidate = value as Partial<ProfileDecoration>;
  const preset = PROFILE_DECORATIONS.find((item) => item.id === candidate.id) ?? DEFAULT_PROFILE_DECORATION;
  return {
    ...preset,
    ...candidate,
    id: preset.id,
    name: candidate.name || preset.name,
    description: candidate.description || preset.description,
    color: candidate.color || preset.color,
    secondaryColor: candidate.secondaryColor || preset.secondaryColor,
  };
}
