export interface User {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  updated_at: string;
}

export type TransactionType = "credit" | "debit";
export type TransactionIcon = "fund" | "send" | "receive" | "airtime";

export interface Transaction {
  id: string;
  wallet_id: string;
  user_id: string;
  type: TransactionType;
  icon: TransactionIcon;
  label: string;
  amount: number;
  fee: number;
  reference: string;
  recipient_tag?: string;
  note?: string;
  created_at: string;
}

export interface SendPayload {
  recipient: string;
  amount: number;
  note?: string;
}
