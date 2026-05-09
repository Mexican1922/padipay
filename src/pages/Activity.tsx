import { useState } from "react";
import { C, TYPO, ANIM, SHADOWS, ZINDEX } from "../styles/tokens";
import { useWallet } from "../context/useWallet";
import type { Transaction } from "../types";
import AppLayout from "../components/AppLayout";
import FilterTabs, { type FilterOption } from "../components/FilterTabs";
import TransactionItem from "../components/TransactionItem";
import { Icon } from "../components/Icons";
import { ActivitySkeleton } from "../components/Skeleton";

function groupByDate(
  transactions: Transaction[],
): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  transactions.forEach((t) => {
    const date = new Date(t.created_at);
    const now = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    let label: string;
    if (date.toDateString() === now.toDateString()) {
      label = "TODAY";
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = "YESTERDAY";
    } else {
      label = date
        .toLocaleDateString("en-NG", { month: "short", day: "numeric" })
        .toUpperCase();
    }
    if (!groups[label]) groups[label] = [];
    groups[label].push(t);
  });
  return groups;
}

function filterTransactions(
  transactions: Transaction[],
  filter: FilterOption,
): Transaction[] {
  switch (filter) {
    case "Sent":
      return transactions.filter((t) => t.icon === "send");
    case "Received":
      return transactions.filter((t) => t.icon === "receive");
    case "Funded":
      return transactions.filter((t) => t.icon === "fund");
    default:
      return transactions;
  }
}

export default function Activity() {
  const [filter, setFilter] = useState<FilterOption>("All");
  const { transactions, loading } = useWallet();

  const filtered = filterTransactions(transactions, filter);
  const grouped = groupByDate(filtered);

  if (loading) {
    return <ActivitySkeleton />;
  }

  return (
    <AppLayout className="anim-fade-in">
      <div
        className="safe-top"
        style={{
          background: C.surfaceGlass,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "16px 20px 0",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: ZINDEX.header,
          boxShadow: SHADOWS.header,
        }}
      >
        <h1
          style={{
            ...TYPO.h2,
            color: C.onSurface,
            margin: "0 0 12px 0",
            padding: "0 4px",
          }}
        >
          Activity
        </h1>
        <div style={{ margin: "0 -20px" }}>
          <FilterTabs active={filter} onChange={setFilter} />
        </div>
      </div>

      <div
        className="hide-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px",
          position: "relative",
        }}
      >
        {Object.keys(grouped).length === 0 && (
          <div
            className={ANIM.scaleIn}
            style={{ textAlign: "center", padding: "64px 0" }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: C.surface2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Icon.Activity size={32} color={C.outlineVar} />
            </div>
            <div style={{ ...TYPO.bodyMedium, color: C.outline }}>
              No transactions found
            </div>
            <div style={{ ...TYPO.caption, color: C.outlineVar, marginTop: 4 }}>
              Try changing your filter
            </div>
          </div>
        )}

        {Object.entries(grouped).map(([day, txns], groupIdx) => (
          <div
            key={day}
            className={ANIM.fadeInUp}
            style={{ "--delay": `${groupIdx * 100}ms` } as React.CSSProperties}
          >
            <div
              style={{ ...TYPO.label, color: C.outline, margin: "24px 0 8px" }}
            >
              {day}
            </div>
            <div role="list">
              {txns.map((t, i) => (
                <TransactionItem
                  key={t.id}
                  transaction={t}
                  isLast={i === txns.length - 1}
                  index={i}
                />
              ))}
            </div>
          </div>
        ))}
        <div style={{ height: 40 }} />
      </div>
    </AppLayout>
  );
}
