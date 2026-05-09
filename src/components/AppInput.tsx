import { useState, useId } from "react";
import { C, TYPO, TRANSITIONS } from "../styles/tokens";
import { Icon } from "./Icons";

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  id?: string;
  error?: string;
  maxLength?: number;
}

export default function AppInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  id: providedId,
  error,
  maxLength,
}: Props) {
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const hasValue = value.length > 0;
  const isFloating = focused || hasValue;
  const hasError = !!error;

  const accentColor = hasError ? C.error : focused ? C.gold : C.outlineVar;

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          position: "relative",
          borderRadius: 14,
          transition: TRANSITIONS.normal,
          boxShadow: focused
            ? hasError
              ? `0 0 0 2px ${C.errorBg}`
              : `0 0 0 2px ${C.goldTint}`
            : "none",
        }}
      >
        {/* Floating label */}
        {label && (
          <label
            htmlFor={inputId}
            style={{
              position: "absolute",
              left: 16,
              top: isFloating ? 8 : 16,
              fontSize: isFloating ? 10 : 14,
              fontWeight: isFloating ? 600 : 400,
              fontFamily: TYPO.body.fontFamily,
              letterSpacing: isFloating ? "0.08em" : "0",
              textTransform: isFloating ? "uppercase" as const : "none" as const,
              color: hasError
                ? C.error
                : focused
                  ? C.gold
                  : C.onSurfaceMuted,
              transition: TRANSITIONS.smooth,
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          type={isPassword && !showPassword ? "password" : isPassword ? "text" : type}
          placeholder={isFloating ? placeholder : ""}
          value={value}
          onChange={(e) => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
          style={{
            width: "100%",
            background: focused ? C.surface1 : C.surface2,
            border: `1.5px solid ${accentColor}`,
            borderRadius: 14,
            padding: label ? "24px 48px 10px 16px" : "15px 16px",
            minHeight: label ? 56 : 52,
            ...TYPO.bodyMedium,
            color: C.onSurface,
            boxSizing: "border-box",
            outline: "none",
            transition: TRANSITIONS.normal,
          }}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            {showPassword ? (
              <Icon.EyeOpen size={18} color={C.onSurfaceMuted} />
            ) : (
              <Icon.EyeClosed size={18} color={C.onSurfaceMuted} />
            )}
          </button>
        )}
      </div>

      {/* Error message + character count row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: hasError || maxLength ? 20 : 0,
          padding: hasError || maxLength ? "4px 4px 0" : 0,
        }}
      >
        {hasError && (
          <span
            style={{
              ...TYPO.caption,
              color: C.error,
              fontSize: 11,
            }}
          >
            {error}
          </span>
        )}
        {maxLength && (
          <span
            style={{
              ...TYPO.caption,
              color: value.length >= maxLength ? C.error : C.outline,
              fontSize: 11,
              marginLeft: "auto",
            }}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
