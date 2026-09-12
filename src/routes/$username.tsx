import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db, fetchProfileByUsername, type Profile, type BioLink } from "@/lib/bio";
import { ProfileView } from "@/components/ProfileView";

export const Route = createFileRoute("/$username")({
  loader: async ({ params }) => {
    const result = await fetchProfileByUsername(params.username);
    if (!result || !result.profile.username || result.profile.is_banned) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Page unavailable — Spider Wensors" }, { name: "robots", content: "noindex" }] };
    const { profile } = loaderData;
    const name = profile.display_name || profile.username;
    const desc = profile.bio?.slice(0, 150) || `All of ${name}'s links in one place on Spider Wensors.`;
    return { meta: [{ title: `${name} (@${profile.username}) — Spider Wensors` }, { name: "description", content: desc }, { property: "og:title", content: `${name} (@${profile.username})` }, { property: "og:description", content: desc }] };
  },
  notFoundComponent: ProfileNotFound,
  component: PublicProfile,
});

function ProfileFooter() {
  return <div className="pointer-events-none absolute inset-x-0 bottom-2 z-40 flex justify-center px-4"><span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-medium tracking-wide text-white/55 backdrop-blur-md">@powered by: Aarav goyal</span></div>;
}

function PublicProfile() {
  const loaderData = Route.useLoaderData();
  const [profile, setProfile] = useState<Profile>(loaderData.profile);
  const [links, setLinks] = useState<BioLink[]>(loaderData.links);
  useEffect(() => {
    const applyLocal = (e?: StorageEvent | Event) => {
      if (e instanceof StorageEvent && e.key && !e.key.startsWith("halo_live_")) return;
      try {
        const localProfile = localStorage.getItem("halo_live_profile");
        const localLinks = localStorage.getItem("halo_live_links");
        if (localProfile) { const parsed = JSON.parse(localProfile); if (parsed.username === profile.username) setProfile(parsed); }
        if (localLinks) setLinks(JSON.parse(localLinks));
      } catch (err) { console.warn("Local storage error:", err); }
    };
    const fetchDB = () => {
      try { const tick = localStorage.getItem("halo_sync_tick"); if (tick && Date.now() - parseInt(tick) < 5000) return; } catch (err) { console.warn("Local storage error:", err); }
      void fetchProfileByUsername(profile.username).then((fresh) => {
        if (!fresh?.profile) return;
        try { const tick = localStorage.getItem("halo_sync_tick"); if (tick && Date.now() - parseInt(tick) < 5000) return; } catch (err) { console.warn("Local storage error:", err); }
        setProfile(fresh.profile); setLinks(fresh.links);
      });
    };
    window.addEventListener("halo-store-updated", applyLocal); window.addEventListener("storage", applyLocal); window.addEventListener("focus", fetchDB); applyLocal();
    return () => { window.removeEventListener("halo-store-updated", applyLocal); window.removeEventListener("storage", applyLocal); window.removeEventListener("focus", fetchDB); };
  }, [profile.username]);

  const handleEnter = async () => {
    try { const viewedKey = `halo_viewed_${profile.username}`; const lastViewed = localStorage.getItem(viewedKey); if (lastViewed && Date.now() - parseInt(lastViewed) < 12 * 60 * 60 * 1000) return; localStorage.setItem(viewedKey, String(Date.now())); } catch (err) { console.warn("Local storage err:", err); }
    const res = await db.rpc("increment_profile_view", { _username: profile.username });
    if (res.data && typeof (res.data as { views?: number }).views === "number") setProfile((prev) => ({ ...prev, views: (res.data as { views: number }).views }));
  };

  return <div className="relative h-screen w-full"><ProfileView profile={profile} links={links} onEnter={handleEnter} onLinkClick={(link) => {
    try { const clickedKey = `halo_clicked_${link.id}`; const lastClicked = localStorage.getItem(clickedKey); if (lastClicked && Date.now() - parseInt(lastClicked) < 12 * 60 * 60 * 1000) return; localStorage.setItem(clickedKey, String(Date.now())); } catch (err) { console.warn("Local storage err:", err); }
    void db.rpc("increment_link_click", { _link_id: link.id });
  }} /><ProfileFooter /></div>;
}

function ProfileNotFound() {
  const { username } = Route.useParams();
  const [clientProfile, setClientProfile] = useState<{ profile: Profile; links: BioLink[] } | null>(null);
  useEffect(() => { if (typeof window === "undefined") return; void fetchProfileByUsername(username).then((res) => { if (res?.profile?.username && !res.profile.is_banned) setClientProfile(res); }); }, [username]);
  if (clientProfile) return <div className="relative h-screen w-full"><ProfileView profile={clientProfile.profile} links={clientProfile.links} onEnter={async () => {
    try { const viewedKey = `halo_viewed_${clientProfile.profile.username}`; const lastViewed = localStorage.getItem(viewedKey); if (lastViewed && Date.now() - parseInt(lastViewed) < 12 * 60 * 60 * 1000) return; localStorage.setItem(viewedKey, String(Date.now())); } catch (err) { console.warn("Local storage err:", err); }
    const res = await db.rpc("increment_profile_view", { _username: clientProfile.profile.username });
    if (res.data && typeof (res.data as { views?: number }).views === "number") setClientProfile((prev) => prev ? { ...prev, profile: { ...prev.profile, views: (res.data as { views: number }).views } } : null);
  }} onLinkClick={(link) => { try { const clickedKey = `halo_clicked_${link.id}`; const lastClicked = localStorage.getItem(clickedKey); if (lastClicked && Date.now() - parseInt(clickedKey) < 12 * 60 * 60 * 1000) return; localStorage.setItem(clickedKey, String(Date.now())); } catch (err) { console.warn("Local storage err:", err); } void db.rpc("increment_link_click", { _link_id: link.id }); }} /><ProfileFooter /></div>;
  return <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center"><div className="aura pointer-events-none absolute inset-0 -z-10" /><div className="glass-panel max-w-md p-8 animate-float-in"><h1 className="font-display text-3xl font-bold tracking-tight">@{username} is available!</h1><p className="mt-2 text-sm text-muted-foreground">Nobody has claimed this custom link-in-bio handle yet.</p><div className="mt-6 flex justify-center gap-3"><Link to="/auth" search={{ mode: "signup", u: username }} className="btn-primary">Claim @{username} now</Link><Link to="/" className="btn-ghost">Explore Spider Wensors</Link></div></div></div>;
}
