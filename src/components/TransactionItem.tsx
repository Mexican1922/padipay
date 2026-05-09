import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, TYPO, TRANSITIONS } from "../styles/tokens";
import { Icon } from "./Icons";
import BrandLogo, { isKnownBrand } from "./BrandLogo";
import type { Transaction } from "../types";

function TxIcon({
  icon,
  type,
  label,
}: {
  icon: Transaction["icon"];
  type: Transaction["type"];
  label: string;
}) {
  if (isKnownBrand(label)) {
    return <BrandLogo brand={label} size={44} />;
  }

  const isCredit = type === "credit";
  const isAirtime = icon === "airtime";
  const bg = isCredit ? C.mintGlow : isAirtime ? C.errorBg : C.goldGlow;
  const border = isCredit
    ? C.mintBorder
    : isAirtime
      ? C.errorBorder
      : C.goldBorder;
  const color = isCredit ? C.mint : isAirtime ? C.error : C.gold;

  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        background: bg,
        border: `1px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {(icon === "fund" || icon === "receive") && (
        <Icon.ArrowDown size={18} color={color} />
      )}
      {icon === "send" && <Icon.Send size={18} color={color} />}
      {icon === "airtime" && <Icon.Phone size={18} color={color} />}
    </div>
  );
}

interface Props {
  transaction: Transaction;
  isLast?: boolean;
  /** Animation stagger index */
  index?: number;
}

export default function TransactionItem({
  transaction,
  isLast,
  index = 0,
}: Props) {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(false);
  const { type, icon, label, amount, created_at } = transaction;

  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);

  const date = new Date(created_at).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isCredit = type === "credit";

  return (
    <div
      className="anim-fade-in-up"
      role="listitem"
      onClick={() => navigate(`/transaction/${transaction.id}`)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={
        {
          "--delay": `${index * 50}ms`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 8px",
          margin: "0 -8px",
          borderBottom: isLast ? "none" : `0.5px solid ${C.outlineFaint}`,
          cursor: "pointer",
          borderRadius: 12,
          transition: TRANSITIONS.fast,
          background: pressed ? C.surface1 : "transparent",
          transform: pressed ? "scale(0.98)" : "scale(1)",
        } as React.CSSProperties
      }
    >
      <TxIcon icon={icon} type={type} label={label} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            ...TYPO.bodyMedium,
            fontSize: 13,
            color: C.onSurface,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </div>
        <div
          style={{
            ...TYPO.caption,
            fontSize: 11,
            color: C.outline,
            marginTop: 2,
          }}
        >
          {date}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <span
          style={{
            ...TYPO.amount,
            color: isCredit ? C.mint : C.error,
          }}
        >
          {isCredit ? "+" : "-"}
          {formatted}
        </span>
        <Icon.ChevronRight size={14} color={C.outlineVar} />
      </div>
    </div>
  );
}
