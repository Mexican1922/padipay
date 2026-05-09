import { C, TYPO, ANIM, SHADOWS } from "../styles/tokens";
import { Icon } from "./Icons";
import GoldButton from "./GoldButton";

interface BillerMockModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (status: "success" | "failure") => void;
  loading: boolean;
  title?: string;
  subtitle?: string;
}

export default function BillerMockModal({
  open,
  onClose,
  onSelect,
  loading,
  title = "Simulate Biller API",
  subtitle = "Choose how the third-party Biller API (e.g. Flutterwave) should respond to this transaction.",
}: BillerMockModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={loading ? undefined : onClose}
    >
      <div
        className={ANIM.scaleIn}
        style={{
          background: C.surface1,
          borderRadius: 24,
          padding: 24,
          width: "100%",
          maxWidth: 360,
          border: `1px solid ${C.outlineVar}`,
          boxShadow: SHADOWS.cardHover,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: C.surface2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: C.gold,
            }}
          >
            <Icon.Settings size={28} />
          </div>
          <h3
            style={{
              ...TYPO.h3,
              color: C.onSurface,
              marginBottom: 8,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              ...TYPO.bodyMedium,
              color: C.onSurfaceDim,
            }}
          >
            {subtitle}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <GoldButton onClick={() => onSelect("success")} disabled={loading}>
            {loading ? "Processing..." : "Simulate Success"}
          </GoldButton>

          <button
            onClick={() => onSelect("failure")}
            disabled={loading}
            style={{
              background: "transparent",
              border: `1px solid ${C.error}`,
              borderRadius: 16,
              padding: "16px",
              color: C.error,
              ...TYPO.h4,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            Simulate Failure
          </button>
        </div>
      </div>
    </div>
  );
}
