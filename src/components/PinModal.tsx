import { useState, useRef, useEffect } from "react";
import { C, TYPO, ZINDEX, TRANSITIONS } from "../styles/tokens";
import GoldButton from "./GoldButton";
import { Icon } from "./Icons";
import LogoLoader from "./LogoLoader";

interface PinModalProps {
  open: boolean;
  onSubmit: (pin: string) => void;
  onClose: () => void;
  loading?: boolean;
  title?: string;
  subtitle?: string;
}

export default function PinModal({
  open,
  onSubmit,
  onClose,
  loading = false,
  title = "Enter PIN",
  subtitle = "Enter your 4-digit PIN to confirm",
}: PinModalProps) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [shaking, setShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input when modal opens
  useEffect(() => {
    if (open) {
      setDigits(["", "", "", ""]);
      setShaking(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  // Clear PIN on failure (loading stops but modal stays open)
  useEffect(() => {
    if (!loading && open && digits.some((d) => d !== "")) {
      setDigits(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 10);
    }
  }, [loading, open]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...digits];
    next[index] = value;
    setDigits(next);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits are filled
    if (value && index === 3 && next.every((d) => d !== "")) {
      onSubmit(next.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  if (!open) return null;

  const pinFilled = digits.every((d) => d !== "");

  if (!open) return null;

  if (loading) {
    return <LogoLoader text="PROCESSING..." fullScreen />;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: ZINDEX.modal,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: C.scrim,
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: C.surface1,
          borderRadius: "24px 24px 0 0",
          padding: "32px 24px 40px",
          animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          {/* Lock icon */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: C.goldTint,
              border: `1px solid ${C.goldBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Icon.Lock size={24} color={C.gold} />
          </div>
          <h2 style={{ ...TYPO.h2, color: C.onSurface, margin: 0 }}>
            {title}
          </h2>
          <p style={{ ...TYPO.bodyMedium, color: C.outline, margin: "8px 0 0" }}>
            {subtitle}
          </p>
        </div>

        {/* PIN Input Boxes */}
        <div
          className={shaking ? "anim-shake" : ""}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {digits.map((digit, i) => (
            <div key={i} style={{ position: "relative" }}>
              <input
                ref={(el) => { inputRefs.current[i] = el; }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={loading}
                style={{
                  width: 56,
                  height: 64,
                  borderRadius: 16,
                  border: `2px solid ${digit ? C.goldBorder : C.outlineVar}`,
                  background: digit ? C.goldTint : C.surface2,
                  color: C.gold,
                  fontSize: 28,
                  fontFamily: TYPO.display.fontFamily,
                  fontWeight: 700,
                  textAlign: "center",
                  outline: "none",
                  transition: TRANSITIONS.normal,
                  caretColor: "transparent",
                }}
              />
              {/* Filled dot indicator */}
              {digit && (
                <div
                  style={{
                    position: "absolute",
                    bottom: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.gold,
                    animation: "scaleIn 0.15s ease-out",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Confirm Button */}
        <GoldButton
          onClick={() => pinFilled && onSubmit(digits.join(""))}
          disabled={!pinFilled || loading}
          loading={loading}
        >
          {loading ? "Verifying..." : "Confirm"}
        </GoldButton>

        {/* Cancel link */}
        <div style={{ marginTop: 16 }}>
          <GoldButton variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </GoldButton>
        </div>
      </div>
    </div>
  );
}
