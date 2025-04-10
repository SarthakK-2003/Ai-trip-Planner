// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6zyAk2R6wC9x-WnsYj5v-GZr853k1zT4",
  authDomain: "ai-trip-plan-448a1.firebaseapp.com",
  projectId: "ai-trip-plan-448a1",
  storageBucket: "ai-trip-plan-448a1.firebasestorage.app",
  messagingSenderId: "194712004528",
  appId: "1:194712004528:web:3a50c2b1e205cfca011875",
  measurementId: "G-DQJBDJ1LQT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);