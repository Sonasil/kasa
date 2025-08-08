// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAD26IMDbKuAKB2mrTI-H0m8IJR7pIHuD8",
  authDomain: "kasa-ae2cb.firebaseapp.com",
  projectId: "kasa-ae2cb",
  storageBucket: "kasa-ae2cb.firebasestorage.app",
  messagingSenderId: "510257612644",
  appId: "1:510257612644:web:2e138aef2be7fe5d301c71",
  measurementId: "G-9RWRMTGL50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);