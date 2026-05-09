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

const CATEGORIES = ["Electricity", "TV", "Internet"];
const BILLERS: Record<string, string[]> = {
  Electricity: ["Ikeja Electric", "Eko Electric", "Abuja Electric"],
  TV: ["DSTV", "GOTV", "Startimes"],
  Internet: ["Spectranet", "Smile", "Swift"],
};

export default function Bills() {
  const navigate = useNavigate();
  const { wallet, refresh } = useWallet();
  const { user: authUser } = useAuth();

  const [category, setCategory] = useState(CATEGORIES[0]);
  const [biller, setBiller] = useState(BILLERS[CATEGORIES[0]][0]);
  const [accountNo, setAccountNo] = useState("");
  const [amount, setAmount] = useState("");

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const numAmount = Number(amount) || 0;
  const balanceNum = wallet?.balance ?? 0;

  const canProceed =
    accountNo.length >= 8 &&
    numAmount > 0 &&
    numAmount <= balanceNum;

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(numAmount);

  // Update biller when category changes
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setBiller(BILLERS[cat][0]);
  };

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
        "Bills",
        biller,
        accountNo,
        `${category} Bill Payment`,
        pin,
        "FileText"
      );

      setPinModalOpen(false);
      await refresh();
      toast.success("Bill paid successfully!");

      navigate("/success", {
        state: {
          amount: numAmount,
          type: "debit",
          label: `${category} Bill Payment`,
          recipient: biller,
          date: new Date().toISOString(),
        },
      });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Payment failed. Please check your PIN and balance."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout showNav={false} className="anim-slide-in-right">
      <PageHeader title="Pay Bills" back="/" />

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
            {/* Category Selector */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  ...TYPO.label,
                  color: C.outline,
                  marginBottom: 12,
                  display: "block",
                }}
              >
                Service Category
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    style={{
                      flex: "1 1 calc(33.333% - 12px)",
                      minWidth: "100px",
                      padding: "12px 16px",
                      textAlign: "center",
                      borderRadius: 16,
                      background: category === cat ? C.indigoGlow : C.surface1,
                      border: `1px solid ${category === cat ? C.indigoBorder : C.outlineVar}`,
                      color: category === cat ? C.indigo : C.onSurface,
                      ...TYPO.bodyMedium,
                      fontWeight: category === cat ? 700 : 500,
                      cursor: "pointer",
                      transition: TRANSITIONS.fast,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Biller Selector */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  ...TYPO.label,
                  color: C.outline,
                  marginBottom: 12,
                  display: "block",
                }}
              >
                Select Biller
              </label>
              <div
                style={{
                  background: C.surface1,
                  borderRadius: 16,
                  border: `1px solid ${C.outlineVar}`,
                  padding: "4px",
                  display: "grid",
                  gap: "4px",
                }}
              >
                {BILLERS[category].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBiller(b)}
                    style={{
                      padding: "16px",
                      borderRadius: 12,
                      background: biller === b ? C.surface2 : "transparent",
                      border: "none",
                      color: biller === b ? C.onSurface : C.onSurfaceDim,
                      textAlign: "left",
                      ...TYPO.bodyMedium,
                      fontWeight: biller === b ? 600 : 500,
                      cursor: "pointer",
                      transition: TRANSITIONS.fast,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <BrandLogo brand={b} size={40} />
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <AppInput
              label="Account / Meter Number"
              placeholder="e.g. 1234567890"
              value={accountNo}
              onChange={setAccountNo}
            />

            <div
              style={{
                textAlign: "center",
                padding: "32px 0 16px",
                margin: "24px 0 32px",
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
                  color: C.indigo,
                  border: "none",
                  background: "transparent",
                  textAlign: "center",
                  width: "100%",
                  outline: "none",
                  letterSpacing: "-1px",
                }}
              />
            </div>
          </div>

          <div style={{ paddingBottom: 24 }}>
            <GoldButton onClick={handleContinue} disabled={!canProceed}>
              Pay Bill
            </GoldButton>
          </div>
        </div>
      </div>

      <PinModal
        open={pinModalOpen}
        onSubmit={handlePinSubmit}
        onClose={() => setPinModalOpen(false)}
        loading={processing}
        title="Confirm Payment"
        subtitle={`Enter your PIN to pay ${formattedAmount} to ${biller}`}
      />
    </AppLayout>
  );
}
