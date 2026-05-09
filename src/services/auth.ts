import { supabase } from "./supabase";

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  username: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username: username.replace("@", "").toLowerCase(),
      },
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error("Registration failed");

  // The profile and wallet are now automatically created by Supabase database triggers
  // on the `auth.users` table immediately upon signup.

  return data;
}

