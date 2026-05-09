import { useState } from "react";
import toast from "react-hot-toast";
import { C, FONTS, TYPO, TRANSITIONS, ANIM } from "../styles/tokens";
import { Icon } from "./Icons";

interface Props {
  balance: number;
  fullName: string;
  username: string;
}

export default function WealthShield({ balance, fullName, username }: Props) {
  const [visible, setVisible] = useState(true);

  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(balance);

  const accountRef = `${username.slice(0, 3).toUpperCase()}${Math.abs(username.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 10000).toString().padStart(4, "0")}`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(`@${username}`).then(() => {
      toast.success("Username copied!");
    });
  };

  return (
    <div
      className={ANIM.scaleIn}
      style={{
        background: C.surface1,
        borderRadius: 20,
        padding: "22px 22px 20px",
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${C.outlineVar}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      }}
    >
      {/* Top row — label + balance + username badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              ...TYPO.label,
              color: C.onSurfaceMuted,
              marginBottom: 6,
              letterSpacing: "0.1em",
            }}
          >
            Total Balance
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                ...TYPO.display,
                color: C.onSurface,
                transition: TRANSITIONS.normal,
              }}
            >
              {visible ? formatted : "₦ ••••••"}
            </span>
            <button
              onClick={() => setVisible(!visible)}
              aria-label={visible ? "Hide balance" : "Show balance"}
              className="focus-ring"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                transition: TRANSITIONS.fast,
              }}
            >
              {visible ? (
                <Icon.EyeOpen size={16} color={C.onSurfaceMuted} />
              ) : (
                <Icon.EyeClosed size={16} color={C.onSurfaceMuted} />
              )}
            </button>
          </div>
        </div>

        {/* Username badge — tappable to copy */}
        <button
          onClick={handleCopyAccount}
          style={{
            background: C.surface2,
            border: `1px solid ${C.outlineVar}`,
            borderRadius: 20,
            padding: "5px 12px",
            ...TYPO.overline,
            color: C.gold,
            letterSpacing: "0.04em",
            textTransform: "none" as const,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            transition: TRANSITIONS.fast,
          }}
        >
          @{username}
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: C.outlineVar,
          marginBottom: 14,
        }}
      />

      {/* Bottom row — name + wallet type */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ ...TYPO.caption, color: C.onSurfaceDim }}>
            {fullName}
          </div>
          <div
            style={{
              fontSize: 11,
              color: C.outline,
              marginTop: 2,
              fontFamily: FONTS.display,
              letterSpacing: "0.08em",
            }}
          >
            Naira Wallet · {accountRef}
          </div>
        </div>
        <div
          style={{
            ...TYPO.overline,
            color: C.goldMid,
            background: C.goldTint,
            border: `1px solid ${C.goldBorder}`,
            padding: "3px 10px",
            borderRadius: 6,
            fontSize: 9,
          }}
        >
          NGN
        </div>
      </div>
    </div>
  );
}
