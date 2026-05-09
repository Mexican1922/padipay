import { useMemo, useState } from "react";
import { C } from "../styles/tokens";
import { useAuth } from "../context/useAuth";
import { useWallet } from "../context/useWallet";
import BottomNav from "../components/BottomNav";
import HomeHeader from "../components/HomeHeader";
import QuickActions from "../components/QuickActions";
import SpendInsight from "../components/SpendInsight";
import RecentTransactions from "../components/RecentTransactions";
import PromoBanner from "../components/PromoBanner";
import AppLayout from "../components/AppLayout";
import { HomeSkeleton } from "../components/Skeleton";

export default function Home() {
  const { user } = useAuth();
  const { wallet, transactions, loading } = useWallet();

  // Calculate weekly spend and real percent change
  const [now] = useState(() => Date.now());
  const { weeklySpend, percentChange, dailySpend } = useMemo(() => {
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

    // Calculate daily spend for last 7 days (for sparkline)
    const daily: number[] = [];
    for (let d = 6; d >= 0; d--) {
      const dayStart = new Date(now - d * 24 * 60 * 60 * 1000);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayTotal = transactions
        .filter(
          (t) =>
            t.type === "debit" &&
            new Date(t.created_at) >= dayStart &&
            new Date(t.created_at) <= dayEnd,
        )
        .reduce((sum, t) => sum + t.amount, 0);
      daily.push(dayTotal);
    }

    const weekly = transactions
      .filter((t) => t.type === "debit" && new Date(t.created_at) > weekAgo)
      .reduce((sum, t) => sum + t.amount, 0);

    const prevWeek = transactions
      .filter(
        (t) =>
          t.type === "debit" &&
          new Date(t.created_at) > twoWeeksAgo &&
          new Date(t.created_at) <= weekAgo,
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const pct =
      prevWeek > 0 ? Math.round(((weekly - prevWeek) / prevWeek) * 100) : 0;

    return { weeklySpend: weekly, percentChange: pct, dailySpend: daily };
  }, [transactions, now]);

  if (loading || !user) {
    return <HomeSkeleton />;
  }

  // Fallback wallet for new users who don't have one yet
  const activeWallet = wallet ?? {
    id: "",
    user_id: user.id,
    balance: 0,
    currency: "NGN",
    updated_at: "",
  };

  return (
    <AppLayout showNav={false}>
      <HomeHeader user={user} wallet={activeWallet} />
      <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>
        <QuickActions />
        <PromoBanner />
        <SpendInsight
          amount={weeklySpend}
          percentChange={percentChange}
          dailySpend={dailySpend}
        />
        <RecentTransactions transactions={transactions.slice(0, 4)} />
        <div style={{ height: 24 }} />
      </div>
      <BottomNav />
    </AppLayout>
  );
}
