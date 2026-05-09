import { supabase } from "./supabase";
import type { User } from "../types";

export async function resolveRecipient(
  usernameOrEmail: string,
): Promise<User | null> {
  const searchTerm = usernameOrEmail.replace("@", "").toLowerCase();

  // Try username first
  let { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", searchTerm)
    .maybeSingle();

  if (!data) {
    // Try email if username not found. Wait, email is often in auth.users, 
    // but if it's not in profiles, we can't search it easily without an Edge Function or admin API.
    // For now, we'll just allow searching by exact username from profiles.
  }

  if (error || !data) return null;

  return data as User;
}

export async function sendMoney(
  senderId: string,
  recipientId: string,
  amount: number,
  note: string,
  userPin: string,
): Promise<void> {
  const { error } = await supabase.rpc("transfer_funds", {
    sender_id: senderId,
    recipient_id: recipientId,
    transfer_amount: amount,
    transfer_note: note,
    user_pin: userPin,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function payBill(
  _payerId: string,
  amount: number,
  billType: string,
  billLabel: string,
  reference: string,
  note: string,
  userPin: string,
  iconName: string,
): Promise<void> {
  // Use the Edge Function to securely process the 2-phase commit and 3rd-party API
  const { data, error } = await supabase.functions.invoke("pay-bill", {
    body: {
      amount,
      billType,
      billLabel,
      reference,
      note,
      userPin,
      iconName,
    },
  });

  if (error) {
    throw new Error(error.message || "Server connection failed");
  }

  if (data?.error) {
    throw new Error(data.error);
  }
}
