// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAW4vJbcj_b8BB0qjy1Ep1JXauNHdkXyWA",
  authDomain: "clubsphere-81633.firebaseapp.com",
  projectId: "clubsphere-81633",
  storageBucket: "clubsphere-81633.firebasestorage.app",
  messagingSenderId: "797423489933",
  appId: "1:797423489933:web:38ddd14c0109463432a3c4",
  measurementId: "G-Q36V24NRCM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);