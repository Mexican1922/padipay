import { useNavigate } from "react-router-dom";
import { C, TYPO, SHADOWS, TRANSITIONS, ANIM } from "../styles/tokens";
import WealthShield from "./WealthShield";
import { Icon } from "./Icons";
import type { User, Wallet } from "../types";

interface Props {
  user: User;
  wallet: Wallet;
}

export default function HomeHeader({ user, wallet }: Props) {
  const navigate = useNavigate();
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const firstName = user.full_name.split(" ")[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div
      className={ANIM.fadeIn}
      style={{
        background: C.surface0,
        padding: "16px 24px 24px",
        flexShrink: 0,
        boxShadow: SHADOWS.header,
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        className="safe-top"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Avatar with gold glow */}
          <button
            onClick={() => navigate("/profile")}
            aria-label="Go to profile"
            className="focus-ring anim-press-bounce"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldMid})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...TYPO.bodyMedium,
              fontWeight: 700,
              color: C.goldDark,
              fontFamily: TYPO.display.fontFamily,
              cursor: "pointer",
              border: `2px solid ${C.surface0}`,
              boxShadow: `0 0 0 1px ${C.goldBorder}`,
              padding: 0,
              transition: TRANSITIONS.fast,
            }}
          >
            {initials}
          </button>
          
          <div>
            <div
              style={{
                ...TYPO.caption,
                color: C.onSurfaceDim,
                marginBottom: 2,
              }}
            >
              {greeting},
            </div>
            <div
              style={{
                ...TYPO.h3,
                fontSize: 16,
                color: C.onSurface,
              }}
            >
              {firstName}
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
            className="focus-ring anim-press-bounce"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: C.onSurface,
              position: "relative",
            }}
          >
            <Icon.Bell size={22} />
            {/* Unread badge */}
            <div
              style={{
                position: "absolute",
                top: 4,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.error,
                border: `2px solid ${C.surface0}`,
              }}
            />
          </button>
        </div>
      </div>
      
      <WealthShield
        balance={wallet.balance}
        fullName={user.full_name}
        username={user.username}
      />
    </div>
  );
}
