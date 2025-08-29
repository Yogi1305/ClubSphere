// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTcev9r-WJi0Sewjrr0BIeZ7arC-tI_uU",
  authDomain: "quizzy13-8dd90.firebaseapp.com",
  projectId: "quizzy13-8dd90",
  storageBucket: "quizzy13-8dd90.firebasestorage.app",
  messagingSenderId: "750818737403",
  appId: "1:750818737403:web:ff77c9dbb0f37c5ecb045e",
  measurementId: "G-8QF6M373R3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);