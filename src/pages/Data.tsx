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

const DATA_PLANS = [
  { id: "d1", name: "1GB - 1 Day", price: 350 },
  { id: "d2", name: "2GB - 2 Days", price: 500 },
  { id: "d3", name: "3GB - 7 Days", price: 1000 },
  { id: "d4", name: "10GB - 30 Days", price: 3000 },
  { id: "d5", name: "20GB - 30 Days", price: 5000 },
  { id: "d6", name: "50GB - 30 Days", price: 10000 },
];

export default function Data() {
  const navigate = useNavigate();
  const { wallet, refresh } = useWallet();
  const { user: authUser } = useAuth();

  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [selectedPlan, setSelectedPlan] = useState(DATA_PLANS[0]);

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const balanceNum = wallet?.balance ?? 0;

  const canProceed =
    phone.length >= 10 &&
    selectedPlan.price > 0 &&
    selectedPlan.price <= balanceNum;

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(selectedPlan.price);

  const handleContinue = () => {
    if (!canProceed) return;
    setPinModalOpen(true);
  };

  const handlePinSubmit = async (pin: string) => {
    if (!authUser || !wallet || !selectedPlan) return;
    setProcessing(true);

    try {
      await payBill(
        authUser.id,
        selectedPlan.price,
        "Data",
        `${network} Data - ${selectedPlan.name}`,
        phone,
        "Data Top-Up",
        pin,
        "Wifi"
      );

      setPinModalOpen(false);
      await refresh();
      toast.success("Data purchased successfully!");

      navigate("/success", {
        state: {
          amount: selectedPlan.price,
          type: "debit",
          label: "Data Top-Up",
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
      <PageHeader title="Buy Data" back="/" />

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
                      background: network === net ? C.mintGlow : C.surface1,
                      border: `1px solid ${network === net ? C.mintBorder : C.outlineVar}`,
                      color: network === net ? C.mint : C.onSurface,
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

            {/* Plan Selector */}
            <div style={{ marginTop: 24, marginBottom: 32 }}>
              <label
                style={{
                  ...TYPO.label,
                  color: C.outline,
                  marginBottom: 12,
                  display: "block",
                }}
              >
                Select Data Plan
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {DATA_PLANS.map((plan) => {
                  const isSelected = selectedPlan.id === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        borderRadius: 16,
                        background: isSelected ? C.mintGlow : C.surface1,
                        border: `1px solid ${isSelected ? C.mintBorder : C.outlineVar}`,
                        cursor: "pointer",
                        transition: TRANSITIONS.fast,
                      }}
                    >
                      <span
                        style={{
                          ...TYPO.bodyMedium,
                          fontWeight: 600,
                          color: isSelected ? C.mint : C.onSurface,
                        }}
                      >
                        {plan.name}
                      </span>
                      <span
                        style={{
                          ...TYPO.bodyMedium,
                          fontWeight: 700,
                          color: isSelected ? C.mint : C.onSurfaceDim,
                        }}
                      >
                        ₦{plan.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ paddingBottom: 24 }}>
            <GoldButton onClick={handleContinue} disabled={!canProceed}>
              Pay {formattedAmount}
            </GoldButton>
          </div>
        </div>
      </div>

      <PinModal
        open={pinModalOpen}
        onSubmit={handlePinSubmit}
        onClose={() => setPinModalOpen(false)}
        loading={processing}
        title="Confirm Data Purchase"
        subtitle={`Enter your PIN to buy ${selectedPlan?.name} for ${formattedAmount}`}
      />
    </AppLayout>
  );
}
