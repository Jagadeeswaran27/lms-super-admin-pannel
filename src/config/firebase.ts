// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "ultrasonic-clinic.firebaseapp.com",
  projectId: "ultrasonic-clinic",
  storageBucket: "ultrasonic-clinic.appspot.com",
  messagingSenderId: "400364342771",
  appId: "1:400364342771:web:d6556aaf3a1272ee135686",
  measurementId: "G-3WTKCK2NGS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
