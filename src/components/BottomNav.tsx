import { useNavigate, useLocation } from "react-router-dom";
import { C, FONTS, TRANSITIONS, ZINDEX } from "../styles/tokens";
import { Icon } from "./Icons";

type NavIcon = "Home" | "Activity" | "Send" | "User";

const NAV_ITEMS: { label: string; path: string; icon: NavIcon }[] = [
  { label: "Home", path: "/", icon: "Home" },
  { label: "Activity", path: "/activity", icon: "Activity" },
  { label: "Send", path: "/send", icon: "Send" },
  { label: "Profile", path: "/profile", icon: "User" },
];

const ICON_MAP: Record<NavIcon, typeof Icon.Home> = {
  Home: Icon.Home,
  Activity: Icon.Activity,
  Send: Icon.Send,
  User: Icon.User,
};

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="safe-bottom"
      style={{
        background: C.surfaceGlass,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${C.outlineFaint}`,
        padding: "6px 0 10px",
        display: "flex",
        justifyContent: "space-around",
        flexShrink: 0,
        zIndex: ZINDEX.nav,
        position: "relative",
      }}
    >
      {NAV_ITEMS.map(({ label, path, icon }) => {
        const isActive = pathname === path;
        const color = isActive ? C.gold : C.outline;
        const IconComponent = ICON_MAP[icon];

        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className="focus-ring"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              padding: "6px 20px",
              background: "none",
              border: "none",
              borderRadius: 12,
              transition: TRANSITIONS.smooth,
              position: "relative",
            }}
          >
            {/* Active pill indicator behind icon */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  width: 36,
                  height: 28,
                  borderRadius: 10,
                  background: C.goldTint,
                  border: `1px solid ${C.goldBorder}`,
                  transition: TRANSITIONS.smooth,
                }}
              />
            )}

            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", height: 26 }}>
              <IconComponent
                size={isActive ? 23 : 21}
                color={color}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color,
                fontFamily: FONTS.body,
                letterSpacing: isActive ? "0.06em" : "0.04em",
                textTransform: "uppercase",
                transition: TRANSITIONS.smooth,
                position: "relative",
                zIndex: 1,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
