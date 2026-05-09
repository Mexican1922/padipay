import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { C, TYPO, ANIM } from "../styles/tokens";
import AppLayout from "../components/AppLayout";
import AppInput from "../components/AppInput";
import GoldButton from "../components/GoldButton";
import { Icon } from "../components/Icons";
import { loginUser } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim() !== "" && password.length >= 6;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await loginUser(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout showNav={false}>
      <div
        className="hide-scroll"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "0 24px",
          overflowY: "auto",
        }}
      >
        {/* Logo area */}
        <div
          className={ANIM.fadeInUp}
          style={{
            paddingTop: 80,
            paddingBottom: 48,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: C.surface2,
              border: `1px solid ${C.outlineVar}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 28,
            }}
          >
            <Icon.Wallet size={28} color={C.gold} />
          </div>
          <h1 style={{ ...TYPO.h1, color: C.onSurface, margin: 0, textAlign: "center" }}>
            Welcome back
          </h1>
          <p style={{ ...TYPO.bodyMedium, color: C.outline, margin: "8px 0 0", textAlign: "center" }}>
            Sign in to your PadiPay wallet
          </p>
        </div>

        {/* Form */}
        <div className={ANIM.fadeInUp} style={{ "--delay": "80ms" } as React.CSSProperties}>
          <AppInput label="Email address" placeholder="you@example.com" type="email" value={email} onChange={setEmail} />
          <AppInput label="Password" placeholder="Enter password" type="password" value={password} onChange={setPassword} />
        </div>

        {/* Forgot password */}
        <div style={{ textAlign: "right", marginTop: -8, marginBottom: 28 }}>
          <button
            className="focus-ring"
            style={{ ...TYPO.caption, color: C.gold, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <div className={ANIM.fadeInUp} style={{ "--delay": "160ms" } as React.CSSProperties}>
          <GoldButton onClick={handleLogin} disabled={!canSubmit} loading={loading}>
            Sign In
          </GoldButton>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "32px 0" }}>
          <div style={{ flex: 1, height: "1px", background: C.outlineVar }} />
          <span style={{ ...TYPO.caption, color: C.outline }}>or</span>
          <div style={{ flex: 1, height: "1px", background: C.outlineVar }} />
        </div>

        {/* Register link */}
        <div style={{ textAlign: "center", paddingBottom: 48 }}>
          <span style={{ ...TYPO.bodyMedium, color: C.outline }}>New to PadiPay? </span>
          <button
            onClick={() => navigate("/register")}
            className="focus-ring"
            style={{ ...TYPO.bodyMedium, color: C.gold, fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Create account
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
