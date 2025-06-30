import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreateWorkout from "./pages/CreateWorkout";
import RunWorkout from "./pages/RunWorkout";
import ResetPassword from "./pages/ResetPassword";
import colors from "./colors";
import Navbar from "./Navbar";

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "he");
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.body.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);
  return (
    <>
      <Navbar lang={lang} setLang={setLang} />
      <Routes>
        <Route path="/" element={<Login lang={lang} />} />
        <Route path="/signup" element={<Signup lang={lang} />} />
        <Route path="/create" element={<CreateWorkout lang={lang} />} />
        <Route path="/run" element={<RunWorkout lang={lang} />} />
        <Route path="/reset" element={<ResetPassword lang={lang} />} />
      </Routes>
    </>
  );
}
