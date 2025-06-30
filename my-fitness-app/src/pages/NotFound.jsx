import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate("/", { replace: true }), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="notfound-container">
      <div className="notfound-animation">
        <div className="dumbbell">
          <div className="bar"></div>
          <div className="weight left"></div>
          <div className="weight right"></div>
        </div>
        <div className="jumping-athlete">
          <div className="head"></div>
          <div className="body"></div>
          <div className="arm left"></div>
          <div className="arm right"></div>
          <div className="leg left"></div>
          <div className="leg right"></div>
        </div>
      </div>
      <h1>404 - הדף לא נמצא</h1>
      <p>הדף שחיפשת לא קיים. תוכל לחזור לדף הכניסה או להמתין להפניה אוטומטית.</p>
      <button className="notfound-btn" onClick={() => navigate("/", { replace: true })}>
        מעבר מהיר לדף הכניסה
      </button>
    </div>
  );
}
