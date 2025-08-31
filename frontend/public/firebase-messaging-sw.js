
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// import firebase from "firebase/compat/app";
const firebaseConfig = {
  apiKey: "AIzaSyBTcev9r-WJi0Sewjrr0BIeZ7arC-tI_uU",
  authDomain: "quizzy13-8dd90.firebaseapp.com",
  projectId: "quizzy13-8dd90",
  storageBucket: "quizzy13-8dd90.firebasestorage.app",
  messagingSenderId: "750818737403",
  appId: "1:750818737403:web:ff77c9dbb0f37c5ecb045e",
  measurementId: "G-8QF6M373R3"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});