import { C, TYPO, ANIM, TRANSITIONS } from "../styles/tokens";
import { useWallet } from "../context/useWallet";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import { Icon } from "../components/Icons";
import type { Transaction } from "../types";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
  });
}

function txToNotification(tx: Transaction) {
  const isCredit = tx.type === "credit";
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(tx.amount);

  let title: string;
  let description: string;
  let iconColor: string;
  let iconBg: string;
  let iconBorder: string;

  if (tx.icon === "send") {
    title = "Money Sent";
    description = `You sent ${formatted} to ${tx.recipient_tag || "a user"}`;
    iconColor = C.gold;
    iconBg = C.goldGlow;
    iconBorder = C.goldBorder;
  } else if (tx.icon === "receive") {
    title = "Money Received";
    description = `You received ${formatted}`;
    iconColor = C.mint;
    iconBg = C.mintGlow;
    iconBorder = C.mintBorder;
  } else if (tx.icon === "fund") {
    title = "Wallet Funded";
    description = `${formatted} was added to your wallet`;
    iconColor = C.mint;
    iconBg = C.mintGlow;
    iconBorder = C.mintBorder;
  } else {
    title = tx.label;
    description = `${isCredit ? "+" : "-"}${formatted}`;
    iconColor = C.outline;
    iconBg = C.surface2;
    iconBorder = C.outlineVar;
  }

  return { title, description, iconColor, iconBg, iconBorder, time: timeAgo(tx.created_at) };
}

function groupNotifications(transactions: Transaction[]) {
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const groups: Record<string, Transaction[]> = {};

  transactions.forEach((tx) => {
    const d = new Date(tx.created_at).toDateString();
    let label: string;
    if (d === today) label = "Today";
    else if (d === yesterday) label = "Yesterday";
    else label = "Earlier";

    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  });

  // Return in order: Today, Yesterday, Earlier
  const ordered: [string, Transaction[]][] = [];
  if (groups["Today"]) ordered.push(["Today", groups["Today"]]);
  if (groups["Yesterday"]) ordered.push(["Yesterday", groups["Yesterday"]]);
  if (groups["Earlier"]) ordered.push(["Earlier", groups["Earlier"]]);
  return ordered;
}

export default function Notifications() {
  const { transactions, loading } = useWallet();

  const grouped = groupNotifications(transactions);
  const hasNotifications = transactions.length > 0;

  return (
    <AppLayout showNav={false} className="anim-slide-in-right">
      <PageHeader title="Notifications" back="/" />

      <div
        className="hide-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px",
        }}
      >
        {/* Empty state */}
        {!loading && !hasNotifications && (
          <div
            className={ANIM.scaleIn}
            style={{
              textAlign: "center",
              padding: "80px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: C.surface2,
                border: `1px solid ${C.outlineVar}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Icon.Bell size={36} color={C.outlineVar} />
            </div>
            <div
              style={{
                ...TYPO.h3,
                color: C.onSurface,
                marginBottom: 8,
              }}
            >
              You're all caught up
            </div>
            <div
              style={{
                ...TYPO.bodyMedium,
                color: C.outline,
                maxWidth: 240,
                lineHeight: 1.6,
              }}
            >
              New notifications will appear here when you send or receive money.
            </div>
          </div>
        )}

        {/* Notification groups */}
        {grouped.map(([label, txns], groupIdx) => (
          <div
            key={label}
            className={ANIM.fadeInUp}
            style={{ "--delay": `${groupIdx * 80}ms` } as React.CSSProperties}
          >
            {/* Group label */}
            <div
              style={{
                ...TYPO.label,
                color: C.outline,
                margin: "24px 0 8px",
                paddingLeft: 4,
              }}
            >
              {label}
            </div>

            {/* Notification items */}
            {txns.map((tx, i) => {
              const notif = txToNotification(tx);
              return (
                <div
                  key={tx.id}
                  className="anim-press-bounce"
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom:
                      i < txns.length - 1
                        ? `0.5px solid ${C.outlineFaint}`
                        : "none",
                    cursor: "pointer",
                    transition: TRANSITIONS.fast,
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: notif.iconBg,
                      border: `1px solid ${notif.iconBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {tx.icon === "send" && (
                      <Icon.Send size={18} color={notif.iconColor} />
                    )}
                    {(tx.icon === "receive" || tx.icon === "fund") && (
                      <Icon.ArrowDown size={18} color={notif.iconColor} />
                    )}
                    {tx.icon === "airtime" && (
                      <Icon.Phone size={18} color={notif.iconColor} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          ...TYPO.bodyMedium,
                          color: C.onSurface,
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {notif.title}
                      </div>
                      <div
                        style={{
                          ...TYPO.caption,
                          color: C.outline,
                          flexShrink: 0,
                          fontSize: 11,
                        }}
                      >
                        {notif.time}
                      </div>
                    </div>
                    <div
                      style={{
                        ...TYPO.caption,
                        color: C.onSurfaceDim,
                        marginTop: 3,
                        lineHeight: 1.4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {notif.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div style={{ height: 32 }} />
      </div>
    </AppLayout>
  );
}
