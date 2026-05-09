import { createContext } from "react";
import type { Wallet, Transaction } from "../types";

export interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | null>(null);
