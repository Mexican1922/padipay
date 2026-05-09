import { createContext } from "react";
import type { Session, User as AuthUser } from "@supabase/supabase-js";
import type { User as AppUser } from "../types";

export interface AuthContextType {
  session: Session | null;
  authUser: AuthUser | null;
  user: AppUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
