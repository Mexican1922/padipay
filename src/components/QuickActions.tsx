import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C, FONTS, TRANSITIONS, ANIM } from "../styles/tokens";
import { Icon } from "./Icons";

const ACTIONS = [
  {
    label: "Send",
    bg: C.goldGlow,
    border: C.goldBorder,
    icon: "Send" as const,
    iconColor: C.gold,
    path: "/send",
  },
  {
    label: "Add Money",
    bg: C.mintGlow,
    border: C.mintBorder,
    icon: "AddCircle" as const,
    iconColor: C.mint,
    path: "/add-money",
  },
  {
    label: "History",
    bg: C.indigoGlow,
    border: C.indigoBorder,
    icon: "Activity" as const,
    iconColor: C.indigo,
    path: "/activity",
  },
  {
    label: "More",
    bg: C.surface2,
    border: C.outlineVar,
    icon: "MoreDots" as const,
    iconColor: C.outline,
    path: null as string | null,
  },
];

const MORE_ACTIONS = [
  {
    label: "Airtime",
    bg: C.skyGlow,
    border: C.skyBorder,
    icon: "Phone" as const,
    iconColor: C.sky,
    path: "/airtime",
  },
  {
    label: "Data",
    bg: C.mintGlow,
    border: C.mintBorder,
    icon: "Wifi" as const,
    iconColor: C.mint,
    path: "/data",
  },
  {
    label: "Bills",
    bg: C.indigoGlow,
    border: C.indigoBorder,
    icon: "FileText" as const,
    iconColor: C.indigo,
    path: "/bills",
  },
  {
    label: "Betting",
    bg: C.goldGlow,
    border: C.goldBorder,
    icon: "Gamepad" as const,
    iconColor: C.gold,
    path: "/betting",
  },
];

const ICON_MAP = {
  Send: Icon.Send,
  AddCircle: Icon.AddCircle,
  Activity: Icon.Activity,
  MoreDots: Icon.MoreDots,
  Phone: Icon.Phone,
  Wifi: Icon.Wifi,
  FileText: Icon.FileText,
  Gamepad: Icon.Gamepad,
} as const;

export default function QuickActions() {
  const navigate = useNavigate();
  const [pressedIdx, setPressedIdx] = useState<number | null>(null);
  const [showMore, setShowMore] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showMore) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMore]);

  const handleAction = (path: string | null) => {
    if (path) {
      navigate(path);
    } else {
      setShowMore(true);
    }
  };

  const handleMoreAction = (path: string) => {
    setShowMore(false);
    navigate(path);
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          padding: "20px 20px 0",
        }}
      >
        {ACTIONS.map(({ label, bg, border, icon, iconColor, path }, i) => {
          const IconComponent = ICON_MAP[icon];
          const isPressed = pressedIdx === i;

          return (
            <button
              key={label}
              className={ANIM.fadeInUp}
              style={{
                "--delay": `${i * 60}ms`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: 0,
              } as React.CSSProperties}
              onClick={() => handleAction(path)}
              onPointerDown={() => setPressedIdx(i)}
              onPointerUp={() => setPressedIdx(null)}
              onPointerLeave={() => setPressedIdx(null)}
              aria-label={label}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: bg,
                  border: `1px solid ${border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: isPressed ? "scale(0.92)" : "scale(1)",
                  transition: TRANSITIONS.smooth,
                  boxShadow: isPressed ? "none" : `0 2px 8px rgba(0,0,0,0.15)`,
                }}
              >
                <IconComponent size={22} color={iconColor} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: C.onSurfaceMuted,
                  fontWeight: 600,
                  fontFamily: FONTS.body,
                  letterSpacing: "0.02em",
                  textAlign: "center",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* More Modal */}
      {showMore && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setShowMore(false)}
          />

          {/* Bottom Sheet */}
          <div
            style={{
              background: C.bg,
              padding: "24px 20px 40px",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              position: "relative",
              animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              borderTop: `1px solid ${C.outlineVar}`,
            }}
          >
            {/* Handle bar */}
            <div
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                background: C.outline,
                margin: "0 auto 24px",
              }}
            />

            <h3
              style={{
                color: C.onSurface,
                fontSize: 18,
                fontWeight: 600,
                fontFamily: FONTS.heading,
                marginBottom: 24,
              }}
            >
              More Services
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "24px 8px",
              }}
            >
              {MORE_ACTIONS.map(({ label, bg, border, icon, iconColor, path }) => {
                const IconComponent = ICON_MAP[icon];

                return (
                  <button
                    key={label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                    onClick={() => handleMoreAction(path)}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: bg,
                        border: `1px solid ${border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
                      }}
                    >
                      <IconComponent size={22} color={iconColor} />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: C.onSurfaceMuted,
                        fontWeight: 600,
                        fontFamily: FONTS.body,
                        letterSpacing: "0.02em",
                        textAlign: "center",
                      }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
