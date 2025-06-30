import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "./firebase";
import colors from "./colors";

export default function Navbar({ lang, setLang }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return unsub;
  }, []);

  useEffect(() => {
    setMenuOpen(false); // סגור תפריט המבורגר במעבר דף
  }, [location.pathname]);

  const navItems = [
    { path: "/run", label: lang === "he" ? "האימונים שלי" : "My Workouts", icon: "🏋️‍♂️" },
    { path: "/create", label: lang === "he" ? "צור אימון" : "Create Workout", icon: "➕" }
  ];

  return (
    <nav style={{
      width: "100%",
      background: colors.surface,
      borderBottom: `2px solid ${colors.primary}22`,
      boxShadow: "0 2px 8px 0 #0001",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 18px",
      minHeight: 60,
      position: "sticky",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      overflowX: "hidden"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, justifyContent: "flex-start" }}>
        <img src="/vite.svg" alt="logo" style={{ height: 38, marginLeft: 8 }} />
        <span className="app-title" style={{ fontWeight: 900, fontSize: 22, color: colors.primary, letterSpacing: 1, display: window.innerWidth <= 500 ? "none" : "inline" }}>ShapeRoom</span>
      </div>
      {/* תפריט ניווט רגיל למסך רחב */}
      <div className="nav-center" style={{ display: "flex", gap: 18, flex: 2, justifyContent: "center", position: "relative" }}>
        <div className="nav-items" style={{ display: window.innerWidth > 700 ? "flex" : "none", gap: 18 }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                background: "none",
                border: "none",
                color: location.pathname === item.path ? colors.primary : colors.text,
                fontWeight: location.pathname === item.path ? 700 : 500,
                fontSize: 17,
                cursor: "pointer",
                padding: "8px 0",
                borderBottom: location.pathname === item.path ? `2.5px solid ${colors.primary}` : "none",
                transition: "color 0.18s, border 0.18s"
              }}
            >
              <span style={{ fontSize: 20, marginLeft: 4 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        {/* המבורגר */}
        <button
          className="hamburger"
          aria-label="menu"
          style={{
            display: window.innerWidth <= 700 ? "block" : "none",
            background: "none",
            border: "none",
            fontSize: 30,
            color: colors.primary,
            cursor: "pointer",
            marginRight: lang === "he" ? 0 : 10,
            marginLeft: lang === "he" ? 10 : 0,
            position: "absolute",
            top: 0,
            [lang === "he" ? "right" : "left"]: 0
          }}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "✖️" : "☰"}
        </button>
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: 60,
              left: 0,
              right: 0,
              background: colors.surface,
              boxShadow: "0 4px 16px #0002",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              animation: "fadeInMenu 0.2s"
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => { setMenuOpen(false); navigate(item.path); }}
                style={{
                  background: "none",
                  border: "none",
                  color: location.pathname === item.path ? colors.primary : colors.text,
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  fontSize: 18,
                  cursor: "pointer",
                  padding: "18px 0",
                  width: "100%",
                  borderBottom: `1px solid ${colors.primary}22`,
                  transition: "color 0.18s, border 0.18s"
                }}
              >
                <span style={{ fontSize: 22, marginLeft: 6 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}
        <style>{`
          @media (max-width: 700px) {
            .nav-items { display: none !important; }
            .hamburger { display: block !important; }
          }
          @media (min-width: 701px) {
            .nav-items { display: flex !important; }
            .hamburger { display: none !important; }
          }
          @keyframes fadeInMenu {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, justifyContent: "flex-end", minWidth: 120, overflow: "hidden", maxWidth: 180 }}>
        <button
          onClick={() => setLang(lang === "he" ? "en" : "he")}
          style={{
            background: "none",
            border: `1.5px solid ${colors.primary}`,
            color: colors.primary,
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 15,
            padding: "6px 14px",
            cursor: "pointer",
            marginLeft: 8
          }}
        >
          {lang === "he" ? "English" : "עברית"}
        </button>
        {user ? (
          <>
            <img
              src={user.photoURL || "https://ui-avatars.com/api/?name=" + (user.displayName || user.email)}
              alt="user"
              style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${colors.primary}55`, objectFit: "cover", marginLeft: 8 }}
            />
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                whiteSpace: "nowrap",
                color: colors.text,
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: 80,
                direction: "ltr",
                display: "inline-block",
                verticalAlign: "middle"
              }}
              title={user.email}
            >
              {user.email.length > 16 ? user.email.slice(0, 13) + "..." : user.email}
            </span>
          </>
        ) : (
          <img src="/vite.svg" alt="user" style={{ width: 40, height: 40, opacity: 0.3, marginLeft: 8 }} />
        )}
      </div>
    </nav>
  );
}
