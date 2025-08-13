// src/services/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCvvbiV_LHX_GRzMZPVAAJOaFE1K7PMwcI",
  authDomain: "gamifiedewaste.firebaseapp.com",
  projectId: "gamifiedewaste",
  storageBucket: "gamifiedewaste.firebasestorage.app",
  messagingSenderId: "1091491139830",
  appId: "1:1091491139830:web:4444a926469e2ae8089cd7",
  measurementId: "G-ELYH16ZJN3"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
