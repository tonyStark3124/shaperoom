import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreateWorkout from "./pages/CreateWorkout";
import RunWorkout from "./pages/RunWorkout";
import ResetPassword from "./pages/ResetPassword";
import colors from "./colors";
import Navbar from "./Navbar";
import NotFound from "./pages/NotFound";

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "he");
  const [isAuth, setIsAuth] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.body.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);
  useEffect(() => {
    const unsub = import("./firebase").then(({ auth }) => {
      return auth.onAuthStateChanged((user) => setIsAuth(!!user));
    });
    return () => { unsub.then(u => u && u()); };
  }, []);
  // אם לא מחובר או ראוטר לא קיים -> הפניה ללוגין
  if (isAuth === false && !["/", "/signup", "/reset"].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }
  // דפים שדורשים טופס בלבד
  const isFormPage = ["/", "/signup", "/reset"].includes(location.pathname);
  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <div className={isFormPage ? "page-container" : "page-full"}>
        <Routes>
          <Route path="/" element={<Login lang={lang} />} />
          <Route path="/signup" element={<Signup lang={lang} />} />
          <Route path="/create" element={isAuth ? <CreateWorkout lang={lang} /> : <Navigate to="/" replace />} />
          <Route path="/run" element={isAuth ? <RunWorkout lang={lang} /> : <Navigate to="/" replace />} />
          <Route path="/reset" element={<ResetPassword lang={lang} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
