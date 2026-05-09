import { useState } from "react";
import { C, FONTS, TRANSITIONS } from "../styles/tokens";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "gold" | "outline" | "ghost" | "danger";
  id?: string;
  loading?: boolean;
}

export default function GoldButton({
  children,
  onClick,
  disabled,
  variant = "gold",
  id,
  loading = false,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const isDisabled = disabled || loading;

  const variantStyles: Record<string, React.CSSProperties> = {
    gold: {
      background: `linear-gradient(135deg, ${C.gold}, ${C.goldMid})`,
      color: C.goldDark,
      border: "none",
    },
    outline: {
      background: "transparent",
      color: C.mint,
      border: `1px solid ${C.mintBorder}`,
    },
    ghost: {
      background: C.surface2,
      color: C.onSurfaceDim,
      border: `1px solid ${C.outlineVar}`,
    },
    danger: {
      background: C.errorBg,
      color: C.error,
      border: `1px solid ${C.errorBorder}`,
    },
  };

  return (
    <button
      id={id}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className="focus-ring"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: "100%",
        padding: "16px",
        minHeight: 52,
        borderRadius: 14,
        fontSize: 15,
        fontWeight: 700,
        fontFamily: FONTS.body,
        cursor: isDisabled ? "not-allowed" : "pointer",
        letterSpacing: "0.02em",
        opacity: isDisabled ? 0.45 : 1,
        transform: pressed && !isDisabled ? "scale(0.98)" : "scale(1)",
        transition: TRANSITIONS.fast,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        ...variantStyles[variant],
      }}
    >
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 16,
              height: 16,
              border: `2px solid ${variant === "gold" ? "rgba(85,67,0,0.3)" : "rgba(255,255,255,0.3)"}`,
              borderTopColor: variant === "gold" ? C.goldDark : "currentColor",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
            }}
          />
          <span>{children}</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}
