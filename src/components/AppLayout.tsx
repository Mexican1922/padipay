import type { ReactNode } from "react";
import { C, BREAKPOINTS } from "../styles/tokens";
import BottomNav from "./BottomNav";

interface Props {
  children: ReactNode;
  /** Show BottomNav — defaults to true. Set false for Success/Auth pages. */
  showNav?: boolean;
  /** CSS class for entry animation — e.g. ANIM.fadeInUp */
  className?: string;
}

/**
 * AppLayout — shared page wrapper for every screen.
 *
 * Provides:
 * - Max-width 480px centered container (phone-like on tablet/desktop)
 * - Dynamic viewport height (dvh) with vh fallback
 * - Flex column layout with scrollable content area
 * - Optional BottomNav
 * - Subtle side-border glow on wider screens
 * - Noise texture background overlay
 */
export default function AppLayout({
  children,
  showNav = true,
  className = "",
}: Props) {
  return (
    <div style={outerStyle}>
      <div className={className || undefined} style={shellStyle}>
        {children}
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}

// ── Styles ──

/** Full-viewport outer container — centers the app shell */
const outerStyle: React.CSSProperties = {
  minHeight: "100vh",
  // @ts-expect-error — dvh is valid CSS but not in React's CSSProperties type
  minHeight: "100dvh",
  display: "flex",
  justifyContent: "center",
  background: C.bg,
};

/** The app shell — capped at 480px, full-height flex column */
const shellStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: BREAKPOINTS.appMax,
  minHeight: "100vh",
  // @ts-expect-error — dvh fallback
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  background: C.bg,
  position: "relative",
  // Subtle side glow on wider screens — gives the app shell depth
  boxShadow: `
    1px 0 0 ${C.outlineFaint},
    -1px 0 0 ${C.outlineFaint},
    4px 0 40px rgba(0,0,0,0.3),
    -4px 0 40px rgba(0,0,0,0.3)
  `,
};
