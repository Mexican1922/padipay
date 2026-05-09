import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { C, TYPO, ANIM, TRANSITIONS } from "../styles/tokens";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import AppInput from "../components/AppInput";
import GoldButton from "../components/GoldButton";
import PinModal from "../components/PinModal";
import BrandLogo from "../components/BrandLogo";
import { useWallet } from "../context/useWallet";
import { useAuth } from "../context/useAuth";
import { payBill } from "../services/wallet";

const NETWORKS = ["MTN", "Airtel", "Glo", "9Mobile"];
const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000, 10000];

export default function Airtime() {
  const navigate = useNavigate();
  const { wallet, refresh } = useWallet();
  const { user: authUser } = useAuth();

  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [amount, setAmount] = useState("");

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const numAmount = Number(amount) || 0;
  const balanceNum = wallet?.balance ?? 0;

  const canProceed =
    phone.length >= 10 &&
    numAmount > 0 &&
    numAmount <= balanceNum;

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(numAmount);

  const handleContinue = () => {
    if (!canProceed) return;
    setPinModalOpen(true);
  };

  const handlePinSubmit = async (pin: string) => {
    if (!authUser || !wallet) return;
    setProcessing(true);

    try {
      await payBill(
        authUser.id,
        numAmount,
        "Airtime",
        `${network} Airtime`,
        phone,
        "Airtime Top-Up",
        pin,
        "Phone"
      );

      setPinModalOpen(false);
      await refresh();
      toast.success("Airtime purchased successfully!");

      navigate("/success", {
        state: {
          amount: numAmount,
          type: "debit",
          label: "Airtime Top-Up",
          recipient: `${network} - ${phone}`,
          date: new Date().toISOString(),
        },
      });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Purchase failed. Please check your PIN and balance."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout showNav={false} className="anim-slide-in-right">
      <PageHeader title="Buy Airtime" back="/" />

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
        <div
          className={ANIM.fadeInUp}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <div style={{ flex: 1 }}>
            {/* Network Selector */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  ...TYPO.label,
                  color: C.outline,
                  marginBottom: 12,
                  display: "block",
                }}
              >
                Select Network
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {NETWORKS.map((net) => (
                  <button
                    key={net}
                    onClick={() => setNetwork(net)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 16,
                      background: network === net ? C.skyGlow : C.surface1,
                      border: `1px solid ${network === net ? C.skyBorder : C.outlineVar}`,
                      color: network === net ? C.sky : C.onSurface,
                      ...TYPO.bodyMedium,
                      fontWeight: network === net ? 700 : 500,
                      cursor: "pointer",
                      transition: TRANSITIONS.fast,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <BrandLogo brand={net} size={32} />
                    {net}
                  </button>
                ))}
              </div>
            </div>

            <AppInput
              label="Phone Number"
              placeholder="08012345678"
              type="tel"
              value={phone}
              onChange={setPhone}
            />

            <div
              style={{
                textAlign: "center",
                padding: "32px 0 16px",
                margin: "24px 0 16px",
                background: C.surface1,
                borderRadius: 24,
                border: `1px solid ${C.outlineVar}`,
                boxShadow: `inset 0 2px 10px rgba(0,0,0,0.2)`,
              }}
            >
              <label
                htmlFor="amount-input"
                style={{
                  ...TYPO.label,
                  color: C.outline,
                  marginBottom: 12,
                  display: "block",
                }}
              >
                Amount (₦)
              </label>
              <input
                id="amount-input"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  fontFamily: TYPO.display.fontFamily,
                  fontSize: 48,
                  fontWeight: 700,
                  color: C.sky,
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
                      background: isSelected ? C.skyGlow : C.surface2,
                      border: `1px solid ${isSelected ? C.skyBorder : C.outlineVar}`,
                      borderRadius: 14,
                      padding: "16px 8px",
                      textAlign: "center",
                      ...TYPO.bodyMedium,
                      cursor: "pointer",
                      color: isSelected ? C.sky : C.onSurfaceDim,
                      transition: TRANSITIONS.normal,
                    }}
                  >
                    ₦{val.toLocaleString()}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ paddingBottom: 24, paddingTop: 16 }}>
            <GoldButton onClick={handleContinue} disabled={!canProceed}>
              Buy Airtime
            </GoldButton>
          </div>
        </div>
      </div>

      <PinModal
        open={pinModalOpen}
        onSubmit={handlePinSubmit}
        onClose={() => setPinModalOpen(false)}
        loading={processing}
        title="Confirm Purchase"
        subtitle={`Enter your PIN to buy ${formattedAmount} airtime for ${phone}`}
      />
    </AppLayout>
  );
}
