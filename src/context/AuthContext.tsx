import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session, AuthChangeEvent, User as AuthUser } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";
import { AuthContext } from "./AuthContextDef";
import type { User as AppUser } from "../types";

async function resolveUser(authU: AuthUser): Promise<AppUser> {
  try {
    const fetchProfile = supabase
      .from("profiles")
      .select("*")
      .eq("id", authU.id)
      .single();

    const { data: profile, error: profileError } = await fetchProfile;

    if (profileError) {
      console.error("Error fetching profile:", profileError.message);
    }

    if (profile) {
      return { ...profile, email: authU.email ?? "" };
    }
  } catch (e) {
    console.warn("Profile fetch failed or timed out, using auth metadata:", e);
  }

  // Fallback — profile doesn't exist yet or query failed
  return {
    id: authU.id,
    email: authU.email ?? "",
    full_name: authU.user_metadata?.full_name ?? "PadiPay User",
    username: authU.user_metadata?.username ?? "user",
    created_at: authU.created_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety net: never show loading for more than 6 seconds
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 6000);

    supabase.auth
      .getSession()
      .then(async ({ data, error }) => {
        if (error) {
          console.error("Failed to get session:", error);
        }
        const s: Session | null = data.session;
        setSession(s);
        const authU = s?.user ?? null;
        setAuthUser(authU);

        if (authU) {
          const resolved = await resolveUser(authU);
          setUser(resolved);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Session fetch crashed:", err);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, s: Session | null) => {
        setSession(s);
        const authU = s?.user ?? null;
        setAuthUser(authU);

        if (authU) {
          try {
            const resolved = await resolveUser(authU);
            setUser(resolved);
          } catch (e) {
            console.error("Auth state change profile resolve failed:", e);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
    // Always force clear local state
    setSession(null);
    setAuthUser(null);
    setUser(null);
    setLoading(false);
  };

  const refreshUser = async () => {
    if (authUser) {
      const resolved = await resolveUser(authUser);
      setUser(resolved);
    }
  };

  return (
    <AuthContext.Provider value={{ session, authUser, user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

