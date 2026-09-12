import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Profile } from "@/lib/bio";
import { BadgesEditor } from "@/components/BadgesEditor";

export function DashboardBadgesPortal({ profile }: { profile: Profile }) {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [button, setButton] = useState<HTMLButtonElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.location.pathname !== "/dashboard") return;
    const tabBar = Array.from(document.querySelectorAll("button")).find((el) => {
      const text = el.textContent?.trim();
      return text === "Media & FX" && el.parentElement?.textContent?.includes("Appearance") && el.parentElement?.textContent?.includes("Social Icons");
    })?.parentElement;
    if (!tabBar) return;
    tabBar.classList.remove("sm:grid-cols-4");
    tabBar.classList.add("sm:grid-cols-5");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg px-2 py-2 text-[11px] sm:text-xs font-semibold transition-all min-w-0 truncate text-muted-foreground hover:text-foreground";
    b.innerHTML = '<span class="text-sm leading-none">🏅</span><span class="truncate">Badges</span>';
    tabBar.appendChild(b);

    const content = document.createElement("div");
    content.className = "dashboard-badges-content hidden";
    const parent = tabBar.parentElement;
    if (!parent) { b.remove(); return; }
    parent.appendChild(content);
    const originals = Array.from(parent.children).filter((el) => el !== tabBar && el !== content) as HTMLElement[];
    const show = () => {
      setActive(true);
      originals.forEach((el) => { el.style.display = "none"; });
      content.classList.remove("hidden");
      b.classList.add("bg-card", "text-foreground", "shadow-sm");
      b.classList.remove("text-muted-foreground");
    };
    const hide = () => {
      setActive(false);
      originals.forEach((el) => { el.style.display = ""; });
      content.classList.add("hidden");
      b.classList.remove("bg-card", "text-foreground", "shadow-sm");
      b.classList.add("text-muted-foreground");
    };
    b.addEventListener("click", show);
    const otherTabs = Array.from(tabBar.querySelectorAll("button")).filter((x) => x !== b);
    otherTabs.forEach((x) => x.addEventListener("click", hide));
    setMount(content); setButton(b);
    return () => { b.removeEventListener("click", show); otherTabs.forEach((x) => x.removeEventListener("click", hide)); b.remove(); content.remove(); tabBar.classList.remove("sm:grid-cols-5"); tabBar.classList.add("sm:grid-cols-4"); };
  }, []);

  if (!mount || !button) return null;
  return createPortal(active ? <BadgesEditor profile={profile} /> : null, mount);
}
