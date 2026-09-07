import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  db,
  fetchProfileByUsername,
  type Profile,
  type BioLink,
} from "@/lib/bio";
import { ProfileView } from "@/components/ProfileView";

export const Route = createFileRoute("/$username")({
  loader: async ({ params }) => {
    const result = await fetchProfileByUsername(params.username);
    if (!result || !result.profile.username || result.profile.is_banned)
      throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Page unavailable — Halo" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { profile } = loaderData;
    const name = profile.display_name || profile.username;
    const desc =
      profile.bio?.slice(0, 150) ||
      `All of ${name}'s links in one place on Halo.`;
    return {
      meta: [
        { title: `${name} (@${profile.username}) — Halo` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} (@${profile.username})` },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: ProfileNotFound,
  component: PublicProfile,
});

function PublicProfile() {
  const loaderData = Route.useLoaderData();
  const [profile, setProfile] = useState<Profile>(loaderData.profile);
  const [links, setLinks] = useState<BioLink[]>(loaderData.links);

  // Real-time synchronization: listen for dashboard edits or cross-tab updates
  useEffect(() => {
    const syncFresh = () => {
      void fetchProfileByUsername(profile.username).then((fresh) => {
        if (fresh && fresh.profile) {
          setProfile(fresh.profile);
          setLinks(fresh.links);
        }
      });
    };

    window.addEventListener("halo-store-updated", syncFresh);
    window.addEventListener("storage", syncFresh);
    window.addEventListener("focus", syncFresh);

    return () => {
      window.removeEventListener("halo-store-updated", syncFresh);
      window.removeEventListener("storage", syncFresh);
      window.removeEventListener("focus", syncFresh);
    };
  }, [profile.username]);

  const handleEnter = async () => {
    // Record view ONLY when user clicks the "Click To Enter" black screen
    // The backend /api/view checks visitor IP address to ensure only 1 view per IP
    const res = await db.rpc("increment_profile_view", {
      _username: profile.username,
    });
    if (
      res.data &&
      typeof (res.data as { views?: number }).views === "number"
    ) {
      setProfile((prev) => ({
        ...prev,
        views: (res.data as { views: number }).views,
      }));
    }
  };

  return (
    <div className="h-screen w-full">
      <ProfileView
        profile={profile}
        links={links}
        onEnter={handleEnter}
        onLinkClick={(link) => {
          void db.rpc("increment_link_click", { _link_id: link.id });
        }}
      />
    </div>
  );
}

function ProfileNotFound() {
  const { username } = Route.useParams();
  const [clientProfile, setClientProfile] = useState<{
    profile: Profile;
    links: BioLink[];
  } | null>(null);

  // Client-side fallback: check if profile exists in local store or via API
  useEffect(() => {
    if (typeof window === "undefined") return;
    void fetchProfileByUsername(username).then((res) => {
      if (
        res &&
        res.profile &&
        res.profile.username &&
        !res.profile.is_banned
      ) {
        setClientProfile(res);
      }
    });
  }, [username]);

  if (clientProfile) {
    return (
      <div className="h-screen w-full">
        <ProfileView
          profile={clientProfile.profile}
          links={clientProfile.links}
          onEnter={async () => {
            const res = await db.rpc("increment_profile_view", {
              _username: clientProfile.profile.username,
            });
            if (
              res.data &&
              typeof (res.data as { views?: number }).views === "number"
            ) {
              setClientProfile((prev) =>
                prev
                  ? {
                      ...prev,
                      profile: {
                        ...prev.profile,
                        views: (res.data as { views: number }).views,
                      },
                    }
                  : null,
              );
            }
          }}
          onLinkClick={(link) => {
            void db.rpc("increment_link_click", { _link_id: link.id });
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
      <div className="aura pointer-events-none absolute inset-0 -z-10" />
      <div className="glass-panel max-w-md p-8 animate-float-in">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          @{username} is available!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Nobody has claimed this custom link-in-bio handle yet.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/auth"
            search={{ mode: "signup", u: username }}
            className="btn-primary"
          >
            Claim @{username} now
          </Link>
          <Link to="/" className="btn-ghost">
            Explore Halo
          </Link>
        </div>
      </div>
    </div>
  );
}
