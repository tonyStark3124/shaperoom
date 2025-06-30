import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import colors from "../colors";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword({ lang = "he" }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState(lang);
  const navigate = useNavigate();

  const t = {
    he: {
      title: "איפוס סיסמה",
      email: "אימייל",
      send: "שלח קישור איפוס",
      sending: "שולח...",
      sent: "קישור לאיפוס סיסמה נשלח לאימייל שלך!",
      back: "חזרה להתחברות",
      errorEmail: "יש להזין אימייל",
      errorEmailInvalid: "אימייל לא תקין",
      switchLang: "English"
    },
    en: {
      title: "Reset Password",
      email: "Email",
      send: "Send reset link",
      sending: "Sending...",
      sent: "A reset link was sent to your email!",
      back: "Back to login",
      errorEmail: "Email is required",
      errorEmailInvalid: "Invalid email",
      switchLang: "עברית"
    }
  };
  const tr = t[currentLang];

  const validate = () => {
    if (!email) return tr.errorEmail;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return tr.errorEmailInvalid;
    return "";
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const handleSwitchLang = () => {
    setCurrentLang(currentLang === "he" ? "en" : "he");
    document.body.dir = currentLang === "he" ? "ltr" : "rtl";
  };

  return (
    <form onSubmit={handleReset} style={{
      maxWidth: 350,
      margin: "60px auto",
      padding: 32,
      background: colors.surface,
      borderRadius: 12,
      boxShadow: "0 2px 12px 0 #0002",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      border: `1px solid ${colors.border}`
    }}>
      <button type="button" onClick={handleSwitchLang} style={{ alignSelf: "flex-end", background: "none", border: "none", color: colors.secondary, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>{tr.switchLang}</button>
      <h2 style={{ color: colors.primary, textAlign: "center", marginBottom: 12 }}>{tr.title}</h2>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type="email"
          placeholder={tr.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            boxSizing: "border-box",
            padding: currentLang === "he" ? "10px 44px 10px 10px" : "10px 10px 10px 44px",
            fontSize: 16,
            borderRadius: 6,
            border: `1px solid ${colors.border}`,
            outline: "none",
            width: "100%",
            direction: currentLang === "he" ? "rtl" : "ltr"
          }}
          autoComplete="username"
          aria-label={tr.email}
        />
        <span
          style={{
            position: "absolute",
            [currentLang === "he" ? "right" : "left"]: 8,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 22,
            pointerEvents: "none"
          }}
        >
          {"\u{1F4E7}"}
        </span>
      </div>
      {error && (
        <div style={{ color: colors.error, fontSize: 15, textAlign: "center", marginTop: -8 }}>{error}</div>
      )}
      {sent && (
        <div style={{ color: colors.success, fontSize: 15, textAlign: "center", marginTop: -8 }}>{tr.sent}</div>
      )}
      <button
        type="submit"
        style={{
          background: loading ? colors.border : colors.primary,
          color: colors.textLight,
          border: "none",
          borderRadius: 6,
          padding: "12px 0",
          fontSize: 18,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: 8,
          transition: "background 0.2s"
        }}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? tr.sending : tr.send}
      </button>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <Link
          to="/"
          style={{
            color: colors.primary,
            fontWeight: 700,
            textDecoration: "none",
            borderBottom: `2px solid ${colors.primary}`,
            paddingBottom: 2,
            transition: "color 0.2s"
          }}
        >
          {tr.back}
        </Link>
      </div>
    </form>
  );
}