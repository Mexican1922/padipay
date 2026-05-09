import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { C, TYPO, ANIM } from "../styles/tokens";
import AppLayout from "../components/AppLayout";
import PageHeader from "../components/PageHeader";
import AppInput from "../components/AppInput";
import GoldButton from "../components/GoldButton";
import PinModal from "../components/PinModal";
import { useWallet } from "../context/useWallet";
import { useAuth } from "../context/useAuth";
import { resolveRecipient, sendMoney } from "../services/wallet";
import type { User } from "../types";

export default function Send() {
  const navigate = useNavigate();
  const { wallet, refresh } = useWallet();
  const { user: authUser } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [recipientTag, setRecipientTag] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [resolving, setResolving] = useState(false);
  const [resolvedUser, setResolvedUser] = useState<User | null>(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);

  const balanceNum = wallet?.balance ?? 0;
  const balance = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(balanceNum);

  const canProceed =
    recipientTag.trim() !== "" &&
    Number(amount) > 0 &&
    Number(amount) <= balanceNum;

  const handleContinue = async () => {
    if (!canProceed) return;
    setResolving(true);

    try {
      const user = await resolveRecipient(recipientTag);
      if (!user) {
        toast.error("User not found. Please check the username.");
        return;
      }
      if (user.id === authUser?.id) {
        toast.error("You cannot send money to yourself.");
        return;
      }
      setResolvedUser(user);
      setStep(2);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to resolve user.",
      );
    } finally {
      setResolving(false);
    }
  };

  // Step 2: User clicks "Confirm & Send" — open PIN modal
  const handleConfirmClick = () => {
    setPinModalOpen(true);
  };

  // Step 3: User enters PIN — verify then send
  const handlePinSubmit = async (pin: string) => {
    setPinLoading(true);
    if (!resolvedUser || !authUser || !wallet) return;

    try {
      // Secure Backend Call: transfer_funds now verifies the PIN internally
      await sendMoney(authUser.id, resolvedUser.id, Number(amount), note, pin);

      setPinModalOpen(false);

      // Refresh wallet after sending
      await refresh();
      toast.success("Transfer successful!");

      // Navigate to success and pass transaction details
      navigate("/success", {
        state: {
          amount: Number(amount),
          type: "debit",
          label: "Transfer",
          recipient: resolvedUser.full_name,
          date: new Date().toISOString(),
        },
      });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Transfer failed. Please check your PIN and balance.",
      );
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <AppLayout showNav={false} className="anim-slide-in-right">
      <PageHeader
        title={step === 1 ? "Send Money" : "Review Transfer"}
        back={step === 1 ? "/" : undefined}
      />

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
        {step === 1 && (
          <div
            className={ANIM.fadeInUp}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <div style={{ flex: 1 }}>
              <AppInput
                label="Recipient username"
                placeholder="@username"
                value={recipientTag}
                onChange={(val) => {
                  setRecipientTag(val);
                }}
              />

              <div
                style={{
                  textAlign: "center",
                  padding: "32px 0 16px",
                  margin: "16px 0",
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
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
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
                <div
                  style={{
                    ...TYPO.caption,
                    color:
                      Number(amount) > balanceNum ? C.error : C.onSurfaceDim,
                    marginTop: 8,
                    background: C.surface2,
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: 100,
                  }}
                >
                  Available: {balance}
                </div>
              </div>

              <AppInput
                label="Note (optional)"
                placeholder="What's this for?"
                value={note}
                onChange={setNote}
              />
            </div>

            <div style={{ paddingBottom: 24, paddingTop: 16 }}>
              <GoldButton
                onClick={handleContinue}
                disabled={!canProceed || resolving}
              >
                {resolving ? "Looking up user..." : "Continue"}
              </GoldButton>
            </div>
          </div>
        )}

        {step === 2 && resolvedUser && (
          <div
            className={ANIM.fadeInUp}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  background: C.surface1,
                  border: `1px solid ${C.goldBorder}`,
                  borderRadius: 24,
                  padding: 24,
                  marginBottom: 24,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div
                    style={{
                      ...TYPO.bodyMedium,
                      color: C.outline,
                      marginBottom: 8,
                    }}
                  >
                    Sending
                  </div>
                  <div
                    style={{
                      ...TYPO.display,
                      color: C.gold,
                    }}
                  >
                    {formattedAmount}
                  </div>
                  <div
                    style={{
                      ...TYPO.bodyMedium,
                      color: C.onSurface,
                      marginTop: 8,
                    }}
                  >
                    to{" "}
                    <span style={{ fontWeight: 700 }}>
                      {resolvedUser.full_name}
                    </span>{" "}
                    (@{resolvedUser.username})
                  </div>
                </div>

                <div
                  style={{
                    height: "1px",
                    background: `linear-gradient(90deg, transparent, ${C.outlineVar}, transparent)`,
                    margin: "20px 0",
                  }}
                />

                {[
                  ["Recipient", resolvedUser.full_name],
                  ["Amount", formattedAmount],
                  ["Fee", "₦0.00"],
                  ["Note", note || "—"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ ...TYPO.bodyMedium, color: C.outline }}>
                      {k}
                    </span>
                    <span
                      style={{
                        ...TYPO.bodyMedium,
                        color: C.onSurface,
                        fontWeight: k === "Amount" ? 700 : 500,
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ paddingBottom: 24 }}>
              <GoldButton onClick={handleConfirmClick} disabled={pinLoading}>
                {pinLoading ? "Sending..." : "Confirm & Send"}
              </GoldButton>

              <div style={{ marginTop: 12 }}>
                <GoldButton
                  variant="ghost"
                  onClick={() => setStep(1)}
                  disabled={pinLoading}
                >
                  Edit Details
                </GoldButton>
              </div>
            </div>
          </div>
        )}
      </div>

      <PinModal
        open={pinModalOpen}
        onSubmit={handlePinSubmit}
        onClose={() => setPinModalOpen(false)}
        loading={pinLoading}
        title="Confirm Transfer"
        subtitle={`Enter your PIN to send ${formattedAmount}`}
      />
    </AppLayout>
  );
}
