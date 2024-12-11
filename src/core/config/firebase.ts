// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "ultrasonic-clinic-uat.firebaseapp.com",
  projectId: "ultrasonic-clinic-uat",
  storageBucket: "ultrasonic-clinic-uat.firebasestorage.app",
  messagingSenderId: "786493953653",
  appId: "1:786493953653:web:b568a49b8e810b9c49ca3c",
  measurementId: "G-8422PTVXS9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
