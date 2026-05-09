import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { C, TYPO, ANIM, TRANSITIONS } from "../styles/tokens";
import AppLayout from "../components/AppLayout";
import AppInput from "../components/AppInput";
import GoldButton from "../components/GoldButton";
import { Icon } from "../components/Icons";
import { registerUser } from "../services/auth";

function getPasswordStrength(password: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
  if (password.length === 0) return { level: 0, label: "", color: C.outlineVar };
  if (password.length < 6) return { level: 1, label: "Weak", color: C.error };
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [password.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (score <= 1) return { level: 1, label: "Weak", color: C.error };
  if (score <= 2) return { level: 2, label: "Medium", color: C.gold };
  return { level: 3, label: "Strong", color: C.mint };
}

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const canSubmit =
    fullName.trim() !== "" &&
    username.trim() !== "" &&
    email.trim() !== "" &&
    password.length >= 6;

  const handleRegister = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await registerUser(email, password, fullName, username);
      toast.success("Account created!");
      navigate("/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
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
        {/* Header */}
        <div
          className={ANIM.fadeInUp}
          style={{
            paddingTop: 56,
            paddingBottom: 36,
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
            <Icon.User size={28} color={C.mint} />
          </div>
          <h1 style={{ ...TYPO.h1, color: C.onSurface, margin: 0, textAlign: "center" }}>
            Create account
          </h1>
          <p style={{ ...TYPO.bodyMedium, color: C.outline, margin: "8px 0 0", textAlign: "center" }}>
            Join thousands on PadiPay
          </p>
        </div>

        {/* Form */}
        <div className={ANIM.fadeInUp} style={{ "--delay": "60ms" } as React.CSSProperties}>
          <AppInput label="Full name" placeholder="Adebayo Ogunlesi" value={fullName} onChange={setFullName} />
          <AppInput label="Username" placeholder="yourtag" value={username} onChange={setUsername} />
          <AppInput label="Email address" placeholder="you@example.com" type="email" value={email} onChange={setEmail} />
          <AppInput label="Password" placeholder="Min. 6 characters" type="password" value={password} onChange={setPassword} />

          {/* Password strength */}
          {password.length > 0 && (
            <div style={{ marginTop: -12, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 3, borderRadius: 2, display: "flex", gap: 3 }}>
                {[1, 2, 3].map((seg) => (
                  <div
                    key={seg}
                    style={{
                      flex: 1,
                      height: "100%",
                      borderRadius: 2,
                      background: strength.level >= seg ? strength.color : C.surface3,
                      transition: TRANSITIONS.normal,
                    }}
                  />
                ))}
              </div>
              <span style={{ ...TYPO.caption, fontSize: 10, color: strength.color, fontWeight: 600 }}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        {/* Terms */}
        <p style={{ ...TYPO.caption, color: C.outline, textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>
          By creating an account, you agree to our{" "}
          <span style={{ color: C.gold, fontWeight: 600 }}>Terms of Service</span>{" "}
          and <span style={{ color: C.gold, fontWeight: 600 }}>Privacy Policy</span>
        </p>

        {/* Submit */}
        <div className={ANIM.fadeInUp} style={{ "--delay": "140ms" } as React.CSSProperties}>
          <GoldButton onClick={handleRegister} disabled={!canSubmit} loading={loading}>
            Create Account
          </GoldButton>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "28px 0" }}>
          <div style={{ flex: 1, height: "1px", background: C.outlineVar }} />
          <span style={{ ...TYPO.caption, color: C.outline }}>or</span>
          <div style={{ flex: 1, height: "1px", background: C.outlineVar }} />
        </div>

        {/* Login link */}
        <div style={{ textAlign: "center", paddingBottom: 48 }}>
          <span style={{ ...TYPO.bodyMedium, color: C.outline }}>Already have an account? </span>
          <button
            onClick={() => navigate("/login")}
            className="focus-ring"
            style={{ ...TYPO.bodyMedium, color: C.gold, fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Sign in
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
