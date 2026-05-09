export const C = {
  // ── Surfaces (darkest → lightest) ──
  bg: "#0c0f0f",
  surface0: "#121414",
  surface0_5: "#161919",
  surface1: "#1a1c1c",
  surface2: "#1e2020",
  surface3: "#282a2b",
  surface4: "#333535",
  surfaceGlass: "rgba(26,28,28,0.85)",

  // ── Text ──
  onSurface: "#e2e2e2",
  onSurfaceDim: "#d0c5af",
  onSurfaceMuted: "#b8ad96",
  outline: "#99907c",
  outlineVar: "#4d4635",
  outlineFaint: "#3a3428",

  // ── Primary — Gold ──
  gold: "#f2ca50",
  goldMid: "#d4af37",
  goldDark: "#554300",
  goldDeep: "#3d3000",
  // Solid tinted backgrounds — no glow/opacity
  goldTint: "#1f1c14",
  goldTintStrong: "#2a2518",
  goldBorder: "rgba(242,202,80,0.2)",
  goldShadow: "rgba(212,175,55,0.15)",

  // ── Secondary — Mint ──
  mint: "#43e5b1",
  mintMid: "#01c896",
  mintDark: "#004d38",
  mintTint: "#141e1b",
  mintBorder: "rgba(67,229,177,0.18)",

  // ── Tertiary — Indigo ──
  indigo: "#818cf8",
  indigoDim: "#6366f1",
  indigoTint: "#17171f",
  indigoBorder: "rgba(129,140,248,0.15)",

  // ── Sky — Telecom accent ──
  sky: "#38bdf8",
  skyDim: "#0ea5e9",
  skyTint: "#141a1f",
  skyBorder: "rgba(56,189,248,0.15)",

  // ── States ──
  error: "#ffb4ab",
  errorBg: "#1f1716",
  errorBorder: "rgba(255,180,171,0.15)",
  errorDark: "#93000a",

  // ── Overlays ──
  scrim: "rgba(0,0,0,0.55)",

  // ── DEPRECATED aliases — kept for backward compatibility during refactor ──
  goldGlow: "#1f1c14",
  goldGlowStrong: "#2a2518",
  mintGlow: "#141e1b",
  indigoGlow: "#17171f",
  skyGlow: "#141a1f",
  mintShadow: "rgba(67,229,177,0.08)",
  skyShadow: "rgba(56,189,248,0.08)",
} as const;

// ── Typography ──
export const FONTS = {
  display: "'Sora', sans-serif",
  heading: "'Sora', sans-serif",
  body: "'Manrope', sans-serif",
};

export const TYPO = {
  h1: {
    fontFamily: FONTS.display,
    fontSize: 28,
    fontWeight: 700 as const,
    letterSpacing: -0.8,
    lineHeight: 1.15,
  },
  h2: {
    fontFamily: FONTS.display,
    fontSize: 20,
    fontWeight: 700 as const,
    letterSpacing: -0.4,
    lineHeight: 1.2,
  },
  h3: {
    fontFamily: FONTS.display,
    fontSize: 16,
    fontWeight: 600 as const,
    letterSpacing: -0.2,
    lineHeight: 1.3,
  },
  h4: {
    fontFamily: FONTS.body,
    fontSize: 14,
    fontWeight: 600 as const,
    lineHeight: 1.4,
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: 14,
    fontWeight: 400 as const,
    lineHeight: 1.5,
  },
  bodyMedium: {
    fontFamily: FONTS.body,
    fontSize: 14,
    fontWeight: 500 as const,
    lineHeight: 1.5,
  },
  caption: {
    fontFamily: FONTS.body,
    fontSize: 12,
    fontWeight: 400 as const,
    lineHeight: 1.4,
  },
  label: {
    fontFamily: FONTS.body,
    fontSize: 11,
    fontWeight: 600 as const,
    letterSpacing: "0.08em" as string,
    textTransform: "uppercase" as const,
  },
  overline: {
    fontFamily: FONTS.body,
    fontSize: 10,
    fontWeight: 600 as const,
    letterSpacing: "0.1em" as string,
    textTransform: "uppercase" as const,
  },
  display: {
    fontFamily: FONTS.display,
    fontSize: 36,
    fontWeight: 700 as const,
    letterSpacing: -1.2,
    lineHeight: 1.1,
  },
  amount: {
    fontFamily: FONTS.display,
    fontSize: 14,
    fontWeight: 700 as const,
    letterSpacing: -0.2,
  },
} as const;

export const RADIUS = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  xxl: "20px",
  pill: "100px",
  full: "9999px",
};

export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
  gutter: "20px",
  section: "20px",
};

export const SHADOWS = {
  sm: "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
  md: "0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
  lg: "0 8px 32px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)",
  // Subtle accent accents — no glowing aura, just crisp depth
  goldSubtle: "0 1px 4px rgba(212,175,55,0.06)",
  mintSubtle: "0 1px 4px rgba(67,229,177,0.06)",
  innerGlow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  nav: "0 -2px 16px rgba(0,0,0,0.3)",
  header: "0 2px 16px rgba(0,0,0,0.25)",
  cardHover: "0 6px 24px rgba(0,0,0,0.35)",

  // DEPRECATED aliases — mapped to subtle variants
  goldGlow: "0 1px 4px rgba(212,175,55,0.06)",
  goldGlowStrong: "0 2px 8px rgba(212,175,55,0.08)",
  mintGlow: "0 1px 4px rgba(67,229,177,0.06)",
  skyGlow: "0 1px 4px rgba(56,189,248,0.06)",
} as const;

export const TRANSITIONS = {
  fast: "all 0.12s ease",
  normal: "all 0.2s ease",
  smooth: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const ZINDEX = {
  base: 0,
  card: 1,
  sticky: 10,
  nav: 100,
  header: 100,
  overlay: 200,
  modal: 300,
  toast: 400,
} as const;

export const ANIM = {
  fadeInUp: "anim-fade-in-up",
  fadeIn: "anim-fade-in",
  scaleIn: "anim-scale-in",
  pressBounce: "anim-press-bounce",
} as const;

export const BREAKPOINTS = {
  appMax: 480,
  tablet: 768,
  desktop: 1024,
} as const;
