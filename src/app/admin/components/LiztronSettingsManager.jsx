"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Key } from "lucide-react";

const INPUT = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  background: "rgba(11,25,38,0.9)",
  border: "1px solid rgba(29,175,196,0.2)",
  color: "#E2E8F0",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Inter',sans-serif",
};
const LABEL = {
  color: "#94A3B8",
  fontSize: "0.78rem",
  fontWeight: 600,
  display: "block",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};
const BTN = {
  padding: "10px 20px",
  borderRadius: 8,
  border: "none",
  fontWeight: 700,
  fontSize: "0.85rem",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const CARD = {
  borderRadius: 16,
  background: "rgba(11,25,38,0.9)",
  border: "1px solid rgba(29,175,196,0.15)",
  padding: 28,
  marginBottom: 20,
};

export default function LiztronSettingsManager() {
  const [seoSettings, setSeoSettings] = useState({
    title: "Liztron Energies | Power in Africa, Reimagined",
    description:
      "Green Hydrogen, Green Ammonia, and Nutrient Recovery — transforming stranded renewable power into dispatchable molecular energy for industry, agriculture, and global shipping.",
    openGraphImage: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const saveSEOMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "seo", value: data }),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => toast.success("SEO settings saved!"),
    onError: () => toast.error("Failed to save SEO settings."),
  });

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: passwordForm.email,
          newPassword: passwordForm.newPassword,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setPwError(d.error || "Failed to reset password.");
        return;
      }
      setPwSuccess("Password reset successfully!");
      setPasswordForm({ email: "", newPassword: "", confirmPassword: "" });
    } catch {
      setPwError("Network error. Please try again.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 900,
            color: "#F8FAFC",
            fontFamily: "'Syne','Inter',sans-serif",
            marginBottom: 6,
          }}
        >
          Site Settings
        </h2>
        <p style={{ color: "#64748B" }}>
          Manage SEO metadata, branding, and user passwords.
        </p>
      </div>

      {/* SEO Settings */}
      <div style={CARD}>
        <h3
          style={{
            color: "#1DAFC4",
            fontWeight: 700,
            fontSize: "1rem",
            marginBottom: 20,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          SEO & Meta Settings
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={LABEL}>Site Title</label>
            <input
              value={seoSettings.title}
              onChange={(e) =>
                setSeoSettings((s) => ({ ...s, title: e.target.value }))
              }
              style={INPUT}
            />
          </div>
          <div>
            <label style={LABEL}>Meta Description</label>
            <textarea
              rows={3}
              value={seoSettings.description}
              onChange={(e) =>
                setSeoSettings((s) => ({ ...s, description: e.target.value }))
              }
              style={{ ...INPUT, resize: "vertical" }}
            />
          </div>
          <div>
            <label style={LABEL}>Open Graph Image URL</label>
            <input
              value={seoSettings.openGraphImage}
              onChange={(e) =>
                setSeoSettings((s) => ({
                  ...s,
                  openGraphImage: e.target.value,
                }))
              }
              style={INPUT}
              placeholder="https://..."
            />
          </div>
        </div>
        <button
          onClick={() => saveSEOMut.mutate(seoSettings)}
          disabled={saveSEOMut.isPending}
          style={{
            ...BTN,
            background: "linear-gradient(135deg, #1DAFC4, #3DBF3A)",
            color: "#fff",
            marginTop: 20,
          }}
        >
          <Save size={14} />{" "}
          {saveSEOMut.isPending ? "Saving..." : "Save SEO Settings"}
        </button>
      </div>

      {/* Password Reset */}
      <div style={CARD}>
        <h3
          style={{
            color: "#3DBF3A",
            fontWeight: 700,
            fontSize: "1rem",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Reset User Password
        </h3>
        <p style={{ color: "#64748B", fontSize: "0.85rem", marginBottom: 20 }}>
          Use this form to reset any user's password. Enter the user's email
          address and new password. You must be an admin to use this feature.
        </p>
        <form
          onSubmit={handlePasswordReset}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div>
            <label style={LABEL}>User Email</label>
            <input
              type="email"
              required
              value={passwordForm.email}
              onChange={(e) =>
                setPasswordForm((f) => ({ ...f, email: e.target.value }))
              }
              style={INPUT}
              placeholder="user@liztronenergies.com"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={LABEL}>New Password</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    newPassword: e.target.value,
                  }))
                }
                style={INPUT}
                placeholder="Min. 8 characters"
              />
            </div>
            <div>
              <label style={LABEL}>Confirm Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    confirmPassword: e.target.value,
                  }))
                }
                style={INPUT}
              />
            </div>
          </div>
          {pwError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#EF4444",
                fontSize: "0.85rem",
              }}
            >
              {pwError}
            </div>
          )}
          {pwSuccess && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: "rgba(61,191,58,0.1)",
                border: "1px solid rgba(61,191,58,0.2)",
                color: "#3DBF3A",
                fontSize: "0.85rem",
              }}
            >
              {pwSuccess}
            </div>
          )}
          <button
            type="submit"
            style={{
              ...BTN,
              background: "rgba(61,191,58,0.15)",
              color: "#3DBF3A",
              border: "1px solid rgba(61,191,58,0.2)",
            }}
          >
            <Key size={14} /> Reset Password
          </button>
        </form>
      </div>

      {/* Admin Info */}
      <div style={CARD}>
        <h3
          style={{
            color: "#8B5CF6",
            fontWeight: 700,
            fontSize: "1rem",
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Admin Access
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["Admin Panel URL", "/admin"],
            ["Sign In URL", "/account/signin"],
            ["Sign Up URL", "/account/signup"],
            ["Password Reset", "/account/forgot-password"],
            ["General Email", "info@liztronenergies.com"],
            ["Investor Email", "investors@liztronenergies.com"],
          ].map(([label, val]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span style={{ color: "#64748B", fontSize: "0.85rem" }}>
                {label}
              </span>
              <span
                style={{
                  color: "#E2E8F0",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
