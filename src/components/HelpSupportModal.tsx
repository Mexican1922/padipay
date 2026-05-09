import { useState } from "react";
import { C, TYPO, ZINDEX, TRANSITIONS } from "../styles/tokens";
import { Icon } from "./Icons";

interface Props {
  open: boolean;
  onClose: () => void;
}

const FAQS = [
  {
    q: "How do I reset my PIN?",
    a: "You can reset your PIN anytime from the 'Security & PIN' setting in your Profile. You will need to enter a new 4-digit PIN."
  },
  {
    q: "What are the transaction limits?",
    a: "Standard accounts have a daily transaction limit of ₦500,000. To increase this limit, please contact support."
  },
  {
    q: "Why did my transaction fail?",
    a: "Transactions can fail due to insufficient funds, network timeout, or incorrect recipient details. Your funds are automatically reversed if a failure occurs."
  },
  {
    q: "How long do withdrawals take?",
    a: "Withdrawals to local bank accounts are processed instantly but may take up to 5 minutes to reflect depending on the destination bank's network."
  }
];

export default function HelpSupportModal({ open, onClose }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!open) return null;

  const handleSupportEmail = () => {
    window.location.href = "mailto:support@padipay.com?subject=Support Request";
  };

  return (
    <>
      <div
        className="anim-fade-in"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: C.scrim,
          backdropFilter: "blur(4px)",
          zIndex: ZINDEX.modal,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: C.bg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: "24px 24px 48px",
          zIndex: ZINDEX.modal + 1,
          animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.1)",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: C.outlineVar,
            borderRadius: 2,
            margin: "0 auto 24px",
            flexShrink: 0,
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexShrink: 0 }}>
          <h2 style={{ ...TYPO.h2, margin: 0, color: C.onSurface }}>Help & Support</h2>
          <button
            onClick={onClose}
            style={{
              background: C.surface2,
              border: "none",
              width: 32,
              height: 32,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon.X size={18} color={C.onSurface} />
          </button>
        </div>

        <div className="hide-scroll" style={{ overflowY: "auto", paddingBottom: 24 }}>
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ ...TYPO.h3, color: C.outline, marginBottom: 16 }}>Frequently Asked Questions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      background: C.surface1,
                      border: `1px solid ${isOpen ? C.goldBorder : C.outlineVar}`,
                      borderRadius: 16,
                      padding: "16px",
                      cursor: "pointer",
                      transition: TRANSITIONS.fast,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ ...TYPO.bodyMedium, fontWeight: 600, color: C.onSurface }}>{faq.q}</span>
                      <div style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: TRANSITIONS.fast }}>
                        <Icon.ChevronLeft size={16} color={C.outline} style={{ transform: "rotate(-90deg)" }} />
                      </div>
                    </div>
                    {isOpen && (
                      <div className="anim-fade-in" style={{ ...TYPO.bodyMedium, color: C.outline, marginTop: 12, lineHeight: 1.5 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              background: `linear-gradient(135deg, ${C.surface2}, ${C.surface1})`,
              borderRadius: 20,
              padding: 24,
              textAlign: "center",
              border: `1px solid ${C.outlineVar}`,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: C.goldGlow,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Icon.Send size={24} color={C.gold} />
            </div>
            <h3 style={{ ...TYPO.h3, color: C.onSurface, marginBottom: 8 }}>Still need help?</h3>
            <p style={{ ...TYPO.bodyMedium, color: C.outline, marginBottom: 20 }}>
              Our support team is available 24/7 to assist you with any issues.
            </p>
            <button
              onClick={handleSupportEmail}
              style={{
                background: C.gold,
                color: C.goldDark,
                border: "none",
                padding: "14px 24px",
                borderRadius: 100,
                ...TYPO.bodyMedium,
                fontWeight: 600,
                cursor: "pointer",
                width: "100%",
                transition: TRANSITIONS.fast,
              }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
