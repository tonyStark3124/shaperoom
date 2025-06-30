// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { auth } from "../firebase";
import colors from "../colors";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ lang = "he" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [lastUser, setLastUser] = useState(null);
  const [autoLoginLoading, setAutoLoginLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState(lang);
  const navigate = useNavigate();

  // טקסטים לפי שפה
  const t = {
    he: {
      title: "התחברות",
      email: "אימייל",
      password: "סיסמה",
      login: "התחבר",
      loggingin: "מתחבר...",
      remember: "זכור אותי",
      forgot: "שכחת סיסמה?",
      noAccount: "אין לך חשבון? ",
      toSignup: "להרשמה",
      errorEmail: "יש להזין אימייל",
      errorEmailInvalid: "אימייל לא תקין",
      errorPassword: "יש להזין סיסמה",
      switchLang: "English",
      lastLogin: "התחברות אחרונה: "
    },
    en: {
      title: "Login",
      email: "Email",
      password: "Password",
      login: "Login",
      loggingin: "Logging in...",
      remember: "Remember me",
      forgot: "Forgot password?",
      noAccount: "Don't have an account? ",
      toSignup: "Sign up",
      errorEmail: "Email is required",
      errorEmailInvalid: "Invalid email",
      errorPassword: "Password is required",
      switchLang: "עברית",
      lastLogin: "Last login: "
    }
  };
  const tr = t[currentLang];

  // שמירת משתמש אחרון בלוקאל סטורג'
  useEffect(() => {
    const last = JSON.parse(localStorage.getItem("lastUser"));
    if (last && last.email && last.password) {
      setLastUser(last);
    }
  }, []);

  // שמירה אוטומטית של המשתמש האחרון לאחר התחברות מוצלחת
  const saveLastUser = (email, password) => {
    localStorage.setItem("lastUser", JSON.stringify({ email, password }));
  };

  const validate = () => {
    if (!email) return tr.errorEmail;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return tr.errorEmailInvalid;
    if (!password) return tr.errorPassword;
    return "";
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      if (remember) saveLastUser(email, password);
      setLoading(false);
      navigate("/run");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  // התחברות אוטומטית למשתמש האחרון
  const handleAutoLogin = async () => {
    if (!lastUser) return;
    setAutoLoginLoading(true);
    setError("");
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, lastUser.email, lastUser.password);
      setAutoLoginLoading(false);
      setRemember(true);
      setEmail(lastUser.email);
      setPassword(lastUser.password);
      navigate("/run");
    } catch (error) {
      setAutoLoginLoading(false);
      setError("התחברות אוטומטית נכשלה: " + error.message);
    }
  };

  // מעבר שפה
  const handleSwitchLang = () => {
    setCurrentLang(currentLang === "he" ? "en" : "he");
    document.body.dir = currentLang === "he" ? "ltr" : "rtl";
  };

  return (
    <form onSubmit={handleLogin} style={{
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
      {lastUser && (
        <button
          type="button"
          onClick={handleAutoLogin}
          style={{
            background: colors.success,
            color: colors.textLight,
            border: "none",
            borderRadius: 6,
            padding: "10px 0",
            fontSize: 16,
            fontWeight: 600,
            cursor: autoLoginLoading ? "not-allowed" : "pointer",
            marginBottom: 8,
            transition: "background 0.2s"
          }}
          disabled={autoLoginLoading}
        >
          {autoLoginLoading ? tr.loggingin : `${tr.lastLogin}${lastUser.email}`}
        </button>
      )}
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
          autoComplete="current-password"
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
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          id="remember"
          checked={remember}
          onChange={() => setRemember((v) => !v)}
          style={{ accentColor: colors.primary }}
        />
        <label htmlFor="remember" style={{ fontSize: 14 }}>{tr.remember}</label>
        <span style={{ flex: 1 }} />
        <Link to="/reset" style={{ color: colors.secondary, fontSize: 14, textDecoration: "underline dotted", cursor: "pointer" }}>
          {tr.forgot}
        </Link>
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
        {loading ? tr.loggingin : tr.login}
      </button>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <span style={{ fontSize: 15 }}>{tr.noAccount}</span>
        <Link
          to="/signup"
          style={{
            color: colors.primary,
            fontWeight: 700,
            textDecoration: "none",
            borderBottom: `2px solid ${colors.primary}`,
            paddingBottom: 2,
            transition: "color 0.2s"
          }}
        >
          {tr.toSignup}
        </Link>
      </div>
    </form>
  );
}
