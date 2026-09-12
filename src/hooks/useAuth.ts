import { useEffect, useState } from "react";
import { auth, db, type Profile, type AuthSession } from "@/lib/bio";

export const OWNER_EMAIL = "aaravg78201333@gmail.com";
const AUTH_TIMEOUT_MS = 7000;

async function fetchCurrentSession(): Promise<AuthSession | null> {
  if (typeof window === "undefined" || typeof fetch === "undefined") return null;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);

  try {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
      headers: { "X-Requested-With": "halo-app" },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      user?: { id: string; email: string; full_name?: string; role?: "admin" | "user" } | null;
      session?: { user_id: string; role: "admin" | "user" } | null;
    };

    if (!data.user || !data.session) return null;

    return {
      access_token: "server-cookie-session",
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role || data.session.role,
        user_metadata: { full_name: data.user.full_name || "" },
      },
    };
  } catch (error) {
    console.warn("Authentication check failed:", error);
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const subscription = auth.onAuthStateChange((event, nextSession) => {
      if (cancelled) return;
      if (event !== "INITIAL_SESSION" || nextSession) {
        setSession(nextSession);
        setLoading(false);
      }
    });

    const load = async () => {
      const current = await fetchCurrentSession();
      if (cancelled) return;

      setSession(current);
      setLoading(false);

      // Populate the shared client store in the background. This must never
      // block the auth gate or make protected pages appear broken.
      if (current) {
        void auth.getSession().catch(() => null);
      }
    };

    void load();

    return () => {
      cancelled = true;
      subscription.data.subscription.unsubscribe();
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
    const suppliedEmail = (email ?? "").trim().toLowerCase();

    if (suppliedEmail === OWNER_EMAIL) {
      setIsAdmin(true);
      return;
    }

    void auth.getUser().then(({ data }) => {
      if (cancelled) return;

      const currentEmail = (data.user?.email ?? "").trim().toLowerCase();
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
