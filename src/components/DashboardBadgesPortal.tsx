import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth, useMyProfile } from "@/hooks/useAuth";
import { BadgesEditor } from "@/components/BadgesEditor";

export function DashboardBadgesPortal() {
  const { user } = useAuth();
  const { profile } = useMyProfile(user?.id);
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [button, setButton] = useState<HTMLButtonElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.location.pathname !== "/dashboard") return;
    let tabBar: HTMLElement | null = null;
    let content: HTMLDivElement | null = null;
    let badgeButton: HTMLButtonElement | null = null;
    const boundTabs = new Set<Element>();

    const findTabBar = () => Array.from(document.querySelectorAll("button")).find((el) => {
      const text = el.textContent?.trim();
      return text === "Media & FX" && el.parentElement?.textContent?.includes("Appearance") && el.parentElement?.textContent?.includes("Social Icons");
    })?.parentElement as HTMLElement | undefined;

    const show = () => {
      setActive(true);
      Array.from(content?.parentElement?.children ?? []).filter((el) => el !== tabBar && el !== content).forEach((el) => (el as HTMLElement).style.display = "none");
      content?.classList.remove("hidden");
      badgeButton?.classList.add("bg-card", "text-foreground", "shadow-sm");
      badgeButton?.classList.remove("text-muted-foreground");
    };
    const hide = () => {
      setActive(false);
      Array.from(content?.parentElement?.children ?? []).filter((el) => el !== tabBar && el !== content).forEach((el) => (el as HTMLElement).style.display = "");
      content?.classList.add("hidden");
      badgeButton?.classList.remove("bg-card", "text-foreground", "shadow-sm");
      badgeButton?.classList.add("text-muted-foreground");
    };

    const ensure = () => {
      const found = findTabBar();
      if (!found) return;
      tabBar = found;
      tabBar.classList.remove("sm:grid-cols-4");
      tabBar.classList.add("sm:grid-cols-5");
      if (!badgeButton || !badgeButton.isConnected) {
        badgeButton = document.createElement("button");
        badgeButton.type = "button";
        badgeButton.className = "inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg px-2 py-2 text-[11px] sm:text-xs font-semibold transition-all min-w-0 truncate text-muted-foreground hover:text-foreground";
        badgeButton.innerHTML = '<span class="text-sm leading-none">🏅</span><span class="truncate">Badges</span>';
        badgeButton.addEventListener("click", show);
        tabBar.appendChild(badgeButton);
        setButton(badgeButton);
      }
      const parent = tabBar.parentElement;
      if (!parent) return;
      if (!content || !content.isConnected) {
        content = document.createElement("div");
        content.className = "dashboard-badges-content hidden";
        parent.appendChild(content);
        setMount(content);
      }
      Array.from(tabBar.querySelectorAll("button")).filter((x) => x !== badgeButton).forEach((x) => {
        if (!boundTabs.has(x)) { x.addEventListener("click", hide); boundTabs.add(x); }
      });
    };

    ensure();
    const observer = new MutationObserver(ensure);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      badgeButton?.removeEventListener("click", show);
      boundTabs.forEach((x) => x.removeEventListener("click", hide));
      badgeButton?.remove();
      content?.remove();
      tabBar?.classList.remove("sm:grid-cols-5");
      tabBar?.classList.add("sm:grid-cols-4");
    };
  }, []);

  if (!mount || !button || !profile) return null;
  return createPortal(active ? <BadgesEditor profile={profile} /> : null, mount);
}
