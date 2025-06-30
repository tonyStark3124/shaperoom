import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import colors from "../colors";

export default function CreateWorkout({ lang = "he" }) {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [exerciseName, setExerciseName] = useState("");
  const [type, setType] = useState("reps"); // reps | time
  const [value, setValue] = useState("");
  const [iconType, setIconType] = useState("emoji"); // emoji | image
  const [icon, setIcon] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const t = {
    he: {
      title: "צור אימון חדש",
      workoutName: "שם האימון",
      addExercise: "הוסף תרגיל",
      exerciseName: "שם התרגיל",
      type: "סוג תרגיל",
      reps: "חזרות",
      time: "זמן (שניות)",
      valueReps: "מס' חזרות",
      valueTime: "שניות",
      add: "הוסף תרגיל",
      save: "שמור אימון",
      chooseIcon: "אימוג'י/תמונה (לא חובה)",
      remove: "הסר",
      iconType: "סוג אייקון",
      emoji: "אימוג'י",
      image: "תמונה"
    },
    en: {
      title: "Create New Workout",
      workoutName: "Workout Name",
      addExercise: "Add Exercise",
      exerciseName: "Exercise Name",
      type: "Type",
      reps: "Reps",
      time: "Time (seconds)",
      valueReps: "Reps",
      valueTime: "Seconds",
      add: "Add Exercise",
      save: "Save Workout",
      chooseIcon: "Emoji/Image (optional)",
      remove: "Remove",
      iconType: "Icon Type",
      emoji: "Emoji",
      image: "Image"
    }
  };
  const tr = t[lang];

  const addExercise = () => {
    const numericValue = type === "reps" ? Number(value) : value;
    if (!exerciseName || (!numericValue && numericValue !== 0) || (type === "reps" && isNaN(numericValue))) {
      alert(tr.exerciseName + " " + (type === "reps" ? tr.valueReps : tr.valueTime));
      return;
    }
    let iconToSave = icon;
    if (iconType === "image" && iconFile) {
      iconToSave = URL.createObjectURL(iconFile); // TODO: upgrade to Firebase Storage
    }
    setExercises([...exercises, { name: exerciseName, type, value: numericValue, icon: iconToSave, iconType }]);
    setExerciseName("");
    setType("reps");
    setValue("");
    setIcon("");
    setIconType("emoji");
    setIconFile(null);
  };

  const saveWorkout = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("עליך להתחבר קודם");
      return;
    }
    if (!workoutName || exercises.length === 0) return;
    try {
      const workoutData = {
        name: workoutName,
        exercises,
        createdAt: new Date()
      };
      await addDoc(collection(db, "users", user.uid, "workouts"), workoutData);
      setToast(lang === "he" ? "האימון נשמר בהצלחה!" : "Workout saved!");
      setTimeout(() => {
        setToast("");
        navigate("/run");
      }, 1500);
    } catch (err) {
      setToast((lang === "he" ? "שגיאה בשמירה: " : "Save error: ") + err.message);
      setTimeout(() => setToast(""), 2500);
    }
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: 500, margin: "auto", padding: 24, background: colors.surface, borderRadius: 16, boxShadow: "0 2px 12px #0002", position: "relative" }}>
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
            animation: "fadeInOut 1.5s"
          }}>
            {toast}
          </div>
        )}
        <h2 style={{ color: colors.primary, textAlign: "center", marginBottom: 18 }}>{tr.title}</h2>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 22, marginRight: 8 }}>🏷️</span>
          <input
            placeholder={tr.workoutName}
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            style={{ flex: 1, fontSize: 16, padding: 10, borderRadius: 6, border: `1px solid ${colors.border}` }}
          />
        </div>
        <h3 style={{ marginTop: 18 }}>{tr.addExercise}</h3>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 22, marginRight: 8 }}>💪</span>
          <input
            placeholder={tr.exerciseName}
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            style={{ flex: 1, fontSize: 16, padding: 10, borderRadius: 6, border: `1px solid ${colors.border}` }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>🎨</span>
          <select value={iconType} onChange={e => { setIconType(e.target.value); setIcon(""); setIconFile(null); }} style={{ fontSize: 15, padding: 7, borderRadius: 6, border: `1px solid ${colors.border}` }}>
            <option value="emoji">Emoji</option>
            <option value="image">Image</option>
          </select>
          {iconType === "emoji" ? (
            <input
              placeholder={tr.chooseIcon}
              value={icon}
              onChange={e => setIcon(e.target.value)}
              style={{ flex: 1, fontSize: 16, padding: 10, borderRadius: 6, border: `1px solid ${colors.border}` }}
              maxLength={2}
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={e => setIconFile(e.target.files[0])}
              style={{ flex: 1, fontSize: 16, padding: 10, borderRadius: 6, border: `1px solid ${colors.border}` }}
            />
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>{type === "reps" ? "🔢" : "⏱️"}</span>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setValue(""); }}
            style={{ fontSize: 15, padding: 7, borderRadius: 6, border: `1px solid ${colors.border}` }}
          >
            <option value="reps">{tr.reps}</option>
            <option value="time">{tr.time}</option>
          </select>
          {type === "reps" ? (
            <input
              type="number"
              min="1"
              placeholder={tr.valueReps}
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^\d]/g, ""))}
              style={{ flex: 1, fontSize: 16, padding: 10, borderRadius: 6, border: `1px solid ${colors.border}` }}
            />
          ) : (
            <input
              type="time"
              step="1"
              placeholder={tr.valueTime}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ flex: 1, fontSize: 16, padding: 10, borderRadius: 6, border: `1px solid ${colors.border}` }}
            />
          )}
        </div>
        <button onClick={addExercise} disabled={!exerciseName || !value || (type === "reps" && isNaN(Number(value)))} style={{ width: "100%", marginBottom: 20, background: colors.primary, color: colors.textLight, fontWeight: 700, fontSize: 17, border: "none", borderRadius: 8, padding: 12, cursor: (!exerciseName || !value || (type === "reps" && isNaN(Number(value)))) ? "not-allowed" : "pointer", opacity: (!exerciseName || !value || (type === "reps" && isNaN(Number(value)))) ? 0.6 : 1 }}>
          {tr.add}
        </button>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {exercises.map((ex, i) => (
            <li key={i} style={{ background: colors.background, borderRadius: 8, marginBottom: 10, padding: 12, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 4px #0001" }}>
              {ex.iconType === "image" && ex.icon ? (
                <img src={ex.icon} alt="icon" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 28 }}>{ex.icon || "🏃‍♂️"}</span>
              )}
              <span style={{ flex: 1, fontWeight: 600 }}>{ex.name} - {ex.type === "reps" ? `${ex.value} ${tr.reps}` : `${ex.value} ${tr.time}`}</span>
              <button onClick={() => setExercises(exercises.filter((_, idx) => idx !== i))} style={{ background: colors.error, color: colors.textLight, border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 700 }}>{tr.remove}</button>
            </li>
          ))}
        </ul>
        <button onClick={saveWorkout} disabled={!workoutName || exercises.length === 0} style={{ width: "100%", marginTop: 20, background: colors.success, color: colors.textLight, fontWeight: 700, fontSize: 18, border: "none", borderRadius: 8, padding: 14, cursor: (!workoutName || exercises.length === 0) ? "not-allowed" : "pointer", opacity: (!workoutName || exercises.length === 0) ? 0.6 : 1 }}>
          {tr.save}
        </button>
        <style>{`
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-20px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
  }`}</style>
      </div>
    </div>
  );
}
