import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "./firebase";
import colors from "./colors";

export default function Navbar({ lang, setLang }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Responsive state for hiding app name
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
  const [isNavMobile, setIsNavMobile] = useState(window.innerWidth <= 700);
  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 500);
      setIsNavMobile(window.innerWidth <= 700);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  // הגדרת סדר עמודות קבועה: ימין (המבורגר, תמונה, שם) | מרכז | שמאל (שפה, שם, לוגו)
  const gridTemplate = 'hamburgerUser center logoLang';

  // Helper: קיצור שם משתמש במסך קטן
  function getShortEmail(email) {
    if (!email) return "";
    if (!isMobile) return email;
    if (email.length <= 5) return email;
    return email.slice(0, 5) + (email.length > 5 ? "..." : "");
  }

  return (
    <nav style={{
      width: "100%",
      maxWidth: "100vw",
      background: colors.surface,
      borderBottom: `2px solid ${colors.primary}22`,
      boxShadow: "0 2px 8px 0 #0001",
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gridTemplateAreas: `'${gridTemplate}'`,
      alignItems: "center",
      justifyItems: "center",
      padding: "0 8px",
      minHeight: 60,
      position: "sticky",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      overflow: "visible",
      direction: "ltr"
    }}>
      {/* ימין: המבורגר, תמונה, שם */}
      <div style={{ gridArea: "hamburgerUser", display: "flex", alignItems: "center", gap: 8, minWidth: 0, flexDirection: "row", overflow: "visible" }}>
        {isNavMobile && (
          <button
            className="hamburger"
            aria-label="menu"
            style={{
              background: "none",
              border: "none",
              fontSize: 30,
              color: colors.primary,
              cursor: "pointer",
              zIndex: 201
            }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "✖️" : "☰"}
          </button>
        )}
        {/* מגש צדדי מקצועי */}
        {isNavMobile && menuOpen && (
          <>
            <div
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.45)",
                zIndex: 200,
                transition: "background 0.2s"
              }}
            />
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                width: 260,
                background: `linear-gradient(120deg, ${colors.primary} 60%, ${colors.secondary} 100%)`,
                boxShadow: "2px 0 24px #0005",
                zIndex: 201,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "32px 0 0 0",
                animation: "slideInMenu 0.22s cubic-bezier(.7,1.7,.5,1)"
              }}
            >
              <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => { setMenuOpen(false); navigate(item.path); }}
                    style={{
                      background: "none",
                      border: "none",
                      color: location.pathname === item.path ? colors.textLight : colors.textLight + "cc",
                      fontWeight: location.pathname === item.path ? 800 : 600,
                      fontSize: 20,
                      cursor: "pointer",
                      padding: "18px 32px 18px 0",
                      width: "100%",
                      textAlign: "left",
                      borderLeft: location.pathname === item.path ? `5px solid ${colors.surface}` : "5px solid transparent",
                      transition: "color 0.18s, border 0.18s, background 0.18s",
                      letterSpacing: 1
                    }}
                  >
                    <span style={{ fontSize: 24, marginLeft: 10 }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <style>{`
              @keyframes slideInMenu {
                from { transform: translateX(-100%); opacity: 0.2; }
                to { transform: translateX(0); opacity: 1; }
              }
            `}</style>
          </>
        )}
        {user ? (
          <>
            <img
              src={user.photoURL || "https://ui-avatars.com/api/?name=" + (user.displayName || user.email)}
              alt="user"
              style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${colors.primary}55`, objectFit: "cover" }}
            />
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                whiteSpace: "nowrap",
                color: colors.text,
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: isMobile ? 50 : 80,
                direction: "ltr",
                display: "inline-block",
                verticalAlign: "middle"
              }}
              title={user.email}
            >
              {getShortEmail(user.email)}
            </span>
          </>
        ) : (
          <img src="/vite.svg" alt="user" style={{ width: 40, height: 40, opacity: 0.3 }} />
        )}
      </div>
      {/* מרכז ניווט */}
      <div className="nav-center" style={{ gridArea: "center", display: "flex", gap: 18, justifyContent: "center", alignItems: "center", minWidth: 0, position: "relative", overflow: "visible" }}>
        <div className="nav-items" style={{ display: !isNavMobile ? "flex" : "none", gap: 18 }}>
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
        {isNavMobile && menuOpen && (
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
          }
          @media (min-width: 701px) {
            .nav-items { display: flex !important; }
          }
          @keyframes fadeInMenu {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
      {/* שמאל: שפה, שם, לוגו */}
      <div style={{ gridArea: "logoLang", display: "flex", alignItems: "center", gap: 8, minWidth: 0, flexDirection: "row-reverse", overflow: "visible" }}>
        <img src="/fitness-favicon.svg" alt="logo" style={{ height: 38, marginLeft: 8, marginRight: 0 }} />
        {!isMobile && (
          <span className="app-title" style={{ fontWeight: 900, fontSize: 22, color: colors.primary, letterSpacing: 1, whiteSpace: "nowrap" }}>ShapeRoom</span>
        )}
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
            cursor: "pointer"
          }}
        >
          {lang === "he" ? "English" : "עברית"}
        </button>
      </div>
    </nav>
  );
}
