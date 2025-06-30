import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import colors from "../colors";
import { Link, useNavigate } from "react-router-dom";

export default function Signup({ lang = "he" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState(lang);
  const navigate = useNavigate();

  // טקסטים לפי שפה
  const t = {
    he: {
      title: "הרשמה",
      email: "אימייל",
      password: "סיסמה",
      confirm: "אימות סיסמה",
      signup: "הרשם",
      signingup: "נרשם...",
      haveAccount: "כבר יש לך חשבון? ",
      toLogin: "להתחברות",
      errorEmail: "יש להזין אימייל",
      errorEmailInvalid: "אימייל לא תקין",
      errorPassword: "יש להזין סיסמה",
      errorPasswordShort: "הסיסמה חייבת להכיל לפחות 6 תווים",
      errorConfirm: "הסיסמאות אינן תואמות",
      switchLang: "English"
    },
    en: {
      title: "Sign Up",
      email: "Email",
      password: "Password",
      confirm: "Confirm Password",
      signup: "Sign Up",
      signingup: "Signing up...",
      haveAccount: "Already have an account? ",
      toLogin: "Login",
      errorEmail: "Email is required",
      errorEmailInvalid: "Invalid email",
      errorPassword: "Password is required",
      errorPasswordShort: "Password must be at least 6 characters",
      errorConfirm: "Passwords do not match",
      switchLang: "עברית"
    }
  };
  const tr = t[currentLang];

  const validate = () => {
    if (!email) return tr.errorEmail;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return tr.errorEmailInvalid;
    if (!password) return tr.errorPassword;
    if (password.length < 6) return tr.errorPasswordShort;
    if (password !== confirm) return tr.errorConfirm;
    return "";
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate("/run");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  // מעבר שפה
  const handleSwitchLang = () => {
    setCurrentLang(currentLang === "he" ? "en" : "he");
    document.body.dir = currentLang === "he" ? "ltr" : "rtl";
  };

  return (
    <form onSubmit={handleSignup} style={{
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
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={tr.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          autoComplete="new-password"
          aria-label={tr.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          style={{
            position: "absolute",
            [currentLang === "he" ? "right" : "left"]: 8,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 22
          }}
          tabIndex={-1}
          aria-label={showPassword ? (currentLang === "he" ? "הסתר סיסמה" : "Hide password") : (currentLang === "he" ? "הצג סיסמה" : "Show password")}
        >
          {showPassword ? "\u{1F648}" : "\u{1F441}"}
        </button>
      </div>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type={showConfirm ? "text" : "password"}
          placeholder={tr.confirm}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
          autoComplete="new-password"
          aria-label={tr.confirm}
        />
        <button
          type="button"
          onClick={() => setShowConfirm((v) => !v)}
          style={{
            position: "absolute",
            [currentLang === "he" ? "right" : "left"]: 8,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 22
          }}
          tabIndex={-1}
          aria-label={showConfirm ? (currentLang === "he" ? "הסתר סיסמה" : "Hide password") : (currentLang === "he" ? "הצג סיסמה" : "Show password")}
        >
          {showConfirm ? "\u{1F648}" : "\u{1F441}"}
        </button>
      </div>
      {error && (
        <div style={{ color: colors.error, fontSize: 15, textAlign: "center", marginTop: -8 }}>{error}</div>
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
        {loading ? tr.signingup : tr.signup}
      </button>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <span style={{ fontSize: 15 }}>{tr.haveAccount}</span>
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
          {tr.toLogin}
        </Link>
      </div>
    </form>
  );
}
