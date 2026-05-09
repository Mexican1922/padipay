import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { C, TYPO, ANIM, TRANSITIONS } from "../styles/tokens";
import AppLayout from "../components/AppLayout";
import GoldButton from "../components/GoldButton";
import { Icon } from "../components/Icons";

export default function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    amount = 0,
    label = "Transaction",
    type = "debit",
    reference = "",
    recipient = "",
    date = new Date().toISOString(),
  } = state || {};

  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);

  const formattedDate = new Date(date).toLocaleDateString("en-NG", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopyRef = () => {
    if (reference) {
      navigator.clipboard.writeText(reference);
      toast.success("Reference copied!");
    }
  };

  const handleShare = async () => {
    const text = `PadiPay Transaction\n${label}\nAmount: ${formatted}\nRef: ${reference}\nDate: ${formattedDate}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "PadiPay Receipt", text });
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Receipt copied to clipboard!");
    }
  };

  return (
    <AppLayout showNav={false}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        {/* Checkmark */}
        <div
          className={ANIM.scaleIn}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: C.mintGlow,
            border: `1px solid ${C.mintBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <svg
            width={36}
            height={36}
            viewBox="0 0 24 24"
            fill="none"
            stroke={C.mint}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" className="anim-check-draw" />
          </svg>
        </div>

        {/* Success text */}
        <h1
          className={ANIM.fadeInUp}
          style={{ ...TYPO.h1, color: C.onSurface, margin: 0, textAlign: "center" }}
        >
          Transaction Complete
        </h1>
        <p
          className={ANIM.fadeInUp}
          style={{
            "--delay": "60ms",
            ...TYPO.bodyMedium,
            color: C.outline,
            margin: "8px 0 0",
            textAlign: "center",
          } as React.CSSProperties}
        >
          Your payment was processed successfully
        </p>

        {/* Amount */}
        <div
          className={ANIM.fadeInUp}
          style={{
            "--delay": "120ms",
            ...TYPO.display,
            fontSize: 32,
            color: type === "credit" ? C.mint : C.onSurface,
            margin: "24px 0 28px",
          } as React.CSSProperties}
        >
          {type === "credit" ? "+" : "-"}{formatted}
        </div>

        {/* Receipt card */}
        <div
          className={ANIM.fadeInUp}
          style={{
            "--delay": "180ms",
            width: "100%",
            background: C.surface1,
            border: `1px solid ${C.outlineVar}`,
            borderRadius: 16,
            padding: "16px 20px",
          } as React.CSSProperties}
        >
          {[
            { key: "To", value: recipient || label },
            { key: "Type", value: label },
            { key: "Date", value: formattedDate },
            { key: "Reference", value: reference || "—" },
          ].map(({ key, value }, i, arr) => (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: i < arr.length - 1 ? `1px solid ${C.outlineFaint}` : "none",
              }}
            >
              <span style={{ ...TYPO.caption, color: C.outline }}>{key}</span>
              <span
                style={{
                  ...TYPO.bodyMedium,
                  color: C.onSurface,
                  fontSize: 13,
                  maxWidth: "60%",
                  textAlign: "right",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {value}
              </span>
            </div>
          ))}

          {reference && (
            <button
              onClick={handleCopyRef}
              className="focus-ring"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                width: "100%",
                padding: "10px",
                marginTop: 12,
                background: C.surface2,
                border: `1px solid ${C.outlineVar}`,
                borderRadius: 10,
                ...TYPO.caption,
                color: C.gold,
                fontWeight: 600,
                cursor: "pointer",
                transition: TRANSITIONS.fast,
              }}
            >
              <Icon.Copy size={14} color={C.gold} />
              Copy Reference
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div
          className={ANIM.fadeInUp}
          style={{
            "--delay": "240ms",
            width: "100%",
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          } as React.CSSProperties}
        >
          <GoldButton variant="outline" onClick={handleShare}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon.Share size={16} color={C.mint} />
              Share Receipt
            </span>
          </GoldButton>
          <GoldButton onClick={() => navigate("/")}>
            Back to Home
          </GoldButton>
        </div>
      </div>
    </AppLayout>
  );
}
