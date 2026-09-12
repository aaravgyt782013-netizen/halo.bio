export type ProfileLayout = "default" | "modern" | "minimal" | "sleek" | "portfolio";

export type ProfileCustomization = {
  layout: ProfileLayout;
  bannerUrl: string;
  location: string;
  showLocation: boolean;
  showSocials: boolean;
  socialAlignment: "left" | "center" | "right";
  avatarRadius: number;
  borderWidth: number;
  borderOpacity: number;
  borderRadius: number;
  borderColor: string;
  borderGlow: boolean;
  borderGlowSize: number;
  cardGradientEnabled: boolean;
  cardGradientColor: string;
  textColor: string;
  iconColor: string;
  monochromeIcons: boolean;
  profileGlow: boolean;
  profileGlowSize: number;
  usernameEffect: "none" | "glow" | "pulse" | "gradient" | "typing";
  backgroundEffect: "none" | "particles" | "stars" | "aurora" | "grid" | "scanlines";
  cursorEffect: "none" | "glow" | "spark";
  animatedTitle: boolean;
  typewriterTexts: string[];
  typewriterSpeed: number;
  customFont: string;
  secondTabEnabled: boolean;
  secondTabTitle: string;
  secondTabContent: string;
  widgets: Array<{ id: string; type: string; title?: string; value?: string; enabled: boolean }>;
  aboutMe: string;
  projects: Array<{ name: string; url: string; description?: string }>;
  skills: string[];
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  faviconUrl: string;
  pageAlias: string;
};

export const DEFAULT_PROFILE_CUSTOMIZATION: ProfileCustomization = {
  layout: "default",
  bannerUrl: "",
  location: "",
  showLocation: false,
  showSocials: true,
  socialAlignment: "center",
  avatarRadius: 999,
  borderWidth: 1,
  borderOpacity: 0.28,
  borderRadius: 24,
  borderColor: "#ffffff",
  borderGlow: false,
  borderGlowSize: 18,
  cardGradientEnabled: false,
  cardGradientColor: "#3b82f6",
  textColor: "#ffffff",
  iconColor: "#ffffff",
  monochromeIcons: false,
  profileGlow: false,
  profileGlowSize: 24,
  usernameEffect: "none",
  backgroundEffect: "none",
  cursorEffect: "none",
  animatedTitle: false,
  typewriterTexts: [],
  typewriterSpeed: 70,
  customFont: "",
  secondTabEnabled: false,
  secondTabTitle: "About Me",
  secondTabContent: "",
  widgets: [],
  aboutMe: "",
  projects: [],
  skills: [],
  seoTitle: "",
  seoDescription: "",
  seoImage: "",
  faviconUrl: "",
  pageAlias: "",
};

export function normalizeProfileCustomization(value: unknown): ProfileCustomization {
  const raw = value && typeof value === "object" ? (value as Partial<ProfileCustomization>) : {};
  return {
    ...DEFAULT_PROFILE_CUSTOMIZATION,
    ...raw,
    typewriterTexts: Array.isArray(raw.typewriterTexts) ? raw.typewriterTexts.filter(Boolean).slice(0, 10) : [],
    widgets: Array.isArray(raw.widgets) ? raw.widgets.slice(0, 20) : [],
    projects: Array.isArray(raw.projects) ? raw.projects.slice(0, 20) : [],
    skills: Array.isArray(raw.skills) ? raw.skills.slice(0, 30) : [],
  };
}
