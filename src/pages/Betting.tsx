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

const PLATFORMS = ["Bet9ja", "SportyBet", "1xBet", "BetKing"];
const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

export default function Betting() {
  const navigate = useNavigate();
  const { wallet, refresh } = useWallet();
  const { user: authUser } = useAuth();

  const [userId, setUserId] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [amount, setAmount] = useState("");

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const numAmount = Number(amount) || 0;
  const balanceNum = wallet?.balance ?? 0;

  const canProceed =
    userId.length >= 4 &&
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
        "Betting",
        platform,
        userId,
        "Wallet Funding",
        pin,
        "Gamepad"
      );

      setPinModalOpen(false);
      await refresh();
      toast.success("Account funded successfully!");

      navigate("/success", {
        state: {
          amount: numAmount,
          type: "debit",
          label: "Wallet Funding",
          recipient: `${platform} (ID: ${userId})`,
          date: new Date().toISOString(),
        },
      });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Funding failed. Please check your PIN and balance."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout showNav={false} className="anim-slide-in-right">
      <PageHeader title="Fund Betting Wallet" back="/" />

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
            {/* Platform Selector */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  ...TYPO.label,
                  color: C.outline,
                  marginBottom: 12,
                  display: "block",
                }}
              >
                Select Platform
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {PLATFORMS.map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setPlatform(plat)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 16,
                      background: platform === plat ? C.goldGlow : C.surface1,
                      border: `1px solid ${platform === plat ? C.goldBorder : C.outlineVar}`,
                      color: platform === plat ? C.gold : C.onSurface,
                      ...TYPO.bodyMedium,
                      fontWeight: platform === plat ? 700 : 500,
                      cursor: "pointer",
                      transition: TRANSITIONS.fast,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <BrandLogo brand={plat} size={32} />
                    {plat}
                  </button>
                ))}
              </div>
            </div>

            <AppInput
              label="User ID"
              placeholder="e.g. 1234567"
              value={userId}
              onChange={setUserId}
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
                  color: C.gold,
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
                      background: isSelected ? C.goldGlow : C.surface2,
                      border: `1px solid ${isSelected ? C.goldBorder : C.outlineVar}`,
                      borderRadius: 14,
                      padding: "16px 8px",
                      textAlign: "center",
                      ...TYPO.bodyMedium,
                      cursor: "pointer",
                      color: isSelected ? C.gold : C.onSurfaceDim,
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
              Fund Account
            </GoldButton>
          </div>
        </div>
      </div>

      <PinModal
        open={pinModalOpen}
        onSubmit={handlePinSubmit}
        onClose={() => setPinModalOpen(false)}
        loading={processing}
        title="Confirm Funding"
        subtitle={`Enter your PIN to fund ${formattedAmount} to your ${platform} account (ID: ${userId})`}
      />
    </AppLayout>
  );
}
