import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { db, fetchProfileByUsername } from "@/lib/bio";
import { ProfileView } from "@/components/ProfileView";

export const Route = createFileRoute("/$username")({
  loader: async ({ params }) => {
    const result = await fetchProfileByUsername(params.username);
    if (!result || !result.profile.username || result.profile.is_banned) throw notFound();
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
    const desc = profile.bio?.slice(0, 150) || `All of ${name}'s links in one place on Halo.`;
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
  const { profile, links } = Route.useLoaderData();

  useEffect(() => {
    if (!profile.username) return;
    void db.rpc("increment_profile_view", { _username: profile.username });
  }, [profile.username]);

  return (
    <div className="h-screen w-full">
      <ProfileView
        profile={profile}
        links={links}
        onLinkClick={(link) => {
          void db.rpc("increment_link_click", { _link_id: link.id });
        }}
      />
    </div>
  );
}

function ProfileNotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
      <div className="aura pointer-events-none absolute inset-0 -z-10" />
      <h1 className="font-display text-3xl font-bold">This handle is free</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Nobody has claimed this page yet — or it has been removed.
      </p>
      <Link to="/auth" search={{ mode: "signup" }} className="btn-primary">
        Claim it
      </Link>
    </div>
  );
}
