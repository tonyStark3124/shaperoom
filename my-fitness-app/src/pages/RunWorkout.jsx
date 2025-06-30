// src/pages/RunWorkout.jsx
import { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import colors from "../colors";
import { useNavigate } from "react-router-dom";

export default function RunWorkout({ lang = "he" }) {
  const [workouts, setWorkouts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showDone, setShowDone] = useState(false);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const t = {
    he: {
      choose: "בחר אימון להרצה",
      create: "צור אימון חדש",
      noWorkouts: "אין אימונים שמורים. אנא צור אימון קודם.",
      exercise: "תרגיל",
      of: "מתוך",
      reps: "חזרות",
      time: "שניות",
      next: "הבא",
      done: "סיימת!",
      workout: "אימון",
      finish: "הסיום של האימון! כל הכבוד 🙌",
      loading: "טוען משתמש...",
      login: "אנא התחבר כדי לראות את האימונים שלך.",
      prev: "חזור"
    },
    en: {
      choose: "Choose a workout to start",
      create: "Create New Workout",
      noWorkouts: "No saved workouts. Please create one first.",
      exercise: "Exercise",
      of: "of",
      reps: "reps",
      time: "seconds",
      next: "Next",
      done: "Done!",
      workout: "Workout",
      finish: "Workout complete! Well done 🙌",
      loading: "Loading user...",
      login: "Please log in to see your workouts.",
      prev: "Previous"
    }
  };
  const tr = t[lang] || t.he;

  const currentIndexRef = useRef(currentIndex);
  const selectedRef = useRef(selected);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchWorkouts(user.uid);
      } else {
        setWorkouts([]);
      }
      setLoadingUser(false);
    });

    return () => {
      if (timer) clearInterval(timer);
      unsubscribe();
    };
  }, []);

  const fetchWorkouts = async (uid) => {
    try {
      const colRef = collection(db, "users", uid, "workouts");
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("אימונים שנמצאו:", data);
      setWorkouts(data);
    } catch (err) {
      console.error("שגיאה בטעינת אימונים:", err);
      alert("שגיאה בטעינת האימונים: " + err.message);
    }
  };

  const startWorkout = (workout) => {
    setSelected(workout);
    setCurrentIndex(0);
    handleExercise(workout.exercises[0]);
  };

  // Helper: convert time string ("mm:ss" or "hh:mm:ss") to seconds
  function timeToSeconds(val) {
    if (typeof val === "number") return val;
    if (!val || typeof val !== "string") return 0;
    const parts = val.split(":").map(Number);
    if (parts.some(isNaN)) return 0;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1) return parts[0];
    return 0;
  }

  const handleExercise = (exercise) => {
    if (!exercise) return;
    if (exercise.type === "time") {
      const seconds = timeToSeconds(exercise.value);
      setCountdown(seconds);
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
      let didAutoNext = false;
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowDone(true);
            setCountdown(0);
            if (!didAutoNext) {
              didAutoNext = true;
              setTimeout(() => {
                setShowDone(false);
                // השתמש בסטייט העדכני
                if (selectedRef.current && currentIndexRef.current + 1 < selectedRef.current.exercises.length) {
                  setCurrentIndex(idx => idx + 1);
                  setTimeout(() => handleExercise(selectedRef.current.exercises[currentIndexRef.current + 1]), 0);
                } else {
                  setToast(tr.finish);
                  setSelected(null);
                  setCurrentIndex(0);
                  setCountdown(0);
                  setTimeout(() => setToast(""), 2500);
                }
              }, 900);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(interval);
    } else {
      setCountdown(0);
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
    }
  };

  const nextExercise = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    if (!selected) return;
    if (currentIndex + 1 < selected.exercises.length) {
      setCurrentIndex(currentIndex + 1);
      setShowDone(false);
      setTimeout(() => handleExercise(selected.exercises[currentIndex + 1]), 0);
    } else {
      setToast(tr.finish);
      setSelected(null);
      setCurrentIndex(0);
      setCountdown(0);
      setTimeout(() => setToast(""), 2500);
    }
  };

  const prevExercise = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    if (!selected) return;
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowDone(false);
      setTimeout(() => handleExercise(selected.exercises[currentIndex - 1]), 0);
    }
  };

  if (loadingUser) return <p>{tr.loading}</p>;
  if (!auth.currentUser) {
    return <p>{tr.login}</p>;
  }

  if (!selected) {
    return (
      <div style={{
        maxWidth: 420,
        margin: "auto",
        padding: 24,
        background: colors.surface,
        borderRadius: 18,
        boxShadow: "0 4px 24px 0 #0003",
        minHeight: 400,
        position: "relative"
      }}>
        {toast && (
          <div style={{
            position: "absolute",
            top: 10,
            left: 0,
            right: 0,
            margin: "auto",
            width: "fit-content",
            background: colors.success,
            color: colors.textLight,
            borderRadius: 12,
            padding: "12px 32px",
            fontWeight: 700,
            fontSize: 18,
            boxShadow: "0 2px 12px #0003",
            zIndex: 10,
            animation: "fadeInOut 2.5s"
          }}>
            {toast}
          </div>
        )}
        <h2 style={{ color: colors.primary, textAlign: "center", marginBottom: 18, fontSize: 28, letterSpacing: 1 }}>{tr.choose}</h2>
        <button
          onClick={() => navigate("/create")}
          style={{
            display: "block",
            margin: "0 auto 24px auto",
            padding: "12px 0",
            width: "70%",
            background: `linear-gradient(90deg, ${colors.primary} 60%, ${colors.secondary} 100%)`,
            color: colors.textLight,
            border: "none",
            borderRadius: 8,
            fontSize: 18,
            fontWeight: 700,
            boxShadow: "0 2px 8px 0 #0002",
            cursor: "pointer",
            transition: "transform 0.15s, box-shadow 0.15s",
            outline: "none"
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          ➕ {tr.create}
        </button>
        {workouts.length === 0 ? (
          <p style={{ color: colors.error, textAlign: "center", fontSize: 17, marginTop: 40 }}>{tr.noWorkouts}</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
            marginTop: 10
          }}>
            {workouts.map((w, i) => (
              <button
                key={w.id}
                onClick={() => startWorkout(w)}
                style={{
                  background: `linear-gradient(120deg, ${colors.primary}11 60%, ${colors.secondary}22 100%)`,
                  border: `2px solid ${colors.primary}33`,
                  borderRadius: 12,
                  padding: "22px 10px 18px 10px",
                  fontSize: 18,
                  fontWeight: 600,
                  color: colors.text,
                  boxShadow: "0 2px 8px 0 #0001",
                  cursor: "pointer",
                  transition: "transform 0.18s, box-shadow 0.18s, border 0.18s",
                  outline: "none",
                  position: "relative",
                  overflow: "hidden",
                  animation: `fadeInUp 0.5s ${i * 0.08}s both` // אנימציה stagger
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <span style={{ fontSize: 26, display: "block", marginBottom: 6 }}>{w.exercises[0]?.icon || "🏋️‍♂️"}</span>
                {w.name}
              </button>
            ))}
          </div>
        )}
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  const current = selected.exercises[currentIndex];
  const totalSeconds = current.type === "time" ? timeToSeconds(current.value) : 0;
  const percent = current.type === "time" && totalSeconds ? ((countdown / totalSeconds) * 100) : 0;
  return (
    <div style={{
      maxWidth: 440,
      margin: "auto",
      padding: 28,
      background: colors.surface,
      borderRadius: 22,
      boxShadow: "0 4px 24px 0 #0003",
      minHeight: 420,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {toast && (
        <div style={{
          position: "absolute",
          top: 10,
          left: 0,
          right: 0,
          margin: "auto",
          width: "fit-content",
          background: colors.success,
          color: colors.textLight,
          borderRadius: 12,
          padding: "12px 32px",
          fontWeight: 700,
          fontSize: 18,
          boxShadow: "0 2px 12px #0003",
          zIndex: 10,
          animation: "fadeInOut 2.5s"
        }}>
          {toast}
        </div>
      )}
      <h2 style={{ color: colors.primary, fontSize: 26, marginBottom: 8, letterSpacing: 1 }}>{tr.workout}: {selected.name}</h2>
      <h3 style={{ color: colors.secondary, fontWeight: 700, fontSize: 20, marginBottom: 18 }}>{tr.exercise} {currentIndex + 1} {tr.of} {selected.exercises.length}</h3>
      <div style={{
        background: `linear-gradient(120deg, ${colors.primary}22 60%, ${colors.secondary}22 100%)`,
        borderRadius: 18,
        boxShadow: "0 2px 8px #0001",
        padding: 24,
        minWidth: 260,
        minHeight: 160,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        position: "relative",
        animation: "fadeInCard 0.5s"
      }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>
          {current.iconType === "image" && current.icon ? (
            <img src={current.icon} alt="icon" style={{ width: 54, height: 54, borderRadius: 12, objectFit: "cover", boxShadow: "0 2px 8px #0002" }} />
          ) : (
            <span>{current.icon || "🏃‍♂️"}</span>
          )}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{current.name}</div>
        {current.type === "reps" ? (
          <div style={{ fontSize: 20, color: colors.primary, fontWeight: 600 }}>{current.value} {tr.reps}</div>
        ) : (
          <>
            <div style={{ fontSize: 20, color: colors.primary, fontWeight: 600 }}>{countdown} {tr.time}</div>
            <div style={{ width: "100%", height: 10, background: colors.background, borderRadius: 6, marginTop: 10, overflow: "hidden" }}>
              <div style={{ width: `${percent}%`, height: "100%", background: colors.secondary, borderRadius: 6, transition: "width 0.5s" }} />
            </div>
            {showDone && <div style={{ fontSize: 22, color: colors.success, fontWeight: 700, marginTop: 12, animation: "fadeIn 1s" }}>{tr.done}</div>}
          </>
        )}
      </div>
      <div style={{
        display: "flex",
        gap: 16,
        justifyContent: "center",
        marginTop: 10
      }}>
        <button
          onClick={prevExercise}
          disabled={currentIndex === 0}
          style={{
            padding: "12px 28px",
            fontSize: 16,
            fontWeight: 700,
            background: colors.background,
            color: colors.primary,
            border: `2px solid ${colors.primary}55`,
            borderRadius: 10,
            boxShadow: "0 1px 4px #0001",
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            opacity: currentIndex === 0 ? 0.5 : 1,
            transition: "transform 0.15s, box-shadow 0.15s"
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {tr.prev}
        </button>
        <button
          onClick={nextExercise}
          style={{
            padding: "14px 38px",
            fontSize: 18,
            fontWeight: 700,
            background: `linear-gradient(90deg, ${colors.primary} 60%, ${colors.secondary} 100%)`,
            color: colors.textLight,
            border: "none",
            borderRadius: 10,
            boxShadow: "0 2px 8px #0002",
            cursor: "pointer",
            transition: "transform 0.15s, box-shadow 0.15s"
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {tr.next}
        </button>
      </div>
      <style>{`
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
