import { useState } from "react";
import toast from "react-hot-toast";
import { C, TYPO, ZINDEX, TRANSITIONS } from "../styles/tokens";
import { Icon } from "./Icons";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ open, onClose }: Props) {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [promo, setPromo] = useState(false);

  if (!open) return null;

  const handleToggle = (type: string, current: boolean, setter: (val: boolean) => void) => {
    setter(!current);
    toast.success(`${type} notifications ${!current ? "enabled" : "disabled"}`);
  };

  const ToggleSwitch = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <div
      onClick={onClick}
      style={{
        width: 50,
        height: 28,
        borderRadius: 14,
        background: active ? C.mint : C.surface2,
        position: "relative",
        cursor: "pointer",
        transition: TRANSITIONS.fast,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          background: C.bg,
          position: "absolute",
          top: 2,
          left: active ? 24 : 2,
          transition: TRANSITIONS.fast,
          boxShadow: `0 2px 4px rgba(0,0,0,0.2)`,
        }}
      />
    </div>
  );

  return (
    <>
      <div
        className="anim-fade-in"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: C.scrim,
          backdropFilter: "blur(4px)",
          zIndex: ZINDEX.modal,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: C.bg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: "24px 24px 48px",
          zIndex: ZINDEX.modal + 1,
          animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: C.outlineVar,
            borderRadius: 2,
            margin: "0 auto 24px",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ ...TYPO.h2, margin: 0, color: C.onSurface }}>Notifications</h2>
          <button
            onClick={onClose}
            style={{
              background: C.surface2,
              border: "none",
              width: 32,
              height: 32,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon.X size={18} color={C.onSurface} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: C.surface1, borderRadius: 16, border: `1px solid ${C.outlineVar}` }}>
            <div>
              <div style={{ ...TYPO.bodyMedium, fontWeight: 600, color: C.onSurface }}>Push Notifications</div>
              <div style={{ ...TYPO.caption, color: C.outline, marginTop: 4 }}>Receive instant alerts on your device</div>
            </div>
            <ToggleSwitch active={push} onClick={() => handleToggle("Push", push, setPush)} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: C.surface1, borderRadius: 16, border: `1px solid ${C.outlineVar}` }}>
            <div>
              <div style={{ ...TYPO.bodyMedium, fontWeight: 600, color: C.onSurface }}>Email Receipts</div>
              <div style={{ ...TYPO.caption, color: C.outline, marginTop: 4 }}>Get transaction receipts sent to email</div>
            </div>
            <ToggleSwitch active={email} onClick={() => handleToggle("Email", email, setEmail)} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: C.surface1, borderRadius: 16, border: `1px solid ${C.outlineVar}` }}>
            <div>
              <div style={{ ...TYPO.bodyMedium, fontWeight: 600, color: C.onSurface }}>Promotions & Offers</div>
              <div style={{ ...TYPO.caption, color: C.outline, marginTop: 4 }}>Occasional news and promotional deals</div>
            </div>
            <ToggleSwitch active={promo} onClick={() => handleToggle("Promo", promo, setPromo)} />
          </div>
        </div>
      </div>
    </>
  );
}
