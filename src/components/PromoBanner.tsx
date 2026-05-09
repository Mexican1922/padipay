import { useState, useEffect, useCallback } from "react";
import { C, TYPO, TRANSITIONS, ANIM } from "../styles/tokens";
import { Icon } from "./Icons";

interface PromoCard {
  title: string;
  subtitle: string;
  accentColor: string;
  borderColor: string;
  icon: keyof typeof Icon;
}

const PROMOS: PromoCard[] = [
  {
    title: "Refer & Earn ₦500",
    subtitle: "Share your referral code with friends and earn rewards",
    accentColor: C.gold,
    borderColor: C.goldBorder,
    icon: "Gift",
  },
  {
    title: "Complete Your KYC",
    subtitle: "Verify your identity to unlock higher transaction limits",
    accentColor: C.mint,
    borderColor: C.mintBorder,
    icon: "Shield",
  },
  {
    title: "Save & Earn Interest",
    subtitle: "Coming soon — Earn up to 15% on your savings",
    accentColor: C.indigo,
    borderColor: C.indigoBorder,
    icon: "TrendingUp",
  },
];

export default function PromoBanner() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % PROMOS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, paused]);

  const promo = PROMOS[activeIdx];
  const IconComponent = Icon[promo.icon];

  return (
    <div
      className={ANIM.fadeInUp}
      style={{ "--delay": "100ms", margin: "16px 20px 0" } as React.CSSProperties}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div
        style={{
          background: C.surface1,
          border: `1px solid ${promo.borderColor}`,
          borderRadius: 14,
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          cursor: "pointer",
          transition: TRANSITIONS.normal,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: C.surface2,
            border: `1px solid ${C.outlineVar}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconComponent size={18} color={promo.accentColor} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...TYPO.bodyMedium, fontWeight: 600, color: C.onSurface, fontSize: 13, marginBottom: 2 }}>
            {promo.title}
          </div>
          <div
            style={{
              ...TYPO.caption,
              color: C.outline,
              fontSize: 11,
              lineHeight: 1.4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {promo.subtitle}
          </div>
        </div>

        <Icon.ChevronRight size={16} color={C.outlineVar} />
      </div>

      {/* Dot pagination */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
        {PROMOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            aria-label={`Promo ${i + 1}`}
            style={{
              width: i === activeIdx ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: i === activeIdx ? C.gold : C.surface3,
              border: "none",
              cursor: "pointer",
              transition: TRANSITIONS.normal,
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
