import { useEffect, useState } from "react";
import { auth, db, type Profile, type AuthSession } from "@/lib/bio";

export const OWNER_EMAIL = "aaravg78201333@gmail.com";

const AUTH_TIMEOUT_MS = 10000;

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let initialized = false;

    const { data: sub } = auth.onAuthStateChange((event, nextSession) => {
      // The local auth adapter immediately emits INITIAL_SESSION. Do not treat
      // that first null value as a real signed-out state: the server session
      // may still be loading and protected routes would otherwise redirect.
      if (event === "INITIAL_SESSION" && !initialized) return;
      if (cancelled) return;
      setSession(nextSession);
      if (event !== "INITIAL_SESSION" || initialized) setLoading(false);
    });

    const load = async () => {
      try {
        const result = await Promise.race([
          auth.getSession(),
          new Promise<never>((_, reject) =>
            window.setTimeout(() => reject(new Error("Authentication timed out")), AUTH_TIMEOUT_MS),
          ),
        ]);
        if (cancelled) return;
        setSession(result.data.session);
      } catch (error) {
        if (!cancelled) {
          console.warn("Authentication initialization failed:", error);
          setSession(null);
        }
      } finally {
        initialized = true;
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
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

    const loadProfile = async () => {
      try {
        const { data }: { data: Profile | null } = await db
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
        if (!cancelled) {
          setProfile(data ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.warn("Could not load profile:", error);
        if (!cancelled) {
          setProfile(null);
          setLoading(false);
        }
      }
    };

    void loadProfile();
    const handleUpdate = () => void loadProfile();
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

export function useIsAdmin(userId: string | undefined, email?: string | null) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(null);
      return;
    }

    let cancelled = false;
    const suppliedEmail = (email ?? "").toLowerCase();
    if (suppliedEmail === OWNER_EMAIL) {
      setIsAdmin(true);
      return;
    }

    void auth.getUser().then(({ data }) => {
      if (cancelled) return;
      const currentEmail = (data.user?.email ?? "").toLowerCase();
      if (currentEmail === OWNER_EMAIL) {
        setIsAdmin(true);
        return;
      }

      void db
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle()
        .then(({ data: role }) => {
          if (!cancelled) setIsAdmin(!!role);
        })
        .catch((error) => {
          console.warn("Could not load admin role:", error);
          if (!cancelled) setIsAdmin(false);
        });
    }).catch((error) => {
      console.warn("Could not load authenticated user:", error);
      if (!cancelled) setIsAdmin(false);
    });

    return () => {
      cancelled = true;
    };
  }, [userId, email]);

  return isAdmin;
}
