import { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  Share2,
  Sparkles,
  Check,
} from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/lib/bio";
import {
  SUPPORTED_PLATFORMS,
  getPlatformConfig,
  formatSocialUrl,
} from "@/lib/socials";

type Props = {
  socialLinks: SocialLink[];
  onChange: (links: SocialLink[]) => void;
  accentColor?: string;
};

export function SocialLinksEditor({
  socialLinks = [],
  onChange,
  accentColor = "#3b82f6",
}: Props) {
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform>("instagram");
  const [urlInput, setUrlInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrlValue, setEditUrlValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentPlatformConfig = getPlatformConfig(selectedPlatform);

  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!urlInput.trim()) return;

    const formatted = formatSocialUrl(selectedPlatform, urlInput);
    if (!formatted) return;

    const newLink: SocialLink = {
      id: "soc-" + Math.random().toString(36).substring(2, 9),
      platform: selectedPlatform,
      url: formatted,
      active: true,
    };

    onChange([...socialLinks, newLink]);
    setUrlInput("");
  };

  const handleRemove = (id: string) => {
    onChange(socialLinks.filter((item) => item.id !== id));
  };

  const handleToggleActive = (id: string) => {
    onChange(
      socialLinks.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= socialLinks.length) return;

    const updated = [...socialLinks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const handleQuickAdd = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    // If not already in the list, focus the input
    const existing = socialLinks.find((l) => l.platform === platform);
    if (existing) {
      setEditingId(existing.id);
      setEditUrlValue(existing.url);
    }
  };

  const handleSaveInlineEdit = (id: string) => {
    const target = socialLinks.find((l) => l.id === id);
    if (!target) return;

    const formatted = formatSocialUrl(target.platform, editUrlValue);
    if (!formatted) return;

    onChange(
      socialLinks.map((l) => (l.id === id ? { ...l, url: formatted } : l)),
    );
    setEditingId(null);
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-border/60">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            Social Media Icon Links
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add quick-access icon links to Instagram, X/Twitter, TikTok,
            YouTube, and other platforms.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 self-start sm:self-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          {socialLinks.filter((l) => l.active !== false).length} Active
        </span>
      </div>

      {/* Quick Add Platforms Chips */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground block">
          Select or Quick-Add Platform
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SUPPORTED_PLATFORMS.map((p) => {
            const Icon = p.icon;
            const isAdded = socialLinks.some((l) => l.platform === p.id);
            const isSelected = selectedPlatform === p.id;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleQuickAdd(p.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isAdded
                      ? "bg-secondary text-foreground border border-primary/30"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{p.label}</span>
                {isAdded && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Social Link Form */}
      <form
        onSubmit={handleAdd}
        className="rounded-xl border border-border/80 bg-secondary/30 p-3.5 sm:p-4 space-y-3"
      >
        <div className="flex items-center gap-2">
          {(() => {
            const Icon = currentPlatformConfig.icon;
            return (
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm text-white"
                style={{ backgroundColor: currentPlatformConfig.color }}
              >
                <Icon className="h-4 w-4" />
              </div>
            );
          })()}
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-foreground block truncate">
              Add {currentPlatformConfig.label}
            </span>
            <span className="text-[10px] text-muted-foreground block truncate">
              {currentPlatformConfig.hint}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={currentPlatformConfig.placeholder}
              className="field w-full text-xs font-mono pr-8"
            />
            {urlInput && (
              <button
                type="button"
                onClick={() => setUrlInput("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!urlInput.trim()}
            className="btn-primary py-2 px-4 text-xs font-semibold shrink-0 inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Icon</span>
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
          Smart format: Entering just your{" "}
          <span className="font-semibold text-foreground">@username</span>{" "}
          automatically builds the full link.
        </p>
      </form>

      {/* Active Social Links List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Your Social Profiles ({socialLinks.length})
          </span>
          {socialLinks.length > 1 && (
            <span className="text-[11px] text-muted-foreground">
              Use arrows to reorder
            </span>
          )}
        </div>

        {socialLinks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 p-6 text-center">
            <div className="mx-auto h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-2">
              <Share2 className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold text-foreground">
              No Social Icon Links Added Yet
            </p>
            <p className="text-[11px] text-muted-foreground max-w-xs mx-auto mt-1">
              Connect your Instagram, TikTok, YouTube, or X profiles above. They
              will display as sleek frosted icons on your bio page.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {socialLinks.map((link, index) => {
              const config = getPlatformConfig(link.platform);
              const Icon = config.icon;
              const isEditing = editingId === link.id;
              const isActive = link.active !== false;

              return (
                <div
                  key={link.id}
                  className={`surface flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                    isActive
                      ? "border-border/80 hover:border-primary/50"
                      : "border-border/40 opacity-60 bg-secondary/20"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-white shadow-sm"
                      style={{ backgroundColor: config.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {config.label}
                        </span>
                        {!isActive && (
                          <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] font-medium text-muted-foreground">
                            Hidden
                          </span>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <input
                            type="text"
                            value={editUrlValue}
                            onChange={(e) => setEditUrlValue(e.target.value)}
                            className="field py-1 px-2 text-xs font-mono w-full"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveInlineEdit(link.id)}
                            className="btn-primary py-1 px-2.5 text-xs shrink-0"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <p
                          onClick={() => {
                            setEditingId(link.id);
                            setEditUrlValue(link.url);
                          }}
                          className="text-[11px] font-mono text-muted-foreground truncate hover:text-foreground cursor-pointer"
                          title="Click to edit link"
                        >
                          {link.url}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <button
                      type="button"
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-25"
                      title="Move Up"
                      aria-label="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMove(index, "down")}
                      disabled={index === socialLinks.length - 1}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-25"
                      title="Move Down"
                      aria-label="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(link.id)}
                      className={`rounded-lg p-1.5 transition-colors ${
                        isActive
                          ? "text-primary hover:bg-primary/10"
                          : "text-muted-foreground hover:bg-secondary"
                      }`}
                      title={isActive ? "Hide on profile" : "Show on profile"}
                      aria-label={
                        isActive ? "Hide on profile" : "Show on profile"
                      }
                    >
                      {isActive ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      title="Test open link"
                      aria-label="Test open link"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleRemove(link.id)}
                      className="rounded-lg p-1.5 text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors ml-1"
                      title="Remove social icon"
                      aria-label="Remove social icon"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
