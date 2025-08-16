import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = { 
  apiKey: "AIzaSyAD26IMDbKuAKB2mrTI-H0m8IJR7pIHuD8",
  authDomain: "kasa-ae2cb.firebaseapp.com",
  projectId: "kasa-ae2cb",
  storageBucket: "kasa-ae2cb.appspot.com",
  messagingSenderId: "510257612644",
  appId: "1:510257612644:web:2e138aef2be7fe5d301c71",
  measurementId: "G-9RWRMTGL50"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  // TS kırmızılığını engelleyen dinamik import
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getReactNativePersistence } = require("firebase/auth/react-native");
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db = getFirestore(app);
export { app, auth, db };
