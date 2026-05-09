import { C, TYPO, ZINDEX } from "../styles/tokens";

interface Props {
  text?: string;
  fullScreen?: boolean;
}

export default function LogoLoader({ text = "PADIPAY", fullScreen = true }: Props) {
  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <div
        className="anim-pulse-opacity"
        style={{
          width: 80,
          height: 80,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1A1F1F" />
              <stop offset="100%" stop-color="#0C0F0F" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F2CA50" />
              <stop offset="100%" stop-color="#D4AF37" />
            </linearGradient>
            <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#43E5B1" />
              <stop offset="100%" stop-color="#01C896" />
            </linearGradient>
            <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.4" />
              <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0" />
            </linearGradient>
            
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.6"/>
            </filter>
          </defs>
          
          <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
          <rect width="510" height="510" x="1" y="1" rx="111" fill="none" stroke="#2A3030" stroke-width="2" />

          <g filter="url(#shadow)">
            <circle cx="248" cy="240" r="40" fill="url(#mintGrad)" />
            <circle cx="248" cy="240" r="40" fill="url(#goldShine)" />
            
            <path d="M176 152 h72 a 88 88 0 0 1 0 176 h-72" fill="none" stroke="url(#goldGrad)" stroke-width="32" stroke-linecap="round" />
            <path d="M176 152 h72 a 88 88 0 0 1 0 176 h-72" fill="none" stroke="url(#goldShine)" stroke-width="32" stroke-linecap="round" />
            
            <rect x="160" y="136" width="32" height="240" rx="16" fill="url(#goldGrad)" />
            <rect x="160" y="136" width="32" height="240" rx="16" fill="url(#goldShine)" />
          </g>
        </svg>
      </div>
      <div
        className="anim-fade-in-up"
        style={{
          ...TYPO.bodyMedium,
          color: C.gold,
          letterSpacing: "0.2em",
          fontWeight: 700,
          fontSize: 14,
          textTransform: "uppercase"
        }}
      >
        {text}
      </div>
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: C.bg,
        zIndex: ZINDEX.modal + 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {content}
    </div>
  );
}
