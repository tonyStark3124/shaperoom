
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZ6WZaErINqWKHUMBTBcaLHZWf8HbsQTg",
  authDomain: "shaperoom-f06b1.firebaseapp.com",
  projectId: "shaperoom-f06b1",
  storageBucket: "shaperoom-f06b1.firebasestorage.app",
  messagingSenderId: "355094017773",
  appId: "1:355094017773:web:e76a73757801801ef73ee4",
};

// הפעלת האפליקציה
const app = initializeApp(firebaseConfig);

// יצוא של auth ו-db לשימוש בפרויקט
export const auth = getAuth(app);
export const db = getFirestore(app);
