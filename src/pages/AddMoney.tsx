import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { usePaystackPayment } from "react-paystack";
import { C, TYPO, ANIM, TRANSITIONS } from "../styles/tokens";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import GoldButton from "../components/GoldButton";
import { Icon } from "../components/Icons";
import { useAuth } from "../context/useAuth";
import { useWallet } from "../context/useWallet";
import { supabase } from "../services/supabase";

const QUICK_AMOUNTS = [1000, 5000, 10000, 20000, 50000];

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

function PayButton({ amount, email, onSuccess, disabled }: {
  amount: number;
  email: string;
  onSuccess: (ref: string) => void;
  disabled: boolean;
}) {
  const config = {
    reference: `PP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    email,
    amount: amount * 100, // Paystack uses kobo (1 NGN = 100 kobo)
    publicKey: PAYSTACK_KEY,
    currency: "NGN",
  };

  const initializePayment = usePaystackPayment(config);

  const handleClick = () => {
    if (!PAYSTACK_KEY) {
      toast.error("Paystack is not configured. Add VITE_PAYSTACK_PUBLIC_KEY to your .env file.");
      return;
    }
    initializePayment({
      onSuccess: (ref: any) => {
        onSuccess(ref.reference || config.reference);
      },
      onClose: () => {
        toast("Payment cancelled", { icon: "⚠️" });
      },
    });
  };

  return (
    <GoldButton onClick={handleClick} disabled={disabled}>
      Pay Now
    </GoldButton>
  );
}

export default function AddMoney() {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { refresh } = useWallet();
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const numAmount = Number(amount) || 0;
  const canPay = numAmount > 0 && !processing;

  const handlePaymentSuccess = async (reference: string) => {
    setProcessing(true);
    try {
      // Secure Backend Call: Edge Function verifies the transaction directly with Paystack
      const { data, error } = await supabase.functions.invoke("fund-wallet", {
        body: { reference },
      });

      if (error) {
        throw new Error(error.message || "Server verification failed");
      }
      if (data?.error) {
        throw new Error(data.error);
      }

      // We use the amount verified by the server, not the client
      const verifiedAmount = data.amount || numAmount;

      await refresh();
      
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
      }).format(verifiedAmount);

      toast.success(`${formatted} added to your wallet!`);
      
      navigate("/success", {
        state: {
          amount: verifiedAmount,
          type: "credit",
          label: "Added Money",
          recipient: "Your Wallet",
          date: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to verify payment. Contact support.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout showNav={false} className="anim-slide-in-right">
      <PageHeader title="Add Money" back="/" />

      <div
        className="hide-scroll"
        style={{
          flex: 1,
          padding: "24px 20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div className={ANIM.fadeInUp}>
            {/* Big amount input */}
            <div
              style={{
                textAlign: "center",
                padding: "32px 0 16px",
                margin: "0 0 24px",
                background: C.surface1,
                borderRadius: 24,
                border: `1px solid ${C.outlineVar}`,
                boxShadow: `inset 0 2px 10px rgba(0,0,0,0.2)`,
              }}
            >
              <label
                htmlFor="add-amount"
                style={{
                  ...TYPO.label,
                  color: C.outline,
                  marginBottom: 12,
                  display: "block",
                }}
              >
                How much? (₦)
              </label>
              <input
                id="add-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  fontFamily: TYPO.display.fontFamily,
                  fontSize: 48,
                  fontWeight: 700,
                  color: C.mint,
                  border: "none",
                  background: "transparent",
                  textAlign: "center",
                  width: "100%",
                  outline: "none",
                  letterSpacing: "-1px",
                }}
              />
            </div>

            {/* Quick amounts */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 32,
              }}
            >
              {QUICK_AMOUNTS.map((val) => {
                const isSelected = amount === String(val);
                return (
                  <button
                    key={val}
                    onClick={() => setAmount(String(val))}
                    className="focus-ring anim-press-bounce"
                    style={{
                      background: isSelected ? C.mintGlow : C.surface2,
                      border: `1px solid ${isSelected ? C.mintBorder : C.outlineVar}`,
                      borderRadius: 14,
                      padding: "16px 8px",
                      textAlign: "center",
                      ...TYPO.bodyMedium,
                      cursor: "pointer",
                      color: isSelected ? C.mint : C.onSurfaceDim,
                      transition: TRANSITIONS.normal,
                    }}
                  >
                    ₦{val.toLocaleString()}
                  </button>
                );
              })}
              <button
                onClick={() => setAmount("")}
                className="focus-ring anim-press-bounce"
                style={{
                  background: C.surface2,
                  border: `1px solid ${C.outlineVar}`,
                  borderRadius: 14,
                  padding: "16px 8px",
                  textAlign: "center",
                  ...TYPO.bodyMedium,
                  cursor: "pointer",
                  color: C.onSurfaceDim,
                  transition: TRANSITIONS.fast,
                }}
              >
                Other
              </button>
            </div>
          </div>

          {/* Payment method */}
          <div
            className={ANIM.fadeInUp}
            style={{
              "--delay": "80ms",
              background: C.surface1,
              border: `1px solid ${C.outlineVar}`,
              borderRadius: 16,
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            } as React.CSSProperties}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(99,102,241,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon.Wallet size={20} color={C.indigo} />
            </div>
            <div>
              <div
                style={{
                  ...TYPO.label,
                  color: C.outline,
                  marginBottom: 4,
                }}
              >
                Payment via
              </div>
              <div
                style={{
                  ...TYPO.bodyMedium,
                  color: C.onSurface,
                }}
              >
                Paystack · Card / Transfer
              </div>
            </div>
          </div>
        </div>

        {/* Bottom pinned button area */}
        <div
          className={ANIM.fadeInUp}
          style={{
            "--delay": "160ms",
            paddingTop: 24,
            paddingBottom: 24,
          } as React.CSSProperties}
        >
          {processing ? (
            <GoldButton disabled>
              Processing...
            </GoldButton>
          ) : (
            <PayButton
              amount={numAmount}
              email={authUser?.email || ""}
              onSuccess={handlePaymentSuccess}
              disabled={!canPay}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
