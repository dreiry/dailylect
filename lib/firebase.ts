// dailylect/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️ PASTE YOUR CONFIG FROM FIREBASE CONSOLE BELOW ⚠️
const firebaseConfig = {
  apiKey: "AIzaSyCYBTB3NWqnL5uPyEjlZ3uaPayu_BBvy1k",
  authDomain: "dailylect-249d7.firebaseapp.com",
  projectId: "dailylect-249d7",
  storageBucket: "dailylect-249d7.firebasestorage.app",
  messagingSenderId: "733451115724",
  appId: "1:733451115724:web:3dda50f7f61f429880b669",
  measurementId: "G-FT3YSKRQHM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);