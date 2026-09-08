const fs = require("fs");
let code = fs.readFileSync("src/components/SocialLinksEditor.tsx", "utf8");

// Find the end of the Custom URL input field div and inject the checkboxes
const targetCustom = `                  className="field w-full text-xs font-mono"
                />
              </div>`;

const checkboxesCustom = `                  className="field w-full text-xs font-mono"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={customFullCover} onChange={e => setCustomFullCover(e.target.checked)} className="rounded border-border bg-background" />
                  Full Button Cover
                </label>
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={customRemoveBg} onChange={e => setCustomRemoveBg(e.target.checked)} className="rounded border-border bg-background" />
                  Remove Background
                </label>
              </div>`;
code = code.replace(targetCustom, checkboxesCustom);

const targetEdit = `                              className="field py-0.5 px-2 text-[11px] font-mono flex-1"
                            />`;

const checkboxesEdit = `                              className="field py-0.5 px-2 text-[11px] font-mono flex-1"
                            />
                            <div className="flex flex-col gap-1 shrink-0">
                              <label className="flex items-center gap-1 text-[10px] text-muted-foreground cursor-pointer">
                                <input type="checkbox" checked={editFullCover} onChange={e => setEditFullCover(e.target.checked)} className="rounded border-border bg-background w-3 h-3" />
                                Full Cover
                              </label>
                              <label className="flex items-center gap-1 text-[10px] text-muted-foreground cursor-pointer">
                                <input type="checkbox" checked={editRemoveBg} onChange={e => setEditRemoveBg(e.target.checked)} className="rounded border-border bg-background w-3 h-3" />
                                No BG
                              </label>
                            </div>`;

code = code.replace(targetEdit, checkboxesEdit);

// Now apply the style rules in the rendered list
// We need to find where the `border: ` and `background: ` are defined in the inline style of the link
// It currently looks like:
// background: isCustom && link.icon_url ? "transparent" : isCustom ? "rgba(139, 92, 246, 0.15)" : config.color,
// border: isCustom && link.icon_url ? "none" : isCustom ? "1px solid rgba(139, 92, 246, 0.3)" : undefined,
const styleRegex =
  /background:[\s\S]*?isCustom && link\.icon_url[\s\S]*?\? "transparent"[\s\S]*?: isCustom[\s\S]*?\? "rgba\(139, 92, 246, 0\.15\)"[\s\S]*?: config\.color,[\s\S]*?border:[\s\S]*?isCustom && link\.icon_url[\s\S]*?\? "none"[\s\S]*?: isCustom[\s\S]*?\? "1px solid rgba\(139, 92, 246, 0\.3\)"[\s\S]*?: undefined,/m;

const newStyle = `background: link.remove_bg || (isCustom && link.icon_url) ? "transparent" : (isCustom ? "rgba(139, 92, 246, 0.15)" : config.color),
                        border: link.remove_bg || (isCustom && link.icon_url) ? "none" : (isCustom ? "1px solid rgba(139, 92, 246, 0.3)" : undefined),`;

code = code.replace(styleRegex, newStyle);

const imgPaddingRegex = /className="h-full w-full object-cover"/;
const newImgPadding = `className={\`h-full w-full object-cover \${link.full_cover ? 'rounded-full scale-110' : 'p-[6px]'}\`}`;
code = code.replace(imgPaddingRegex, newImgPadding);

fs.writeFileSync("src/components/SocialLinksEditor.tsx", code);
