import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { C, TYPO, SHADOWS, ANIM, TRANSITIONS, ZINDEX, FONTS } from "../styles/tokens";
import { useAuth } from "../context/useAuth";
import { useWallet } from "../context/useWallet";
import AppLayout from "../components/AppLayout";
import GoldButton from "../components/GoldButton";
import { Icon } from "../components/Icons";
import PinModal from "../components/PinModal";
import EditProfileModal from "../components/EditProfileModal";
import HelpSupportModal from "../components/HelpSupportModal";
import NotificationsModal from "../components/NotificationsModal";
import { supabase } from "../services/supabase";

const SETTINGS = [
  { label: "Edit Profile", icon: "Edit" as const, accent: C.indigo },
  { label: "Security & PIN", icon: "Lock" as const, accent: C.gold },
  { label: "Notifications", icon: "Bell" as const, accent: C.mint },
  { label: "Help & Support", icon: "HelpCircle" as const, accent: C.outline },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { wallet, transactions } = useWallet();
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [hoveredSetting, setHoveredSetting] = useState<number | null>(null);

  if (!user) return null;

  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const totalIn = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const txCount = transactions.length;

  const fmt = (val: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(val);

  const memberSince = new Date(user.created_at).toLocaleDateString("en-NG", {
    month: "long",
    year: "numeric",
  });

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const handleSetPin = async (pin: string) => {
    setPinLoading(true);
    try {
      const { error } = await supabase.rpc("set_user_pin", { new_pin: pin });
      if (error) throw error;
      toast.success("PIN updated successfully!");
      setPinModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to set PIN");
      } else {
        toast.error("Failed to set PIN");
      }
    } finally {
      setPinLoading(false);
    }
  };

  const handleSettingClick = (label: string) => {
    if (label === "Security & PIN") setPinModalOpen(true);
    if (label === "Edit Profile") setEditModalOpen(true);
    if (label === "Help & Support") setHelpModalOpen(true);
    if (label === "Notifications") setNotificationsModalOpen(true);
  };

  return (
    <AppLayout className="anim-fade-in">
      <div
        className="safe-top"
        style={{
          background: C.surfaceGlass,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "16px 24px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: ZINDEX.header,
          boxShadow: SHADOWS.header,
        }}
      >
        <h1 style={{ ...TYPO.h2, color: C.onSurface, margin: 0 }}>Profile</h1>
      </div>

      <div
        className="hide-scroll"
        style={{ flex: 1, padding: "24px 20px", overflowY: "auto" }}
      >
        {/* Avatar + name + KYC badge */}
        <div
          className={ANIM.fadeInUp}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 12,
            background: C.surface1,
            padding: 20,
            borderRadius: 20,
            border: `1px solid ${C.outlineVar}`,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldMid})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...TYPO.h2,
              color: C.goldDark,
              boxShadow: `0 0 0 2px ${C.surface1}, 0 0 0 4px ${C.goldBorder}`,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                ...TYPO.h3,
                color: C.onSurface,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.full_name}
            </div>
            <div style={{ ...TYPO.bodyMedium, color: C.gold, marginTop: 2 }}>
              @{user.username}
            </div>
            <div
              style={{
                ...TYPO.caption,
                color: C.outline,
                marginTop: 4,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.email}
            </div>
          </div>
        </div>

        {/* KYC / Tier badge + Member since */}
        <div
          className={ANIM.fadeInUp}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
            padding: "0 4px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: C.mintTint,
              border: `1px solid ${C.mintBorder}`,
              borderRadius: 20,
              padding: "4px 12px",
            }}
          >
            <Icon.Shield size={13} color={C.mint} />
            <span
              style={{
                ...TYPO.caption,
                color: C.mint,
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.04em",
              }}
            >
              Tier 1 · Verified
            </span>
          </div>
          <span
            style={{
              ...TYPO.caption,
              color: C.outline,
              fontSize: 10,
            }}
          >
            Member since {memberSince}
          </span>
        </div>

        {/* Stats */}
        <div
          className={ANIM.fadeInUp}
          style={
            {
              "--delay": "80ms",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              marginBottom: 28,
            } as React.CSSProperties
          }
        >
          {[
            { label: "Balance", value: fmt(wallet?.balance ?? 0), color: C.onSurface, icon: Icon.Wallet, iconColor: C.gold },
            { label: "Total In", value: fmt(totalIn), color: C.mint, icon: Icon.ArrowDown, iconColor: C.mint },
            { label: "Total Out", value: fmt(totalOut), color: C.error, icon: Icon.Send, iconColor: C.error },
          ].map(({ label, value, color, icon: StatIcon, iconColor }) => (
            <div
              key={label}
              style={{
                background: C.surface1,
                border: `1px solid ${C.outlineVar}`,
                borderRadius: 16,
                padding: "14px 10px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `${iconColor}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StatIcon size={14} color={iconColor} />
              </div>
              <div
                style={{
                  fontFamily: TYPO.display.fontFamily,
                  fontSize: 13,
                  fontWeight: 700,
                  color: color as string,
                }}
              >
                {value}
              </div>
              <div style={{ ...TYPO.caption, color: C.outline, fontSize: 10 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Transaction count card */}
        <div
          className={ANIM.fadeInUp}
          style={
            {
              "--delay": "120ms",
              background: C.surface1,
              border: `1px solid ${C.outlineVar}`,
              borderRadius: 14,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
            } as React.CSSProperties
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon.Activity size={16} color={C.indigo} />
            <span style={{ ...TYPO.bodyMedium, color: C.onSurfaceDim, fontSize: 13 }}>
              Total Transactions
            </span>
          </div>
          <span
            style={{
              ...TYPO.bodyMedium,
              color: C.indigo,
              fontWeight: 700,
              fontSize: 14,
              fontFamily: FONTS.display,
            }}
          >
            {txCount}
          </span>
        </div>

        {/* Settings list */}
        <div
          className={ANIM.fadeInUp}
          style={
            {
              "--delay": "160ms",
              background: C.surface1,
              border: `1px solid ${C.outlineVar}`,
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 32,
            } as React.CSSProperties
          }
        >
          {SETTINGS.map((item, i) => {
            const IconComp = Icon[item.icon];
            const isHovered = hoveredSetting === i;
            return (
              <button
                key={item.label}
                onClick={() => handleSettingClick(item.label)}
                onPointerEnter={() => setHoveredSetting(i)}
                onPointerLeave={() => setHoveredSetting(null)}
                className="focus-ring"
                style={{
                  width: "100%",
                  padding: "18px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  background: isHovered ? C.surface2 : "transparent",
                  border: "none",
                  borderBottom:
                    i < SETTINGS.length - 1
                      ? `0.5px solid ${C.outlineVar}`
                      : "none",
                  transition: TRANSITIONS.fast,
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `${item.accent}12`,
                      border: `1px solid ${item.accent}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: TRANSITIONS.fast,
                    }}
                  >
                    <IconComp size={18} color={item.accent} />
                  </div>
                  <span style={{ ...TYPO.bodyMedium, color: C.onSurface }}>
                    {item.label}
                  </span>
                </div>
                <Icon.ChevronRight size={18} color={C.outline} />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div
          className={ANIM.fadeInUp}
          style={{ "--delay": "240ms" } as React.CSSProperties}
        >
          <GoldButton variant="danger" onClick={handleLogout}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Icon.LogOut size={18} color={C.error} />
              <span>Log Out</span>
            </div>
          </GoldButton>
        </div>

        <div style={{ height: 40 }} />
      </div>

      <PinModal
        open={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSubmit={handleSetPin}
        loading={pinLoading}
        title="Set New PIN"
        subtitle="Create a 4-digit PIN for transactions"
      />

      <EditProfileModal open={editModalOpen} onClose={() => setEditModalOpen(false)} />
      <HelpSupportModal open={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
      <NotificationsModal open={notificationsModalOpen} onClose={() => setNotificationsModalOpen(false)} />
    </AppLayout>
  );
}
