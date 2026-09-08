import { useState, useRef } from "react";
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
  Upload,
  Image as ImageIcon,
  X,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";
import { uploadMedia, type SocialLink, type SocialPlatform } from "@/lib/bio";
import {
  SUPPORTED_PLATFORMS,
  getPlatformConfig,
  formatSocialUrl,
} from "@/lib/socials";

type Props = {
  socialLinks: SocialLink[];
  onChange: (links: SocialLink[]) => void;
  accentColor?: string;
  userId?: string;
};

export function SocialLinksEditor({
  socialLinks = [],
  onChange,
  accentColor = "#3b82f6",
  userId = "default",
}: Props) {
  // Mode: "standard" for famous social platforms, "custom" for uploading custom icons
  const [activeTab, setActiveTab] = useState<"standard" | "custom">("standard");
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform>("instagram");
  const [urlInput, setUrlInput] = useState("");

  // Custom icon form state
  const [customTitle, setCustomTitle] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [customIconUrl, setCustomIconUrl] = useState("");
  const [customRemoveBg, setCustomRemoveBg] = useState<boolean>(true);
  const [customFitMode, setCustomFitMode] = useState<"cover" | "contain">(
    "cover",
  );
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrlValue, setEditUrlValue] = useState("");
  const [editTitleValue, setEditTitleValue] = useState("");
  const [editIconUrlValue, setEditIconUrlValue] = useState("");
  const [editRemoveBgValue, setEditRemoveBgValue] = useState<boolean>(true);
  const [editFitModeValue, setEditFitModeValue] = useState<"cover" | "contain">(
    "cover",
  );
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  const currentPlatformConfig = getPlatformConfig(selectedPlatform);

  // Handle adding famous platform link
  const handleAddStandard = (e?: React.FormEvent) => {
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
    toast.success(`Added ${currentPlatformConfig.label} icon link`);
  };

  // Handle adding custom icon link
  const handleAddCustom = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!customUrl.trim()) {
      toast.error("Please enter a destination link URL");
      return;
    }
    if (!customTitle.trim()) {
      toast.error("Please enter a name or platform title");
      return;
    }

    const formatted = formatSocialUrl("custom", customUrl);

    const newLink: SocialLink = {
      id: "soc-" + Math.random().toString(36).substring(2, 9),
      platform: "custom",
      title: customTitle.trim(),
      icon_url: customIconUrl.trim() || undefined,
      url: formatted,
      active: true,
      remove_bg: customRemoveBg,
      fit_mode: customFitMode,
    };

    onChange([...socialLinks, newLink]);
    setCustomTitle("");
    setCustomUrl("");
    setCustomIconUrl("");
    toast.success(`Added custom ${newLink.title} icon link`);
  };

  // Handle file upload for custom icon
  const handleIconFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isForEdit = false,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, SVG, JPG, WebP)");
      return;
    }

    setIsUploadingIcon(true);
    try {
      // Optimistic instant preview via local blob
      const localBlob = URL.createObjectURL(file);
      if (isForEdit) {
        setEditIconUrlValue(localBlob);
      } else {
        setCustomIconUrl(localBlob);
      }

      const uploadedUrl = await uploadMedia(userId, file, "icons");
      if (isForEdit) {
        setEditIconUrlValue(uploadedUrl);
      } else {
        setCustomIconUrl(uploadedUrl);
      }
      toast.success("Icon uploaded successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload icon";
      toast.error(msg);
    } finally {
      setIsUploadingIcon(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleRemove = (id: string) => {
    onChange(socialLinks.filter((item) => item.id !== id));
    toast.info("Social icon removed");
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
    setActiveTab("standard");
    setSelectedPlatform(platform);
    const existing = socialLinks.find((l) => l.platform === platform);
    if (existing) {
      setEditingId(existing.id);
      setEditUrlValue(existing.url);
      setEditTitleValue(existing.title || "");
      setEditIconUrlValue(existing.icon_url || "");
      setEditRemoveBgValue(
        existing.remove_bg !== undefined
          ? existing.remove_bg
          : existing.platform === "custom",
      );
      setEditFitModeValue(existing.fit_mode || "cover");
    }
  };

  const handleStartEdit = (link: SocialLink) => {
    setEditingId(link.id);
    setEditUrlValue(link.url);
    setEditTitleValue(link.title || "");
    setEditIconUrlValue(link.icon_url || "");
    setEditRemoveBgValue(
      link.remove_bg !== undefined
        ? link.remove_bg
        : link.platform === "custom",
    );
    setEditFitModeValue(link.fit_mode || "cover");
  };

  const handleSaveInlineEdit = (id: string) => {
    const target = socialLinks.find((l) => l.id === id);
    if (!target) return;

    const formatted = formatSocialUrl(target.platform, editUrlValue);
    if (!formatted) return;

    onChange(
      socialLinks.map((l) =>
        l.id === id
          ? {
              ...l,
              url: formatted,
              title: editTitleValue.trim() || undefined,
              icon_url: editIconUrlValue.trim() || undefined,
              remove_bg: editRemoveBgValue,
              fit_mode: editFitModeValue,
            }
          : l,
      ),
    );
    setEditingId(null);
    toast.success("Updated social icon link");
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            Social Media Icon Links
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select from famous creator platforms or upload your own custom
            icons.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 self-start sm:self-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          {socialLinks.filter((l) => l.active !== false).length} Active
        </span>
      </div>

      {/* Tabs: Famous Platforms vs Custom Icon Upload */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-secondary/50 border border-border/60 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("standard")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "standard"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Famous Icons
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("custom")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "custom"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="h-3 w-3 text-primary" />
          <span>Upload Custom Icon</span>
        </button>
      </div>

      {activeTab === "standard" ? (
        <div className="space-y-4">
          {/* Famous Platforms Quick-Select */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground block">
              Famous Platforms
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

          {/* Add Famous Platform Link Form */}
          <form
            onSubmit={handleAddStandard}
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
              Tip: Enter your handle like{" "}
              <span className="font-semibold text-foreground">
                @username
              </span>{" "}
              or paste your full profile link.
            </p>
          </form>
        </div>
      ) : (
        /* Custom Icon Upload Form */
        <form
          onSubmit={handleAddCustom}
          className="rounded-xl border border-border/80 bg-secondary/30 p-4 space-y-4"
        >
          <div className="flex items-start gap-4">
            {/* Live Icon Preview & File Trigger */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className="relative h-14 w-14 rounded-2xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-background/60 shadow-sm transition-all hover:border-primary cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload icon file"
              >
                {customIconUrl ? (
                  <img
                    src={customIconUrl}
                    alt="Custom icon preview"
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <Upload className="h-5 w-5" />
                    <span className="text-[9px] font-medium mt-1">Upload</span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/svg+xml,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(e) => handleIconFileUpload(e, false)}
              />

              {customIconUrl && (
                <button
                  type="button"
                  onClick={() => setCustomIconUrl("")}
                  className="text-[10px] text-destructive hover:underline"
                >
                  Clear icon
                </button>
              )}
            </div>

            {/* Inputs: Title and URL */}
            <div className="flex-1 space-y-3 min-w-0">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Platform / Label Name
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Threads, WhatsApp, Pinterest, Steam, Kick, Portfolio"
                  className="field w-full text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Target Profile / Website URL
                </label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://..."
                  className="field w-full text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">
                  Or paste direct Image / SVG Icon URL (optional)
                </label>
                <input
                  type="text"
                  value={customIconUrl}
                  onChange={(e) => setCustomIconUrl(e.target.value)}
                  placeholder="https://example.com/icon.svg"
                  className="field w-full text-xs font-mono"
                />
              </div>

              {customIconUrl && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={customRemoveBg}
                      onChange={(e) => setCustomRemoveBg(e.target.checked)}
                      className="rounded border-border bg-background text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span className="text-[11px] font-medium text-foreground group-hover:text-primary transition-colors">
                      Transparent Button (No BG)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={customFitMode === "cover"}
                      onChange={(e) =>
                        setCustomFitMode(e.target.checked ? "cover" : "contain")
                      }
                      className="rounded border-border bg-background text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span className="text-[11px] font-medium text-foreground group-hover:text-primary transition-colors">
                      Fill Full Button (Cover)
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              Supports PNG, SVG, WebP with transparency
            </span>

            <button
              type="submit"
              disabled={
                !customUrl.trim() || !customTitle.trim() || isUploadingIcon
              }
              className="btn-primary py-2 px-4 text-xs font-semibold shrink-0 inline-flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>
                {isUploadingIcon ? "Uploading..." : "Add Custom Icon"}
              </span>
            </button>
          </div>
        </form>
      )}

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
              Connect your Instagram, TikTok, YouTube, or upload custom icons.
              They will display as sleek frosted icons on your bio page.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {socialLinks.map((link, index) => {
              const isCustom = link.platform === "custom" || !!link.icon_url;
              const config = getPlatformConfig(link.platform);
              const Icon = config.icon;
              const isEditing = editingId === link.id;
              const isActive = link.active !== false;
              const displayName = link.title || config.label;

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
                    {/* Icon Box */}
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm overflow-hidden"
                      style={{
                        backgroundColor: isCustom
                          ? "rgba(139, 92, 246, 0.15)"
                          : config.color,
                        border: isCustom
                          ? "1px solid rgba(139, 92, 246, 0.3)"
                          : undefined,
                      }}
                    >
                      {link.icon_url ? (
                        <img
                          src={link.icon_url}
                          alt={displayName}
                          className="h-5 w-5 object-contain"
                        />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {displayName}
                        </span>
                        {isCustom && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary">
                            Custom
                          </span>
                        )}
                        {!isActive && (
                          <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] font-medium text-muted-foreground">
                            Hidden
                          </span>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-1.5 mt-2">
                          <div className="flex items-center gap-1.5">
                            {isCustom && (
                              <input
                                type="text"
                                value={editTitleValue}
                                onChange={(e) =>
                                  setEditTitleValue(e.target.value)
                                }
                                placeholder="Icon Title"
                                className="field py-1 px-2 text-xs w-1/3"
                              />
                            )}
                            <input
                              type="text"
                              value={editUrlValue}
                              onChange={(e) => setEditUrlValue(e.target.value)}
                              placeholder="URL"
                              className="field py-1 px-2 text-xs font-mono flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveInlineEdit(link.id)}
                              className="btn-primary py-1 px-2.5 text-xs shrink-0"
                              title="Save changes"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground"
                              title="Cancel"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {isCustom && (
                            <div className="flex items-center gap-2 text-xs">
                              <input
                                type="text"
                                value={editIconUrlValue}
                                onChange={(e) =>
                                  setEditIconUrlValue(e.target.value)
                                }
                                placeholder="Icon URL or upload new"
                                className="field py-0.5 px-2 text-[11px] font-mono flex-1"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  editFileInputRef.current?.click()
                                }
                                className="px-2 py-0.5 rounded bg-secondary text-[11px] hover:bg-secondary/80"
                              >
                                Replace File
                              </button>
                              <input
                                ref={editFileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleIconFileUpload(e, true)}
                              />
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-3 pt-1">
                            <label className="flex items-center gap-1.5 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={editRemoveBgValue}
                                onChange={(e) =>
                                  setEditRemoveBgValue(e.target.checked)
                                }
                                className="rounded border-border bg-background text-primary focus:ring-primary h-3 w-3"
                              />
                              <span className="text-[10px] font-medium text-foreground group-hover:text-primary transition-colors">
                                Transparent Button
                              </span>
                            </label>
                            {isCustom && (
                              <label className="flex items-center gap-1.5 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={editFitModeValue === "cover"}
                                  onChange={(e) =>
                                    setEditFitModeValue(
                                      e.target.checked ? "cover" : "contain",
                                    )
                                  }
                                  className="rounded border-border bg-background text-primary focus:ring-primary h-3 w-3"
                                />
                                <span className="text-[10px] font-medium text-foreground group-hover:text-primary transition-colors">
                                  Fill Full Button
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p
                          onClick={() => handleStartEdit(link)}
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

                    <button
                      type="button"
                      onClick={() => handleStartEdit(link)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      title="Edit link"
                      aria-label="Edit link"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
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
