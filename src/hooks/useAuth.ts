import { useEffect, useState } from "react";
import { auth, db, type Profile, type AuthSession } from "@/lib/bio";

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, loading };
}

export function useMyProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    const loadProfile = () => {
      db.from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()
        .then(({ data }: { data: Profile | null }) => {
          if (!cancelled) {
            setProfile(data ?? null);
            setLoading(false);
          }
        });
    };

    loadProfile();

    const handleUpdate = () => {
      loadProfile();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("halo-store-updated", handleUpdate);
    }

    return () => {
      cancelled = true;
      if (typeof window !== "undefined") {
        window.removeEventListener("halo-store-updated", handleUpdate);
      }
    };
  }, [userId]);

  return { profile, setProfile, loading };
}

export function useIsAdmin(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(null);
      return;
    }
    let cancelled = false;
    db.from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }: { data: { role: string } | null }) => {
        if (!cancelled) setIsAdmin(!!data);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return isAdmin;
}
