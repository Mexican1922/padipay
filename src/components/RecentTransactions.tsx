import { useNavigate } from "react-router-dom";
import { C, TYPO, ANIM } from "../styles/tokens";
import { Icon } from "./Icons";
import TransactionItem from "./TransactionItem";
import type { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className={ANIM.fadeInUp}
      style={{ "--delay": "240ms", padding: "18px 20px 0" } as React.CSSProperties}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span style={{ ...TYPO.h3, fontSize: 14 }}>
          Recent Transactions
        </span>
        <button
          onClick={() => navigate("/activity")}
          className="focus-ring"
          style={{
            ...TYPO.caption,
            color: C.gold,
            cursor: "pointer",
            fontWeight: 600,
            background: "none",
            border: "none",
            padding: "4px 0",
          }}
        >
          See all
        </button>
      </div>

      {/* Empty state */}
      {transactions.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
          }}
        >
          <Icon.Wallet size={40} color={C.outlineVar} />
          <div
            style={{
              ...TYPO.bodyMedium,
              color: C.outline,
              marginTop: 12,
            }}
          >
            No transactions yet
          </div>
          <div
            style={{
              ...TYPO.caption,
              color: C.outlineVar,
              marginTop: 4,
            }}
          >
            Your activity will show up here
          </div>
        </div>
      )}

      {/* Transaction list */}
      {transactions.length > 0 && (
        <div role="list">
          {transactions.map((t, i) => (
            <TransactionItem
              key={t.id}
              transaction={t}
              isLast={i === transactions.length - 1}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
