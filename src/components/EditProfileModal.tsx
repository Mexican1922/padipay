import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { C, TYPO, ZINDEX, TRANSITIONS } from "../styles/tokens";
import { Icon } from "./Icons";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/useAuth";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ open, onClose }: Props) {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && open) {
      setFullName(user.full_name || "");
      setUsername(user.username || "");
    }
  }, [user, open]);

  if (!open) return null;

  const handleSave = async () => {
    if (!user) return;
    if (!fullName.trim() || !username.trim()) {
      toast.error("Name and Username cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          username: username.trim().toLowerCase(),
        })
        .eq("id", user.id);

      if (error) throw error;
      
      await refreshUser();
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="anim-fade-in"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: C.scrim,
          backdropFilter: "blur(4px)",
          zIndex: ZINDEX.modal,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: C.bg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: "24px 24px 48px",
          zIndex: ZINDEX.modal + 1,
          animation: "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: C.outlineVar,
            borderRadius: 2,
            margin: "0 auto 24px",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ ...TYPO.h2, margin: 0, color: C.onSurface }}>Edit Profile</h2>
          <button
            onClick={onClose}
            style={{
              background: C.surface2,
              border: "none",
              width: 32,
              height: 32,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon.X size={18} color={C.onSurface} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ ...TYPO.label, color: C.outline, display: "block", marginBottom: 8 }}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 16,
                border: `1px solid ${C.outlineVar}`,
                background: C.surface1,
                color: C.onSurface,
                ...TYPO.bodyMedium,
                outline: "none",
                transition: TRANSITIONS.fast,
              }}
              onFocus={(e) => (e.target.style.border = `1px solid ${C.gold}`)}
              onBlur={(e) => (e.target.style.border = `1px solid ${C.outlineVar}`)}
            />
          </div>

          <div>
            <label style={{ ...TYPO.label, color: C.outline, display: "block", marginBottom: 8 }}>Username</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 16, top: 16, color: C.outline, ...TYPO.bodyMedium }}>@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                style={{
                  width: "100%",
                  padding: "16px 16px 16px 36px",
                  borderRadius: 16,
                  border: `1px solid ${C.outlineVar}`,
                  background: C.surface1,
                  color: C.onSurface,
                  ...TYPO.bodyMedium,
                  outline: "none",
                  transition: TRANSITIONS.fast,
                }}
                onFocus={(e) => (e.target.style.border = `1px solid ${C.gold}`)}
                onBlur={(e) => (e.target.style.border = `1px solid ${C.outlineVar}`)}
              />
            </div>
            <p style={{ ...TYPO.caption, color: C.outline, marginTop: 8 }}>Only letters, numbers, and underscores allowed.</p>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              marginTop: 16,
              background: loading ? C.surface2 : C.gold,
              color: loading ? C.outline : C.goldDark,
              border: "none",
              padding: "18px",
              borderRadius: 16,
              ...TYPO.h3,
              cursor: loading ? "not-allowed" : "pointer",
              transition: TRANSITIONS.fast,
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
