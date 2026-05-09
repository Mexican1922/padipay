import { useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./useAuth";
import { WalletContext } from "./WalletContextDef";
import type { Wallet, Transaction } from "../types";

export function WalletProvider({ children }: { children: ReactNode }) {
  const { authUser } = useAuth();
  const userId = authUser?.id;
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Store fetch logic in a ref so the effect doesn't depend on it
  const fetchWallet = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Fetch wallet
      const { data: walletData, error: _walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (_walletError) throw _walletError;
      setWallet(walletData);

      // Fetch transactions
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (txError) throw txError;
      setTransactions(txData ?? []);
    } catch (err) {
      console.error("Failed to fetch wallet:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial load
  useEffect(() => {
    let cancelled = false;

    // Safety net: never show loading for more than 6 seconds
    const timeout = setTimeout(() => {
      if (!cancelled) {
        console.warn("[WalletContext] Loading timed out after 6 seconds, forcing loading=false");
        setLoading(false);
      }
    }, 6000);

    const load = async () => {
      await Promise.resolve();

      if (!userId) {
        if (!cancelled) {
          setWallet(null);
          setTransactions([]);
          setLoading(false);
        }
        return;
      }

      console.log("[WalletContext] Fetching for user:", userId);
      setLoading(true);
      try {
        const { data: walletData, error: _walletError2 } = await supabase
          .from("wallets")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        const { data: txData, error: txError } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50);

        if (txError) throw txError;

        if (!cancelled) {
          console.log("[WalletContext] Fetch success. Wallet:", walletData?.id, "Txns:", txData?.length);
          setWallet(walletData);
          setTransactions(txData ?? []);
        }
      } catch (err) {
        console.error("[WalletContext] Failed to fetch wallet or timed out:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
          clearTimeout(timeout);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [userId]);

  // Real-time Subscriptions
  useEffect(() => {
    if (!userId) return;

    // Listen to wallet updates
    const walletSub = supabase
      .channel('public:wallets')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setWallet(payload.new as Wallet);
        }
      )
      .subscribe();

    // Listen to new transactions
    const txSub = supabase
      .channel('public:transactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setTransactions((prev) => {
            const updated = [payload.new as Transaction, ...prev];
            return updated.slice(0, 50); // Keep max 50 items to prevent memory leak
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(walletSub);
      supabase.removeChannel(txSub);
    };
  }, [userId]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        loading,
        refresh: fetchWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
