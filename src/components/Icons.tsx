/* eslint-disable react-refresh/only-export-components */
/**
 * PadiPay Icon Library
 *
 * Centralized SVG icons — eliminates duplication across components.
 * Every icon accepts `size`, `color`, and `strokeWidth` for consistency.
 *
 * Usage:
 *   import { Icon } from "../components/Icons";
 *   <Icon.Send color={C.gold} />
 *   <Icon.Send size={18} color={C.gold} strokeWidth={2} />
 */

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

const defaults = {
  size: 22,
  color: "currentColor",
  strokeWidth: 1.8,
};

function svg(
  props: IconProps,
  children: React.ReactNode,
  overrides?: { strokeWidth?: number },
) {
  const {
    size = defaults.size,
    color = defaults.color,
    strokeWidth = overrides?.strokeWidth ?? defaults.strokeWidth,
    className,
    style,
  } = props;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// ── Navigation Icons ──

function Home(props: IconProps) {
  return svg(props, (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </>
  ));
}

function Activity(props: IconProps) {
  return svg(props, (
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  ));
}

function Send(props: IconProps) {
  return svg(props, (
    <>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </>
  ));
}

function User(props: IconProps) {
  return svg(props, (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ));
}

// ── Action Icons ──

function AddCircle(props: IconProps) {
  return svg(props, (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </>
  ));
}

function MoreDots(props: IconProps) {
  return svg(props, (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ));
}

// ── Transaction Icons ──

function ArrowDown(props: IconProps) {
  return svg(props, (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </>
  ), { strokeWidth: 2 });
}

function Phone(props: IconProps) {
  const {
    size = defaults.size,
    color = defaults.color,
    className,
    style,
  } = props;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={3} />
    </svg>
  );
}

// ── UI Icons ──

function ChevronLeft(props: IconProps) {
  return svg(props, (
    <polyline points="15 18 9 12 15 6" />
  ), { strokeWidth: 2.2 });
}

function ChevronRight(props: IconProps) {
  return svg(props, (
    <polyline points="9 18 15 12 9 6" />
  ), { strokeWidth: 2 });
}

function Check(props: IconProps) {
  return svg(props, (
    <polyline points="20 6 9 17 4 12" />
  ), { strokeWidth: 2.5 });
}

function EyeOpen(props: IconProps) {
  return svg(props, (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ), { strokeWidth: 2 });
}

function EyeClosed(props: IconProps) {
  return svg(props, (
    <>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </>
  ), { strokeWidth: 2 });
}

function Bell(props: IconProps) {
  return svg(props, (
    <>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>
  ));
}

function Shield(props: IconProps) {
  return svg(props, (
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  ));
}

function Settings(props: IconProps) {
  return svg(props, (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ));
}

function Lock(props: IconProps) {
  return svg(props, (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ));
}

function HelpCircle(props: IconProps) {
  return svg(props, (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ));
}

function FileText(props: IconProps) {
  return svg(props, (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </>
  ));
}

function Wifi(props: IconProps) {
  return svg(props, (
    <>
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </>
  ));
}

function Gamepad(props: IconProps) {
  return svg(props, (
    <>
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" />
      <line x1="18" y1="11" x2="18.01" y2="11" />
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
    </>
  ));
}

function LogOut(props: IconProps) {
  return svg(props, (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>
  ));
}

function Edit(props: IconProps) {
  return svg(props, (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ));
}

function Share(props: IconProps) {
  return svg(props, (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </>
  ));
}

function Wallet(props: IconProps) {
  return svg(props, (
    <>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
    </>
  ));
}

function Copy(props: IconProps) {
  return svg(props, (
    <>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ));
}

function Clock(props: IconProps) {
  return svg(props, (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ));
}

function Gift(props: IconProps) {
  return svg(props, (
    <>
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </>
  ));
}

function TrendingUp(props: IconProps) {
  return svg(props, (
    <>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </>
  ), { strokeWidth: 2 });
}

function X(props: IconProps) {
  return svg(props, (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ), { strokeWidth: 2.2 });
}

function Lightning(props: IconProps) {
  return svg(props, (
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  ));
}

// ── Export ──

export const Icon = {
  // Navigation
  Home,
  Activity,
  Send,
  User,
  // Actions
  AddCircle,
  MoreDots,
  // Transactions
  ArrowDown,
  Phone,
  // UI
  ChevronLeft,
  ChevronRight,
  Check,
  EyeOpen,
  EyeClosed,
  Bell,
  Shield,
  Settings,
  Lock,
  HelpCircle,
  LogOut,
  Edit,
  Share,
  Wallet,
  Copy,
  Clock,
  X,
  FileText,
  Wifi,
  Gamepad,
  Gift,
  TrendingUp,
  Lightning,
} as const;

export type IconName = keyof typeof Icon;
