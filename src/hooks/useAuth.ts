import { useEffect, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { firebaseAuth, db } from "@/lib/firebase";
import type { Profile } from "@/lib/bio";

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // For compatibility with old code that expected session.user.id
  const compatSession = user
    ? { user: { id: user.uid, email: user.email, role: "user" } }
    : null;
  const compatUser = compatSession ? compatSession.user : null;

  return {
    session: compatSession,
    user: compatUser,
    firebaseUser: user,
    loading,
  };
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

    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, "profiles", userId),
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as Profile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching profile", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
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

    const unsubscribe = onSnapshot(
      doc(db, "user_roles", userId),
      (docSnap) => {
        if (docSnap.exists()) {
          setIsAdmin(docSnap.data().role === "admin");
        } else {
          setIsAdmin(false);
        }
      },
      (error) => {
        console.error("Error fetching admin status", error);
        setIsAdmin(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  return isAdmin;
}
