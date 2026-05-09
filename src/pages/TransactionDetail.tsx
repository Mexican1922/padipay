import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { C, TYPO, ANIM, TRANSITIONS } from "../styles/tokens";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import GoldButton from "../components/GoldButton";
import { Icon } from "../components/Icons";
import BrandLogo, { isKnownBrand } from "../components/BrandLogo";
import { useWallet } from "../context/useWallet";

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions } = useWallet();

  const tx = transactions.find((t) => t.id === id);

  if (!tx) {
    return (
      <AppLayout showNav={false} className="anim-slide-in-right">
        <PageHeader title="Transaction" back="/" />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
            gap: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: C.surface2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon.Activity size={28} color={C.outlineVar} />
          </div>
          <div style={{ ...TYPO.bodyMedium, color: C.outline }}>
            Transaction not found
          </div>
          <div style={{ width: "100%", maxWidth: 200, marginTop: 8 }}>
            <GoldButton onClick={() => navigate("/")}>Go Home</GoldButton>
          </div>
        </div>
      </AppLayout>
    );
  }

  const isCredit = tx.type === "credit";
  const accentColor = isCredit ? C.mint : C.error;
  const accentGlow = isCredit ? C.mintGlow : C.errorBg;
  const accentBorder = isCredit ? C.mintBorder : C.errorBorder;

  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(tx.amount);

  const feeFormatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(tx.fee || 0);

  const dateObj = new Date(tx.created_at);
  const dateStr = dateObj.toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = dateObj.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const txTypeLabel =
    tx.icon === "send"
      ? "Money Sent"
      : tx.icon === "receive"
        ? "Money Received"
        : tx.icon === "fund"
          ? "Wallet Funded"
          : tx.label;

  const handleShareReceipt = () => {
    const receipt = [
      `── PadiPay Receipt ──`,
      ``,
      `${txTypeLabel}`,
      `Amount: ${isCredit ? "+" : "-"}${formatted}`,
      `Status: Successful`,
      `Date: ${dateStr}, ${timeStr}`,
      `Fee: ${feeFormatted}`,
      tx.reference ? `Ref: ${tx.reference}` : "",
      tx.note ? `Note: ${tx.note}` : "",
      ``,
      `── padipay.app ──`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(receipt).then(() => {
      toast.success("Receipt copied to clipboard!");
    });
  };

  // Receipt detail rows
  const details: [string, string, string?][] = [
    ["Status", "Successful", C.mint],
    ["Type", txTypeLabel],
    ["Date", `${dateStr}`],
    ["Time", timeStr],
    ["Fee", feeFormatted],
  ];
  if (tx.reference) details.push(["Reference", tx.reference.slice(0, 20) + (tx.reference.length > 20 ? "…" : "")]);
  if (tx.note) details.push(["Note", tx.note]);

  return (
    <AppLayout showNav={false} className="anim-slide-in-right">
      <PageHeader title="Transaction Details" back={-1} />

      <div
        className="hide-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Hero amount section */}
        <div
          className={ANIM.fadeInUp}
          style={{
            textAlign: "center",
            padding: "40px 0 32px",
          }}
        >
          {/* Transaction icon */}
          {isKnownBrand(tx.label) ? (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))" }}>
              <BrandLogo brand={tx.label} size={72} />
            </div>
          ) : (
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: accentGlow,
                border: `1.5px solid ${accentBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
              }}
            >
              {tx.icon === "send" && <Icon.Send size={28} color={accentColor} />}
              {(tx.icon === "fund" || tx.icon === "receive") && (
                <Icon.ArrowDown size={28} color={accentColor} />
              )}
              {tx.icon === "airtime" && (
                <Icon.Phone size={28} color={accentColor} />
              )}
            </div>
          )}

          {/* Amount */}
          <div
            style={{
              fontFamily: TYPO.display.fontFamily,
              fontSize: 40,
              fontWeight: 700,
              color: accentColor,
              letterSpacing: -1.5,
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            {isCredit ? "+" : "-"}{formatted}
          </div>

          <div
            style={{
              ...TYPO.bodyMedium,
              color: C.outline,
            }}
          >
            {txTypeLabel}
          </div>
        </div>

        {/* Receipt card */}
        <div
          className={ANIM.fadeInUp}
          style={{
            "--delay": "80ms",
            background: C.surface1,
            border: `1px solid ${C.outlineVar}`,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 24,
          } as React.CSSProperties}
        >
          {/* Dashed tear edge */}
          <div
            style={{
              height: 0,
              borderTop: `2px dashed ${C.outlineFaint}`,
              margin: "0 16px",
            }}
          />

          <div style={{ padding: "8px 20px 20px" }}>
            {details.map(([label, value, color], i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 0",
                  borderBottom:
                    i < details.length - 1
                      ? `0.5px dashed ${C.outlineFaint}`
                      : "none",
                }}
              >
                <span
                  style={{
                    ...TYPO.bodyMedium,
                    color: C.outline,
                    fontSize: 13,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    ...TYPO.bodyMedium,
                    fontWeight: 600,
                    color: (color as string) || C.onSurface,
                    fontSize: 13,
                    textAlign: "right",
                    maxWidth: "55%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    ...(label === "Status"
                      ? {}
                      : {}),
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Dashed tear edge bottom */}
          <div
            style={{
              height: 0,
              borderTop: `2px dashed ${C.outlineFaint}`,
              margin: "0 16px",
            }}
          />
        </div>

        {/* Actions */}
        <div
          className={ANIM.fadeInUp}
          style={{ "--delay": "160ms", flex: 1 } as React.CSSProperties}
        />

        <div
          className={ANIM.fadeInUp}
          style={{
            "--delay": "200ms",
            paddingBottom: 32,
          } as React.CSSProperties}
        >
          {/* Share Receipt */}
          <button
            onClick={handleShareReceipt}
            className="focus-ring anim-press-bounce"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              background: C.surface2,
              border: `1px solid ${C.outlineVar}`,
              color: C.onSurfaceDim,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: TYPO.bodyMedium.fontFamily,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 12,
              transition: TRANSITIONS.fast,
            }}
          >
            <Icon.Copy size={16} color={C.onSurfaceDim} />
            Share Receipt
          </button>

          <GoldButton onClick={() => navigate(-1)}>Done</GoldButton>
        </div>
      </div>
    </AppLayout>
  );
}
